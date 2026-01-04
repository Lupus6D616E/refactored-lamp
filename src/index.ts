import { Elysia,Context , t} from "elysia";
import { exec } from 'child_process'
import { watch } from 'fs'
import { db } from "./db"
import { eq } from "drizzle-orm";
import { auth } from '@lib/auth';
import { staticPlugin } from '@elysiajs/static'
import { user, userCertification, userWorkExperience } from "src/db/schema";
const buildCSS = () =>
  new Promise(resolve =>
    exec('tailwindcss -i ./src/app.css -o ./public/output.css',
      (_error, _stdout, stderr) => {
        console.log(stderr);
        resolve(null);
      })
  );

await buildCSS();

const watcher = watch('./public', { recursive: true },
  async () => {
    await buildCSS();
  }
);

process.on('SIGINT', () => {
  watcher.close();
  process.exit(0);
});

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    // validate request method
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    } else {
        Error("405")
    }
}

const betterAuth = new Elysia({ name: 'better-auth' })
  .mount('/auth',auth.handler)
  .macro({
    authMacro: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);
        return {
          currentUser: session.user,
          currentSession: session.session,
        };
      },
  
    },
    role:(allowedRoles: Array<'user' | 'admin' | 'business'>) => ({
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers })

        if (!session) return status(401)
        const role = session.user.role

        if (role !== 'user' && role !== 'admin' && role !== 'business') {
          return status(500) // corrupted data
        }
          
        if (!allowedRoles.includes(role)) {
          return status(403)
        }

        return {
          currentUser: session.user,
          currentSession: session.session
        }
      }
    })
  })

const app = new Elysia()
  .use(await staticPlugin()) 
  .use(betterAuth)
  .all("auth/*", betterAuthView)
  .get('/admin', () => 'ok', {
    role: ['admin']
  })
  .get('/user', () => 'ok', {
    role: ['user']
  })
  .get('/getcertifications', async ({currentUser}) => {
      const userCertifications = await db
      .select({
        id: userCertification.id,
        certification: userCertification.certification
      })
      .from(userCertification)
      .where(eq(userCertification.userId, currentUser.id));

      return {
        items:userCertifications}
  },{
    role:['user']
  })
  .post('/addcertification', async ({currentUser, body}) => {
    await db.insert(userCertification)
    .values({userId: currentUser.id, certification: body.certification })
    return{
      success: 'yes'
    }
  },{
        role: ['user'],
        body: t.Object({
          certification: t.String()
        })
  })
  .delete('/certifications/:id', async ({ params, set, currentUser }) => {
  const certificationId = Number(params.id);

  const item = await db
    .select()
    .from(userCertification)
    .where(eq(userCertification.id, certificationId))
    .limit(1);
  if (!item[0] || item[0].userId !== currentUser.id) {
    set.status = 404;
    return { error: 'Item not found or unauthorized' };
  }

  await db.delete(userCertification).where(eq(userCertification.id, certificationId));
  return { success: true };
  },{
    role:['user']
  })
  .get('/getexperience', async ({currentUser}) => {
      const workExperience = await db
      .select({
        id: userWorkExperience.id,
        position: userWorkExperience.position,
        experience: userWorkExperience.experience
      })
      .from(userWorkExperience)
      .where(eq(userWorkExperience.userId, currentUser.id));

      return {
        items:workExperience}
  },{
    role:['user']
  })
  .post('/addexperience', async ({currentUser, body}) => {
    await db.insert(userWorkExperience)
    .values({userId: currentUser.id, experience: body.experience, position: body.position})
    return{
      success: 'yes'
      }
  },{
        role: ['user'],
        body: t.Object({
          experience: t.String(),
          position: t.String()
        })
  })
  .delete('/workexperience/:id', async ({ params, set, currentUser }) => {
  const experienceId = Number(params.id);
  const item = await db
    .select()
    .from(userWorkExperience)
    .where(eq(userWorkExperience.id, experienceId))
    .limit(1);
  if (!item[0] || item[0].userId !== currentUser.id) {
    set.status = 404;
    return { error: 'Item not found or unauthorized' };
  }
  await db.delete(userWorkExperience).where(eq(userWorkExperience.id, experienceId));
  return { success: true };
  },{
    role:['user']
  })
  .get("/downloadresume", async ({currentUser,set}) => {
    if (typeof currentUser.resumeUrl === 'string'){
      const filePath:string = currentUser.resumeUrl;  // Adjust path as needed
      set.headers['Content-Type'] = 'application/pdf';
      set.headers['Content-Disposition'] = `attachment; filename="resume.pdf"`;
      return Bun.file(filePath)
    }
    else{
      return {
        success: false,
        message: 'No resume'
      }
    }
  },{
    role: ['user']
  })
  .post('/uploadpdf',
    async ({ currentUser,body}) => {
    const { file } = body;
      const oldResume = currentUser.resumeUrl;
      const uploadDir = './userdata/resumes';
      await Bun.$`mkdir -p ${uploadDir}`.quiet(); 
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`;
      const filepath = `${uploadDir}/${filename}`;
      await Bun.write(filepath, file);
      console.log("file uploaded")
      await db
        .update(user)
        .set({
          resumeUrl: filepath,
        })
        .where(eq(user.id, currentUser.id));
      if(oldResume === null){
        return {
        success: true,
        message: 'PDF uploaded successfully',
        size: file.size,
      }
      }
      else{
        const oldResumeClear = Bun.file(oldResume!);
        oldResumeClear.delete();
        return {
          success: true,
          message: 'PDF uploaded and updated successfully',
          size: file.size,
        }
      }
    },
  {
    role: ['user'],
    body: t.Object({
      file: t.File({
        type: 'application/pdf',
        minSize: 1,           
        maxSize: 10 * 1024 * 1024, 
      }),
    }), 
  })
	.listen(3000, ({ hostname, port }) => {
		console.log(`Server started http://${hostname}:${port}`);
	});
