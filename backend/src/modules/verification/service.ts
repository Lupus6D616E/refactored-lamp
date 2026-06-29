import { db } from "@db/db";
import { verificationModel } from "./model";
import { businessApplications, businessApplicationsDocuments, businessProfile, disabilityVerification, seekerProfile, studentVerification, user } from "@db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Admin } from "@modules/admin/service";
import { s3Client } from "@lib/minio";
import { createNotification } from "@backend/src/lib/notifications";

export abstract class Verification {
    static async getSeekerVerificationStatus(userId: string): Promise<verificationModel.seekerVerificationStatusReturn> {
        let answer: verificationModel.seekerVerificationStatusReturn = {
            disability: "Unverified",
            student: "Unverified"
        }
        const res = await db
            .select({
                disabilityStatus: seekerProfile.disabilityVerified,
                studentStatus: seekerProfile.studentVerified,
                studentVerifiedDate: seekerProfile.studentVerifiedDate
            })
            .from(seekerProfile)
            .where(eq(seekerProfile.userId, userId))
        if(res[0].studentStatus) {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (res[0].studentVerifiedDate! < oneYearAgo) {
                await db
                    .update(seekerProfile)
                    .set({
                        studentVerified: false,
                        studentVerifiedDate: null
                    })
                    .where(eq(seekerProfile.userId, userId))
                createNotification(userId, "verification expiry", "Your Student Verification has expired!", "Reverify if you are still a student!", {})
                answer.student = "Unverified"
            }
            else {
                answer.student = "Verified"
            }
        }
        else {
            const res = await db.select().from(studentVerification).where(eq(studentVerification.userId, userId)).limit(1)
            if (res.length === 1) {
                answer.student = "Pending"
            }
        }
        if (res[0].disabilityStatus) {
            answer.disability = "Verified"
        }
        else {
            const res = await db.select().from(disabilityVerification).where(eq(disabilityVerification.userId, userId)).limit(1)
            if (res.length === 1) {
                answer.disability = "Pending"
            }
        }
        return answer

    }

    static async getPendingSeekerVerifications(
        page: number,
        seekerType: string
    ) {
        if (seekerType === "disabled") {
            {
                console.log("disbled seker serach")
                const res = await db
                    .select({
                        id: disabilityVerification.id,
                        userName: user.name,
                        email: user.email,
                    })
                    .from(disabilityVerification)
                    .leftJoin(user, eq(user.id, disabilityVerification.userId))
                    .orderBy(desc(disabilityVerification.createdAt))
                    .limit(5)
                    .offset((page - 1) * 5)
                const applicationCount = await db.select({ count: count() }).from(disabilityVerification)
                const applications = res.map((item) => ({ ...item, status: "disabled" as const }))
                return {
                    applications: applications,
                    pagination: {
                        page: page,
                        totalApplications: applicationCount[0].count,
                        totalPages: Math.ceil(applicationCount[0].count / 5)
                    }

                }

            }
        }
        else {
            {
                const res = await db
                    .select({
                        id: studentVerification.id,
                        userName: user.name,
                        email: user.email,
                    })
                    .from(studentVerification)
                    .leftJoin(user, eq(user.id, studentVerification.userId))
                    .orderBy(desc(studentVerification.createdAt))
                    .limit(5)
                    .offset((page - 1) * 5)
                const applicationCount = await db.select({ count: count() }).from(studentVerification)
                const applications = res.map((item) => ({ ...item, status: "student" as const }))
                return {
                    applications: applications,
                    pagination: {
                        page: page,
                        totalApplications: applicationCount[0].count,
                        totalPages: Math.ceil(applicationCount[0].count / 5)
                    }

                }

            }
        }
    }
    static async createDisabilityVerificationRequest(
        userId: string,
        document: File,
        disabilities: string[]
    ): Promise<boolean> {
        const newName = (Math.floor(10000 + Math.random() * 90000) + "-" + document.name)
        const path = `verification/disability/${userId}/${newName}`
        try {
            await s3Client.write(path, document)
            const res = await db.insert(disabilityVerification)
                .values({
                    userId: userId,
                    documentUrl: path,
                    disabilities: disabilities
                })
                .onConflictDoUpdate({
                    target: disabilityVerification.userId,
                    set: {
                        documentUrl: path,
                        disabilities: disabilities
                    }
                })
            console.log("activated 3")
        }
        catch (e) {
            console.log(e)
            return false
        }
        return true
    }
    static async createStudentVerificationRequest(
        userId: string,
        document: File,
    ): Promise<boolean> {
        const newName = (Math.floor(10000 + Math.random() * 90000) + "-" + document.name)
        const path = `verification/student/${userId}/${newName}`
        try {
            await s3Client.write(path, document)
            const res = await db.insert(studentVerification)
                .values({
                    userId: userId,
                    documentUrl: path,

                })
                .onConflictDoUpdate({
                    target: studentVerification.userId,
                    set: {
                        documentUrl: path,
                    }
                })
            console.log("activated 3")
        }
        catch (e) {
            console.log(e)
            return false
        }
        return true
    }
    static async getDisabledSeekerVerificationItem(id: number) {
        const res = await db
            .select({
                id: disabilityVerification.id,
                userName: user.name,
                email: user.email,
                disabilities: disabilityVerification.disabilities
            })
            .from(disabilityVerification)
            .where(eq(disabilityVerification.id, id))
            .leftJoin(user, eq(user.id, disabilityVerification.userId))
            return res
    }

    static async getStudentSeekerVerificationItem(id: number) {
        const res = await db
            .select({
                id: studentVerification.id,
                userName: user.name,
                email: user.email,
            })
            .from(studentVerification)
            .where(eq(studentVerification.id, id))
            .leftJoin(user, eq(user.id, studentVerification.userId))
            const application = res.map((item) => ({ ...item, disabilities: null}))
            return application
    }

    static async getSeekerVerificationFile(id:number,seekerType:string){
        if(seekerType === "disabled"){
            const res = await  db.select({
                id: disabilityVerification.id,
                url: disabilityVerification.documentUrl
            })
            .from(disabilityVerification)
            .where(eq(disabilityVerification.id, id))
            const file = await s3Client.file(res[0].url)
            return file
        }
        else{
            const res = await  db.select({
                id: studentVerification.id,
                url: studentVerification.documentUrl
            })
            .from(studentVerification)
            .where(eq(studentVerification.id, id))
            const file = await s3Client.file(res[0].url)
            return file
        }
    }
    static async createVerificationRequest(
        userId: string,
        name: string,           // string
        industry: string,       // string
        description: string,    // string 
        address: string,
        bin: string,
        documents: File[],      // File[] 
    ): Promise<verificationModel.businessVerificationReturn> {
        console.log('Text fields:', { name, industry, address, bin, description })
        try {
            const nameTaken = await db
                .select({ exists: businessProfile.name })
                .from(businessProfile)
                .where(eq(businessProfile.name, name.toLowerCase().trim()))
                .limit(1);
            if (nameTaken.length > 0) {
                console.log("name taken")
                return {
                    success: false,
                    message: `a business with this name already exists`,
                }
            }
            const application = await db.insert(businessApplications).values({
                userid: userId,
                description: description,
                name: name.toLowerCase().trim(),
                industry: industry,
                bin: bin,
                address: address
            }).returning()
            console.log(application)
            // Process multiple files
            for (const doc of documents) {
                console.log(`Document: ${doc.name} (${doc.size} bytes, type: ${doc.type})`)
                const newName = (Math.floor(10000 + Math.random() * 90000) + "-" + doc.name)
                const path = `verification/business/${userId}/${newName}`
                await s3Client.write(path, doc)
                await db.insert(businessApplicationsDocuments)
                    .values({
                        applicationId: application[0].id,
                        documentName: newName,
                        documentUrl: path
                    })
            }
        }
        catch (e) {
            console.log(e)
            return {
                success: false,
                message: `an error has occurred`,
            }
        }
        return {
            success: true,
            message: `Received ${documents.length} documents`,
        }

    }
    static async getVerificationStatus(userId: string) {
        const status = await db.select({
            id: businessApplications.id,
            verified: businessApplications.verified
        })
            .from(businessApplications)
            .where(eq(businessApplications.userid, userId))
            .orderBy(desc(businessApplications.createdAt))
        if (status[0] === null) {
            return null
        }
        return {
            status: status[0].verified,
            id: status[0].id
        }
    }
    static async getPendingVerifications(type: string, page: number) {
        if (type === "pending") {
            const res = await db
                .select({
                    id: businessApplications.id,
                    businessName: businessApplications.name,
                    userName: user.name,
                    email: user.email,
                    status: businessApplications.verified,
                })
                .from(businessApplications)
                .leftJoin(user, eq(user.id, businessApplications.userid))
                .where(eq(businessApplications.verified, type))
                .orderBy(desc(businessApplications.createdAt))
                .limit(5)
                .offset((page - 1) * 5)
            const applicationCount = await db.select({ count: count() }).from(businessApplications).where(eq(businessApplications.verified, type))
            return {
                applications: res,
                pagination: {
                    page: page,
                    totalApplications: applicationCount[0].count,
                    totalPages: Math.ceil(applicationCount[0].count / 5)
                }

            }
        }
        else {
            const res = await db
                .select({
                    id: businessApplications.id,
                    businessName: businessApplications.name,
                    userName: user.name,
                    email: user.email,
                    status: businessApplications.verified,
                })
                .from(businessApplications)
                .leftJoin(user, eq(user.id, businessApplications.userid))
                .orderBy(desc(businessApplications.createdAt))
                .limit(5)
                .offset((page - 1) * 5)
            const applicationCount = await db.select({ count: count() }).from(businessApplications)
            return {
                applications: res,
                pagination: {
                    page: page,
                    totalApplications: applicationCount[0].count,
                    totalPages: Math.ceil(applicationCount[0].count / 5)
                }
            }
        }
    }
    static async getVerificationItem(id: number) {
        const res = await db
            .select({
                id: businessApplications.id,
                businessName: businessApplications.name,
                userId: businessApplications.userid,
                userName: user.name,
                description: businessApplications.description,
                address: businessApplications.address,
                industry: businessApplications.industry,
                email: user.email,
                bin: businessApplications.bin,
                status: businessApplications.verified
            })
            .from(businessApplications)
            .leftJoin(user, eq(user.id, businessApplications.userid))
            .where(eq(businessApplications.id, id))
        return res[0]
    }
    static async getPDF(id: number) {
        const res = await db
            .select({
                id: businessApplicationsDocuments.id,
                filepath: businessApplicationsDocuments.documentUrl,
                filename: businessApplicationsDocuments.documentName
            })
            .from(businessApplicationsDocuments)
            .where(eq(businessApplicationsDocuments.applicationId, id))
        return res
    }
    static async rejectSeekerApplication(id: number, seekerType: string){
        if(seekerType === "disabled"){
            const res = await db.select().from(disabilityVerification).where(eq(disabilityVerification.id,id))
            await createNotification(res[0].userId,"Seeker Verification", "Disability Verification", "Your Disability Verification has been rejected, try again, or contact support.",{
                applicationId: res[0].userId,
                userId: res[0].userId
            })
            await s3Client.delete(res[0].documentUrl)
            await db.delete(disabilityVerification).where(eq(disabilityVerification.id,id))
            return
        }
        else{
            const res = await db.select().from(studentVerification).where(eq(studentVerification.id,id))
            await createNotification(res[0].userId,"Seeker Verification", "Student Verification", "Your Student Verification has been rejected, try again, or contact support.",{
                applicationId: res[0].userId,
                userId: res[0].userId
            })
            await s3Client.delete(res[0].documentUrl)
            await db.delete(studentVerification).where(eq(studentVerification.id,id))
            return
        }
    }
       static async acceptSeekerApplication(id: number, seekerType: string){
        if(seekerType === "disabled"){

            const res = await db.select().from(disabilityVerification).where(eq(disabilityVerification.id,id))
            await createNotification(res[0].userId,"Seeker Verification", "Disability Verification", "Your Disability Verification has been accepted.",{
                applicationId: res[0].userId,
                userId: res[0].userId
            })
            await db.update(seekerProfile).set({
                disabilities: res[0].disabilities,
                disabilityVerified: true
            })
            .where(eq(seekerProfile.userId,res[0].userId))
            
            await s3Client.delete(res[0].documentUrl)
            await db.delete(disabilityVerification).where(eq(disabilityVerification.id,id))
            return
        }
        else{
            const res = await db.select().from(studentVerification).where(eq(studentVerification.id,id))
            await createNotification(res[0].userId,"Seeker Verification", "Student Verification", "Your Student Verification has been accepted.",{
                applicationId: res[0].userId,
                userId: res[0].userId
            })

            await db.update(seekerProfile).set({
                studentVerified: true,
                studentVerifiedDate: new Date
            })
            .where(eq(seekerProfile.userId,res[0].userId))
            await s3Client.delete(res[0].documentUrl)
            await db.delete(studentVerification).where(eq(studentVerification.id,id))
            return
        }
    }
    static async rejectBusinessApplication(id: number) {
        const res = await db.update(businessApplications)
            .set({ verified: "rejected" })
            .where(eq(businessApplications.id, id))
    }
    static async acceptBusinessApplication(id: number) {
        const verified = await db.update(businessApplications)
            .set({ verified: "accepted" })
            .where(eq(businessApplications.id, id)).returning()
        const business = verified[0]
        const res = await Admin.createBusiness(business.name.toLowerCase().trim(), business.description, business.industry, business.address, business.bin)
        const useremail = await db.select({
            email: user.email
        })
            .from(user)
            .where(eq(user.id, business.userid))
        console.log("business created")
        const added = await Admin.addUserToBusiness(useremail[0].email, business.name.trim().toLowerCase())
        console.log("user added to created business")
    }
}