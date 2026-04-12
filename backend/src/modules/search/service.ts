import { db } from "@db/db";
import { searchModel } from "./model";
import {
  businessProfile,
  businessUser,
  jobPostEmbedding,
  jobPosts,
  seekerProfile,
  seekerProfileEmbedding,
  user,
} from "@db/schema";
import {
  arrayContains,
  and,
  arrayOverlaps,
  eq,
  gte,
  SQL,
  sql,
  cosineDistance,
  inArray,
} from "drizzle-orm";
export abstract class Search {
  static async findjobpost(search: searchModel.searchJobQuery) {
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
      })
      .from(jobPosts)
      .where(and(...filters)) // fast pre-filter (~0.3–0.4 threshold)
      .orderBy(sql`levenshtein(${jobPosts.title}, ${search.title})`) // precise ordering
      .limit(20);
    return result;
  }
  static async smartJobSearch(userID: string) {
    const profileEmbedding = await getUserEmbedding(userID)
    console.log(`getting embeddings for ${userID}`)
    const similarPosts = await db
      .select({
        id: jobPostEmbedding.id,
        postId: jobPostEmbedding.postid,
        similarity: sql<number>`1 - (${cosineDistance(jobPostEmbedding.postEmbedding, profileEmbedding.embedding)})`.as('similarity'),
      })
      .from(jobPostEmbedding)
      .orderBy(cosineDistance(jobPostEmbedding.postEmbedding,profileEmbedding.embedding))
      .limit(5);
    console.log(`got embeddings, ${similarPosts}`)
    const postIds = similarPosts.map(({postId}) => postId)
    similarPosts.forEach((item)=> {console.log(`${item.postId} and sim: ${item.similarity}`)})
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
      })
      .from(jobPosts)
      .where(inArray(jobPosts.id,postIds))
      .limit(5)
    return result
  }
  static async findSeeker(search: searchModel.searchUserQuery) {
    const filters: SQL[] = [];
    if (search.name !== undefined) {
      filters.push(sql`${user.name} % ${search.name.trim()}`);
      filters.push(eq(user.role, "user"));
    }
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        banned: user.banned,
        description: sql<string>`
      COALESCE(
        ${seekerProfile.description},
        'user has not set up profile yet'
      )
    `,
        distance: sql<number>`levenshtein(${user.name}, ${search.name})`.as(
          "distance",
        ),
        sim: sql<number>`similarity(${user.name}, ${search.name})`.as("sim"),
      })
      .from(user)
      .leftJoin(seekerProfile, eq(user.id, seekerProfile.userId))
      .where(and(...filters)) // fast pre-filter (~0.3–0.4 threshold)
      .orderBy(sql`levenshtein(${user.name}, ${search.name})`) // precise ordering
      .limit(20);
    return result;
  }
  static async findBusiness(search: searchModel.searchBusinessQuery) {
    const filters: SQL[] = [];
    if (search.name !== undefined) {
      filters.push(sql`${businessProfile.name} % ${search.name.trim()}`);
    }
    const result = await db
      .select({
        id: businessProfile.id,
        name: businessProfile.name,
        description: businessProfile.description,
        address: businessProfile.address,
        industry: businessProfile.industry,
        distance: sql<number>`levenshtein(${businessProfile.name}, ${search.name})`.as(
          "distance",
        ),
        sim: sql<number>`similarity(${businessProfile.name}, ${search.name})`.as("sim"),
      })
      .from(businessProfile)
      .where(and(...filters)) // fast pre-filter (~0.3–0.4 threshold)
      .orderBy(sql`levenshtein(${businessProfile.name}, ${search.name})`) // precise ordering
      .limit(20);
    return result;
  }
  static async findBusinessUser(search: searchModel.searchUserQuery) {
    const filters: SQL[] = [];
    if (search.name !== undefined) {
      filters.push(sql`${user.name} % ${search.name.trim()}`);
      filters.push(eq(user.role, "business"));
    }
    try {
      const result = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          businessName: sql<
            string[]
          >`coalesce(array_agg(${businessProfile.name}), '{}')::text[]`.as(
            "business_names",
          ),
          description: sql<
            string[]
          >`coalesce(array_agg(${businessProfile.description}), '{}')::text[]`.as(
            "business_descriptions",
          ),
          distance: sql<number>`levenshtein(${user.name}, ${search.name})`.as(
            "distance",
          ),
          sim: sql<number>`similarity(${user.name}, ${search.name})`.as("sim"),
        })
        .from(user)
        .leftJoin(businessUser, eq(user.id, businessUser.userId))
        .leftJoin(
          businessProfile,
          eq(businessUser.businessId, businessProfile.id),
        )
        .where(and(...filters)) // fast pre-filter (~0.3–0.4 threshold)
        .orderBy(sql`levenshtein(${user.name}, ${search.name})`) // precise ordering
        .groupBy(user.id, user.name)
        .limit(20);

      return result;
    }
    catch (error) { console.log(error) }
  }
}

async function getUserEmbedding(userID: string) {
  const res = await db.select({
    embedding: seekerProfileEmbedding.profileEmbedding
  }).from(seekerProfileEmbedding)
    .where(eq(seekerProfileEmbedding.userid, userID))
  return res[0]
}