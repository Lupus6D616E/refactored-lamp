import { t } from "elysia";

export namespace searchModel {
  export const searchJobQuery = t.Object({
    title: t.Optional(t.String()),
    city: t.Optional(t.String()),
    employmentType: t.Optional(t.String()),
    salaryMinimum: t.Optional(t.Numeric()),
    tags: t.Optional(t.Array(t.String())),
    tagsMode: t.Optional(t.String()),
    schedule: t.Optional(t.Array(t.String())),
  });
  export const searchUserQuery = t.Object({
    name: t.String(),
  })

  export const searchBusinessQuery = t.Object({
    name: t.String(),
  })
export type searchBusinessQuery = typeof searchBusinessQuery.static;
export type searchUserQuery = typeof searchUserQuery.static;
export type searchJobQuery = typeof searchJobQuery.static;
}
