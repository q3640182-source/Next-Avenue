"use server";

import { db } from "@/lib/db";
import { listings, sellSubmissions, user } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function globalAdminSearch(query: string) {
  if (!query || query.trim() === "") return { listings: [], submissions: [], users: [] };

  const q = `%${query}%`;

  const foundListings = await db.select({
    id: listings.id,
    title: listings.title,
    slug: listings.slug,
    status: listings.status,
  }).from(listings)
  .where(or(ilike(listings.title, q), ilike(listings.address, q)))
  .limit(5);

  const foundSubmissions = await db.select({
    id: sellSubmissions.id,
    ownerName: sellSubmissions.ownerName,
    status: sellSubmissions.status,
    phone: sellSubmissions.phone,
  }).from(sellSubmissions)
  .where(or(ilike(sellSubmissions.ownerName, q), ilike(sellSubmissions.phone, q)))
  .limit(5);

  const foundUsers = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
  }).from(user)
  .where(or(ilike(user.name, q), ilike(user.email, q)))
  .limit(5);

  return {
    listings: foundListings,
    submissions: foundSubmissions,
    users: foundUsers
  };
}
