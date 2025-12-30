import { Elysia,Context , t} from "elysia";
import { exec } from 'child_process'
import { watch } from 'fs'
import { db } from "./db"
import { eq } from "drizzle-orm";
import { auth } from './lib/auth';
import { staticPlugin } from '@elysiajs/static'
import { user } from "src/db/schema";
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
  .post('/updateprofile',async ({ currentUser:currentUser, body}) => {
    const userInfo  = body;
    const uploadDir = './userdata/profiles';
    await Bun.$`mkdir -p ${uploadDir}`.quiet(); 
    const filename = `${currentUser.id}.json`;
    const filepath = `${uploadDir}/${filename}`;
    await Bun.write(filepath, JSON.stringify(userInfo, null, 2));
    return {no: filepath}
  },{
    role: ['user'],
    body: t.Object({
      education: t.String(),
      address: t.String(),
      certification1: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      certification2: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      certification3: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      certification4: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      certification5: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      workexperience1: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      workexperience2: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      workexperience3: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      workexperience4: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
      workexperience5: t.String({ minLength: 1,maxLength: 500, error: 'Line must not be empty or longer than 500 characters' }),
    })
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
  } 
  )
	.listen(3000, ({ hostname, port }) => {
		console.log(`Server started http://${hostname}:${port}`);
	});

  async function loadUserData(userID:string): Promise<string[]> {
  try {
    const file = Bun.file(userID);
    if (await file.exists()) {
      const data = await file.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error('Error loading file:', e);
  }
  return [];
}
