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
      role: ['admin'],
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
        if(res.message)
          return status(404,res.message)
        else{
          console.log(res)
          return status(500, "an unexplainable error has occurred")
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
    const res = await Admin.createBusiness(body.name.toLowerCase(),body.description,body.industry,body.address,body.bin)
    if( res === 409){
      return status(409,"Business Already Exists")
    }else{
      return status(201, "Business Created")
    }
  },{
    role:["admin"],
    body: AdminModel.createBusinessBody
  })
  .post("/createpost",async ({ body}) => {
    console.log(body)
    const res = await Admin.createArticle(body.title,body.body,body.image)
    if(res){
      return status(201,"article Created")
    }
    else{
       return status(500,"upload failure")
    }
  },{
    role: ["admin"],
    body: t.Object({
      title: t.String(),
      body: t.String(),
      image: t.File({
        type: ["image/jpeg","image/png"],
        maxSize: "10m"
      })
    })
  })
  .get(
    "/stats",
    async ({ currentUser}) => {
      console.log(currentUser.role)
      const res = await Admin.statistics()
      return res
    },
    {
      role: ['admin'],
    },
  )
