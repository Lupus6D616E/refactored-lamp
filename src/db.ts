import { drizzle } from "drizzle-orm/node-postgres"

import * as authSchema from "./db/schema";
export const db = drizzle(process.env.DATABASE_URL!,{ schema:{...authSchema}});