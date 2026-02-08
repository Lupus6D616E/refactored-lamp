import { db } from "@db/db";
import { businessProfile, mail } from "@db/schema";
import { eq } from "drizzle-orm";
export abstract class Message{
    static async checkAllowedToViewMessage(userId: string, messageId: number){
    const ids = (await this.getUserMessages(userId)).map(({ id }) => id);
    if (ids.includes(messageId)) {
      return true;
    } else {
      return false;
    }
    }
     static async getUserMessages(userId: string) {
        const result = await db
          .select({
            id: mail.id,
          })
          .from(mail)
          .where(eq(mail.receiverId, userId));
        return result;
      }
    static async getMessage(mailId: number){
         const res = await db.select({
                  messageId: mail.id,
                  businessId: businessProfile.id,
                  businessName: businessProfile.name,
                  message: mail.message,
                  subject: mail.subject,
                  senderRole: mail.senderRole,
                  date: mail.dateSent,
                }).from(mail)
                  .leftJoin(businessProfile, eq(mail.businessId, businessProfile.id))
                  .where(eq(mail.id, mailId))
                return res[0]
    }
}