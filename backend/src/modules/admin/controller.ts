import { Elysia, status, t } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { Admin } from "./service";
import { AdminModel } from "./model";
export const adminPlugin = new Elysia({ prefix: "/admin" })
  .use(betterAuthPlugin)
  .post(
    "/changetype",
    async ({ body }) => {
      const res = await Admin.changeAccountType(body.email, body.type)
      if(res === true){
        return status(200)
      }
      else{
        return status(500)
      }
    },
    {
      role: ["admin"],
      body: AdminModel.changeAccountRoleBody
    },
  )
    .post(
    "/addtobusiness",
    async ({ body }) => {
      const res = await Admin.addUserToBusiness(body.email, body.business.toLowerCase())
      if(res.success === true){
        return {
          success: true,
          message: "user added to business"
        }
      }
      else if(res.success === false){
        if(res.message === `User not found`){
          return status(404,"User Not Found")
        }
        else if(res.message === `Organization not found`){
          return status(404,"Organization Not Found")
        }
        else{
          return status(500)
        }
      }
      else{
        return status(500)
      }
    },
    {
      role: ["admin"],
      body: AdminModel.addUserToBusinessModel
    },
  )
  .post(
    "/bootstrap",
    async ({ body }) => {
      const res = await Admin.bootstrapAdminAccount(body.secret,body.email,body.password,body.name)
      if(res === true){
        return status(201, "Admin created");
      } else {
        return status(403, "Forbidden");
      }
    },
    {
      body:AdminModel.bootStrapAdminAccountBody
      })
  .post("/createbusiness",async ({ body }) => {
    const res = await Admin.createBusiness(body.name.toLowerCase(),body.description,body.industry,body.address)
    if( res === 409){
      return status(409,"Business Already Exists")
    }else if( res === 201){
      return status(201, "Business Created")
    }
    else{
      return status(500)
    }
  },{
    role:["admin"],
    body: AdminModel.createBusinessBody
  })
  .get(
    "/stats",
    async ({}) => {
      const res = await Admin.statistics()
      return res
    },
    {
      role: ["admin"],
    },
  );
