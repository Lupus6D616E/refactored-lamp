import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { businessProfile } from "@db/schema";
import { db } from "@db/db";

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
  );
