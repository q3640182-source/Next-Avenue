import { db } from "@/lib/db";
import { listings } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminListingsPage() {
  const data = await db.select().from(listings).orderBy(desc(listings.createdAt));

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Listings Portfolio</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage your property listings, update statuses, and control what is visible to the public.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl px-6 font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all text-sm">
          <Link href="/admin/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40 w-full overflow-hidden">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
