import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
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

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),

  price: integer("price").notNull(),

  description: text("description"),

  category: varchar("category", {
    length: 100,
  }).notNull(),
  imageUrl: text("image_url"),

  isAvailable: boolean("is_available").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
