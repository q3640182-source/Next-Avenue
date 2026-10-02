import { db } from "@/lib/db";
import { sellSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SubmissionsTable } from "@/components/admin/submissions-table";

export default async function AdminSubmissionsPage() {
  const data = await db.select().from(sellSubmissions).orderBy(desc(sellSubmissions.createdAt));

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Sell Requests</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Monitor and manage incoming property valuation and listing requests from your clients.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40 w-full overflow-hidden">
        <SubmissionsTable data={data} />
      </div>
    </div>
  );
}
