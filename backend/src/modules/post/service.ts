import { db } from "@db/db";
import { PostModel } from "./model";
import { jobApplications, jobPosts } from "@db/schema";
import { eq, and } from "drizzle-orm";

export abstract class Post {
  static async postJob(
    job: PostModel.JobBody,
    businessId: string,
  ): Promise<boolean> {
    await db.insert(jobPosts).values({
      businessId: businessId,
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
    });
    return true;
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
        contact: jobPosts.contact,
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
