import { db } from "@db/db";
import { searchModel } from "./model";
import { jobPosts } from "@db/schema";
import {
  arrayContains,
  and,
  arrayOverlaps,
  eq,
  gte,
  SQL,
  sql,
} from "drizzle-orm";

export abstract class Search {
  static async find(search: searchModel.searchQuery) {
    const filters: SQL[] = [];
    if (search.title !== undefined) {
      filters.push(sql`${jobPosts.title} % ${search.title.trim()}`);
    }
    if (search.salaryMinimum !== undefined && search.salaryMinimum > 0) {
      filters.push(gte(jobPosts.salaryMinimum, search.salaryMinimum));
    }

    if (search.city) {
      if (search.city !== "All") {
        filters.push(eq(jobPosts.city, search.city));
      }
    }
    if (search.employmentType) {
      if (search.city !== "All") {
        filters.push(eq(jobPosts.employmentType, search.employmentType));
      }
    }
    if (search.tags !== undefined && search.tags.length > 0) {
      if (search.tagsMode === "all") {
        filters.push(arrayContains(jobPosts.tags, search.tags));
      } else if (search.tagsMode === "exact") {
        filters.push(eq(jobPosts.tags, search.tags));
      } else {
        filters.push(arrayOverlaps(jobPosts.tags, search.tags));
      }
    }
    const result = await db
      .select({
        id: jobPosts.id,
        title: jobPosts.title,
        city: jobPosts.city,
        description: jobPosts.description,
        salaryMinimum: jobPosts.salaryMinimum,
        employmentType: jobPosts.employmentType,
        tags: jobPosts.tags,
        schedule: jobPosts.schedule,
        distance:
          sql<number>`levenshtein(${jobPosts.title}, ${search.title})`.as(
            "distance",
          ),
        sim: sql<number>`similarity(${jobPosts.title}, ${search.title})`.as(
          "sim",
        ),
      })
      .from(jobPosts)
      .where(and(...filters)) // fast pre-filter (~0.3–0.4 threshold)
      .orderBy(sql`levenshtein(${jobPosts.title}, ${search.title})`) // precise ordering
      .limit(20);
    return result;
  }
}
