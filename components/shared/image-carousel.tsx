"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-muted md:aspect-[21/9]">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="group relative aspect-[4/3] w-full overflow-hidden bg-black md:aspect-[21/9] md:rounded-xl">
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {images.map((src, index) => (
              <div
                className="relative min-w-0 shrink-0 grow-0 basis-full cursor-pointer"
                key={index}
              >
                <DialogTrigger asChild>
                  <div className="h-full w-full">
                    <Image
                      src={src}
                      alt={`Property image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-opacity hover:opacity-90"
                      sizes="100vw"
                      priority={index === 0}
                    />
                  </div>
                </DialogTrigger>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={scrollPrev}
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={scrollNext}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === selectedIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Expand className="size-4" />
        </div>
      </div>

      <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          <Image
            src={images[selectedIndex]}
            alt="Property fullscreen view"
            fill
            unoptimized
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
