import { betterAuthPlugin } from '@lib/auth'
import { Elysia, t } from 'elysia'

export const verificationPlugin = new Elysia({ prefix: "/verify" })
    .use(betterAuthPlugin)
    .post('/business/upload', async ({ currentUser,body }) => {
        const {
            name,           // string
            industry,       // string
            description,    // string (optional)
            address,
            documents,      // File[] 
        } = body

        console.log('Text fields:', { name, industry, address, description })

        // Process multiple files
        for (const doc of documents) {
            console.log(`Document: ${doc.name} (${doc.size} bytes, type: ${doc.type})`)
            // Save with Bun.write()
            await Bun.write(`userdata/verification/${currentUser.id}/${doc.name}`, doc)
        }
        return {
            success: true,
            message: `Received ${documents.length} documents`,
            textFields: { name, address, industry, description }
        }
    }, {
        role: ["business"],
        body: t.Object({
            name: t.String(),
            address: t.String(),
            description: t.String(),
            industry: t.String(),

            // Multiple files under the same field name
            documents: t.Files({
                maxSize: '10m',        // optional per-file limit
                type: ['application/pdf', 'application/msword']
            }),

        }),

        // Explicitly tell Elysia to parse as multipart/form-data
        // (usually auto-detected when t.File/t.Files is present, but explicit is safer)
        type: 'multipart/form-data'
    })