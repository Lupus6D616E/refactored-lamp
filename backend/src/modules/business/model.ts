import { t } from "elysia";

export namespace businessModel {
    export const businessIdType = t.Object({ id: t.String() })
    export const applicationIdType = t.Object({ id: t.Number() })
    export const applicationDecision =  t.Object({
        jobId: t.Number(),
        userId: t.String(),
        decision: t.Union([t.Literal("accepted"), t.Literal("rejected"), t.Literal("pending")]),
        message: t.String(),
      })
      
    export type applicationDecision = typeof applicationDecision.static
    export type businessIdType = typeof businessIdType.static
    export type applicationIdType = typeof applicationIdType.static
}