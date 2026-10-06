"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero-section");
      // Use hero height minus a buffer (80px), fallback to 10 if not found
      const threshold = hero ? hero.offsetHeight - 80 : 10;
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <div className={cn("w-full z-50 top-0 transition-all duration-300", isHome ? "fixed" : "sticky")}>
      <header
        className={cn(
          "w-full transition-all duration-300 border-b",
          (isHome && !scrolled)
            ? "bg-transparent border-transparent"
            : "bg-white dark:bg-background border-border/50 shadow-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/NA logo.png" 
              alt="Next Avenue Logo" 
              width={300} 
              height={80} 
              className="h-16 w-auto object-contain transition-all scale-[1.3] md:scale-[1.5] origin-left"
              priority
            />
          </Link>

          {/* Desktop nav — hidden below md */}
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-sm font-bold transition-colors group",
                    isActive && !isHome
                      ? "text-primary"
                      : (isHome && !scrolled)
                      ? "text-white/90 hover:text-white"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 w-full origin-left transform transition-transform duration-300 ease-out",
                      (isHome && !scrolled) ? "bg-white" : "bg-primary",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA — hidden below md */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="outline" className={cn("border-2 font-bold", (isHome && !scrolled) ? "bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white" : "text-primary hover:text-primary")} asChild>
              <a href="https://rentyourproperty.pk" target="_blank" rel="noopener noreferrer">
                Rent Property
              </a>
            </Button>
            <Button variant="default" className={cn("bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90", (isHome && !scrolled) && "bg-white text-primary hover:bg-white/90")} asChild>
              <Link href="/sell">Sell Property</Link>
            </Button>
          </div>

        {/* Mobile hamburger — visible below md */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", (isHome && !scrolled) ? "text-white hover:bg-white/20" : "")}
              aria-label="Open menu"
            >
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col p-0">
            <SheetHeader className="border-b px-4 py-4">
              <SheetTitle>
                <Image 
                  src="/NA logo.png" 
                  alt="Next Avenue Logo" 
                  width={250} 
                  height={60} 
                  className="h-12 w-auto object-contain scale-110 origin-left"
                />
              </SheetTitle>
            </SheetHeader>

            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              {navLinks.map((link) => (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === link.href
                        ? "bg-muted text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            {/* Sticky CTA at bottom of sheet */}
            <div className="border-t p-4 flex flex-col gap-3">
              <SheetClose asChild>
                <Button variant="outline" className="w-full border-2 text-primary" asChild>
                  <a href="https://rentyourproperty.pk" target="_blank" rel="noopener noreferrer">
                    Rent Your Property
                  </a>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="default" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90" asChild>
                  <Link href="/sell">Sell Your Property</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    </div>
  );
}
