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
      const isMember = await Business.checkMembership(currentUser.id, id);
      if (isMember) {
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
      const businessid = await Business.getBusinessFromJobPostId(id);
      const isMember = await Business.checkMembership(
        currentUser.id,
        businessid,
      );
      if (isMember) {
        const applications = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            status: jobApplications.status,
          })
          .from(jobApplications)
          .leftJoin(user, eq(user.id, jobApplications.applicantId))
          .where(eq(jobApplications.jobId, id));
        const name = await db
          .select({
            title: jobPosts.title,
          })
          .from(jobPosts)
          .where(eq(jobPosts.id, id))
          .limit(1);
        return {
          title: name[0].title,
          applications: applications,
        };
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
  )
  .post(
    "/decideapplication",
    async ({ currentUser, body }) => {
      const businessid = await Business.getBusinessFromJobPostId(body.jobId);
      const isMember = await Business.checkMembership(
        currentUser.id,
        businessid,
      );
      if (isMember) {
        try {
          const result = await db
            .update(jobApplications)
            .set({
              status: body.decision,
              message: body.message,
            })
            .where(
              and(
                eq(jobApplications.applicantId, body.userId),
                eq(jobApplications.jobId, body.jobId),
              ),
            );
          return true;
        } catch (e) {
          console.log(e);
          return status(500);
        }
      } else {
        return status(403);
      }
    },
    {
      role: ["business"],
      body: t.Object({
        jobId: t.Number(),
        userId: t.String(),
        decision: t.Union([t.Literal("accepted"), t.Literal("rejected")]),
        message: t.String(),
      }),
    },
  )
  .post(
    "/markfilled",
    async ({ currentUser, body }) => {
      const businessid = await Business.getBusinessFromJobPostId(body.id);
      const isMember = await Business.checkMembership(
        currentUser.id,
        businessid,
      );
      if (isMember) {
        try {
          const res = await db
            .update(jobPosts)
            .set({
              status: "filled",
            })
            .where(eq(jobPosts.id, body.id));
          return status(200);
        } catch (e) {
          console.log(e);
          return status(500);
        }
      }
      return status(403)
    },
    {
      role: ["business"],
      body: t.Object({
        id: t.Number(),
      }),
    },
  );
