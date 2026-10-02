"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveListing(data: any) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    // Prepare slug if new
    let slug = data.slug;
    if (!slug) {
      slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      // Add random suffix to avoid conflicts if needed
      if (!data.id) slug += `-${Math.random().toString(36).substring(2, 6)}`;
    }

    const payload = {
      title: data.title,
      slug,
      propertyType: data.propertyType as any,
      purpose: data.purpose || "buy",
      status: data.status,
      sector: data.sector || null,
      address: data.address || null,
      price: data.price ? parseInt(data.price) : null,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
      area: data.area ? parseInt(data.area) : null,
      areaUnit: data.areaUnit || "Sq. Ft.",
      condition: data.condition || null,
      description: data.description || null,
      images: data.images && data.images.length > 0 ? data.images.slice(0, 5) : null,
      updatedAt: new Date(),
    };

    if (data.id) {
      // Update
      await db.update(listings).set(payload).where(eq(listings.id, data.id));
    } else {
      // Insert
      await db.insert(listings).values(payload as any);
    }

    return { success: true };
  } catch (error) {
    console.error("Save listing error:", error);
    return { success: false, error: "Failed to save listing" };
  }
}

export async function deleteListing(id: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(listings).where(eq(listings.id, id));
    return { success: true };
  } catch (error) {
    console.error("Delete listing error:", error);
    return { success: false, error: "Failed to delete listing" };
  }
}
