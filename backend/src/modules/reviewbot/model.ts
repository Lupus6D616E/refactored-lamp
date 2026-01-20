import { t } from "elysia";

export namespace ReviewBotModel{
    export const comparisonBody = t.Object({
        postId: t.Number()
    })
    export const comparisonResponse = t.Object({
        output: t.String(),
        model: t.String()
    })

    export type  comparisonBody = typeof comparisonBody.static
    export type comparisonResponse = typeof comparisonResponse.static
}