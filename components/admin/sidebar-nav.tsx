"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building, Inbox, FileText, Settings, MapPin } from "lucide-react";

export const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Locations", href: "/admin/locations", icon: MapPin },
  { name: "Listings", href: "/admin/listings", icon: Building },
  { name: "Submissions", href: "/admin/submissions", icon: Inbox },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 px-4 py-4">
      <div className="mb-2 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
        Menu
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon 
              className={cn(
                "size-5 transition-transform duration-300 group-hover:scale-110", 
                isActive ? "text-white" : "text-slate-500 group-hover:text-white"
              )} 
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
