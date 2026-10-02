import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { listings, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, BedDouble, Bath, Maximize, Phone, MessageCircle } from "lucide-react";

export async function generateStaticParams() {
  const publishedListings = await db
    .select({ slug: listings.slug })
    .from(listings)
    .where(eq(listings.status, "published"));

  return publishedListings.map((listing) => ({
    slug: listing.slug,
  }));
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1);

  if (!listing || listing.status !== "published") {
    notFound();
  }

  const [settings] = await db.select().from(siteSettings).limit(1);
  const phoneNumber = settings?.phone || "+923001234567";

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in this property: ${listing.title}`)}`;
  const telUrl = `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;

  const formattedPrice = listing.price
    ? new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
      }).format(listing.price)
    : "Price on Request";

  let parsedImages: string[] = [];
  if (Array.isArray(listing.images)) {
    parsedImages = listing.images;
  } else if (typeof listing.images === "string") {
    try {
      parsedImages = JSON.parse(listing.images);
    } catch (e) {
      parsedImages = [];
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description || "",
    datePosted: listing.createdAt.toISOString(),
    offers: {
      "@type": "Offer",
      price: listing.price || 0,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock"
    },
    image: parsedImages,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address || "",
      addressLocality: listing.sector || "",
      addressCountry: "PK"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pb-24 md:pb-12">
      {/* Hero Carousel */}
      <div className="mx-auto max-w-7xl md:px-6 md:pt-6">
        <ImageCarousel images={parsedImages} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Main Content (Left) */}
          <div className="space-y-8 md:col-span-2">
            {/* Header / Title */}
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {listing.propertyType}
                </Badge>
                {listing.sector && (
                  <Badge variant="outline">{listing.sector}</Badge>
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                {listing.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <p>{listing.address}</p>
              </div>
              {/* Mobile price pinned high */}
              <p className="mt-4 font-heading text-3xl font-bold text-primary md:hidden">
                {formattedPrice}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="flex flex-wrap gap-6 rounded-xl border bg-card p-4 shadow-sm md:p-6">
              {listing.bedrooms != null && (
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
                    <BedDouble className="size-4" />
                    <span className="text-sm font-medium">Bedrooms</span>
                  </div>
                  <span className="font-heading text-xl font-bold text-foreground">
                    {listing.bedrooms}
                  </span>
                </div>
              )}
              {listing.bathrooms != null && (
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
                    <Bath className="size-4" />
                    <span className="text-sm font-medium">Bathrooms</span>
                  </div>
                  <span className="font-heading text-xl font-bold text-foreground">
                    {listing.bathrooms}
                  </span>
                </div>
              )}
              {listing.areaSqft != null && (
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
                    <Maximize className="size-4" />
                    <span className="text-sm font-medium">Area</span>
                  </div>
                  <span className="font-heading text-xl font-bold text-foreground">
                    {listing.areaSqft.toLocaleString()} <span className="text-sm text-muted-foreground">sqft</span>
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Property Description
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                {listing.description?.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Right) */}
          <div className="hidden md:block">
            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm">
              <p className="font-heading text-3xl font-bold text-primary">
                {formattedPrice}
              </p>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">Interested?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our agents to schedule a viewing or get more details.
                </p>
                <div className="flex flex-col gap-3">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="default" className="w-full gap-2 bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90">
                      <MessageCircle className="size-4" />
                      WhatsApp Us
                    </Button>
                  </a>
                  <a href={telUrl} className="w-full">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="size-4" />
                      Call Agent
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur-sm md:hidden shadow-lg">
        <div className="mx-auto flex max-w-md gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="default" className="w-full gap-2 bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90">
              <MessageCircle className="size-4" />
              WhatsApp
            </Button>
          </a>
          <a href={telUrl} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Phone className="size-4" />
              Call
            </Button>
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
