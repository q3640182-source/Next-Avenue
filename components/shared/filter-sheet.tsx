"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";

interface FilterValues {
  propertyType: string;
  sector: string;
  subSector: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

interface FilterSheetProps {
  onApply?: (filters: FilterValues) => void;
}

const defaultFilters: FilterValues = {
  propertyType: "",
  sector: "",
  subSector: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
};

import { getLocations } from "@/app/actions/locations";

export function FilterSheet({ onApply }: FilterSheetProps) {
  const [filters, setFilters] = React.useState<FilterValues>(defaultFilters);
  const [locations, setLocations] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  function handleApply() {
    onApply?.(filters);
    setOpen(false);
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col p-0"
      >
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Filter Listings</SheetTitle>
        </SheetHeader>

        {/* Scrollable filters area */}
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Property Type
            </label>
            <Select
              value={filters.propertyType}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, propertyType: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sector
            </label>
            <Select
              value={filters.sector}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, sector: v === "all" ? "" : v, subSector: "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(() => {
            const selectedSector = locations.find((l) => l.name === filters.sector);
            const availableSubSectors = selectedSector?.subSectors || [];
            if (availableSubSectors.length > 0) {
              return (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-foreground">
                    Sub-Sector / Phase
                  </label>
                  <Select
                    value={filters.subSector}
                    onValueChange={(v) =>
                      setFilters((f) => ({ ...f, subSector: v === "all" ? "" : v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All sub-sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sub-Sectors</SelectItem>
                      {availableSubSectors.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.name}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }
            return null;
          })()}

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Price Range (PKR)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minPrice: e.target.value }))
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Bedrooms
            </label>
            <Select
              value={filters.bedrooms}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, bedrooms: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sticky footer with Apply + Reset */}
        <div className="sticky bottom-0 flex gap-2 border-t bg-background p-4">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="default" className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
