import { db } from "@db/db";
import { jobPosts } from "@db/schema";
import { eq } from "drizzle-orm";
export abstract class View{

    static async getPostDetails(id:number){
        const result = await db.select({title: jobPosts.title,
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
        }).from(jobPosts).where(eq(jobPosts.id,id))
        return result
    }
}