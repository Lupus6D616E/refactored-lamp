import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import {
  businessProfile,
  businessUser,
  jobApplications,
  jobPosts,
  seekerProfile,
  user,
} from "@db/schema";
import { db } from "@db/db";
import { Business } from "./service";
import { eq, and, desc, count } from "drizzle-orm";

export const businessPlugin = new Elysia({ prefix: "/business" })
  .use(betterAuthPlugin)
  .get(
    "/profile/:id",
    async ({ params: { id } }) => {
      // query is fully typed!
      console.log("Viewed profile:", id);
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
      const isMember =
        await Business.getUserBusinesses(currentUser.id);
      if (isMember.length > 0) {
        const myjobposts = await db
          .select({
            id: jobPosts.id,
            title: jobPosts.title,
            status: jobPosts.status,
            applications: count(jobApplications.jobId).as("repliesCount"),
          })
          .from(jobPosts)
          .leftJoin(jobApplications, eq(jobApplications.jobId, jobPosts.id))
          .groupBy(jobPosts.id /* + other selected columns if needed */)
          .where(eq(jobPosts.businessId, id));
        return myjobposts;
      } else {
        return status(403);
      }
    },
    {
      role: ["business"],
      params: t.Object({
        id: t.String(),
      }),
    },
  )
   .get(
    "/viewapplications/:id",
    async ({ currentUser, params: { id } }) => {
      const isMember = await Business.getUserBusinesses(currentUser.id)
      if (isMember.length > 0) {
        const applications = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
          })
          .from(jobApplications)
          .leftJoin(user, eq(user.id, jobApplications.applicantId))
          .where(eq(jobApplications.jobId, id));
        return applications;
      } else {
        return status(403);
      }
    },
    {
      role: ["business"],
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
