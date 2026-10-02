import { getLocations } from "@/app/actions/locations";
import { LocationManager } from "@/components/admin/location-manager";

export const metadata = {
  title: "Locations | Admin Dashboard",
};

export default async function AdminLocationsPage() {
  const initialData = await getLocations();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Location Manager</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Manage dynamic sectors and sub-sectors for property listings.
        </p>
      </div>

      <LocationManager initialData={initialData} />
    </div>
  );
}
