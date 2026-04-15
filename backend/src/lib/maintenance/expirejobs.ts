
import { db } from '@db/db';
import { jobPosts } from '@db/schema';
import { eq, and, lt, sql } from 'drizzle-orm';

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
    console.log(`Marked ${result.length} rows as expired`)
}

if(import.meta.main){
    await expireJobPosts()
}