import { Elysia, Context } from 'elysia'
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db"; // your drizzle instance
import * as schema from "../db/schema";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: { ...schema },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  basePath: "/api",
  user: {
    additionalFields: {
      role: {
        type: ["user", "business", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
      address: {
        type: "string",
        required: false,
      },
      education: {
        type: "string",
        required: false,
      },
    },
  },
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    Error("405");
  }
};

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount("/auth", auth.handler)
  .all("auth/*", betterAuthView)
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
    role: (allowedRoles: Array<"user" | "admin" | "business">) => ({
      async resolve({ status, request: { headers } }) {
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