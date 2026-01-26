import { t } from "elysia";

export namespace PostModel {
  export const JobBody = t.Object({
    title: t.String(),
    email: t.String(),
    businessId: t.String(),
    description: t.String(),
    requirements: t.String(),
    responsibilities: t.String(),
    city: t.String(),
    employmentType: t.String(),
    minimumSalary: t.Integer(),
    expireDate: t.Date(),
    tags: t.Array(t.String()),
    schedule: t.Array(t.String())
  });
  export const applicationBody = t.Object({
    id: t.Number()
  })
  export type applicationBody = typeof JobBody.static;
  export type JobBody = typeof JobBody.static;
}
