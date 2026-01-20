import { betterAuthPlugin } from "@lib/auth";
import { Elysia } from "elysia";
import { ProfileModel } from "./model";
import { Profile } from "./service";
export const profilePlugin = new Elysia({ prefix: "/user" })
  .use(betterAuthPlugin)

  .get(
    "/getcertifications",
    async ({ currentUser }) => {
      const userCertification = await Profile.getCertification(currentUser.id);
      return {
        items: userCertification,
      };
    },
    {
      role: ["user"],
    },
  )
  .post(
    "/addcertification",
    async ({ currentUser, body }) => {
      const response = await Profile.insertCertification(currentUser, body);
      if (response === 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    },
    {
      role: ["user"],
      body: ProfileModel.certificationBody,
    },
  )
  .delete(
    "/certifications/:id",
    async ({ params, set, currentUser }) => {
      const certificationId = Number(params.id);
      const response = await Profile.deleteCertification(
        currentUser,
        certificationId,
      );
      if (response === 404) {
        set.status = 404;
        return {
          message: "Item not Found or Unauthorized.",
        };
      }
      return {
        message: "success",
      };
    },
    {
      role: ["user"],
    },
  )
  .get(
    "/getexperience",
    async ({ currentUser }) => {
      const workExperience = await Profile.getExperience(currentUser.id);
      return {
        items: workExperience,
      };
    },
    {
      role: ["user"],
    },
  )
  .post(
    "/addexperience",
    async ({ currentUser, body }) => {
      const response = await Profile.insertExperience(currentUser, body);
      if (response === 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    },
    {
      role: ["user"],
      body: ProfileModel.experienceBody,
    },
  )
  .delete(
    "/workexperience/:id",
    async ({ params, set, currentUser }) => {
      const experienceId = Number(params.id);
      const response = await Profile.deleteExperience(
        currentUser,
        experienceId,
      );
      if (response === 404) {
        set.status = 404;
        return {
          message: "Item not Found or Unauthorized.",
        };
      }
      return {
        message: "success",
      };
    },
    {
      role: ["user"],
    },
  )
  .get(
    "/downloadresume",
    async ({ currentUser, set }) => {
      const result = await Profile.getResumeUrl(currentUser.id);
      if (result === null) {
        return {
          success: false,
          message: "No resume",
        };
      } else {
        set.headers["Content-Type"] = "application/pdf";
        set.headers["Content-Disposition"] =
          `attachment; filename="resume.pdf"`;
        return Bun.file(result);
      }
    },
    {
      role: ["user"],
    },
  )
  .post(
    "/uploadpdf",
    async ({ currentUser, body }) => {
      const response = await Profile.uploadResume(currentUser, body);
      return response;
    },
    {
      role: ["user"],
      body: ProfileModel.resumeBody,
    },
  )
  .post(
    "/updateprofile",
    async ({ currentUser, body, set }) => {
      const result = await Profile.updateSeekerProfile(currentUser.id, body)
      if(result === 0 ){
      return { success: true, message: "updated profile" };
      }
      else{
        set.status = 500;
        return { success: false, message: "something happened" }
      }
    },
    {
      role: ["user"],
      body: ProfileModel.profileBody
    },
  ).get("/profile",async ({currentUser}) => {
    const result = await Profile.getSeekerProfile(currentUser.id)
    return result
  },{
    role:['user']
  })