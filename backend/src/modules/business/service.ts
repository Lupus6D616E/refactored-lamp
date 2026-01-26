import { db } from "@db/db";
import { businessProfile, businessUser } from "@db/schema";
import { eq } from "drizzle-orm";

export abstract class Business{

   static async getUserBusinesses(userId: string) {
     const result = await db
       .select({
         id: businessUser.businessId,
         name: businessProfile.name,
       })
       .from(businessUser)
       .leftJoin(
         businessProfile,
         eq(businessUser.businessId, businessProfile.id),
       )
       .where(eq(businessUser.userId, userId));
     console.log(result);
     return result;
   }   
}