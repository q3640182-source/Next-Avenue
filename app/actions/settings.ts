"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await db.select().from(siteSettings).limit(1);
  if (settings.length === 0) {
    const [newSettings] = await db.insert(siteSettings).values({
      address: "Islamabad, Pakistan",
      phone: "+92 300 0000000",
      email: "info@nextavenue.com",
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    }).returning();
    return newSettings;
  }
  return settings[0];
}

export async function updateSettings(data: {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}) {
  const settings = await db.select().from(siteSettings).limit(1);
  
  if (settings.length === 0) {
    await db.insert(siteSettings).values(data);
  } else {
    await db.update(siteSettings).set({ ...data, updatedAt: new Date() }).where(eq(siteSettings.id, settings[0].id));
  }
  
  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  return { success: true };
}
