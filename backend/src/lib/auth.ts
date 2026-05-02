import { Elysia, Context } from "elysia";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db"; // your drizzle instance
import { openAPI, admin } from "better-auth/plugins";
import * as schema from "../db/schema";
import { mailer } from "./mailer";
import { getBaseUrl } from "./detectdeployed";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: { ...schema },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set this to true when we're done
  },
   emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      console.log(process.env.NODE_ENV)
       mailer.sendMail({  
        from: 'noreply-verify@mail.flexihire.link',
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${getBaseUrl()}/auth/api/verify-email?token=${token}`,
      });
    },
    sendOnSignIn: false,
  },
  plugins: [openAPI(), admin({})],
	baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api",
   trustedOrigins: [      
    "https://www.flexihire.link",                   
    "https://test.flexihire.link",
    "http://localhost:5173",                             // for local dev (Vite default)
    "http://localhost:3000",                             // or whatever port your frontend uses locally
    // add any preview/staging domains too
  ],
  user: {
    additionalFields: {
      role: {
        type: ["user", "business", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;


export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount("/auth", auth.handler)
  .macro({
      role: (allowedRoles: Array<"user" | "admin" | "business">) => ({
      async resolve({ status, request: { headers} }) {
        const session = await auth.api.getSession({ headers });

        if (!session) return status(401);
        const role = session.user.role;
        if (role !== "user" && role !== "admin" && role !== "business") {
          return status(500); // corrupted data
        }
        if (!allowedRoles.includes(role)) {
          return status(403);
        }

        return {
          currentUser: session.user,
          currentSession: session.session,
        };
      },
    }),
  });

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<AuthSession>["user"];
