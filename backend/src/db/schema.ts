import { pgEnum, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  serial,
  integer,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("user").notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userWorkExperience = pgTable("user_work_experience", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  experience: varchar("experience", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
});

export const userCertification = pgTable("user_certification", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certification: varchar("certification", { length: 100 }).notNull(),
});

export const userResume = pgTable("user_resume", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  resumeUrl: text("resume_url"),
});

export const seekerProfile = pgTable("seeker_profile", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  description: text("description"),
  resumeUrl: text("resume_url"),
  schedule: text("schedule")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  skills: text("skills")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  address: text("address"),
  education: text("education"),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  jobApplications: many(jobApplications),
}));
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const jobPosts = pgTable("job_posts", {
  id: serial("id").primaryKey(),
  businessId: text("business_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  responsibilities: text("responsibilities").notNull(),
  city: text("city").notNull(),
  employmentType: text("employment_type").notNull(),
  salaryMinimum: integer("salaryMinimum").notNull(),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").default("active").notNull(),
  schedule: text("schedule")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  contact: text("contact").notNull(),
});

export const userDailyUsage = pgTable(
  "user_daily_usage",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date", { mode: "string" }).notNull(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date] })],
);
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "rejected",
  "accepted",
  "expired",
]);
export const jobApplications = pgTable(
  "job_applications",
  {
    applicantId: text("applicant_id")
      .notNull()
      .references(() => user.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobPosts.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: applicationStatusEnum("application_status")
      .notNull()
      .default("pending"),
  },
  (t) => [primaryKey({ columns: [t.jobId, t.applicantId] })],
);

export const jobPostsRelations = relations(jobPosts,({ many }) => ({
  jobApplications: many(jobApplications)
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  user: one(user, {
    fields: [jobApplications.applicantId],
    references: [user.id],
  }),
  post: one(jobPosts, {
    fields: [jobApplications.jobId],
    references: [jobPosts.id],
  }),
}));