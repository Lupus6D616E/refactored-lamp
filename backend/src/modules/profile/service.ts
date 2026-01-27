import { db } from "@db/db";
import { eq } from "drizzle-orm";
import {
  userCertification,
  userWorkExperience,
  seekerProfile,
  jobApplications,
  jobPosts,
  user,
  businessUser,
  businessProfile,
} from "@db/schema";
import { ProfileModel } from "./model";
import { auth, type AuthUser } from "@lib/auth";
export abstract class Profile {
  static async uploadResume(
    userSession: AuthUser,
    pdf: ProfileModel.resumeBody,
  ) {
    const { file } = pdf;
    const oldResume = await this.getResumeUrl(userSession.id);
    const uploadDir = "userdata/resumes";
    await Bun.$`mkdir -p ${uploadDir}`.quiet();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`;
    const filepath = `${uploadDir}/${filename}`;
    await Bun.write(filepath, file);
    console.log("file uploaded");
    console.log(filepath);
    let response: ProfileModel.resumeResponse = {
      message: "something happened",
      size: 0,
    };
    await db
      .insert(seekerProfile)
      .values({
        userId: userSession.id,
        resumeUrl: filepath,
      })
      .onConflictDoUpdate({
        target: seekerProfile.userId,
        set: {
          resumeUrl: filepath,
        },
      });
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

  static async getResumeUrl(userId: string): Promise<string | null> {
    const item = await db
      .select({ resumeUrl: seekerProfile.resumeUrl })
      .from(seekerProfile)
      .where(eq(seekerProfile.userId, userId));

    if (item.length === 0 || item[0].resumeUrl === null) {
      return null;
    } else {
      return item[0].resumeUrl;
    }
  }
  static async deleteExperience(
    userSession: AuthUser,
    id: number,
  ): Promise<number> {
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

  static async deleteCertification(
    userSession: AuthUser,
    id: number,
  ): Promise<number> {
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
  ): Promise<number> {
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
  ): Promise<number> {
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
      .where(eq(userWorkExperience.userId, userId));
    return experience;
  }
  static async getCertification(userId: string) {
    const certs = await db
      .select({
        id: userCertification.id,
        certification: userCertification.certification,
      })
      .from(userCertification)
      .where(eq(userCertification.userId, userId));
    return certs;
  }
  static async updateSeekerProfile(
    userId: string,
    data: ProfileModel.profileBody,
  ): Promise<number> {
    try {
      await db
        .insert(seekerProfile)
        .values({
          userId: userId,
          description: data.description,
          schedule: data.selectedDays,
          skills: data.skills,
          address: data.address,
          education: data.education,
        })
        .onConflictDoUpdate({
          target: seekerProfile.userId,
          set: {
            schedule: data.selectedDays,
            skills: data.skills,
            description: data.description,
            address: data.address,
            education: data.education,
          },
        });
    } catch {
      return 500;
    }
    return 0;
  }
  static async getSeekerProfile(userId: string) {
    const result = await db
      .select({
        description: seekerProfile.description,
        schedule: seekerProfile.schedule,
        skills: seekerProfile.skills,
        address: seekerProfile.address,
        education: seekerProfile.education,
      })
      .from(seekerProfile)
      .where(eq(seekerProfile.userId, userId))
      .limit(1);
    return result[0];
  }
  static async getSeekerApplications(userId: string) {
    const result = await db
      .select({
        jobId: jobApplications.jobId,
        title: jobPosts.title,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .innerJoin(jobPosts, eq(jobApplications.jobId, jobPosts.id))
      .where(eq(jobApplications.applicantId, userId));
    return result;
  }
  static async getUserProfile(userId: string) {
    const result = await db
      .select({
        name: user.name,
        email: user.email,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, userId));
    return result[0];
  }
  static async getUserBusinesses(userId: string) {
    const result = await db
      .select({
        id: businessUser.businessId,
        name: businessProfile.name,
      })
      .from(businessUser)
      .leftJoin(
        businessProfile,
        eq(businessUser.businessId, businessProfile.id),
      )
      .where(eq(businessUser.userId, userId));
    console.log(result);
    return result;
  }
  static async createUser(
    name: string,
    email: string,
    type: ProfileModel.roleType,
    password: string,
  ) {
    try {
      const result = await auth.api.createUser({
        body: {
          email: email,
          password: password,
          name: name,
        },
        asResponse: false, // get data directly instead of Response object
        // returnHeaders: true,     // if you want Set-Cookie headers
      });
      console.log(result);
      const newAdmin = await db
        .update(user)
        .set({ role: type })
        .where(eq(user.email, email));
      console.log(newAdmin);
      return true;
    } catch (e) {
      return false;
    }
  }
}
