import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  integer, 
  boolean, 
  jsonb, 
  timestamp, 
  pgEnum 
} from "drizzle-orm/pg-core";

export const propertyTypeEnum = pgEnum("property_type", [
  "house", "apartment", "commercial", "office", 
  "upper_portion", "lower_portion", "farm_house", 
  "shop", "warehouse", "building", "plot"
]);
export const listingStatusEnum = pgEnum("listing_status", ["draft", "published", "sold"]);
export const submissionStatusEnum = pgEnum("submission_status", ["new", "contacted", "listed", "closed"]);

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  propertyType: propertyTypeEnum("property_type").notNull(),
  purpose: varchar("purpose", { length: 50 }).default("buy"),
  sector: varchar("sector", { length: 100 }),
  subSector: varchar("sub_sector", { length: 100 }),
  address: text("address"),
  price: integer("price"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area"),
  areaUnit: varchar("area_unit", { length: 50 }).default("sqft"),
  areaSqft: integer("area_sqft"),
  condition: varchar("condition", { length: 50 }),
  images: jsonb("images").$type<string[]>(),
  status: listingStatusEnum("status").default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sellSubmissions = pgTable("sell_submissions", {
  id: serial("id").primaryKey(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  propertyType: propertyTypeEnum("property_type").notNull(),
  sector: varchar("sector", { length: 100 }),
  subSector: varchar("sub_sector", { length: 100 }),
  address: text("address"),
  price: integer("price"),
  description: text("description"),
  remarks: text("remarks"),
  status: submissionStatusEnum("status").default("new").notNull(),
  sheetSynced: boolean("sheet_synced").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: varchar("cover_image", { length: 255 }),
  author: varchar("author", { length: 255 }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  address: text("address").default("").notNull(),
  phone: varchar("phone", { length: 50 }).default("").notNull(),
  email: varchar("email", { length: 255 }).default("").notNull(),
  facebook: varchar("facebook", { length: 255 }).default("").notNull(),
  twitter: varchar("twitter", { length: 255 }).default("").notNull(),
  instagram: varchar("instagram", { length: 255 }).default("").notNull(),
  linkedin: varchar("linkedin", { length: 255 }).default("").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Locations Tables ---

export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(), // e.g. "F-11", "Bahria Town"
  hasSubSectors: boolean("has_sub_sectors").default(true).notNull(), // toggle for auto-gen/sub-sectors
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subSectors = pgTable("sub_sectors", {
  id: serial("id").primaryKey(),
  sectorId: integer("sector_id").references(() => sectors.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "F-11/1", "Phase 8"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Better Auth Tables ---

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").default("admin").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt")
});
