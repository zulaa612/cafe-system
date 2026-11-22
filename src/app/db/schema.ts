import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  pgEnum,
  index,
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

export const orderStatus = pgEnum("order_status", [
  "pending",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const paymentStatus = pgEnum("payment_status", [
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),

    status: orderStatus("status").notNull().default("pending"),

    // Payment fields
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),

    wireIntentId: varchar("wire_intent_id", {
      length: 255,
    }).unique(),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    totalAmount: integer("total_amount").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("orders_user_id_idx").on(table.userId)],
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),

  productName: varchar("product_name", {
    length: 150,
  }).notNull(),

  quantity: integer("quantity").notNull(),

  unitPrice: integer("unit_price").notNull(),

  subtotal: integer("subtotal").notNull(),
});

