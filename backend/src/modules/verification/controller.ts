
import { betterAuthPlugin } from '@lib/auth'
import { Elysia, status, t } from 'elysia'
import { verificationModel } from './model'
import { Verification } from './service'
import AdmZip from 'adm-zip';
import { s3Client } from '@lib/minio';
import { createNotification } from '@lib/notifications';
import { logger, pino } from '@bogeychan/elysia-logger';
import { min } from 'drizzle-orm';
export const verificationPlugin = new Elysia({ prefix: "/verify" })
    .use(betterAuthPlugin)
    .use(
        logger({
            level: "info",
            stream: pino.multistream([
                process.stdout,
                pino.destination("./logs/out.log")]),
            autoLogging: false, // disabled
        })
    )
    .get("/seeker/status", async ({ currentSession, log, request: { url }, currentUser, body }) => {
        const res = await Verification.getSeekerVerificationStatus(currentUser.id)
        return res
    }, {
        role: ["user"]
    })
    .post('/seeker/disability', async ({ currentSession, log, request: { url }, currentUser, body }) => {
        const res = await Verification.createDisabilityVerificationRequest(currentUser.id, body.document, body.disabilities)
        return res
    }, {
        role: ["user"],
        body: verificationModel.disabilityVerificationBody
    })
    .post('/seeker/student', async ({ currentSession, log, request: { url }, currentUser, body }) => {
        const res = await Verification.createStudentVerificationRequest(currentUser.id, body.document)
        return res
    }, {
        role: ["user"],
        body: verificationModel.studentVerificationBody
    })

    .post('/business/upload', async ({ currentSession, log, request: { url }, currentUser, body }) => {
        const {
            name,           // string
            industry,       // string
            description,    // string 
            address,
            bin,
            documents,      // File[] 
        } = body
        const res = await Verification.createVerificationRequest(currentUser.id, name, industry, description, address, bin, documents)
        log.info({
            user: currentUser.email,
            IP: currentSession.ipAddress,
            URL: url,
            BIN: bin,
            success: res.success
        }, "CREATE VERIFICATION REQUEST")
        return res
    }, {
        role: ["business"],
        body: verificationModel.businessVerificationBody,
        // Explicitly tell Elysia to parse as multipart/form-data
        // (usually auto-detected when t.File/t.Files is present, but explicit is safer)
        type: 'multipart/form-data'
    })
    .get('/business/status', async ({ currentUser }) => {
        const res = await Verification.getVerificationStatus(currentUser.id)
        return res
    }, {
        role: ["business"]
    })
    .get('/admin/listpendingverification', async ({ currentUser, query }) => {
        const res = await Verification.getPendingVerifications(query.type, query.page,)
        return res
    }, {
        role: ["admin"],
        query: t.Object({
            page: t.Number(),
            type: t.String()
        })
    })
    .get('/admin/listpendingseekerverification', async ({ currentUser, query }) => {
        const res = await Verification.getPendingSeekerVerifications(query.page, query.seekerType)
        return res
    }, {
        role: ["admin"],
        query: t.Object({
            page: t.Number(),
            seekerType: t.String()
        })
    })
    .get('/admin/verification/:id', async ({ currentUser, params }) => {
        const res = await Verification.getVerificationItem(parseInt(params.id))
        return res
    }, {
        role: ["admin"]
    })
    .get('admin/seekerverificationitem', async ({ currentUser, query }) => {
        if (query.seekerType === "disabled") {
            const res = await Verification.getDisabledSeekerVerificationItem(query.id)
            return res[0]
        }
        else {
            const res = await Verification.getStudentSeekerVerificationItem(query.id)
            return res[0]
        }
    }, {
        role: ["admin"],
        query: t.Object({
            id: t.Number(),
            seekerType: t.String()
        })
    })
    .get('admin/verification/seeker/file', async ({ currentUser, query }) => {
        const file = await Verification.getSeekerVerificationFile(query.id,query.seekerType)
        if (!file) {
            return status(404, "not found");
        }
        const zip = new AdmZip();
        const fileContent = await file.arrayBuffer()
        zip.addFile(file.name!, Buffer.from(fileContent))
        const zipBuffer = zip.toBuffer();
        return zipBuffer
    }, {
        role: ["admin"],
        query: t.Object({
            id: t.Number(),
            seekerType: t.String()
        })
    })
    .get('admin/verification/files/:id', async ({ log, currentUser, currentSession, request: { url }, params }) => {
        const files = await Verification.getPDF(parseInt(params.id))
        if (!files?.length) {
            return status(404, "not found");
        }
        const zip = new AdmZip();
        for (const file of files) {
            try {
                // Read the file from disk
                const fileContent = await s3Client.file(file.filepath).arrayBuffer();

                // Add to zip with the original or custom filename
                zip.addFile(file.filename, Buffer.from(fileContent));
            } catch (err) {
                console.error(`Failed to add ${file.filepath}:`, err);
                // Optionally continue or throw
            }
        }
        const zipBuffer = zip.toBuffer();
        log.info({
            user: currentUser.email,
            IP: currentSession.ipAddress,
            URL: url,
            fileId: params.id
        }, "DOWNLOAD VERIFICATION DOCUMENTS SEEKER")

        return zipBuffer
    }, {
        role: ["admin"]
    }
    )
    .post('admin/verification/seekerverify',async ({ currentUser, body, log, currentSession, request: { url } }) => {
        console.log(body.id, body.decision)
        log.info({
            user: currentUser.email,
            IP: currentSession.ipAddress,
            URL: url,
            verifyId: body.id,
            decision: body.decision
        }, "VERIFY SEEKER")
        if (body.decision === "reject") {
            await Verification.rejectSeekerApplication(body.id,body.seekerType)
            return {
                success: true,
                message: `application ID: ${body.id} Rejected`
            }
        }
        if (body.decision === "accept") {
            await Verification.acceptSeekerApplication(body.id,body.seekerType)
            return {
                success: true,
                message: `application ID: ${body.id} accepted`
            }
        }
    }, {
        role: ["admin"],
        body: t.Object({
            id: t.Number(),
            decision: t.String(),
            seekerType: t.String()
        })
    })
    .post('admin/verification/verify', async ({ currentUser, body, log, currentSession, request: { url } }) => {
        console.log(body.id, body.decision)
        log.info({
            user: currentUser.email,
            IP: currentSession.ipAddress,
            URL: url,
            verifyId: body.id,
            decision: body.decision
        }, "VERIFY BUSINESS")
        if (body.decision === "reject") {
            await Verification.rejectBusinessApplication(body.id)
            const data = await Verification.getVerificationItem(body.id)
            createNotification(data.userId, "business verification", "Business Rejection", `Your business ${data.businessName}, has been rejected.`, {
                applicationId: data.id,
                userId: data.userId
            })
            return {
                success: true,
                message: `application ID: ${body.id} Rejected`
            }
        }
        if (body.decision === "accept") {
            await Verification.acceptBusinessApplication(body.id)
            const data = await Verification.getVerificationItem(body.id)
            createNotification(data.userId, "business verification", "Business Accepted", `Your business ${data.businessName}, has been accepted.`, {
                applicationId: data.id,
                userId: data.userId
            })
            return {
                success: true,
                message: `application ID: ${body.id} accepted`
            }
        }
    }, {
        role: ["admin"],
        body: t.Object({
            id: t.Number(),
            decision: t.String()
        })
    })

