import { getSettings } from "@/app/actions/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight">Site Settings</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage your public contact information and social media links.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-200/40 w-full overflow-hidden">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
