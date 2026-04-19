
import { db } from '@db/db';
import { jobApplications, jobPosts } from '@db/schema';
import { eq, and, lt, sql, or, inArray } from 'drizzle-orm';

export async function expireJobPosts() {
    const result = await db
        .update(jobPosts)
        .set({
            status: 'expired'
        })
        .where(
            and(
                eq(jobPosts.status, 'active'),
                lt(jobPosts.expiresAt, sql`NOW()`)   // PostgreSQL
            )
        ).returning()
    console.log(`Marked ${result.length} job posts as expired`)
}

export async function expireJobApplications(){
    const result = await db
    .update(jobApplications)
    .set({
        status: 'expired',
        message: 'this job application has expired due to the posting expiring.'
    })
    .where(
        and(
            eq(jobApplications.status,'pending'),
            inArray(
                jobApplications.jobId,
                db.select({id: jobPosts.id})
                  .from(jobPosts)
                  .where(inArray(jobPosts.status,['expired','filled']))
            )
        )
    ).returning()

    console.log(`Marked ${result.length} job applications as expired`)
}
if(import.meta.main){
    await expireJobPosts()
    await expireJobApplications()
}