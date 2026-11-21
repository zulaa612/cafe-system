import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 100 }).notNull(),

  phone: varchar("phone", { length: 12 }).notNull().unique(),

  role: varchar("role", { length: 20 }).notNull().default("customer"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
