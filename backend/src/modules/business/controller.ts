import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { businessProfile, businessUser, jobPosts } from "@db/schema";
import { db } from "@db/db";
import { Business } from "./service";
import { eq, and } from "drizzle-orm";

export const businessPlugin = new Elysia({ prefix: "/business" })
  .use(betterAuthPlugin)
  .get(
    "/profile/:id",
    async ({ params: { id } }) => {
      // query is fully typed!
      console.log("Viewed post:", id);
      const result = await db
        .select({
          name: businessProfile.name,
          description: businessProfile.description,
          industry: businessProfile.industry,
          address: businessProfile.address,
        })
        .from(businessProfile);
      console.log(result);
      return result[0];
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )
  .get(
    "/mybusinesses",
    async ({ currentUser }) => {
      const result = await Business.getUserBusinesses(currentUser.id);
      return result;
    },
    {
      role: ["business"],
    },
  )
  .get(
    "/jobposts/:id",
    async ({ currentUser, params: { id } }) => {
      const userBusiness = await db
        .select({
          exists: businessUser.userId,
        })
        .from(businessUser)
        .where(
          and(
            eq(businessUser.userId, currentUser.id),
            eq(businessUser.businessId, id),
          ),
        ).limit(1)
      const isMember = userBusiness.length > 0;
      if(isMember){
        const myjobposts = await db.select({
          id: jobPosts.id,
          title: jobPosts.title,
          status: jobPosts.status,
        }).from(jobPosts).where(eq(jobPosts.businessId, id))
        return myjobposts
      }else{
        return status(403)
      }
    },
    {
      role: ["business"],
      params: t.Object({
        id: t.String(),
      }),
    },
  );
