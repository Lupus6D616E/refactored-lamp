import {t} from "elysia"

export namespace verificationModel{
    export const businessVerificationBody = t.Object({
            name: t.String(),
            address: t.String(),
            description: t.String(),
            industry: t.String(),
            documents: t.Files({
                maxSize: '10m',        // optional per-file limit
                type: ['application/pdf', 'application/msword']
            }),
        })
    export const businessVerificationReturn = t.Object({
        success: t.Boolean(),
        message: t.String()

    })
    export type businessVerificationReturn = typeof businessVerificationReturn.static
    export type businessVerificationBody = typeof businessVerificationBody.static
}