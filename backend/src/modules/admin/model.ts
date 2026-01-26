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
  export const createBusinessBody = t.Object({
    name: t.String(),
    description: t.String(),
    industry: t.String(),
    address: t.String(),
  });
  export const addUserToBusinessModel = t.Object({
    email: t.String(),
    business: t.String(),
  });
  export type role = "user" | "admin" | "business";
  export type createBusinessBody = typeof createBusinessBody.static;
  export type bootStrapAdminAccountBody =
    typeof bootStrapAdminAccountBody.static;
  export type addUserToBusinessModel = typeof addUserToBusinessModel.static;
  export type changeAccountRoleBody = typeof changeAccountRoleBody.static;
}
