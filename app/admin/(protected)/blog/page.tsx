import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { BlogActions } from "@/components/admin/blog-actions";

export default async function AdminBlogPage() {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Journal & Insights</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Write, edit, and publish articles to the Next Avenue public journal.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl px-6 font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all text-sm">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Write New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-3">
        {posts.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center shadow-sm">
            <p className="font-heading text-lg font-bold text-slate-900">
              No articles published yet.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Start writing your first market insight.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading text-lg font-bold text-slate-900">{post.title}</h3>
                    <div className={post.published ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500"}>
                      {post.published ? "Published" : "Draft"}
                    </div>
                  </div>
                  <div className="text-xs font-bold tracking-wide uppercase text-slate-400 flex items-center gap-2">
                    <span>{post.author || "Next Avenue"}</span>
                    <span>•</span>
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <BlogActions id={post.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
