import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { listings } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ld4eqh8j";

function cldUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/c_fill,w_800,h_600,q_auto,f_auto/${publicId}`;
}

const seedListings = [
  {
    slug: "modern-villa-f7-islamabad",
    title: "Modern 3-Bed Villa in F-7",
    description:
      "A beautifully designed modern villa in the heart of F-7, Islamabad. Features an open-plan living area, imported marble flooring, a landscaped garden, and dedicated parking for two vehicles. The property benefits from 24/7 security and is within walking distance of schools and commercial centres.",
    propertyType: "house" as const,
    sector: "F-7",
    address: "Street 23, F-7/2, Islamabad",
    price: 85000000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 3200,
    images: [
      cldUrl("samples/landscapes/architecture-signs"),
      cldUrl("samples/landscapes/beach-boat"),
      cldUrl("samples/animals/three-dogs"),
    ],
    status: "published" as const,
    featured: true,
  },
  {
    slug: "luxury-apartment-bahria-town",
    title: "Luxury 2-Bed Apartment in Bahria Town",
    description:
      "Premium apartment in Bahria Town Phase 4 with stunning views of the Margalla Hills. The apartment includes a modern kitchen, built-in wardrobes, and access to a communal gym and swimming pool. Ideal for young professionals or a small family.",
    propertyType: "apartment" as const,
    sector: "Bahria Town",
    address: "Tower B, Bahria Town Phase 4, Rawalpindi",
    price: 32000000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1800,
    images: [
      cldUrl("samples/landscapes/nature-mountains"),
      cldUrl("samples/food/spices"),
      cldUrl("samples/landscapes/beach-boat"),
    ],
    status: "published" as const,
    featured: true,
  },
  {
    slug: "commercial-plaza-blue-area",
    title: "Commercial Plaza on Blue Area",
    description:
      "A prime commercial property on Jinnah Avenue, Blue Area — Islamabad's premier business district. The plaza spans four floors with retail on the ground floor and offices above. High foot traffic, excellent signage visibility, and ample basement parking.",
    propertyType: "commercial" as const,
    sector: "Blue Area",
    address: "Jinnah Avenue, Blue Area, Islamabad",
    price: 250000000,
    bedrooms: null,
    bathrooms: 4,
    areaSqft: 12000,
    images: [
      cldUrl("samples/landscapes/architecture-signs"),
      cldUrl("samples/landscapes/nature-mountains"),
    ],
    status: "published" as const,
    featured: false,
  },
  {
    slug: "family-home-e11-islamabad",
    title: "Spacious 5-Bed Family Home in E-11",
    description:
      "A generously sized family home in the quiet residential sector of E-11/3. Five bedrooms with en-suite bathrooms, a large drawing room, separate dining, servant quarter, and a lush back garden. Perfect for a large family seeking space and tranquility.",
    propertyType: "house" as const,
    sector: "E-11",
    address: "E-11/3, Islamabad",
    price: 120000000,
    bedrooms: 5,
    bathrooms: 5,
    areaSqft: 5500,
    images: [
      cldUrl("samples/animals/three-dogs"),
      cldUrl("samples/food/spices"),
      cldUrl("samples/landscapes/architecture-signs"),
    ],
    status: "published" as const,
    featured: true,
  },
  {
    slug: "penthouse-dha-phase2",
    title: "DHA Phase 2 Penthouse with Terrace",
    description:
      "Stunning penthouse apartment in DHA Phase 2 featuring a wraparound terrace with panoramic views. Three bedrooms, a chef's kitchen, floor-to-ceiling windows, and a private rooftop entertaining area. Building amenities include a concierge, gym, and underground parking.",
    propertyType: "apartment" as const,
    sector: "DHA",
    address: "DHA Phase 2, Islamabad",
    price: 78000000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2800,
    images: [
      cldUrl("samples/landscapes/beach-boat"),
      cldUrl("samples/landscapes/nature-mountains"),
      cldUrl("samples/landscapes/architecture-signs"),
    ],
    status: "published" as const,
    featured: true,
  },
  {
    slug: "office-suite-g11-markaz",
    title: "Modern Office Suite in G-11 Markaz",
    description:
      "A freshly renovated office suite in G-11 Markaz, ideal for a startup or professional services firm. Open-plan layout with two private cabins, a reception area, kitchenette, and dedicated washroom. Fibre internet–ready with backup power.",
    propertyType: "office" as const,
    sector: "G-11",
    address: "G-11 Markaz, Islamabad",
    price: 45000000,
    bedrooms: null,
    bathrooms: 2,
    areaSqft: 2200,
    images: [
      cldUrl("samples/food/spices"),
      cldUrl("samples/landscapes/nature-mountains"),
    ],
    status: "published" as const,
    featured: false,
  },
  {
    slug: "kanal-house-f8-islamabad",
    title: "1-Kanal House in F-8 with Garden",
    description:
      "An elegant 1-kanal residence in F-8 with mature trees and a manicured lawn. Four bedrooms upstairs, formal and informal reception rooms on the ground floor, a separate guest suite, and a double garage. Recently renovated with modern fixtures throughout.",
    propertyType: "house" as const,
    sector: "F-8",
    address: "F-8/3, Islamabad",
    price: 150000000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 4800,
    images: [
      cldUrl("samples/landscapes/nature-mountains"),
      cldUrl("samples/animals/three-dogs"),
      cldUrl("samples/landscapes/beach-boat"),
    ],
    status: "published" as const,
    featured: false,
  },
  {
    slug: "studio-apartment-i8-islamabad",
    title: "Affordable Studio in I-8",
    description:
      "A compact, well-designed studio apartment in I-8 — perfect for a single professional or as an investment property. Includes a small balcony, built-in storage, and access to communal laundry facilities. Close to the metro station.",
    propertyType: "apartment" as const,
    sector: "I-8",
    address: "I-8/1, Islamabad",
    price: 12000000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 650,
    images: [
      cldUrl("samples/food/spices"),
      cldUrl("samples/landscapes/architecture-signs"),
    ],
    status: "sold" as const,
    featured: false,
  },
];

async function seed() {
  console.log("🌱 Seeding listings...");

  // Clear existing listings
  const { sql: rawSql } = await import("drizzle-orm");
  await db.execute(rawSql`TRUNCATE TABLE listings RESTART IDENTITY CASCADE`);

  for (const listing of seedListings) {
    await db.insert(listings).values(listing);
    console.log(`  ✓ ${listing.title}`);
  }

  console.log(`\n✅ Seeded ${seedListings.length} listings.`);
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
