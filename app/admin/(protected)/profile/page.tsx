import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/admin/profile-form";
import { UserCircle } from "lucide-react";

export const metadata = {
  title: "My Profile | Admin Dashboard",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
          <UserCircle className="h-6 w-6 text-brand-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="mt-8">
        <ProfileForm 
          initialData={{ 
            name: session.user.name, 
            email: session.user.email,
            image: session.user.image
          }} 
        />
      </div>
    </div>
  );
}
