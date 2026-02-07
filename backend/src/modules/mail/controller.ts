import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { Post } from "@modules/post/service";
import { db } from "@db/db";
import { mail } from "@db/schema";

export const messagePlugin = new Elysia({ prefix: "/message" })
  .use(betterAuthPlugin)
  .post(
    "/user/:id",
    async ({ currentUser, body, params }) => {
      if(currentUser.role === "business"){
      const res = await db.insert(mail).values({
        receiverId: params.id,
        senderId: currentUser.id,
        senderRole: currentUser.role ,
        subject: body.subject,
        message: body.message,
        businessId: body.businessId
      })
    } else if (currentUser.role === "admin"){
      const res = await db.insert(mail).values({
        receiverId: params.id,
        senderId: currentUser.id,
        senderRole: currentUser.role ,
        subject: body.subject,
        message: body.message,
      })
    }
    },
    {
      role: ["business","admin"], body: t.Object({
        subject: t.String(),
        message: t.String(),
        businessId: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.String()
      })
    },
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
    { role: ["user"], params:t.Object({id: t.Number()}) },
  );
