import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { eq, and, gte, lte, or, ilike } from "drizzle-orm";
import { ListingCard } from "@/components/shared/listing-card";
import { Search, MapPin, Building, Bed, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyFilters } from "@/components/shared/buy-filters";

export const metadata = {
  title: "Properties for Sale | Next Avenue",
  description: "Browse premium houses, apartments, and commercial properties for sale in Islamabad and Rawalpindi.",
};

export const dynamic = "force-dynamic";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Build filters from URL
  const conditions = [eq(listings.status, "published")];

  if (params.q && typeof params.q === "string") {
    const keywords = params.q.trim().split(/\s+/).filter(Boolean);
    if (keywords.length > 0) {
      const keywordConditions = keywords.map(kw => {
        return or(
          ilike(listings.title, `%${kw}%`),
          ilike(listings.address, `%${kw}%`),
          ilike(listings.sector, `%${kw}%`),
          ilike(listings.subSector, `%${kw}%`)
        );
      });
      conditions.push(and(...keywordConditions) as any);
    }
  }

  if (params.type && typeof params.type === "string") {
    conditions.push(eq(listings.propertyType, params.type as any));
  }
  if (params.sector && typeof params.sector === "string") {
    conditions.push(eq(listings.sector, params.sector));
  }
  if (params.subSector && typeof params.subSector === "string") {
    conditions.push(eq(listings.subSector, params.subSector));
  }
  if (params.min && typeof params.min === "string") {
    conditions.push(gte(listings.price, parseInt(params.min)));
  }
  if (params.max && typeof params.max === "string") {
    conditions.push(lte(listings.price, parseInt(params.max)));
  }
  if (params.beds && typeof params.beds === "string") {
    conditions.push(gte(listings.bedrooms, parseInt(params.beds)));
  }
  if (params.baths && typeof params.baths === "string") {
    conditions.push(gte(listings.bathrooms, parseInt(params.baths)));
  }
  if (params.minArea && typeof params.minArea === "string") {
    conditions.push(gte(listings.area, parseInt(params.minArea)));
  }
  if (params.maxArea && typeof params.maxArea === "string") {
    conditions.push(lte(listings.area, parseInt(params.maxArea)));
  }
  if (params.areaUnit && typeof params.areaUnit === "string") {
    conditions.push(eq(listings.areaUnit, params.areaUnit));
  }


  const locations = await import("@/app/actions/locations").then(m => m.getLocations());

  const results = await db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(listings.createdAt);

  console.log("=== BUY PAGE SEARCH LOG ===");
  console.log("URL Params:", params);
  console.log("Number of conditions applied:", conditions.length);
  console.log("Results found:", results.length);
  console.log("===========================");

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="relative flex h-[350px] md:h-[450px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-centaurus.jpg"
            alt="Properties for Sale in Islamabad"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          {/* Dual Shading Gradients & Glow matching Homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        </div>
        
        <div className="z-10 mx-auto max-w-7xl text-center px-4 -mt-10">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 drop-shadow-sm">
            Explore Listings
          </span>
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
            Find Your Dream <br className="hidden md:block" />
            <span className="text-white">Property.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm md:text-base text-white/90 mx-auto font-medium drop-shadow">
            Browse our exclusive portfolio of premium residential and commercial properties in Islamabad.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-[320px] lg:shrink-0">
            <div className="sticky top-24 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Search Filters
                </h2>
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="size-4" />
                </div>
              </div>

              {/* The form submits a GET request to update URL parameters */}
              <BuyFilters params={params} locations={locations} />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                {results.length} {results.length === 1 ? 'Property' : 'Properties'} Available
              </h3>
            </div>

            {results.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white text-center shadow-sm">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-slate-50">
                  <Search className="size-8 text-slate-300" />
                </div>
                <p className="font-heading text-xl font-bold text-slate-900">
                  No matches found
                </p>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <a href="/buy" className="mt-6">
                  <Button variant="outline" className="rounded-xl">Clear Filters</Button>
                </a>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
