import {t} from "elysia"

export namespace verificationModel{
    export const businessVerificationBody = t.Object({
            name: t.String(),
            address: t.String(),
            description: t.String(),
            industry: t.String(),
            bin: t.String(),
            documents: t.Files({
                maxSize: '10m',        // optional per-file limit
                type: ['application/pdf', 'application/msword']
            }),
        })
    export const disabilityVerificationBody = t.Object({
       document:  t.File(),
       disabilities: t.Array(t.String())
    })

    export const studentVerificationBody = t.Object({
       document:  t.File(),
    })
    export const businessVerificationReturn = t.Object({
        success: t.Boolean(),
        message: t.String()

    })
    export type seekerVerificationStatusReturn =  {
        disability: "Pending" | "Verified" | "Unverified"
        student:"Pending" | "Verified" | "Unverified"
    }
    export type studentVerificationBody = typeof studentVerificationBody.static
    export type disabilityVerificationBody = typeof disabilityVerificationBody.static
    export type businessVerificationReturn = typeof businessVerificationReturn.static
    export type businessVerificationBody = typeof businessVerificationBody.static
}