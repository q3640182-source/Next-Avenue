import { AdminModal } from "@/components/admin/modal";
import { ListingForm } from "@/components/admin/listing-form";
import { Plus } from "lucide-react";

export default function NewListingPage() {
  return (
    <AdminModal title="Add New Property Listing" icon={<Plus className="h-5 w-5" />}>
      <ListingForm />
    </AdminModal>
  );
}
