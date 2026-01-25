import { db } from "@db/db";
import { businessProfile, jobApplications, jobPosts, user } from "@db/schema";
import { auth } from "@lib/auth";
import { count, eq } from "drizzle-orm";
import { AdminModel } from "./model";

export abstract class Admin {
  static async changeAccountType(email: string, type: AdminModel.role) {
    try {
      const result = await db
        .update(user)
        .set({ role: type })
        .where(eq(user.email, email));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  static async bootstrapAdminAccount(
    secret: string,
    email: string,
    password: string,
    name: string,
  ) {
    if (secret === process.env.BOOTSTRAP_SECRET!) {
      const result = await auth.api.createUser({
        body: {
          email: email,
          password: password,
          name: name,
        },
        asResponse: false, // get data directly instead of Response object
        // returnHeaders: true,     // if you want Set-Cookie headers
      });
      console.log(result);
      const newAdmin = await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.email, email));
      console.log(newAdmin);
      return true;
    } else {
      return false;
    }
  }
  static async createbusiness(
    name: string,
    description: string,
    industry: string,
    address: string,
  ) {
    try {
      const result = await db
        .insert(businessProfile)
        .values({
          name,
          description,
          industry,
          address,
        })
        .onConflictDoNothing({ target: businessProfile.name })
        .returning({
          id: businessProfile.id,
          name: businessProfile.name,
        });
      if (result.length === 0) {
        return 409;
      }
      return 201;
    
    } catch (e) {
      console.log(e);
    } 
     
  }
  static async statistics() {
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
    const uptime = uptimeString();

    return {
      seekers: userCount,
      businesses: businessCount,
      userTotal: totalUsers,
      jobPosts: jobPostCount,
      applicationTotal: totalApplications,
      applicationPending: applicationPendingCount,
      applicationAccepted: applicationAcceptedCount,
      applicationRejected: applicationRejectedCount,
      uptime: uptime,
    };
  }
}

function uptimeString() {
  const totalSeconds = Math.floor(process.uptime());

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} second${seconds === 1 ? "" : "s"}`);

  return parts.join(", ");
}
