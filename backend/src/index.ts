import { Elysia, Context, t } from "elysia";
import { exec } from "child_process";
import { watch } from "fs";
import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { betterAuthPlugin } from "backend/src/lib/auth";
import { staticPlugin } from "@elysiajs/static";
import { user, userCertification, userWorkExperience } from "backend/src/db/schema";
import { profilePlugin } from "@modules/profile/controller";
import { postPlugin } from "@modules/post/controller";
const buildCSS = () =>
  new Promise((resolve) =>
    exec(
      "tailwindcss -i backend/src/app.css -o frontend/public/output.css",
      (_error, _stdout, stderr) => {
        console.log(stderr);
        resolve(null);
      },
    ),
  );

await buildCSS();

const watcher = watch("frontend/public", { recursive: true }, async () => {
  await buildCSS();
});

process.on("SIGINT", () => {
  watcher.close();
  process.exit(0);
});

const app = new Elysia()
  .use(await staticPlugin({
    assets: 'frontend/public'
  }))
  .use(betterAuthPlugin)
  .use(profilePlugin)
  .use(postPlugin)
  .post(
    "/changetype",
    async ({ body }) => {
      const result = await db
        .update(user)
        .set({ role: body.change })
        .where(eq(user.email, body.email));
      return {
        success: "yes",
      };
    },
    {
      role: ["admin"],
      body: t.Object({
        email: t.String(),
        change: t.String(),
      }),
    },
  )
  .listen(3000, ({ hostname, port }) => {
    console.log(`Server started http://${hostname}:${port}`);
  });

  export type App = typeof app 