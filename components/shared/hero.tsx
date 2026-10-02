"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

const HERO_IMAGES = [
  "/hero-centaurus.jpg",
  "/hero-faisal-mosque.jpg",
  "/hero-centaurus-2.jpg",
];

export function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sector, setSector] = useState("");
  const [subSector, setSubSector] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [locations, setLocations] = useState<{ id: number; name: string; subSectors?: { id: number; name: string }[] }[]>([]);

  useEffect(() => {
    import("@/app/actions/locations").then((m) => m.getLocations().then(setLocations));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sector && sector !== "all") params.set("sector", sector);
    if (subSector && subSector !== "all") params.set("subSector", subSector);
    if (type && type !== "all") params.set("type", type);
    if (bedrooms && bedrooms !== "all") params.set("beds", bedrooms);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);

    router.push(`/buy?${params.toString()}`);
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <section className="relative flex min-h-[700px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900 sm:min-h-[800px] lg:min-h-[880px]">
      {/* 2. Multi-Layered Background Architecture */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Hero Background ${index + 1}`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out",
              currentSlide === index ? "opacity-60 scale-105" : "opacity-0 scale-100"
            )}
          />
        ))}
      </div>

      {/* Dual Shading Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />

      {/* Atmospheric Glow Element */}
      <div className="absolute left-1/2 top-1/4 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />

      {/* Main Content Enclosure */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        
        {/* Display Headline */}
        <h1 className="animate-in fade-in slide-in-from-bottom-6 font-heading text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Your Property, <br />
          <span className="text-white">Our Priority</span>
        </h1>

        {/* Descriptive Sub-Headline */}
        <p className="mt-6 max-w-xs animate-in fade-in slide-in-from-bottom-8 text-sm font-medium leading-relaxed text-neutral-200 sm:max-w-xl sm:text-lg md:max-w-2xl md:text-xl">
          Pakistan&apos;s trusted platform for buying and selling real estate.
          List your property and reach thousands of qualified buyers today.
        </p>

        {/* Interactive Property Search & Filter Console */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-8 sm:mt-12 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-10 flex flex-col gap-4 px-2 sm:px-0"
        >
          
          {/* Row 1: Primary Search Input (Mobile standalone, Desktop combined) */}
          <div className="relative flex w-full flex-col sm:flex-row items-center sm:rounded-full sm:bg-white/10 sm:p-2 sm:shadow-xl sm:backdrop-blur-md sm:border sm:border-white/20 gap-3 sm:gap-0">
            
            <div className="relative flex w-full items-center rounded-full bg-white/10 p-2 sm:bg-transparent sm:p-0 shadow-xl sm:shadow-none backdrop-blur-md sm:backdrop-blur-none border border-white/20 sm:border-none">
              <Search className="absolute left-4 sm:left-6 size-5 text-white/70" />
              <input
                type="text"
                placeholder="Search location, society, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full bg-transparent pl-12 sm:pl-14 pr-10 text-sm font-medium text-white placeholder:text-white/70 focus:outline-none sm:text-base"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-white/70 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>

            {/* Desktop Action Button */}
            <Button type="submit" className="hidden sm:flex h-11 rounded-full px-8 py-3.5 shadow-md hover:shadow-lg transition-all bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90">
              Search
            </Button>
          </div>

          {/* Row 2: Secondary Quick-Filters & Popovers */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Dropdowns */}
            <Select value={sector} onValueChange={(val) => { setSector(val); setSubSector(""); }}>
              <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                <SelectItem value="all">Any Sector</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(() => {
              const selectedSector = locations.find((l) => l.name === sector);
              const availableSubSectors = selectedSector?.subSectors || [];
              if (availableSubSectors.length > 0) {
                return (
                  <Select value={subSector} onValueChange={setSubSector}>
                    <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                      <SelectValue placeholder="Sub-Sector" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                      <SelectItem value="all">Any Sub-Sector</SelectItem>
                      {availableSubSectors.map((sub: { id: number, name: string }) => (
                        <SelectItem key={sub.id} value={sub.name}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }
              return null;
            })()}

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                <SelectItem value="all">Any Type</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="upper_portion">Upper Portion</SelectItem>
                <SelectItem value="lower_portion">Lower Portion</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="h-9 sm:h-8 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white data-placeholder:text-white [&_svg]:text-white backdrop-blur-sm hover:bg-white/20 data-[state=open]:bg-white/20">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="rounded-xl border-white/20 bg-background/95 backdrop-blur-md">
                <SelectItem value="all">Any Beds</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
                <SelectItem value="6">6+ Beds</SelectItem>
              </SelectContent>
            </Select>

            {/* Interactive Price Range Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex h-9 sm:h-8 items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] sm:text-[11px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 data-[state=open]:bg-white/20">
                  {minPrice || maxPrice ? 'Price Set' : 'Price Range'}
                </button>
              </PopoverTrigger>
              <PopoverContent sideOffset={4} className="w-72 rounded-2xl border-white/20 bg-background/95 p-5 shadow-xl backdrop-blur-md" align="center">
                <div className="space-y-4">
                  <h4 className="font-heading text-sm font-bold text-foreground">Select Price Range</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Min</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="h-8 rounded-lg font-mono text-xs" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Max</label>
                      <Input 
                        type="number" 
                        placeholder="Any" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="h-8 rounded-lg font-mono text-xs" 
                      />
                    </div>
                  </div>
                  <Button type="button" variant="default" className="w-full rounded-xl" size="sm" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}>
                    Apply Price
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Active Filter Reset */}
            {(searchQuery || sector || subSector || type || bedrooms || minPrice || maxPrice) && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSector("");
                  setSubSector("");
                  setType("");
                  setBedrooms("");
                  setMinPrice("");
                  setMaxPrice("");
                  router.push("/buy");
                }}
                className="ml-2 text-[11px] font-bold text-white/70 underline underline-offset-4 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mobile CTA Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full sm:hidden mt-2">
            <Button type="button" className="h-14 rounded-full text-sm font-bold shadow-xl bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => router.push("/sell")}>
              Sell Your Property
            </Button>
            <Button type="button" className="h-14 rounded-full text-sm font-bold shadow-xl bg-white text-slate-900 hover:bg-white/90" onClick={() => window.open("https://rentyourproperty.com", "_blank")}>
              Rent Your Property
            </Button>
          </div>

        </form>
      </div>

      {/* Morphing Slide Pagination Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-[7px] rounded-full bg-white transition-all duration-300",
              currentSlide === index ? "w-[24px] opacity-100" : "w-[7px] opacity-50 hover:opacity-75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
