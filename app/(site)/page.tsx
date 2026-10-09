import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { listings, siteSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/components/shared/listing-card";
import { Hero } from "@/components/shared/hero";
import {
  Search,
  ShieldCheck,
  TrendingUp,
  Handshake,
  Clock,
  ArrowRight,
} from "lucide-react";

/* ───────────────────────────── mock data ───────────────────────────── */


const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted Expertise",
    copy: "Decades of experience navigating Pakistan's real estate market with integrity.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    copy: "Data-driven valuations so you price your property right from day one.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    copy: "From listing to closing — we handle documentation, marketing, and negotiations.",
  },
  {
    icon: Clock,
    title: "Fast Results",
    copy: "Our network of qualified buyers means shorter listing times and faster closings.",
  },
];

/* ─────────────────────────────── page ─────────────────────────────── */

export default async function HomePage() {
  const latestListings = await db
    .select()
    .from(listings)
    .where(eq(listings.status, "published"))
    .orderBy(desc(listings.createdAt))
    .limit(4);

  const [settings] = await db.select().from(siteSettings).limit(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Next Avenue",
    image: "https://www.nextavenuepk.com/logo.png",
    url: "https://www.nextavenuepk.com",
    telephone: settings?.phone || "+923001234567",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Islamabad",
      addressRegion: "Islamabad Capital Territory",
      addressCountry: "PK"
    },
    sameAs: [
      settings?.facebookUrl,
      settings?.instagramUrl,
      settings?.twitterUrl,
      settings?.linkedinUrl,
    ].filter(Boolean),
    description: "Next Avenue is Pakistan's premier property platform, specializing in buying, selling, and evaluating premium real estate in Islamabad and Rawalpindi."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Hero />

      {/* ── 2. Featured Listings ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked listings from Islamabad&apos;s most sought-after
              locations.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link href="/buy">
              View all
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Horizontal scroll on mobile, grid on md+ */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">
          {latestListings.map((listing) => (
            <div
              key={listing.id}
              className="w-[280px] flex-shrink-0 snap-start md:w-auto"
            >
              <ListingCard {...listing as any} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link href="/buy">
              View all listings
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── 3. About Summary ───────────────────────────────────── */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-14">
            {/* Image placeholder */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted md:w-1/2">
              <Image
                src="/hero-centaurus-2.jpg"
                alt="About Next Avenue - Centaurus Mall"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="space-y-5 md:w-1/2">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                About Next Avenue
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                Next Avenue is Pakistan&apos;s premier property platform,
                connecting homeowners with serious buyers through transparent
                valuations, professional marketing, and end-to-end transaction
                support. We believe selling your property should be
                straightforward — no hidden fees, no unnecessary delays.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Whether you&apos;re listing a family home in Islamabad&apos;s
                residential sectors or a commercial space in the business
                district, our team brings local expertise and a network of
                qualified buyers to every deal.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn more about us
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Why Choose Us ───────────────────────────────────── */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Why Choose Us
                </span>
              </div>
              <h2 className="mb-6 font-heading text-4xl font-black leading-tight text-slate-900 md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                Why Choose Next Avenue
              </h2>
              <p className="text-lg leading-relaxed text-slate-500 max-w-lg">
                We make selling and buying property simple, transparent, and fast.
              </p>
            </div>

            {/* Right Grid (2x2 with interlocking radii) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 relative">
              {whyChooseUs.map((item, index) => {
                // Determine the unique border radius for this quadrant
                let radiusClass = "rounded-2xl sm:rounded-3xl";
                if (index === 0) radiusClass += " rounded-br-[40px] sm:rounded-br-[80px]";
                if (index === 1) radiusClass += " rounded-bl-[40px] sm:rounded-bl-[80px]";
                if (index === 2) radiusClass += " rounded-tr-[40px] sm:rounded-tr-[80px]";
                if (index === 3) radiusClass += " rounded-tl-[40px] sm:rounded-tl-[80px]";

                return (
                  <div
                    key={item.title}
                    className={`flex flex-col items-center justify-center text-center bg-white p-6 sm:p-10 transition-transform duration-300 hover:-translate-y-1 relative z-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ${radiusClass}`}
                  >
                    <div className="mb-5 flex size-12 sm:size-14 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm text-primary">
                      <item.icon className="size-5 sm:size-6 stroke-[2]" />
                    </div>
                    <h3 className="mb-3 font-heading text-sm sm:text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="max-w-[220px] text-[12px] sm:text-[13px] leading-relaxed text-slate-500">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Final CTA Banner ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-accent">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-pakistan-monument.jpg"
            alt="Pakistan Monument Islamabad"
            className="h-full w-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center md:px-6 md:py-20">
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Ready to Sell Your Property?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
            List with Next Avenue and get your property in front of thousands of
            qualified buyers. No upfront fees — we only succeed when you do.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-white text-brand-accent hover:bg-white/90 shadow-xl hover:-translate-y-1 transition-all"
              asChild
            >
              <Link href="/sell">
                Get Started — It&apos;s Free
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
