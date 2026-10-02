import { db } from "@/lib/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar, User, Newspaper } from "lucide-react";

export const metadata = {
  title: "Real Estate Insights | Next Avenue",
  description: "Expert advice, market trends, and guides on selling your property in Pakistan.",
};

export default async function BlogIndexPage() {
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative flex h-[350px] md:h-[450px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074"
            alt="Real Estate Insights"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          {/* Dual Shading Gradients & Glow matching Homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        </div>
        
        <div className="z-10 mx-auto max-w-4xl text-center px-4 -mt-10">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
            Our Journal
          </span>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Real Estate Insights
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/90 mx-auto max-w-2xl font-medium drop-shadow">
            Expert advice, market trends, and step-by-step guides for buyers, sellers, and investors navigating Pakistan's property market.
          </p>
        </div>
      </section>

      {/* Main Content (3-Column Grid) */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <div className="col-span-full flex h-80 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white text-center shadow-sm">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-50">
                <Newspaper className="size-8 text-slate-300" />
              </div>
              <p className="font-heading text-xl font-bold text-slate-900">
                No articles published yet.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Check back soon for market updates and expert guides.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group h-full">
                <article className="flex h-full flex-col rounded-[2rem] border border-slate-100 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50">
                  
                  {/* Meta */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {format(new Date(post.publishedAt || post.createdAt), "MMM d, yyyy")}
                      </time>
                    </div>
                    <span className="text-slate-200">•</span>
                    <div className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      <span className="text-slate-600 truncate max-w-[100px]">{post.author}</span>
                    </div>
                  </div>
                  
                  {/* Title & Excerpt */}
                  <h2 className="mb-3 font-heading text-xl font-black leading-snug text-slate-900 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-slate-500 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  {/* CTA */}
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary">
                    <span className="relative">
                      Read Article
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
