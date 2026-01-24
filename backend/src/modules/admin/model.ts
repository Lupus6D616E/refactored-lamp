import { t } from "elysia";

export namespace AdminModel {
  export const bootStrapAdminAccountBody = t.Object({
    email: t.String(),
    name: t.String(),
    password: t.String(),
    secret: t.String(),
  });
  export const changeAccountRoleBody = t.Object({
    email: t.String(),
    type: t.Union([
      t.Literal("admin"),
      t.Literal("user"),
      t.Literal("business"),
    ]),
  });
  export type role = "user" | "admin" | "business";
  export type bootStrapAdminAccountBody =
    typeof bootStrapAdminAccountBody.static;
  export type changeAccountRoleBody = typeof changeAccountRoleBody.static;
}
