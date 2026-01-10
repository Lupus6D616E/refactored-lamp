import { db } from "@db/db";
import { eq } from "drizzle-orm";
import { user, userCertification, userWorkExperience } from "@db/schema";
import { ProfileModel } from "./model";
import type { AuthUser } from "@lib/auth";
export abstract class Profile {
  static async uploadResume(
    userSession: AuthUser,
    pdf: ProfileModel.resumeBody,
  ) {
    const { file } = pdf;
    const oldResume = userSession.resumeUrl;
    const uploadDir = "./userdata/resumes";
    await Bun.$`mkdir -p ${uploadDir}`.quiet();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`;
    const filepath = `${uploadDir}/${filename}`;
    await Bun.write(filepath, file);
    console.log("file uploaded");
    let response: ProfileModel.resumeResponse = {
      message: "something happened",
      size: 0,
    };
    await db
      .update(user)
      .set({
        resumeUrl: filepath,
      })
      .where(eq(user.id, userSession.id));
    if (oldResume === null) {
      response = {
        message: "PDF uploaded sucessfully",
        size: file.size,
      };
    } else {
      const oldResumeClear = Bun.file(oldResume!);
      oldResumeClear.delete();
      response = {
        message: "PDF uploaded and updated sucessfully",
        size: file.size,
      };
    }
    return response;
  }

  static async getResumeUrl(userId: string):Promise<string | null>{
    const item = await db.select({resumeUrl: user.resumeUrl})
    .from(user)
    .where(eq(user.id,userId));
    if( item.length === 0||item[0].resumeUrl === null){
        return null
    }
    else{
        return item[0].resumeUrl
    }
  }
  static async deleteExperience(userSession: AuthUser, id: number) {
    const item = await db
      .select()
      .from(userWorkExperience)
      .where(eq(userWorkExperience.id, id))
      .limit(1);
    if (!item[0] || item[0].userId !== userSession.id) {
      return 404;
    }
    await db.delete(userWorkExperience).where(eq(userWorkExperience.id, id));
    return 0;
  }

  static async deleteCertification(userSession: AuthUser, id: number) {
    const item = await db
      .select()
      .from(userCertification)
      .where(eq(userCertification.id, id))
      .limit(1);
    if (!item[0] || item[0].userId !== userSession.id) {
      return 404;
    }
    await db.delete(userCertification).where(eq(userCertification.id, id));
    return 0;
  }

  static async insertExperience(
    userSession: AuthUser,
    data: ProfileModel.experienceBody,
  ) {
    try {
      await db.insert(userWorkExperience).values({
        userId: userSession.id,
        experience: data.experience,
        position: data.position,
      });
    } catch {
      return 404;
    }
    return 0;
  }
   static async insertCertification(
    userSession: AuthUser,
    data: ProfileModel.certificationBody,
  ) {
    try {
      await db.insert(userCertification).values({
        userId: userSession.id,
        certification: data.certification,
      });
    } catch {
      return 404;
    }
    return 0;
  }
  static async getExperience(userId: string) {
    const experience = await db
      .select({
        id: userWorkExperience.id,
        position: userWorkExperience.position,
        experience: userWorkExperience.experience,
      })
      .from(userWorkExperience)
      .where(eq(userWorkExperience.userId, userId))
      return experience;
  }
    static async getCertification(userId: string) {
    const certs = await db
      .select({
        id: userCertification.id,
        certification: userCertification.certification
      })
      .from(userCertification)
      .where(eq(userCertification.userId, userId))
      ;
    return certs;
  }
}
