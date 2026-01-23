import { Elysia, status, t } from "elysia";
import { betterAuthPlugin, auth } from "@lib/auth";
import { db } from "@db/db";
import { count, eq } from "drizzle-orm";
import { jobApplications, jobPosts, user } from "@db/schema";
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
  )
  .get(
    "/stats",
    async ({}) => {
      const [
        adminCount,
        businessCount,
        userCount,
        jobPostCount,
        applicationAcceptedCount,
        applicationPendingCount,
        applicationRejectedCount,
      ] = await Promise.all([
        db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "admin"))
          .then((r) => Number(r[0]?.count ?? 0)),

        db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "business"))
          .then((r) => Number(r[0]?.count ?? 0)),

        db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "user"))
          .then((r) => Number(r[0]?.count ?? 0)),

        db
          .select({ count: count() })
          .from(jobPosts)
          .then((r) => Number(r[0]?.count ?? 0)),

        db
          .select({ count: count() })
          .from(jobApplications)
          .where(eq(jobApplications.status, "accepted"))
          .then((r) => Number(r[0]?.count ?? 0)),
        db
          .select({ count: count() })
          .from(jobApplications)
          .where(eq(jobApplications.status, "pending"))
          .then((r) => Number(r[0]?.count ?? 0)),
        db
          .select({ count: count() })
          .from(jobApplications)
          .where(eq(jobApplications.status, "rejected"))
          .then((r) => Number(r[0]?.count ?? 0)),
      ]);
      const totalApplications =
        applicationAcceptedCount +
        applicationPendingCount +
        applicationRejectedCount;
      const totalUsers = adminCount + businessCount + userCount;

        // Bun / process.uptime() returns seconds since process start
  const totalSeconds = Math.floor(process.uptime());

  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0)    parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0)   parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (seconds > 0 || parts.length === 0) 
    parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
      
      return {
        seekers: userCount,
        businesses: businessCount,
        userTotal: totalUsers,
        jobPosts: jobPostCount,
        applicationTotal: totalApplications,
        applicationPending: applicationPendingCount,
        applicationAccepted: applicationAcceptedCount,
        applicationRejected: applicationRejectedCount,
        uptime:parts.join(', ')
      };
    },
    {
      role: ["admin"],
    },
  );
