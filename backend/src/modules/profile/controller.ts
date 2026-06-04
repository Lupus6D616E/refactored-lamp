import { betterAuthPlugin } from "@lib/auth";
import { Elysia, redirect, status } from "elysia";
import { ProfileModel } from "./model";
import { Profile } from "./service";
import { s3Client } from "@lib/minio";
import { Search } from "@modules/search/service";

export const profilePlugin = new Elysia({ prefix: "/user" })
  .use(betterAuthPlugin)
  .get("/getrecommendedjobs", async ({currentUser}) => {
      const result = await Search.recommendJobs(currentUser.id)
      return result
    }, {
      role: ['user']
    })
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
      console.log(`adding experience ${body.position} for ${currentUser.id}`)
      const response = await Profile.insertExperience(currentUser.id, body);
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
    "/downloadmyresume",
    async ({ currentUser, set }) => {
      const result = await Profile.getResumeUrl(currentUser.id);
      if (result === null) {
        return {
          success: false,
          message: "No resume",
        };
      } else {
        const file = s3Client.file(result);
        const presignedUrl = file.presign({
          expiresIn: 3600,        // seconds (1 hour)
          // method: "GET"        // default
        });
        return redirect(presignedUrl);
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
    "/uploadprofilepicture",
    async ({currentUser, body}) =>{
      const response = await Profile.uploadProfilePicture(currentUser.id,body.file)
      if(response){
        return status(201)
      }
      else{
        return status(500)
      }
    },{
      role: ["user"],
      body: ProfileModel.profilePictureBody
    }
  )
  .post(
    "/updateprofile",
    async ({ currentUser, body, set }) => {
      const result = await Profile.updateSeekerProfile(currentUser.id, body);
      if (result === 0) {
        return { success: true, message: "updated profile" };
      } else {
        set.status = 500;
        return { success: false, message: "something happened" };
      }
    },
    {
      role: ["user"],
      body: ProfileModel.profileBody,
    },
  )
  .get(
    "/myprofile",
    async ({ currentUser }) => {
      const result = await Profile.getSeekerProfile(currentUser.id);
      return result;
    },
    {
      role: ["user"],
    },
  )
  .get(
    "/viewapplications",
    async ({ currentUser }) => {
      const res = await Profile.getSeekerApplications(currentUser.id);
      return res;
    },
    {
      role: ["user"],
    },
  )
  .get(
    "/userprofile/:id",
    async ({ params }) => {
      const seekerProfile = await Profile.getSeekerProfile(params.id);
      const userCertification = await Profile.getCertification(params.id);
      const userExperience = await Profile.getExperience(params.id);
      const userProfile = await Profile.getUserProfile(params.id);
      return {
        image: userProfile.image,
        name: userProfile.name,
        email: userProfile.email,
        address: seekerProfile.address,
        education: seekerProfile.education,
        role: userProfile.role,
        description: seekerProfile.description,
        certificateArray: userCertification,
        experienceArray: userExperience,
        skills: seekerProfile.skills,
        schedule: seekerProfile.schedule,
      };
    },
    {
      role: ["business", "admin"],
    },
  )
  .get(
    "/downloaduserresume/:id",
    async ({ params, set }) => {
      const result = await Profile.getResumeUrl(params.id);
      if (result === null) {
        return status(404, "No resume found");
      } else {
        const file = s3Client.file(result);
        const presignedUrl = file.presign({
          expiresIn: 3600,        // seconds (1 hour)
          // method: "GET"        // default
        });
        return redirect(presignedUrl);
      }
    },
    {
      role: ["business", "admin"],
    },
  )
  .post(
    "/createuser",
    async ({ body }) => {
      const result = await Profile.createUser(
        body.name,
        body.email,
        body.type,
        body.password,
      );
      return { success: result };
    },
    {
      body: ProfileModel.createUserBody,
    },
  );
