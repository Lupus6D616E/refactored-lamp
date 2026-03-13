import { db } from "@db/db";
import { businessProfile, mail, user } from "@db/schema";
import { Business } from "@modules/business/service";
import { eq, and, isNull, or } from "drizzle-orm";
export abstract class Message {
    static async checkUserAllowedToViewMessage(userId: string, messageId: number, role: string) {
        if (role === "user") {
            const receivedIds = (await this.getUserMessagesRecievedId(userId)).map(({ id }) => id);
            const sentIds = (await this.getUserMessagesSentId(userId)).map(({ id }) => id)
            if (receivedIds.includes(messageId)) {

                return true;

            } else if (sentIds.includes(messageId)) {
                return true
            }
            else {
                return false;
            }
        }
    }

    static async checkBusinessAllowedToViewMessage(messageId: number, userId: string){
        const message = await this.getMessage(messageId)
        if(message.businessId === null){
            console.log("no business ID??")
            return false
        }
        const check = await Business.checkMembership(userId,message.businessId)
        console.log(check)
        return check
    }
    static async getUserMessagesRecievedId(userId: string) {
        const result = await db
            .select({
                id: mail.id,
            })
            .from(mail)
            .where(eq(mail.receiverId, userId));
        return result;
    }

    static async getUserMessagesSentId(userId: string) {
        const result = await db
            .select({
                id: mail.id,
            })
            .from(mail)
            .where(eq(mail.senderId, userId));
        return result;
    }

    static async getBusinessMessagesRecievedId(businessId: string) {
        const result = await db
            .select({
                id: mail.id,
            })
            .from(mail)
            .where(and(eq(mail.businessId, businessId), or(eq(mail.senderRole, "admin"), eq(mail.senderRole, "user"))));
        return result;
    }

    static async getBusinessMessagesSentId(businessId: string) {
        const result = await db
            .select({
                id: mail.id,
            })
            .from(mail)
            .where(and(eq(mail.businessId, businessId), eq(mail.senderRole, "business")));
        return result;
    }
    static async getUserMessages(userId: string) {
        const res = await db.select({
            messageId: mail.id,
            businessName: businessProfile.name,
            message: mail.message,
            subject: mail.subject,
            senderRole: mail.senderRole,
            replyToId: mail.replyToId,
            date: mail.dateSent,
        }).from(mail)
            .leftJoin(businessProfile, eq(mail.businessId, businessProfile.id))
            .where(eq(mail.receiverId, userId))
        return res
    }
    static async getBusinessMessages(businessId: string) {
        const res = await db.select({
            id: mail.id,
            businessName: businessProfile.name,
            subject: mail.subject,
            senderRole: mail.senderRole,
            replyToId: mail.replyToId,
            date: mail.dateSent,
            name: user.name,
        }).from(mail)
            .leftJoin(businessProfile, eq(mail.businessId, businessProfile.id))
            .leftJoin(user, eq(mail.senderId, user.id))
            .where(and(eq(mail.businessId, businessId), isNull(mail.receiverId)))
        return res
    }
    static async getMessage(mailId: number) {
        const res = await db.select({
            messageId: mail.id,
            businessId: businessProfile.id,
            businessName: businessProfile.name,
            senderName: user.name,
            message: mail.message,
            subject: mail.subject,
            replyToId: mail.replyToId,
            senderRole: mail.senderRole,
            senderId: mail.senderId,
            date: mail.dateSent,
            alreadyReplied: mail.alreadyReplied
        }).from(mail)
            .leftJoin(businessProfile, eq(mail.businessId, businessProfile.id))
            .leftJoin(user, eq(mail.senderId, user.id))
            .where(eq(mail.id, mailId))
        return res[0]
    }
    static async getRepliedId(mailId: number){
        const res = await db.select({
            messageId: mail.id
        }).from(mail).where(eq(mail.replyToId, mailId))
        return res[0]
    }
}