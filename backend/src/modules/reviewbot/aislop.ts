import { Elysia, t } from "elysia";
import { OpenRouter } from "@openrouter/sdk";
import { betterAuthPlugin } from "@lib/auth";
import { RateLimiter } from "./ratelimiter";
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export const aiPlugin = new Elysia({ prefix: "/ai" });

aiPlugin
  .use(betterAuthPlugin)
  .post(
    "/chat",
    async ({ body, currentUser, set }) => {
      const { text } = body as { text: string };

      console.log("what:");
      const rateStatus = await RateLimiter.ratelimit(currentUser.id);
      if (rateStatus === 429) {
        set.status = 429;    

        return {
          error: "Daily limit of 5 reached",
          reset: "tomorrow at midnight",
        };
      }
      console.log("what2");

      const completion = await openrouter.chat.send({
        model: "allenai/molmo-2-8b:free", // or any OpenRouter-supported model
        messages: [{ role: "user", content: text }],
      });

      const responseText =
        completion.choices[0]?.message?.content ?? "No response";

      // Log response to console
      console.log("OpenRouter response:", responseText);

      // Return response to client
      return {
        input: text,
        output: responseText,
      };
    },
    {
      role: ["user"],
      body: t.Object({
        text: t.String(),
      }),
    },
  )
  .post(
    "/compare",
    async ({ body, currentUser, set }) => {
      const { text } = body as { text: string };

      const rateStatus = await RateLimiter.ratelimit(currentUser.id);

      if (rateStatus === 429) {
        set.status = 429;
        return {
          error: "Daily limit of 5 reached",
          reset: "tomorrow at midnight",
        };
      }

      const completion = await openrouter.chat.send({
        model: "allenai/molmo-2-8b:free", // or any OpenRouter-supported model
        messages: [{ role: "user", content: text }],
      });

      const responseText =
        completion.choices[0]?.message?.content ?? "No response";

      // Log response to console
      console.log("OpenRouter response:", responseText);

      // Return response to client
      return {
        output: responseText,
      };
    },
    {
      role: ["user"],
      body: t.Object({
        text: t.String(),
        postid: t.String(),
        userid: t.String()
      }),
    },
  );
