import { db } from "@db/db";
import { notifications } from "@db/schema";

export async function createNotification(userId: string,type: string, title: string, message: string, data: object){

        const res = await db
        .insert(notifications)
        .values({
            userId:userId,
            type: type,
            title: title,
            message: message,
            data: data
        }

        )
    
}