import { Elysia, status } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { ReviewBotModel } from "./model";
import { ReviewBot } from "./service";

const env = process.env.NODE_ENV || 'development'; 

export const aiPlugin = new Elysia({ prefix: "/ai" })
  .use(betterAuthPlugin)
  .post(
    "/compare",
    async ({ body, currentUser, set }) => {
      const rateStatus = await ReviewBot.ratelimit(currentUser.id);
      if (rateStatus === 429) {
        return status(429,"Exceeded Daily Comparisons");
      }
      const response = await ReviewBot.compare(currentUser.id,body.postId)
      return response
    },
    {
      role: ["user"],
      body: ReviewBotModel.comparisonBody,
    },
  );
