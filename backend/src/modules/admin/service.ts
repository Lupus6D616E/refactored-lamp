import { db } from "@db/db";
import { extname } from "node:path";
import {
  articles,
  businessProfile,
  businessUser,
  jobApplications,
  jobPosts,
  user,
} from "@db/schema";
import { auth } from "@lib/auth";
import { count, eq, and} from "drizzle-orm";
import { AdminModel } from "./model";
import { s3Client } from "@lib/minio";

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
  static async createArticle(title: string, body: string, image: File) {
    try {
      
      const res = await db
        .insert(articles).values({
          title: title,
          body: body
        }).returning()
      
      const ext = extname(image.name)
      const realpath = `news/news_${res[0].id}${ext}`
      const fakepath = `/static/images/news/news_${res[0].id}${ext}`
      await s3Client.write(realpath, image)
      await db.update(articles).set({
        imageUrl: fakepath
      })
      .where(eq(articles.id,res[0].id))
      return true
    }
    catch {
      return false
    }
  }
  static async addUserToBusiness(email: string, businessName: string) {
    console.log(`${email}  ${businessName} `)
    return db
      .transaction(async (tx) => {
        const userObtained = await tx
          .select({ userId: user.id ,
            role: user.role
          })
          .from(user)
          .where(eq(user.email, email))
          .limit(1);
        if (!userObtained[0]){
          return{
            success: false,
            message: "user not found"
          }
        }
        if (userObtained[0].role !== "business"){
          return{
            success: false,
            message: "user is not a business user"
          }
        }
        const businessObtained = await tx
          .select({ businessId: businessProfile.id })
          .from(businessProfile)
          .where(eq(businessProfile.name, businessName))
          .limit(1);
        if (!businessObtained[0]){
          return{
            success: false,
            message: "business not found"
          }
        }
        const checkBusinessUser = await tx
        .select()
        .from(businessUser)
        .where(and(eq(businessUser.userId, userObtained[0].userId),eq(businessUser.businessId,businessObtained[0].businessId)))
        const userId = userObtained[0].userId;
        const businessId = businessObtained[0].businessId;
        
        if(checkBusinessUser.length > 0){
            return{
            success: false,
            message: "user is already in business"
          }
        }
        // UPSERT-style prevention (works even without DB unique constraint)
        await tx
          .insert(businessUser)
          .values({ userId, businessId })
          .onConflictDoNothing(); // ← PostgreSQL / SQLite (modern)
        // For MySQL you can use: .onDuplicateKeyUpdate({ userId: userId }) but better to check first
        return { success: true, message: "user added" };
      })
      .catch((err) => {
        console.log(`hello ${err}`)
        return { success: false, message: "the fuck" };
      });
  }

  static async createBusiness(
    name: string,
    description: string,
    industry: string,
    address: string,
    bin: string,
  ) {
    try {
      const result = await db
        .insert(businessProfile)
        .values({
          name,
          description,
          industry,
          address,
          bin
        })
        .onConflictDoNothing({ target: businessProfile.name })
        .returning({
          id: businessProfile.id,
          name: businessProfile.name,
        });
      if (result.length === 0) {
        return 409;
      }
      return result;
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
