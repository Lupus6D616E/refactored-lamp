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
    size: t.Number()
  });
  export const experienceBody = t.Object({
    experience: t.String(),
    position: t.String()
  });
export const certificationBody = t.Object({
    certification: t.String(),
  });
  export type certificationBody = typeof certificationBody.static;
  export type experienceBody = typeof experienceBody.static;
  export type resumeResponse = typeof resumeResponse.static;
  export type resumeBody = typeof resumeBody.static;
}
