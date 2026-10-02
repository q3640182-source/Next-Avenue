import { db } from "@/lib/db";
import { blogPosts, listings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { ListingCard } from "@/components/shared/listing-card";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // ISR revalidate every hour

export async function generateStaticParams() {
  const posts = await db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.published, true));
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} | Next Avenue Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Next Avenue"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));

  if (!post || !post.published) {
    notFound();
  }

  // Fetch a few random/featured listings for the "Related Listings" section
  const relatedListings = await db.select().from(listings).where(eq(listings.status, "published")).limit(2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: [{
      "@type": "Person",
      name: post.author || "Next Avenue",
    }],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-slate-50/50 py-12 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          
          {/* Top Navigation */}
          <div className="mb-10 flex items-center justify-between">
            <Link 
              href="/blog" 
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm transition-all group-hover:-translate-x-1 group-hover:border-slate-300">
                <ArrowLeft className="size-4" />
              </div>
              Back to Journal
            </Link>
            
            <Button variant="outline" size="sm" className="rounded-full gap-2 h-8 text-xs font-bold text-slate-500 hover:text-slate-900 border-slate-200 bg-white">
              <Share2 className="size-3.5" />
              Share
            </Button>
          </div>

          {/* Article Container */}
          <article className="rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/40 relative overflow-hidden">
            {/* Top decorative edge */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-brand-accent to-primary opacity-90" />
            
            <div className="px-6 py-12 md:px-16 md:py-20">
              <header className="mb-12 text-center md:mb-16">
                {/* Meta */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {format(new Date(post.publishedAt || post.createdAt), "MMMM d, yyyy")}
                    </time>
                  </div>
                  <span className="text-slate-200">•</span>
                  <div className="flex items-center gap-2">
                    <User className="size-4" />
                    <span className="text-slate-600">{post.author}</span>
                  </div>
                </div>

                <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="mt-8 text-lg md:text-xl leading-relaxed text-slate-500 max-w-2xl mx-auto font-medium">
                    {post.excerpt}
                  </p>
                )}
              </header>

              <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* Prose Content */}
              <div className="prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-heading prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-loose prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80 prose-li:text-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content || ""}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          {/* Related Listings Section */}
          {relatedListings.length > 0 && (
            <div className="mt-16 md:mt-24">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-black text-slate-900">Featured Properties</h3>
                  <p className="text-sm text-slate-500 mt-1">Explore our latest premium listings</p>
                </div>
                <Link href="/buy">
                  <Button variant="outline" className="rounded-full text-xs font-bold uppercase tracking-widest h-9">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing as any} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
