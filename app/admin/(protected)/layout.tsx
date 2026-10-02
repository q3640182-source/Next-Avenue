import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, Home, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { UserNav } from "@/components/admin/user-nav";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { AdminSearch } from "@/components/admin/admin-search";
import * as React from "react";

export default async function AdminLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      
      {/* Desktop Sidebar (Dark Professional, Medium Width) */}
      <aside className="hidden w-[250px] flex-col bg-slate-950 md:flex shrink-0 z-10 border-r border-slate-900 shadow-2xl">
        
        {/* Sidebar Header (Logo) */}
        <div className="flex h-32 items-center justify-center border-b border-white/10 px-4 bg-white/5">
          <Link href="/admin" className="flex items-center justify-center w-full transition-transform hover:scale-105">
            <Image 
              src="/NA logo.png" 
              alt="Next Avenue Logo" 
              width={300} 
              height={100} 
              className="h-24 w-auto max-w-full object-contain" 
            />
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-none">
          <SidebarNav />
        </div>
        
        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-white/10 p-4 bg-slate-900/50">
          <Link
            href="/"
            target="_blank"
            className="group flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Home className="size-3.5" />
              Public Site
            </div>
            <ExternalLink className="size-3.5 text-slate-500 group-hover:text-white" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        
        {/* Header (Navbar) */}
        <header className="flex h-20 shrink-0 items-center gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-4 md:px-8 z-20 sticky top-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          
          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col w-[280px] p-0 border-r-0 bg-slate-950">
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                <div className="flex h-32 items-center justify-center border-b border-white/10 px-4 bg-white/5">
                  <Image 
                    src="/NA logo.png" 
                    alt="Next Avenue Logo" 
                    width={300} 
                    height={100} 
                    className="h-24 w-auto max-w-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <div className="flex-1 py-6 overflow-y-auto">
                  <SidebarNav />
                </div>
                <div className="p-4 border-t border-white/10 bg-slate-900/50">
                  <Link
                    href="/"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-accent/20 border border-brand-accent/50 py-3 text-xs font-bold text-white transition-all hover:bg-brand-accent/40"
                  >
                    <Home className="size-4" />
                    Back to Public Site
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <AdminSearch />
          </div>

          {/* Spacer to push items to the right */}
          <div className="flex-1" />
          
          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors h-11 w-11">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-2.5 right-3 size-2 rounded-full bg-red-500 border-2 border-white"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            
            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            {/* User Nav */}
            <UserNav user={{ ...session.user, role: session.user.role ?? undefined, image: session.user.image ?? undefined }} />
          </div>
        </header>

        {/* Dashboard Content - FULL WIDTH */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50/50 w-full relative">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
      {modal}
    </div>
  );
}
