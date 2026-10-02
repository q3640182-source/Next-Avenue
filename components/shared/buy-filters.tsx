"use client";

import React, { useState } from "react";
import { Search, MapPin, Building, Bed, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BuyFilters({ params, locations }: { params: Record<string, unknown>, locations: { id: number; name: string; subSectors?: { id: number; name: string }[] }[] }) {
  const [sector, setSector] = useState(params.sector as string || "");
  const [subSector, setSubSector] = useState(params.subSector as string || "");

  const selectedSector = locations.find((l) => l.name === sector);
  const availableSubSectors = selectedSector?.subSectors || [];

  return (
    <form method="GET" action="/buy" className="space-y-6">
      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Search className="size-3.5" /> Keyword Search
        </label>
        <input 
          name="q" 
          type="text" 
          placeholder="Search titles, addresses..." 
          defaultValue={params.q as string || ""} 
          className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20 placeholder:text-slate-400" 
        />
      </div>

      {/* Sector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <MapPin className="size-3.5" /> Sector / Location
        </label>
        <select 
          name="sector" 
          value={sector} 
          onChange={(e) => { setSector(e.target.value); setSubSector(""); }}
          className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20"
        >
          <option value="">All Sectors</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Sub-Sector */}
      {availableSubSectors.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Sub-Sector / Phase
          </label>
          <select 
            name="subSector" 
            value={subSector}
            onChange={(e) => setSubSector(e.target.value)}
            className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20"
          >
            <option value="">All Sub-Sectors</option>
            {availableSubSectors.map((sub: { id: number, name: string }) => (
              <option key={sub.id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Property Type */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Building className="size-3.5" /> Property Type
        </label>
        <select name="type" defaultValue={params.type as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="commercial">Commercial</option>
          <option value="office">Office</option>
          <option value="upper_portion">Upper Portion</option>
          <option value="lower_portion">Lower Portion</option>
          <option value="shop">Shop</option>
          <option value="plot">Plot</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Wallet className="size-3.5" /> Price Range (PKR)
        </label>
        <div className="flex items-center gap-2">
          <input name="min" type="number" placeholder="Min" defaultValue={params.min as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
          <span className="text-slate-400">-</span>
          <input name="max" type="number" placeholder="Max" defaultValue={params.max as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
        </div>
      </div>

      {/* Area */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Building className="size-3.5" /> Area Size
        </label>
        <div className="flex gap-2">
          <input name="minArea" type="number" placeholder="Min" defaultValue={params.minArea as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
          <input name="maxArea" type="number" placeholder="Max" defaultValue={params.maxArea as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20" />
        </div>
        <select name="areaUnit" defaultValue={params.areaUnit as string || "Marla"} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
          <option value="Marla">Marla</option>
          <option value="Kanal">Kanal</option>
          <option value="Sq. Yd.">Sq. Yd.</option>
          <option value="Sq. Ft.">Sq. Ft.</option>
        </select>
      </div>

      {/* Beds & Baths */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Bed className="size-3.5" /> Beds
          </label>
          <select name="beds" defaultValue={params.beds as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Bathrooms
          </label>
          <select name="baths" defaultValue={params.baths as string || ""} className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium text-slate-900 focus:ring-primary/20">
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all">
        Apply Filters
      </Button>

      <Link href="/buy" className="block text-center text-sm font-bold text-slate-400 hover:text-slate-600 underline underline-offset-4">
        Clear All
      </Link>
    </form>
  );
}
