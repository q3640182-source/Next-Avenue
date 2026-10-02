"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { type listings } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Listing = InferSelectModel<typeof listings>;

import { deleteListing } from "@/app/actions/listings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/admin/alert-modal";
import { useState } from "react";

function ActionCell({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await deleteListing(listing.id);
    setIsDeleting(false);
    if (res.success) {
      toast.success("Listing deleted successfully!");
      setDeleteOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete listing");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8 p-0 border border-transparent hover:border-border/50">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(listing.id.toString())}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/listings/${listing.id}/edit`}>Edit Listing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:bg-red-50 focus:text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Listing"
        description="Are you sure you want to delete this property listing? This action cannot be undone."
        variant="danger"
        confirmText="Delete Property"
      />
    </>
  );
}

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Property Details
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const listing = row.original;
      let parsedImages = listing.images;
      if (typeof listing.images === "string") {
        try {
          parsedImages = JSON.parse(listing.images);
        } catch (e) {
          parsedImages = [];
        }
      }
      
      const imageUrl = (Array.isArray(parsedImages) && parsedImages.length > 0)
        ? parsedImages[0]
        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

      return (
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200">
            <img
              src={imageUrl}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{listing.title}</span>
            {listing.sector && (
              <span className="text-xs text-slate-500">{listing.sector}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("propertyType")}
      </Badge>
    ),
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      if (isNaN(price)) return "On Request";
      const formatted = new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
      }).format(price);
      return <div className="font-mono">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isPublished = status === "published";
      return (
        <Badge
          variant={isPublished ? "default" : status === "draft" ? "secondary" : "outline"}
          className="capitalize gap-1.5 px-2 py-0.5"
        >
          {isPublished && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell listing={row.original} />,
  },
];
