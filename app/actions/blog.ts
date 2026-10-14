"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveBlogPost(data: any) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    // Auto-generate or sanitize slug
    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    if (!slug) {
      slug = `post-${Math.random().toString(36).substring(2, 7)}`;
    }

    const payload = {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content || null,
      coverImage: data.coverImage || null,
      author: data.author || null,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      updatedAt: new Date(),
    };

    if (data.id) {
      await db.update(blogPosts).set(payload).where(eq(blogPosts.id, data.id));
    } else {
      await db.insert(blogPosts).values(payload as any);
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true };
  } catch (error) {
    console.error("Save blog post error:", error);
    return { success: false, error: "Failed to save post" };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
