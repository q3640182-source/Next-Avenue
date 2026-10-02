import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { listings, blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = "https://nextavenue.com.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic routes
  const [activeListings, publishedBlogs] = await Promise.all([
    db.select({ slug: listings.slug, updatedAt: listings.updatedAt }).from(listings).where(eq(listings.status, "published")),
    db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.published, true)),
  ]);

  const listingUrls = activeListings.map((listing) => ({
    url: `${BASE_URL}/buy/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogUrls = publishedBlogs.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes = ["", "/buy", "/sell", "/blog", "/faq"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...staticRoutes, ...listingUrls, ...blogUrls];
}
