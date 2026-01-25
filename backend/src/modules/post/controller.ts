import { Elysia, status} from "elysia";
import { PostModel } from "./model";
import { betterAuthPlugin } from "@lib/auth";
import { Post } from "@modules/post/service";

export const postPlugin = new Elysia({ prefix: "/post" })
  .use(betterAuthPlugin)
  .get(
    "/job/:id",
    async ({ params: { id } }) => {
      // query is fully typed!
      console.log("Viewed post:", id);
      const result = await Post.getPostDetails(id);
      console.log(result);
      return result;
    },
    {
      // Define expected query schema → full type-safety + validation
      params: PostModel.applicationBody,
    },
  )
  .post(
    "/postjob",
    async ({ currentUser, body }) => {
      const res = await Post.postJob(body, currentUser.id);
      if (res === false) {
        return { message: "error" };
      }
      return { message: "no" };
    },

    { role: ["business"], body: PostModel.JobBody },
  )
  .post(
    "/job/:id/apply",
    async ({ currentUser, params }) => {
      const { id } = params;
      const userId = currentUser.id;
      const res = await Post.postApplication(userId, id);
      if (res.success === true) {
        return status(201, "Application successful");
      } else if (
        res.success === false ||
        res.code === "DUPLICATE_ASSOCIATION"
      ) {
        return status(409, "Already Applied");
      } else {
        return status(500, "Internal Server Error");
      }
    },
    { role: ["user"], params: PostModel.applicationBody },
  );
