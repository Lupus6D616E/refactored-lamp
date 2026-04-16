import { Elysia, status } from "elysia";
import { betterAuthPlugin } from "@lib/auth";

const env = process.env.NODE_ENV || 'development'; 

export const imagePlugin = new Elysia({ prefix: "/static" })
  .use(betterAuthPlugin)
  .get("/images/news/:id/:filename", ({ params:{id, filename} }) => {
    return Bun.file(`userdata/news/${id}/${filename}`)
  })    