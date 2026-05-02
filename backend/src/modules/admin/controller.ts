import { Elysia, status, t } from "elysia";
import { auth, betterAuthPlugin } from "@lib/auth";
import { Admin } from "./service";
import { AdminModel } from "./model";
import { email, emailAttachments } from "@db/schema";
import { db } from "@db/db";
import { extname } from "node:path";
import { count, eq, asc, desc } from "drizzle-orm";
import { s3Client } from "@lib/minio";
import { mailer } from "@backend/src/lib/mailer";
import { logger, pino } from "@bogeychan/elysia-logger";


export const adminPlugin = new Elysia({ prefix: "/admin" })
  .use(betterAuthPlugin)
  .use(
    logger({
      level: "info",
      stream: pino.multistream([
        process.stdout,
        pino.destination("./logs/out.log")]),
      autoLogging: false, // disabled
    })
  )
  .post(
    "/changetype",
    async ({ body ,log ,request: {url}, currentUser, currentSession}) => {
      const res = await Admin.changeAccountType(body.email, body.type)
        log.info({
          user: currentUser.email,
          IP: currentSession.ipAddress,
          URL: url,
          changedUser: body.email,
          type: body.type
        },"CHANGE USER")
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
    async ({ body, currentUser, currentSession, request: { url }, log }) => {
      log.info({
        user: currentUser.email,
        IP: currentSession.ipAddress,
        URL: url,
        addUser: body.email,
        business: body.business
      }, "ADD TO BUSINESS")
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
    async ({ body, server, request, log }) => {
      const res = await Admin.bootstrapAdminAccount(body.secret, body.email, body.password, body.name)
      log.warn({
        IP: server?.requestIP(request),
        URL: request.url,
        attempt: res,
        user: body.email
      }, "BOOTSTRAP ATTEMPT")
      if (res === true) {
        return status(201, "Admin created");
      } else {
        return status(403, "Forbidden");
      }
    },
    {
      body: AdminModel.bootStrapAdminAccountBody
    })
  .post("/createbusiness", async ({ body, log, currentUser, currentSession, request: { url } }) => {

    const res = await Admin.createBusiness(body.name.toLowerCase(), body.description, body.industry, body.address, body.bin)
    log.info({
      user: currentUser.email,
      IP: currentSession.ipAddress,
      URL: url,
      businessCreated: !(res === 409),
      businessName: body.name
    }, "BUSINESS CREATED")
    if (res === 409) {
      return status(409, "Business Already Exists")
    } else {
      return status(201, "Business Created")
    }
  }, {
    role: ["admin"],
    body: AdminModel.createBusinessBody
  })
  .post("/createpost", async ({ body, log, currentUser, currentSession, request: { url } }) => {
    const res = await Admin.createArticle(body.title, body.body, body.image)
    log.info({
      user: currentUser.email,
      IP: currentSession.ipAddress,
      URL: url,
      articleCreated: res,
      articleTitle: body.title
    }, "ARTICLE CREATED")
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
    async ({ currentUser, currentSession, log }) => {
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
          html: email.html,
          attachments: email.attachments,
        }).from(email)
          .orderBy(desc(email.createdAt))
          .limit(5)
          .offset((parseInt(params.page) - 1) * 5)
        const emailCount = await db.select({ count: count() }).from(email)
        const data = res.map(prop => ({
          ...prop,
          subject: prop.subject ?? "no subject",
          text: prop.text ?? "no text",
          html: prop.html ?? "no html"
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
    async ({ currentUser, params, set, log, currentSession, request: { url } }) => {
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
        log.info({
          user: currentUser.email,
          IP: currentSession.ipAddress,
          URL: url,
          contentId: params.id,
        }, "DOWNLOAD ATTACHMENT")
        return real; // stream

      }
      catch (e) {
        console.log(e)
        return status(404)
      }
    }, {
    role: ["admin"]
  })
  .post("/email/reply",
    async ({ currentUser, body, log, currentSession, request: { url } }) => {
      try {
        const data = await db
          .select()
          .from(email)
          .where(eq(email.id, body.id))
          .limit(1)

        let attachment = undefined
        if (body.file) {
          const arrayBuffer = await body.file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          attachment = {
            filename: body.file.name,
            content: buffer,
            contentType: body.file.type
          }
        }

        mailer.sendMail({
          from: 'Support@mail.flexihire.link',
          to: data[0].from,
          subject: body.subject,
          text: body.body,
          attachments: attachment ? [attachment] : []
        });
        log.info({
          user: currentUser.email,
          IP: currentSession.ipAddress,
          URL: url,
          repliedTo: body.id,
          subject: body.subject,
          body: body.body,
        }, "EMAIL REPLY")
        return status(200)
      }
      catch {
        return status(501)
      }
    }
    , {
      role: ["admin"],
      body: t.Object({
        id: t.String(),
        subject: t.String(),
        body: t.String(),
        file: t.Optional(t.File())
      })
    }
  )
  .get('/logs/latest', () => Bun.file('./logs/out.log'),{
    role:["admin"]
  })
