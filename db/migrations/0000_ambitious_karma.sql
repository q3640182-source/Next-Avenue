CREATE TYPE "public"."listing_status" AS ENUM('draft', 'published', 'sold');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('house', 'apartment', 'commercial', 'office');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('new', 'contacted', 'listed', 'closed');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text,
	"cover_image" varchar(255),
	"author" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"property_type" "property_type" NOT NULL,
	"sector" varchar(100),
	"address" text,
	"price" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"area_sqft" integer,
	"images" jsonb,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sell_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"property_type" "property_type" NOT NULL,
	"sector" varchar(100),
	"address" text,
	"price" integer,
	"description" text,
	"remarks" text,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"sheet_synced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
