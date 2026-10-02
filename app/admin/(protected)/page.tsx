import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { listings, sellSubmissions, blogPosts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Building, Inbox, FileText, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch stats concurrently
  const [
    totalListingsRes,
    newSubmissionsRes,
    unsyncedSubmissionsRes,
    totalBlogsRes,
    recentListingsRes,
    recentLeadsRes
  ] = await Promise.all([
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(listings),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(sellSubmissions).where(eq(sellSubmissions.status, "new")),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(sellSubmissions).where(eq(sellSubmissions.sheetSynced, false)),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(blogPosts),
    db.select().from(listings).orderBy(sql`${listings.createdAt} DESC`).limit(5),
    db.select().from(sellSubmissions).orderBy(sql`${sellSubmissions.createdAt} DESC`).limit(5)
  ]);

  const totalListings = totalListingsRes[0].count;
  const newSubmissions = newSubmissionsRes[0].count;
  const unsyncedSubmissions = unsyncedSubmissionsRes[0].count;
  const totalBlogs = totalBlogsRes[0].count;
  const recentListings = recentListingsRes;
  const recentLeads = recentLeadsRes;

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Welcome back, {session?.user.name}. Here's the live status of your real estate platform.
          </p>
        </div>
      </div>

      {/* Primary Metrics Grid - Full Width */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {/* Metric 1 */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
            <Building className="size-16 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building className="size-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Listings</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-2xl font-black text-slate-900">{totalListings}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
            <Inbox className="size-16 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Inbox className="size-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Leads</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-2xl font-black text-slate-900">{newSubmissions}</span>
              {newSubmissions > 0 && <span className="flex items-center text-[10px] font-bold text-emerald-500"><TrendingUp className="mr-1 size-3" /> Action required</span>}
            </div>
          </div>
        </div>

        {/* Metric 3 (Sync Failures) */}
        <div className={cn(
          "group rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden",
          unsyncedSubmissions > 0 
            ? "border-red-200 bg-red-50/50 shadow-red-200/40" 
            : "border-slate-100 bg-white"
        )}>
          <div className="absolute top-0 right-0 p-5 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
            <AlertCircle className={cn("size-16", unsyncedSubmissions > 0 ? "text-red-500" : "text-primary")} />
          </div>
          <div className="relative z-10">
            <div className={cn("mb-3 flex size-8 items-center justify-center rounded-lg", unsyncedSubmissions > 0 ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary")}>
              <AlertCircle className="size-4" />
            </div>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest", unsyncedSubmissions > 0 ? "text-red-600/70" : "text-slate-400")}>Sync Failures</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={cn("font-heading text-2xl font-black", unsyncedSubmissions > 0 ? "text-red-600" : "text-slate-900")}>{unsyncedSubmissions}</span>
            </div>
            {unsyncedSubmissions > 0 && (
              <Link href="/admin/submissions" className="mt-2 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700">
                Fix now <ArrowRight className="ml-1 size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20">
            <FileText className="size-16 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Published Posts</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-2xl font-black text-slate-900">{totalBlogs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5 px-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Recent Client Leads</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Latest property valuation requests</p>
            </div>
            <Link href="/admin/submissions" className="text-sm font-bold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-0">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No recent leads found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-5 px-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-slate-900">{lead.name}</span>
                      <span className="text-xs text-slate-500">{lead.email || lead.phone}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                        lead.status === "new" ? "bg-emerald-100 text-emerald-700" :
                        lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {lead.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5 px-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Latest Properties</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Recently added listings</p>
            </div>
            <Link href="/admin/listings" className="text-sm font-bold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="p-0">
            {recentListings.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No properties listed yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentListings.map((listing: any) => (
                  <div key={listing.id} className="flex items-center justify-between p-5 px-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {listing.images && listing.images.length > 0 ? (
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200">
                          <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100">
                          <Building className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 max-w-[200px] sm:max-w-[300px]">
                        <span className="font-bold text-sm text-slate-900 truncate">{listing.title}</span>
                        <span className="text-xs text-slate-500 capitalize">{listing.propertyType} • {listing.sector}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                        listing.status === "published" ? "bg-emerald-100 text-emerald-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
