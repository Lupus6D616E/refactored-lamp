import { db } from "@db/db";
import { PostModel } from "./model";
import { jobPosts } from "@db/schema";

export abstract class Post {
  static async postJob(
    job: PostModel.JobBody,
    businessId: string,
  ): Promise<boolean> {
    await db.insert(jobPosts).values({
      businessId: businessId,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      city: job.city,
      employmentType: job.employmentType,
      salaryMinimum: job.minimumSalary,
      expiresAt: job.expireDate,
      tags: job.tags,
      contact: job.email,
    });
    return true;
  }
}
