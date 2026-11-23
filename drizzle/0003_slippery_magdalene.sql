CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
ALTER TYPE "public"."order_status" ADD VALUE 'completed' BEFORE 'cancelled';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_status" "payment_status" DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "wire_intent_id" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_wire_intent_id_unique" UNIQUE("wire_intent_id");