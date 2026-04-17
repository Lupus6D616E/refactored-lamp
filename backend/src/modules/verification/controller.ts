
import { betterAuthPlugin } from '@lib/auth'
import { Elysia, status, t } from 'elysia'
import { verificationModel } from './model'
import { Verification } from './service'
import AdmZip from 'adm-zip';
import { Business } from '@modules/business/service';
import { Admin } from '@modules/admin/service';
import { s3Client } from '@lib/minio';
export const verificationPlugin = new Elysia({ prefix: "/verify" })
    .use(betterAuthPlugin)
    .post('/business/upload', async ({ currentUser, body }) => {
        const {
            name,           // string
            industry,       // string
            description,    // string 
            address,
            bin,
            documents,      // File[] 
        } = body
        const res = await Verification.createVerificationRequest(currentUser.id, name, industry, description, address,bin ,documents)
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
    .get('/admin/listpendingverification', async ({ currentUser }) => {
        const res = await Verification.getPendingVerifications("pending")
        return res
    }, {
        role: ["admin"]
    })
    .get('/admin/verification/:id', async ({ currentUser, params }) => {
        const res = await Verification.getVerificationItem(parseInt(params.id))
        return res
    }, {
        role: ["admin"]
    })
    .get('admin/verification/files/:id', async ({ currentUser, params }) => {
        const files = await Verification.getPDF(parseInt(params.id))
        if (!files?.length) {
            return status(404,"not found");
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
    
        return zipBuffer
    }, {
        role: ["admin"]
    }
    )
    .post('admin/verification/verify', async ({ currentUser, body}) =>{
        console.log(body.id, body.decision)
        if(body.decision === "reject"){
        Verification.rejectBusinessApplication(body.id)
        return{
            success: true,
            message: `application ID: ${body.id} Rejected`
        }
        }
         if(body.decision === "accept"){
        Verification.acceptBusinessApplication(body.id)
        return{
            success: true,
            message: `application ID: ${body.id} accepted`
        }
        }
    },{
        role:["admin"],
        body: t.Object({
            id: t.Number(),
            decision: t.String()
        })
    })

