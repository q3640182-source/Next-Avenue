"use server";

import { db } from "@/lib/db";
import { sectors, subSectors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLocations() {
  const allSectors = await db.select().from(sectors);
  const allSubSectors = await db.select().from(subSectors);
  
  return allSectors.map((sector) => ({
    ...sector,
    subSectors: allSubSectors.filter((sub) => sub.sectorId === sector.id),
  }));
}

export async function addSector(name: string, hasSubSectors: boolean) {
  if (!name.trim()) return { success: false, error: "Sector name is required" };
  try {
    const [newSector] = await db.insert(sectors).values({ 
      name: name.trim(),
      hasSubSectors 
    }).returning();
    
    // Auto-generate standard sub-sectors if requested and not specialized
    if (hasSubSectors) {
      const isSpecialized = name.toLowerCase().includes("bahria") || name.toLowerCase().includes("dha");
      if (!isSpecialized) {
        await db.insert(subSectors).values([
          { sectorId: newSector.id, name: `${name.trim()}/1` },
          { sectorId: newSector.id, name: `${name.trim()}/2` },
          { sectorId: newSector.id, name: `${name.trim()}/3` },
          { sectorId: newSector.id, name: `${name.trim()}/4` },
        ]);
      }
    }
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error: any) {
    if (error.code === '23505') return { success: false, error: "Sector already exists" };
    return { success: false, error: "Failed to add sector" };
  }
}

export async function deleteSector(id: number) {
  try {
    await db.delete(sectors).where(eq(sectors.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete sector" };
  }
}

export async function addSubSector(sectorId: number, name: string) {
  if (!name.trim()) return { success: false, error: "Name is required" };
  try {
    await db.insert(subSectors).values({ sectorId, name: name.trim() });
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add sub-sector" };
  }
}

export async function deleteSubSector(id: number) {
  try {
    await db.delete(subSectors).where(eq(subSectors.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete sub-sector" };
  }
}
