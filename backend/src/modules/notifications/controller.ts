import { db } from "@db/db";
import { notifications } from "@db/schema";
import { betterAuthPlugin } from "@lib/auth";
import { eq,and } from "drizzle-orm";
import { Elysia , status} from "elysia";
const env = process.env.NODE_ENV || 'development';

export const notificationPlugin = new Elysia({ prefix: "/notifications" })
    .use(betterAuthPlugin)
    .get("/mynotifications", async ({ currentUser }) => {
        const res = await db
            .select({
                id: notifications.id,
                type: notifications.type,
                title: notifications.title,
                message: notifications.message,
                createdAt: notifications.createdAt,
            })
            .from(notifications)
            .where(and(eq(notifications.userId, currentUser.id),eq(notifications.isRead, false)))
        return res
    }, {
        role: ["user"]
    })
    .get("/markread/:id", async ({ currentUser, params}) =>{
        try{
        const res = await db
        .update(notifications)
        .set({
            isRead: true
        })
        .where(and(eq(notifications.userId,currentUser.id),eq(notifications.id,parseInt(params.id))))
        return status(200)
    }
    catch{
        return status(500)
    }
    },{
        role: ["user", "business"]
    })