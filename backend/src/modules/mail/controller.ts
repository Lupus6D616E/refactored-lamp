import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { db } from "@db/db";
import { businessProfile, mail } from "@db/schema";
import { Business } from "@modules/business/service";
import { eq } from "drizzle-orm";
import { Message } from "./service";
export const messagePlugin = new Elysia({ prefix: "/message" })
  .use(betterAuthPlugin)
  .post(
    "/user/:id",
    async ({ currentUser, body, params }) => {
      if (currentUser.role === "business" && body.businessId) {
        const isMember = await Business.checkMembership(
          currentUser.id,
          body.businessId,
        );
        if (isMember) {
          const res = await db.insert(mail).values({
            receiverId: params.id,
            senderId: currentUser.id,
            senderRole: currentUser.role,
            subject: body.subject,
            message: body.message,
            businessId: body.businessId
          })
        }
        else {
          return status(403)
        }
      } else if (currentUser.role === "admin") {
        const res = await db.insert(mail).values({
          receiverId: params.id,
          senderId: currentUser.id,
          senderRole: currentUser.role,
          subject: body.subject,
          message: body.message,
        })
      }
    },
    {
      role: ["business", "admin"], body: t.Object({
        subject: t.String(),
        message: t.String(),
        businessId: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.String()
      })
    },
  )
  .get(
    "/usermymessages",
    async ({ currentUser }) => {
      const res = await db.select({
        messageId: mail.id,
        businessName: businessProfile.name,
        message: mail.message,
        subject: mail.subject,
        senderRole: mail.senderRole,
        date: mail.dateSent,
      }).from(mail)
        .leftJoin(businessProfile, eq(mail.businessId, businessProfile.id))
        .where(eq(mail.receiverId, currentUser.id))
      return res
    },
    { role: ["user"] },
  )
  .get(
    "/user/viewmessage/:id",
    async ({ currentUser, params }) => {
      const check = await Message.checkAllowedToViewMessage(currentUser.id, params.id)
      if (check) {
       const res = await Message.getMessage(params.id)
       return res
      }
      return status(403)
    },
    {
      role: ["user"], params: t.Object({
        id: t.Number()
      })
    },
  )
  .post("/user/reply", async ({ currentUser, body }) => {
    const check = await Message.checkAllowedToViewMessage(currentUser.id, body.id)
    if (check) {
      try {
        const {senderRole:prevRole, businessId:prevBusinessId} = await Message.getMessage(body.id)
        if(prevRole === "admin"){
        const res = await db.insert(mail).values({
          senderId: currentUser.id,
          senderRole: currentUser.role!,
          recieverRole: prevRole,
          replyToId: body.id,
          message:body.message,
          subject:body.subject,
        })}
        if(prevRole === "business"){
        const res = await db.insert(mail).values({
          senderId: currentUser.id,
          senderRole: currentUser.role!,
          recieverRole: prevRole,
          businessId: prevBusinessId,
          replyToId: body.id,
          message:body.message,
          subject:body.subject,
        })
        }
        return status(201)
      } catch (e) {
        console.log(e)
        return status(500)
      }
    }
    return status(403)
  }, {
    role: ["user"], body: t.Object({
      id: t.Number(),
      message: t.String(),
      subject: t.String(),
    })
  }
  )