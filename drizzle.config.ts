import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './backend/src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
    migrations: {
    table: "__drizzle_migrations",            // default
    schema: "public",                         // usually public
  },
  verbose: true,
}); 