import { db } from "@db/db";
import { businessProfile, businessUser, jobPosts } from "@db/schema";
import { eq } from "drizzle-orm";

export abstract class Business {
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
