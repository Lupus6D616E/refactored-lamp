import { role } from "better-auth/plugins";
import { t } from "elysia";

export namespace ProfileModel {
  export const resumeBody = t.Object({
    file: t.File({
      type: "application/pdf",
      minSize: 1,
      maxSize: 10 * 1024 * 1024,
    }),
  });
  export const resumeResponse = t.Object({
    message: t.String(),
    size: t.Number(),
  });
  export const experienceBody = t.Object({
    experience: t.String(),
    position: t.String(),
  });
  export const certificationBody = t.Object({
    certification: t.String(),
  });
  export const profileBody = t.Object({
    description: t.String({ minLength: 1 }),
    address: t.String({ minLength: 1 }),
    location: t.Object({
      lat: t.Number({ minimum: -90, maximum: 90 }),
      lng: t.Number({ minimum: -180, maximum: 180 }),
    }),
    education: t.String({ minLength: 1 }),
    skills: t.Array(t.String()),
    selectedDays: t.Array(t.String()),
  });
  export const roleType = t.Union([t.Literal("user"), t.Literal("business")]);
  export const createUserBody = t.Object({
    name: t.String(),
    email: t.String(),
    password: t.String(),
    type: roleType,
  });
  export type roleType = typeof roleType.static;
  export type createUserBody = typeof createUserBody.static;
  export type profileBody = typeof profileBody.static;
  export type certificationBody = typeof certificationBody.static;
  export type experienceBody = typeof experienceBody.static;
  export type resumeResponse = typeof resumeResponse.static;
  export type resumeBody = typeof resumeBody.static;
}
