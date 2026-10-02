import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const queries = [
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'upper_portion'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'lower_portion'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'farm_house'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'shop'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'warehouse'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'building'`,
      `ALTER TYPE "public"."property_type" ADD VALUE IF NOT EXISTS 'plot'`,
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "purpose" varchar(50) DEFAULT 'buy'`,
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "area" integer`,
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "area_unit" varchar(50) DEFAULT 'sqft'`,
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "condition" varchar(50)`,
    ];
    for (const q of queries) {
      try {
        await db.execute(sql.raw(q));
      } catch (e: any) {
        console.error("Error executing", q, e.message);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
