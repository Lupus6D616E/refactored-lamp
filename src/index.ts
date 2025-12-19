import { Elysia,Context , t} from "elysia";
import { exec } from 'child_process'
import { watch } from 'fs'
import { db } from "./db"
import { eq } from "drizzle-orm";
import { auth } from './lib/auth';
import { staticPlugin } from '@elysiajs/static'
import { session, user } from "src/db/schema";
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
  .post('/uploadpdf',
    async ({ currentUser,body}) => {
    const { file } = body;
      const oldResume = currentUser.resumeUrl;
      const uploadDir = './src/resumes';
      await Bun.$`mkdir -p ${uploadDir}`.quiet(); 
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`;
      const filepath = `${uploadDir}/${filename}`;
    
      // Write file 
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
        url: `src/uploads/${filename}`, 
      }
      }
      else{
        const oldResumeClear = Bun.file(oldResume!);
        oldResumeClear.delete();
        return {
          success: true,
          message: 'PDF uploaded and updated successfully',
          size: file.size,
          url: `src/uploads/${filename}`, 
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
