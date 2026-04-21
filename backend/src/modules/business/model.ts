import { t } from "elysia";

export namespace businessModel {
    export const businessIdType = t.Object({ id: t.String() })
    export const applicationIdType = t.Object({ id: t.Number() })
    export const applicationDecision =  t.Object({
        jobId: t.Number(),
        userId: t.String(),
        decision: t.Union([t.Literal("accepted"), t.Literal("rejected"), t.Literal("processing")]),
        message: t.String(),
      })
    export const changePictureBody = t.Object({
      profilePicture: t.File({
         type: ["image/jpeg","image/png"],
          maxSize: "10m",
          minSize: 1
        }),
      bannerPicture: t.File({
         type: ["image/jpeg","image/png"],
          maxSize: "10m",
          minSize: 1
        }),
      businessId: t.String()
    })
    export type changePictureBody = typeof changePictureBody.static
    export type applicationDecision = typeof applicationDecision.static
    export type businessIdType = typeof businessIdType.static
    export type applicationIdType = typeof applicationIdType.static
}