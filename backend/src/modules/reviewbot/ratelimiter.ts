import { db } from "@db/db";
import { userDailyUsage } from "@db/schema";
import { and, eq } from "drizzle-orm";
export abstract class RateLimiter {
  static async ratelimit(userId: string): Promise<number> {
    const today = new Date().toISOString().split("T")[0];

    const result = await db.transaction(async (tx) => {
      const record = await tx
        .select()
        .from(userDailyUsage)
        .where(
          and(
            eq(userDailyUsage.userId, userId),
            eq(userDailyUsage.date, today),
          ),
        )
        .limit(1);

      if (!record[0]) {
        console.log("wtf")
        await tx.insert(userDailyUsage).values({
          userId: userId,
          date: today,
          count: 1,
        });
        return 200;
      } else if (record[0].count >= 5) {
        return 429;
      } else {
        await tx
          .update(userDailyUsage)
          .set({ count: record[0].count + 1, updatedAt: new Date() })
          .where(eq(userDailyUsage.userId, record[0].userId));
        return 200;
      }
    });
    if(result === 200){
        return 200
    }
    else if (result === 429){
        return 429
    }
    else{
        return 404
    }
  }
}
