import { betterAuthPlugin } from "@lib/auth";
import { Elysia, t } from "elysia";
import { db } from "@db/db";
import { user, userCertification, userWorkExperience } from "@db/schema";
import { eq } from "drizzle-orm";
import { ProfileModel } from "./model";
import { Profile } from "./service";
export const profilePlugin = new Elysia()
  .use(betterAuthPlugin)
  .get(
    "/getcertifications",
    async ({ currentUser }) => {
      const userCertification = Profile.getCertification(currentUser.id);
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
      const response = await Profile.deleteExperience(
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
      const workExperience = Profile.getExperience(currentUser.id);
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
      if (typeof currentUser.resumeUrl === "string") {
        const filePath: string = currentUser.resumeUrl; // Adjust path as needed
        set.headers["Content-Type"] = "application/pdf";
        set.headers["Content-Disposition"] =
          `attachment; filename="resume.pdf"`;
        return Bun.file(filePath);
      } else {
        return {
          success: false,
          message: "No resume",
        };
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
  );
