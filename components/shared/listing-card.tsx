"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { BedDouble, Bath, Maximize } from "lucide-react";

export interface ListingCardProps {
  id: number;
  slug: string;
  title: string;
  address?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqft?: number | null;
  area?: number | null;
  areaUnit?: string | null;
  images?: string[] | null;
  status: "draft" | "published" | "sold";
  propertyType: string;
}

const statusStyles: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  published: { label: "For Sale", variant: "default" },
  sold: { label: "Sold", variant: "destructive" },
  draft: { label: "Draft", variant: "outline" },
};

function formatPrice(price: number | null | undefined): string {
  if (!price) return "Price on Request";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(price);
}

export function ListingCard({
  slug,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  areaSqft,
  area,
  areaUnit,
  images,
  status,
  propertyType,
}: ListingCardProps) {
  const statusInfo = statusStyles[status] ?? statusStyles.draft;
  
  let parsedImages = images;
  if (typeof images === "string") {
    try {
      parsedImages = JSON.parse(images);
    } catch (e) {
      parsedImages = [];
    }
  }

  const imageList = (Array.isArray(parsedImages) && parsedImages.length > 0)
    ? parsedImages
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Link href={`/buy/${slug}`} className="group block h-full">
      <Card className="flex flex-col h-full overflow-hidden border border-border/50 rounded-[24px] shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 bg-background">
        
        {/* Carousel Container */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted">
          <div className="h-full w-full" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {imageList.map((src, idx) => (
                <div className="relative min-w-0 shrink-0 grow-0 basis-full" key={idx}>
                  <Image
                    src={src}
                    alt={`${title} - image ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10">
            <div className="rounded-full bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-sm">
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="absolute right-3 top-3 z-10">
            <div className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-sm">
                {propertyType}
              </span>
            </div>
          </div>

          {/* Controls */}
          {imageList.length > 1 && (
            <>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={scrollNext}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
                {imageList.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all shadow-sm",
                      idx === selectedIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-5">
          <div className="flex-1 space-y-1.5">
            {/* Location */}
            {address && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground line-clamp-1 uppercase tracking-wide">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary">
                  <path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 12 5 12C5 12 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.75C4.035 6.75 3.25 5.965 3.25 5C3.25 4.035 4.035 3.25 5 3.25C5.965 3.25 6.75 4.035 6.75 5C6.75 5.965 5.965 6.75 5 6.75Z" fill="currentColor"/>
                </svg>
                {address}
              </p>
            )}

            {/* Title */}
            <h3 className="font-heading text-lg font-extrabold leading-tight text-foreground line-clamp-2">
              {title}
            </h3>
          </div>

          <div className="mt-4 space-y-4 shrink-0">
            {/* Price */}
            <p suppressHydrationWarning className="font-mono text-2xl font-black tracking-tighter text-primary">
              {formatPrice(price)}
            </p>

            {/* Specs row */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                {bedrooms != null && (
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <BedDouble className="size-4" />
                    </div>
                    <span>{bedrooms}</span>
                  </div>
                )}
                {bathrooms != null && (
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Bath className="size-4" />
                    </div>
                    <span>{bathrooms}</span>
                  </div>
                )}
                {(area != null || areaSqft != null) && (
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Maximize className="size-4" />
                    </div>
                    <span>{area ? `${area} ${areaUnit || "Sq. Ft."}` : `${areaSqft?.toLocaleString()} Sq. Ft.`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
