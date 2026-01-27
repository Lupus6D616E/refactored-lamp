import { db } from "@db/db";
import { userDailyUsage } from "@db/schema";
import { Post } from "@modules/post/service";
import { Profile } from "@modules/profile/service"
import { OpenRouter } from "@openrouter/sdk";
import { and, eq } from "drizzle-orm";
const reviewBot = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});


export abstract class ReviewBot{
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
        if (result === 200) {
          return 200;
        } else if (result === 429) {
          return 429;
        } else {
          return 404;
        }
      }
    static async compare(userId:string,postId: number ){
        const postResponse = await Post.getPostDetails(postId)
              const postDetails = postResponse[0]
              const seekerResponse = await Profile.getSeekerProfile(userId)
              const seekerDetails = seekerResponse
              const prompt = `You are a Job Matching Consultant.
              You are to compare this Job Request:{
              title:${postDetails.title}
              description:${postDetails.description}
              requirements:${postDetails.requirements}
              responsibilities:${postDetails.responsibilities}
              }
              To this applicant:{
              description:${seekerDetails.description}
              skills:${seekerDetails.skills}
              education:${seekerDetails.education}
              }
              Respond in at most 3 Paragraphs, then rate the applicant from 1-10.
              ` 
              const completion = await reviewBot.chat.send({
                model: process.env.CHATBOT_MODEL!, // or any OpenRouter-supported model
                messages: [{ role: "user", content: prompt }],
              });
        
              const responseText =
                completion.choices[0]?.message?.content ?? "No response";
        
              // Log response to console
              console.log("OpenRouter response:", responseText);
              return{
                model: process.env.CHATBOT_MODEL!,
                output: responseText
              }

    }
}