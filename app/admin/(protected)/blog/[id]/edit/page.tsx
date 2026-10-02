import { AdminModal } from "@/components/admin/modal";
import { BlogForm } from "@/components/admin/blog-form";
import { Edit2 } from "lucide-react";
import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));

  if (!post) {
    notFound();
  }

  return (
    <AdminModal title="Edit Post" icon={<Edit2 className="h-5 w-5" />}>
      <BlogForm initialData={post as any} />
    </AdminModal>
  );
}
