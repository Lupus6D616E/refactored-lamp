import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { Business } from "./service";
import { Post } from "@modules/post/service";
import { businessModel } from "./model";

export const businessPlugin = new Elysia({ prefix: "/business" })
  .use(betterAuthPlugin)
  .get(
    "/profile/:id",
    async ({ params: { id } }) => {
      // query is fully typed!
      const result = await Business.getBusinessProfile(id)
      return result;
    },
    {
      params: businessModel.businessIdType
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
        const res = await Business.getJobPosts(id)
        return res;
      } else {
        return status(403);
      }
    },
    {
      role: ["business"],
      params: businessModel.businessIdType,
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
        const applications = await Business.getJobApplications(id)
        const name = await Post.getPostDetails(id)
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
      params: businessModel.applicationIdType,
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
          const result = await Business.decideApplication(body.userId, body.jobId, body.message, body.decision)
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
      body: businessModel.applicationDecision
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
          await Business.markJobFilled(body.id)
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
      body: businessModel.applicationIdType,
    },
  );
