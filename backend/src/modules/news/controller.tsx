import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { db } from "@db/db";
import { articles } from "@db/schema";
import { count, desc, eq } from "drizzle-orm";
import { rm } from "node:fs/promises"
const env = process.env.NODE_ENV || 'development'; 

export const newsPlugin = new Elysia({ prefix: "/news" })
  .use(betterAuthPlugin)
  .get("/page/:number", async ({params}) =>{
    const res = await db.select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(5)
    .offset((parseInt(params.number)-1)*5)
    return res
  })
  .get("/pages/total", async ({}) =>{
    const totalCountResult = await db
    .select({ count: count() })
    .from(articles)
   const totalCount = totalCountResult[0]?.count ?? 0
  const totalPages = Math.ceil(totalCount / 5);
  return totalPages;
  })
  .post("/admin/delete",async ({body})=>{
    const result = await db
    .delete(articles)
    .where(eq(articles.id,body.id))
    await rm(`userdata/news/${body.id}`, { recursive: true, force: true });
    return result
  },{
    role:["admin"],
    body: t.Object({
        id: t.Number()
    })
  })
