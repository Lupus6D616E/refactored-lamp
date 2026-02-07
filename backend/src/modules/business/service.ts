import { db } from "@db/db";
import { businessProfile, businessUser, jobApplications, jobPosts, user } from "@db/schema";
import { and, count, eq } from "drizzle-orm";
import { businessModel } from "./model";

export abstract class Business {
  static async markJobFilled(postId: number) {
    const res = await db
      .update(jobPosts)
      .set({
        status: "filled",
      })
      .where(eq(jobPosts.id, postId));
  }
  static async decideApplication(userId: string, postId: number, message: string, decision: businessModel.applicationDecision['decision']) {
    const result = await db
      .update(jobApplications)
      .set({
        status: decision,
        message: message,
      })
      .where(
        and(
          eq(jobApplications.applicantId, userId),
          eq(jobApplications.jobId, postId),
        ),
      );
    return result
  }
  static async getJobApplications(jobId: number) {
    const applications = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .leftJoin(user, eq(user.id, jobApplications.applicantId))
      .where(eq(jobApplications.jobId, jobId));
    return applications;
  }
  static async getJobPosts(businessId: string) {
    const myjobposts = await db
      .select({
        id: jobPosts.id,
        title: jobPosts.title,
        status: jobPosts.status,
        applications: count(jobApplications.jobId).as("repliesCount"),
      })
      .from(jobPosts)
      .leftJoin(jobApplications, eq(jobApplications.jobId, jobPosts.id))
      .groupBy(jobPosts.id /* + other selected columns if needed */)
      .where(eq(jobPosts.businessId, businessId));
    return myjobposts;
  }
  static async getBusinessProfile(businessId: string) {
    const result = await db
      .select({
        name: businessProfile.name,
        description: businessProfile.description,
        industry: businessProfile.industry,
        address: businessProfile.address,
      })
      .from(businessProfile).where(eq(businessProfile.id, businessProfile));
    return result[0]
  }
  static async getUserBusinesses(userId: string) {
    const result = await db
      .select({
        id: businessUser.businessId,
        name: businessProfile.name,
      })
      .from(businessUser)
      .leftJoin(
        businessProfile,
        eq(businessUser.businessId, businessProfile.id),
      )
      .where(eq(businessUser.userId, userId));
    console.log(result);
    return result;
  }
  static async getBusinessFromJobPostId(postId: number) {
    const result = await db
      .select({
        businessId: jobPosts.businessId,
      })
      .from(jobPosts)
      .where(eq(jobPosts.id, postId))
      .limit(1);
    return result[0].businessId;
  }
  static async checkMembership(userId: string, businessId: string) {
    const ids = (await this.getUserBusinesses(userId)).map(({ id }) => id);
    if (ids.includes(businessId)) {
      return true;
    } else {
      return false;
    }
  }
}
