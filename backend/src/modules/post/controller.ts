import { Elysia, t } from "elysia";
import { PostModel } from "./model";
import { betterAuthPlugin } from "@lib/auth";
import { Post } from "@modules/post/service"
export const postPlugin = new Elysia({ prefix: "/post" })

  .use(betterAuthPlugin)
  .post(
    "/postjob",
    async ({ currentUser, body }) => { 
        const res = await Post.postJob( body, currentUser.id)
        if(res === false){
          return {message: "error"}
        }
      return { message: "no" };
    },

    { role: ["business"], body: PostModel.JobBody },
  )
  .post(
    "/postticket",
    ({ body }) => {
      return "yes";
    },
    { body: t.String() },
  );
