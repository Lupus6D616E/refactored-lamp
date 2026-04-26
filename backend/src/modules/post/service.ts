import { db } from "@db/db";
import { PostModel } from "./model";
import { jobApplications, jobPostEmbedding, jobPosts, jobPostTitleEmbedding } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { getEmbedding } from "@lib/embeddings";

export abstract class Post {
  static async postJob(
    job: PostModel.JobBody,
    userId: string,
  ): Promise<boolean> {
    try {
      const res = await db.insert(jobPosts).values({
        creatorId: userId,
        businessId: job.businessId,
        title: capitalizeWords(job.title),
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        city: job.city,
        employmentType: job.employmentType,
        salaryMinimum: job.minimumSalary,
        expiresAt: job.expireDate,
        tags: normalize(job.tags),
        contact: job.email,
        schedule: job.schedule,
        address: job.address,
        location: { x: job.location.lng, y: job.location.lat }
      }).returning()
      this.insertCreatedEmbedding(res[0].id)
      this.insertCreatedTitleEmbedding(res[0].id)
      return true;
    } catch (e) {
      console.log(e)
      return false
    }
  }
  static async getPostDetails(id: number) {
    const result = await db
      .select({
        title: jobPosts.title,
        description: jobPosts.description,
        requirements: jobPosts.requirements,
        responsibilities: jobPosts.responsibilities,
        city: jobPosts.city,
        employmentType: jobPosts.employmentType,
        salaryMinimum: jobPosts.salaryMinimum,
        postedAt: jobPosts.postedAt,
        expiresAt: jobPosts.expiresAt,
        status: jobPosts.status,
        schedule: jobPosts.schedule,
        tags: jobPosts.tags,
        businessid: jobPosts.businessId,
        contact: jobPosts.contact,
        address: jobPosts.address,
        location: jobPosts.location
      })
      .from(jobPosts)
      .where(eq(jobPosts.id, id));
    return result;
  }
  static async postApplication(userId: string, jobId: number) {
    try {
      // Optional: check if already exists (to give friendly message)
      const existing = await db
        .select()
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.applicantId, userId),
            eq(jobApplications.jobId, jobId),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return {
          success: false,
          error: "Already associated",
          code: "DUPLICATE_ASSOCIATION",
        };
      }

      // Insert the association
      await db.insert(jobApplications).values({
        applicantId: userId,
        jobId: Number(jobId), // ensure correct type
      });

      return {
        success: true,
        message: "Associated successfully",
        data: { userId, jobId },
      };
    } catch (err: any) {
      console.error(err);

      // Handle unique constraint violation (most common failure here)
      // PostgreSQL → code '23505', MySQL → code 'ER_DUP_ENTRY', SQLite → message includes 'UNIQUE constraint'
      if (
        err.code === "23505" || // PostgreSQL
        err.code === "ER_DUP_ENTRY" || // MySQL
        (err.message && err.message.includes("UNIQUE constraint failed")) // SQLite
      ) {
        return {
          success: false,
          error: "This user is already associated with the post",
          code: "DUPLICATE_ASSOCIATION",
        };
      }

      // Generic server error for anything else
      return {
        success: false,
        error: "Failed to associate user with post",
        code: "INTERNAL_ERROR",
      };
    }
  }
  static async embedJobPostTitle(jobId: number){
     console.log(`getting job id ${jobId}`)
    const jobPost = await Post.getPostDetails(jobId)
    const text = jobPost[0].title
    const output = await getEmbedding(text);
    const embedding = output.tolist()[0]
    return embedding
  }
  static async embedJobPost(jobID: number) {
    console.log(`getting job id ${jobID}`)
    const jobPost = await Post.getPostDetails(jobID)

    const scheduleStr = Array.isArray(jobPost[0].schedule)
      ? jobPost[0].schedule.join(', ')
      : '';

    const tagsStr = Array.isArray(jobPost[0].tags)
      ? jobPost[0].tags.join(', ')
      : '';

    const text = `
    Job Title: ${jobPost[0].title || ''}
    Description: ${jobPost[0].description || ''}
    Requirements: ${jobPost[0].requirements || ''}
    Responsibilities ${jobPost[0].responsibilities || ''}
    Schedule: ${scheduleStr}
    Tags: ${tagsStr}
  `.trim();
    const output = await getEmbedding(text);
    const embedding = output.tolist()[0]
    return embedding
  }

  static async insertCreatedTitleEmbedding(postId:number){

      const embedding = await this.embedJobPostTitle(postId)
    const res = await db.insert(jobPostTitleEmbedding).values({
      postId: postId,
      postTitleEmbedding: embedding
    })
      .onConflictDoUpdate({
        target: jobPostEmbedding.postid,
        set: { postTitleEmbedding: embedding },
      })
  }
  
  static async insertCreatedEmbedding(postID: number) {
    const embedding = await this.embedJobPost(postID)
    const res = await db.insert(jobPostEmbedding).values({
      postid: postID,
      postEmbedding: embedding
    })
      .onConflictDoUpdate({
        target: jobPostEmbedding.postid,
        set: { postEmbedding: embedding },
      })
  }
}

function capitalizeWords(str: string): string {
  const words = str.trim().replace(/\s+/g, " ").split(" ");

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) return "";
    // Capitalize the first letter and concatenate with the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}
const normalize = (items: string[]): string[] =>
  items.map((item) =>
    item
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  );