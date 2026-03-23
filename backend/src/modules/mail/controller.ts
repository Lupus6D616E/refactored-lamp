import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { db } from "@db/db";
import { mail } from "@db/schema";
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
      const res = await Message.getUserMessages(currentUser.id)
      return res
    },
    { role: ["user"] },
  )
  .get(
    "/businessmymessages/:id",
    async ({ currentUser, params }) => {
      const check = await Business.checkMembership(currentUser.id, params.id)
      if (check) {
        const res = await Message.getBusinessMessages(params.id)
        return res
      }
      else {
        return status(403)
      }
    },
    {
      role: ["business"], params: t.Object({
        id: t.String()
      })
    },
  )
  .get(
    "/user/viewmessage/:id",
    async ({ currentUser, params }) => {
      const check = await Message.checkUserAllowedToViewMessage(currentUser.id, params.id, "user")
      if (check) {
        const res = await Message.getMessage(params.id)
        if(res.alreadyReplied){
          const alreadyRepliedId = await Message.getRepliedId(res.messageId)
          const response = {...res, nextId: alreadyRepliedId.messageId}
          return response
        }
        else{
          const response = {...res, nextId: null}
          return response
        }
      }
      return status(403)
    },
    {
      role: ["user"], params: t.Object({
        id: t.Number()
      })
    },
  )
  .get(
    "/business/viewmessage/:id",
    async ({ currentUser, params }) => {
      const check = await Message.checkBusinessAllowedToViewMessage(params.id, currentUser.id)
      if (check) {
        const res = await Message.getMessage(params.id)
        if(res.alreadyReplied){
          const alreadyRepliedId = await Message.getRepliedId(res.messageId)
          const response = {...res, nextId: alreadyRepliedId.messageId}
          return response
        }
        else{
          const response = {...res, nextId: null}
          return response
        }
      }
      return status(403)
    },
    {
      role: ["business"], params: t.Object({
        id: t.Number(),
      })
    },
  )
  .post("/user/reply", async ({ currentUser, body }) => {
    const check = await Message.checkUserAllowedToViewMessage(currentUser.id, body.id, "user")
    if (check) {
      try {
        const { senderRole: prevRole, businessId: prevBusinessId } = await Message.getMessage(body.id)
        if (prevRole === "admin") {
          const res = await db.insert(mail).values({
            senderId: currentUser.id,
            senderRole: currentUser.role!,
            recieverRole: prevRole,
            replyToId: body.id,
            message: body.message,
            subject: body.subject,
          })
        }
        if (prevRole === "business") {
          await db.insert(mail).values({
            senderId: currentUser.id,
            senderRole: currentUser.role!,
            recieverRole: prevRole,
            businessId: prevBusinessId,
            replyToId: body.id,
            message: body.message,
            subject: body.subject,
          })
          await db.update(mail).set({
            alreadyReplied: true
          }).where(eq(mail.id,body.id))
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
    .post("/business/reply", async ({ currentUser, body }) => {
    const check = await Message.checkBusinessAllowedToViewMessage (body.id, currentUser.id)
    if (check) {
      try {
        const { senderRole: prevRole, businessId: prevBusinessId, senderId: prevSenderId } = await Message.getMessage(body.id)
        if (prevRole === "admin") {
          const res = await db.insert(mail).values({
            senderId: currentUser.id,
            senderRole: currentUser.role!,
            recieverRole: prevRole,
            replyToId: body.id,
            businessId: prevBusinessId,
            message: body.message,
            subject: body.subject,
          })
           await db.update(mail).set({
            alreadyReplied: true
          }).where(eq(mail.id,body.id)) 
        }
        if (prevRole === "user") {
          console.log("attempting send")
          await db.insert(mail).values({
            senderId: currentUser.id,
            senderRole: currentUser.role!,
            recieverRole: prevRole,
            receiverId: prevSenderId,
            businessId: prevBusinessId,
            replyToId: body.id,
            message: body.message,
            subject: body.subject,
          })
          await db.update(mail).set({
            alreadyReplied: true
          }).where(eq(mail.id,body.id))
        }
        return status(201)
      } catch (e) {
        console.log(e)
        return status(500)
      }
    }
    return status(403)
  }, {
    role: ["business"], body: t.Object({
      id: t.Number(),
      message: t.String(),
      subject: t.String(),
    })
  }
  )