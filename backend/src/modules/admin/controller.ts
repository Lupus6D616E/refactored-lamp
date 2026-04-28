import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { Admin } from "./service";
import { AdminModel } from "./model";
import { email, emailAttachments } from "@db/schema";
import { db } from "@db/db";
import { extname } from "node:path";
import { count, eq, param } from "drizzle-orm";
import { s3Client } from "@lib/minio";
export const adminPlugin = new Elysia({ prefix: "/admin" })
  .use(betterAuthPlugin)
  .post(
    "/changetype",
    async ({ body }) => {
      const res = await Admin.changeAccountType(body.email, body.type)
      if (res === true) {
        return status(200)
      }
      else {
        return status(500)
      }
    },
    {
      role: ['admin'],
      body: AdminModel.changeAccountRoleBody
    },
  )
  .post(
    "/addtobusiness",
    async ({ body }) => {
      const res = await Admin.addUserToBusiness(body.email, body.business.toLowerCase())
      if (res.success === true) {
        return {
          success: true,
          message: "user added to business"
        }
      }
      else if (res.success === false) {
        if (res.message)
          return status(404, res.message)
        else {
          console.log(res)
          return status(500, "an unexplainable error has occurred")
        }
      }
      else {

        return status(500)
      }
    },
    {
      role: ["admin"],
      body: AdminModel.addUserToBusinessModel
    },
  )
  .post(
    "/bootstrap",
    async ({ body }) => {
      const res = await Admin.bootstrapAdminAccount(body.secret, body.email, body.password, body.name)
      if (res === true) {
        return status(201, "Admin created");
      } else {
        return status(403, "Forbidden");
      }
    },
    {
      body: AdminModel.bootStrapAdminAccountBody
    })
  .post("/createbusiness", async ({ body }) => {
    const res = await Admin.createBusiness(body.name.toLowerCase(), body.description, body.industry, body.address, body.bin)
    if (res === 409) {
      return status(409, "Business Already Exists")
    } else {
      return status(201, "Business Created")
    }
  }, {
    role: ["admin"],
    body: AdminModel.createBusinessBody
  })
  .post("/createpost", async ({ body }) => {
    console.log(body)
    const res = await Admin.createArticle(body.title, body.body, body.image)
    if (res) {
      return status(201, "article Created")
    }
    else {
      return status(500, "upload failure")
    }
  }, {
    role: ["admin"],
    body: t.Object({
      title: t.String(),
      body: t.String(),
      image: t.File({
        type: ["image/jpeg", "image/png"],
        maxSize: "10m"
      })
    })
  })
  .get(
    "/stats",
    async ({ currentUser }) => {
      const res = await Admin.statistics()
      return res
    },
    {
      role: ['admin'],
    },
  )
  .get(
    "/getemails/:page",
    async ({ currentUser, params }) => {
      try {
        const res = await db.select({
          id: email.id,
          from: email.from,
          createdAt: email.createdAt,
          subject: email.subject,
          text: email.text,
          attachments: email.attachments,
        }).from(email)
          .orderBy(email.createdAt)
          .limit(5)
          .offset((parseInt(params.page) - 1) * 5)
        const emailCount = await db.select({ count: count() }).from(email)
        const data = res.map(prop => ({
          ...prop,
          subject: prop.subject ?? "no subject",
          text: prop.text ?? "no text"
        }))
        return {
          emails: data,
          pagination: {
            page: parseInt(params.page),
            totalEmails: emailCount[0].count,
            totalPages: Math.ceil(emailCount[0].count / 5)
          }
        }
      }
      catch {
        return status(500)
      }
    }, {
    role: ["admin"]

  }
  )
  .get("/email/getfile/:id",
    async ({ currentUser, params, set }) => {
      try {
        const res = await db
          .select({
            id: emailAttachments.id,
            filename: emailAttachments.filename,
            emailId: emailAttachments.emailId,
            contentType: emailAttachments.contentType
          })
          .from(emailAttachments)
          .where(eq(emailAttachments.id, params.id))

        const file = s3Client.file(`email/attachments/${res[0].emailId}/${res[0].id}${extname(res[0].filename)}`)
        set.headers["Content-Type"] = res[0].contentType || "application/octet-stream";
        set.headers["Content-Disposition"] = `attachment; filename="${res[0].filename}"`;
        const real = await file.arrayBuffer()
        return real; // stream
      }
      catch(e){
        console.log(e)
        return status(404)
      }
    }, {
    role: ["admin"]
  })
