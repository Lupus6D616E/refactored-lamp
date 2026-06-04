import { Elysia, redirect  } from "elysia";
import { exec } from "child_process";
import { watch } from "fs";
import { betterAuthPlugin } from "@lib/auth";
import { staticPlugin } from "@elysiajs/static";
import { profilePlugin } from "@modules/profile/controller";
import { postPlugin } from "@modules/post/controller";
import { searchPlugin } from "@modules/search/controller";
import { aiPlugin } from "@modules/reviewbot/controller";
import openapi from "@elysiajs/openapi";
import { OpenAPI } from "@lib/auth";
import { adminPlugin } from "@modules/admin/controller";
import { businessPlugin } from "@modules/business/controller";
import { messagePlugin } from "@modules/mail/controller";
import { verificationPlugin } from "@modules/verification/controller";
import { imagePlugin } from "@modules/static/controller";
import { newsPlugin } from "@modules/news/controller";
import { notificationPlugin } from "@modules/notifications/controller";
import { webHookPlugin } from "@modules/webhooks/controller";
import { cron } from "bun";
import { expireJobApplications, expireJobPosts } from "./lib/maintenance/expirejobs";
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

const maintenance =  Bun.cron("0 * * * *", async () => {
  await expireJobPosts();
  await expireJobApplications()
});

const isProd = process.env.NODE_ENV === 'production'
console.log(process.env.NODE_ENV)
const app = new Elysia()
  .get("/", () =>{
    return redirect("/public/index.html")
  })
  .get("/public", () =>{
    return redirect("/public/index.html")
  }
)
  .get("/public/", () =>{
    return redirect("/public/index.html")
  }
  )
  .use(await staticPlugin({
    bunFullstack:true,
    assets: isProd ? 'dist' : 'frontend/public'
  }))
  .use(newsPlugin)
  .use(imagePlugin)
  .use(betterAuthPlugin)
  .use(profilePlugin)
  .use(postPlugin)
  .use(searchPlugin)
  .use(aiPlugin)
  .use(adminPlugin)
  .use(businessPlugin)
  .use(messagePlugin)
  .use(verificationPlugin)
  .use(notificationPlugin)
  .use(webHookPlugin)
  .use(openapi({documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths()
        }})) 
  .listen({
        port: 3000,
    }, ({ hostname, port }) => {
    console.log(`Server started http://${hostname}:${port}`);
  });

  export type App = typeof app 