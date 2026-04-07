import { db } from "@db/db";
import { verificationModel } from "./model";
import { businessApplications, businessApplicationsDocuments, user } from "@db/schema";
import { desc, eq } from "drizzle-orm";
import { Admin } from "@modules/admin/service";

export abstract class Verification {
    static async createVerificationRequest(
        userId: string,
        name: string,           // string
        industry: string,       // string
        description: string,    // string 
        address: string,
        bin: string,
        documents: File[],      // File[] 
    ): Promise<verificationModel.businessVerificationReturn> {
        console.log('Text fields:', { name, industry, address,bin, description })
        const application = await db.insert(businessApplications).values({
            userid: userId,
            description: description,
            name: name,
            industry: industry,
            bin: bin,
            address: address
        }).returning()
        // Process multiple files
        for (const doc of documents) {
            console.log(`Document: ${doc.name} (${doc.size} bytes, type: ${doc.type})`)
            // Save with Bun.write()
            const path = `userdata/verification/${userId}/${doc.name}`
            await Bun.write(path, doc)
            await db.insert(businessApplicationsDocuments)
                .values({
                    applicationId: application[0].id,
                    documentName: doc.name,
                    documentUrl: path
                })
        }
        return {
            success: true,
            message: `Received ${documents.length} documents`,
        }

    }
    static async getVerificationStatus(userId:string){
        const status = await db.select({
            id: businessApplications.id,
            verified: businessApplications.verified
        })
        .from(businessApplications)
        .where(eq(businessApplications.userid,userId))
        .orderBy(desc(businessApplications.createdAt))
        if(status[0] === null){
            return null
        }
        return {
            status: status[0].verified,
            id: status[0].id
        }
    }
    static async getPendingVerifications(type: string){
        const res = await db
        .select({
            id: businessApplications.id,
            businessName: businessApplications.name,
            userName: user.name,
            email: user.email,
            status: businessApplications.verified
        })
        .from(businessApplications)
        .leftJoin(user,eq(user.id,businessApplications.userid))
        .where(eq(businessApplications.verified,type))
        console.log(res)
        return res
    }
    static async getVerificationItem(id: number){
        const res = await db
        .select({
            id: businessApplications.id,
            businessName: businessApplications.name,
            userName: user.name,
            description: businessApplications.description,
            address: businessApplications.address,
            industry: businessApplications.industry,
            email: user.email,
            bin: businessApplications.bin,
            status: businessApplications.verified
        })
        .from(businessApplications)
        .leftJoin(user,eq(user.id,businessApplications.userid))
        .where(eq(businessApplications.id,id))
        return res[0]
    }
    static async getPDF(id: number){
        const res = await db
        .select({
            id: businessApplicationsDocuments.id,
            filepath: businessApplicationsDocuments.documentUrl,
            filename: businessApplicationsDocuments.documentName
        })
        .from(businessApplicationsDocuments)
        .where(eq(businessApplicationsDocuments.applicationId,id))
        return res
    }
    static async rejectBusinessApplication(id: number){
        const res = await db.update(businessApplications)
        .set({ verified:"rejected"})
        .where(eq(businessApplications.id, id))
    }
    static async acceptBusinessApplication(id: number){
        const verified = await db.update(businessApplications)
        .set({ verified:"accepted"})
        .where(eq(businessApplications.id, id)).returning()
        const business = verified[0]
        const res = await Admin.createBusiness(business.name,business.description,business.industry,business.address,business.bin)
        const useremail = await db.select({
            email: user.email
        })
        .from(user)
        .where(eq(user.id,business.userid))   
        console.log("business created")      
        const added = await Admin.addUserToBusiness(useremail[0].email,business.name)
        console.log("user added to created business")
    }
}