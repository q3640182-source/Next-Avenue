import { AdminModal } from "@/components/admin/modal";
import { ListingForm } from "@/components/admin/listing-form";
import { Edit2 } from "lucide-react";
import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditListingModalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = parseInt(id);

  if (isNaN(listingId)) {
    notFound();
  }

  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));

  if (!listing) {
    notFound();
  }

  const initialData = {
    ...listing,
    price: listing.price?.toString() || "",
    bedrooms: listing.bedrooms?.toString() || "",
    bathrooms: listing.bathrooms?.toString() || "",
    areaSqft: listing.areaSqft?.toString() || "",
    images: listing.images || [],
  };

  return (
    <AdminModal title="Edit Property Listing" icon={<Edit2 className="h-5 w-5" />}>
      <ListingForm initialData={initialData as any} />
    </AdminModal>
  );
}
