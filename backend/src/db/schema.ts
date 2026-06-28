import { foreignKey, jsonb, pgEnum, point, varchar, vector } from "drizzle-orm/pg-core";
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
  uuid,
} from "drizzle-orm/pg-core";

export const publicTest = pgTable("public_test", {
  name: text("name").primaryKey()
})

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  businessVerified: boolean("business_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role", { enum: ["user", "business", "admin"] })
    .default("user")
    .notNull(),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
}).enableRLS()

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
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
).enableRLS()

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
).enableRLS()

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
).enableRLS()
export const userWorkExperience = pgTable("user_work_experience", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  experience: text("experience").notNull(),
  position: text("position").notNull(),
  duration: text("duration").notNull(),
}).enableRLS()

export const userCertification = pgTable("user_certification", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certification: text("certification").notNull(),
}).enableRLS()

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
  disabilityVerified: boolean("disabilityVerified").notNull().default(false),
  studentVerified: boolean("studentVerified").notNull().default(false),
  studentVerifiedDate: timestamp('date_verified'),
  disabilities: text("disabilities")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  address: text("address"),
  location: point('location', { mode: 'xy' }),
  education: text("education"),
}).enableRLS()

export const disabilityVerification = pgTable("disability_verification", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  disabilities: text("disabilities")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  documentUrl: text("document_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS()

export const studentVerification = pgTable("student_verification", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  documentUrl: text("document_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS()

export const businessProfile = pgTable("business_profile", {
  id: uuid().defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  address: text("address").notNull(),
  bin: text("bin").notNull().unique(),
  hasPicture: boolean("has_picture").notNull().default(false),
  location: point('location', { mode: 'xy' }),
}).enableRLS()

export const businessUser = pgTable("business_user", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  businessId: uuid()
    .notNull()
    .references(() => businessProfile.id, { onDelete: "cascade" }),
}).enableRLS()

export const businessRelations = relations(businessProfile, ({ many }) => ({
  businessUser: many(businessUser),
}));
export const businessUserRelations = relations(businessUser, ({ one }) => ({
  user: one(user, {
    fields: [businessUser.userId],
    references: [user.id],
  }),
  business: one(businessProfile, {
    fields: [businessUser.businessId],
    references: [businessProfile.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  jobApplications: many(jobApplications),
  businessUser: many(businessUser),
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

export const jobpostStatusEnum = pgEnum("job_post_status", [
  "active",
  "filled",
  "expired",
]);

export const jobPosts = pgTable("job_posts", {
  id: serial("id").primaryKey(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businessProfile.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  responsibilities: text("responsibilities").notNull(),
  city: text("city").notNull(),
  employmentType: text("employment_type").notNull(),
  salaryMinimum: integer("salaryMinimum").notNull(),
  postedAt: timestamp("posted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: jobpostStatusEnum().default("active").notNull(),
  schedule: text("schedule")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  contact: text("contact").notNull(),
  address: text("address"),
  location: point('location', { mode: 'xy' }),
}).enableRLS()

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
).enableRLS()
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "rejected",
  "accepted",
  "expired",
  "processing"
]);
export const jobApplications = pgTable(
  "job_applications",
  {
    applicantId: text("applicant_id")
      .notNull()
      .references(() => user.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobPosts.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status: applicationStatusEnum("application_status")
      .notNull()
      .default("pending"),
    message: text("message")
  },
  (t) => [primaryKey({ columns: [t.jobId, t.applicantId] })],
).enableRLS()

export const jobPostsRelations = relations(jobPosts, ({ many }) => ({
  jobApplications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    user: one(user, {
      fields: [jobApplications.applicantId],
      references: [user.id],
    }),
    post: one(jobPosts, {
      fields: [jobApplications.jobId],
      references: [jobPosts.id],
    }),
  }),
);

export const mail = pgTable("mail", {
  id: serial('id').primaryKey(),
  replyToId: integer("reply_to_id"), // null = top-level message
  senderId: text('sender_id')
    .notNull(),
  receiverId: text('receiver_id'),
  senderRole: text('sender_role', { enum: ["user", "business", "admin"] }).notNull().default('user'),
  recieverRole: text('reciever_role', { enum: ["user", "business", "admin"] }).notNull().default('user'),
  businessId: uuid('business_id')
    .references(() => businessProfile.id, { onDelete: 'cascade' }), // null for direct messages
  dateSent: timestamp('date_sent').notNull().defaultNow(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  alreadyReplied: boolean("already_replied").notNull().default(false),
},
  (table) => {
    const constraints = [];
    constraints.push(
      foreignKey({
        columns: [table.senderId],
        foreignColumns: [user.id],
        name: "messages_sender_fk",
      }).onDelete("restrict"),
      foreignKey({
        columns: [table.receiverId],
        foreignColumns: [user.id],
        name: "messages_receiver_fk",
      }).onDelete("restrict"),
    );

    // Self-reference (reply → original message)
    if (table.replyToId) {
      constraints.push(
        foreignKey({
          columns: [table.replyToId],
          foreignColumns: [table.id],
          name: "messages_reply_to_fk",
        })
          .onDelete("set null")     // or "cascade" / "restrict"
          .onUpdate("cascade"),
      );
    }
    constraints.push(
      index("idx_messages_sender").on(table.senderId),
      index("idx_messages_receiver").on(table.receiverId),
      index("idx_messages_reply_to").on(table.replyToId),
      index("idx_messages_created_at").on(table.dateSent),
    );
    return constraints;
  },).enableRLS()

export const seekerProfileEmbedding = pgTable("seeker_profile_embedding", {
  id: serial('id').primaryKey(),
  userid: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }).unique(),
  profileEmbedding: vector('profile_embedding', { dimensions: 1024 }).notNull()
}, (table) => [index('profile_embedding_idx')
  .using('hnsw', table.profileEmbedding.op('vector_cosine_ops'))]).
  enableRLS()

export const jobPostEmbedding = pgTable("job_post_embedding", {
  id: serial('id').primaryKey(),
  postid: integer("post_id")
    .notNull()
    .references(() => jobPosts.id, { onDelete: "cascade" }).unique(),
  postEmbedding: vector('post_embedding', { dimensions: 1024 }).notNull()
}, (table) => [index('post_embedding_idx')
  .using('hnsw', table.postEmbedding.op('vector_cosine_ops'))]).
  enableRLS()

export const jobPostTitleEmbedding = pgTable("job_post_title_embedding", {
  id: serial('id').primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => jobPosts.id, { onDelete: "cascade" }).unique(),
  postTitleEmbedding: vector('post_title_embedding', { dimensions: 1024 }).notNull()
}, (table) => [index('post_title_embedding_idx')
  .using('hnsw', table.postTitleEmbedding.op('vector_cosine_ops'))]).
  enableRLS()

export const businessApplications = pgTable("business_applications", {
  id: serial('id').primaryKey(),
  userid: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }).notNull(),
  name: text("name").unique().notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  address: text("address").notNull(),
  bin: text("bin").notNull(),
  verified: text("verified").default("pending").notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS()

export const businessApplicationsDocuments = pgTable("business_applications_documents", {
  id: serial('id').primaryKey(),
  applicationId: integer("application_id")
    .notNull()
    .references(() => businessApplications.id, { onDelete: 'cascade' }),
  documentUrl: text("document_url").notNull(),
  documentName: text("document_name").notNull()
}).enableRLS()

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  body: text("body").notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url")
}).enableRLS()

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),

    // Who receives the notification
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // What kind of notification (e.g., "like", "comment", "follow", "system")
    type: text("type").notNull(),

    // Title / short description (optional)
    title: text("title"),

    // Main message body
    message: text("message").notNull(),

    // Link to the related resource (e.g., "/post/123" or post ID)
    link: text("link"),

    // Optional metadata (actor user, post id, comment id, etc.)
    data: jsonb("data"),

    // Read status
    isRead: boolean("is_read").default(false).notNull(),

    // When the notification was created
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // Optional: when it was read (for analytics)
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (table) => [
    // Important indexes for performance
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_user_id_is_read_idx").on(table.userId, table.isRead),
    index("notifications_created_at_idx").on(table.createdAt), // for sorting
    index("notifications_type_idx").on(table.type), // if you filter by type
  ]
).enableRLS();

export const email = pgTable("email", {
  id: uuid("id").primaryKey(),
  to: text("to")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  from: text("from").notNull(),
  createdAt: timestamp("created_at").notNull(),
  subject: text("subject"),
  messageId: text("message_id"),
  bcc: text("bcc")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  cc: text("cc")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  replyTo: text("reply_to")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  html: text("html"),
  text: text("text"),
  attachments: text("attachments")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
}).enableRLS()
export const emailAttachments = pgTable("email_attachments", {
  id: uuid("id").primaryKey(),
  emailId: uuid("email_id").references(() => email.id, { onDelete: "cascade" }).notNull(),
  filename: text("filename").notNull(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(),
  contentDisposition: text("content_disposition").notNull()
}).enableRLS()