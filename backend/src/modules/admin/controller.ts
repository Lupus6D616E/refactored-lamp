import { Elysia, status, t } from "elysia";
import { betterAuthPlugin, auth } from "@lib/auth";
import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { user } from "@db/schema";
export const adminPlugin = new Elysia({ prefix: "/admin" })
  .use(betterAuthPlugin)
    .post(
    "/changetype",
    async ({ body }) => {
      const result = await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.email, body.email));
      return {
        success: "yes",
      };
    },
    {
      role: ["admin"],
      body: t.Object({
        email: t.String(),
        change: t.String(),
      }),
    },
  )
  .post(
    "/bootstrap",
    async ({ body }) => {
      if (body.secret === process.env.BOOTSTRAP_SECRET!) {
        const adminEmail = body.email;
        const adminPassword = body.password;
        const adminName = body.name;
        console.log("hello");
        const result = await auth.api.createUser({
          body: {
            email: adminEmail,
            password: adminPassword,
            name: adminName,
          },
          // Optional: pass headers if you need to set cookies / mimic a real request
          // headers: await headers(),

          // Important options
          asResponse: false, // get data directly instead of Response object
          // returnHeaders: true,     // if you want Set-Cookie headers
        });
        console.log(result);
        const newAdmin = await db
          .update(user)
          .set({ role: "admin" })
          .where(eq(user.email, adminEmail));
        console.log(newAdmin);
        return status(201, "Admin created");
      } else {
        return status(403, "Forbidden");
      }
    },
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String(),
        secret: t.String(),
      }),
    },
  );
