import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as schema from "./../db/schema"
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {...schema}
        }

    ),
    emailAndPassword: {    
        enabled: true,
        requireEmailVerification: false,
    },
    basePath: '/api',
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
            resumeUrl: {
                type: "string",
                required: false,     
                defaultValue: null,
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
