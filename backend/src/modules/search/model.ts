import { t } from "elysia";

export namespace searchModel {
  export const searchQuery = t.Object({
    title: t.Optional(t.String()),
    city: t.Optional(t.String()),
    employmentType: t.Optional(t.String()),
    salaryMinimum: t.Optional(t.Numeric()),
    tags: t.Optional(t.Array(t.String())),
    tagsMode: t.Optional(t.String()),
    schedule: t.Optional(t.Array(t.String())),
  });

export type searchQuery = typeof searchQuery.static;
}
