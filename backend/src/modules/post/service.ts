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
      schedule: job.schedule
    });
    return true;
  }
}

function capitalizeWords(str: string): string {
  const words = str.trim().replace(/\s+/g, ' ').split(' ');

  const capitalizedWords = words.map(word => {
    if (word.length === 0) return '';
    // Capitalize the first letter and concatenate with the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(' ');
}
const normalize = (items: string[]): string[] =>
  items.map(item =>
    item
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase())
  );
