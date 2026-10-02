ALTER TYPE "public"."property_type" ADD VALUE 'upper_portion';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'lower_portion';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'farm_house';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'shop';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'warehouse';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'building';--> statement-breakpoint
ALTER TYPE "public"."property_type" ADD VALUE 'plot';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"phone" varchar(50) DEFAULT '' NOT NULL,
	"email" varchar(255) DEFAULT '' NOT NULL,
	"facebook" varchar(255) DEFAULT '' NOT NULL,
	"twitter" varchar(255) DEFAULT '' NOT NULL,
	"instagram" varchar(255) DEFAULT '' NOT NULL,
	"linkedin" varchar(255) DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "purpose" varchar(50) DEFAULT 'buy';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "area" integer;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "area_unit" varchar(50) DEFAULT 'sqft';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "condition" varchar(50);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "furnished" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "corner" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "park_facing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "servant_quarters" boolean DEFAULT false;