import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { getSettings } from "@/app/actions/settings";

const quickLinks = [
  { href: "/buy", label: "Buy Property" },
  { href: "/sell", label: "Sell Property" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const settings = await getSettings();

  const socialLinks = [
    ...(settings.facebook ? [{ href: settings.facebook, label: "Facebook", icon: FaFacebookF }] : []),
    ...(settings.instagram ? [{ href: settings.instagram, label: "Instagram", icon: FaInstagram }] : []),
    ...(settings.twitter ? [{ href: settings.twitter, label: "Twitter", icon: FaXTwitter }] : []),
    ...(settings.linkedin ? [{ href: settings.linkedin, label: "LinkedIn", icon: FaLinkedinIn }] : []),
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {/* Main grid — stacks on mobile, multi-column on md+ */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/NA logo.png" 
                alt="Next Avenue Logo" 
                width={250} 
                height={80} 
                className="h-16 w-auto object-contain md:h-20"
              />
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Your trusted partner in real estate. We help you sell your
              property with confidence, speed, and transparency.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-sm text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Social + Company Group */}
          <div className="space-y-6">
            {socialLinks.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-lg border border-neutral-700 text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white"
                    >
                      <social.icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                A Next Avenue Company Group
              </h4>
              <p className="text-xs text-neutral-500">
                Part of the Next Avenue family of companies.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-neutral-800" />

        {/* Copyright bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-neutral-500 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Next Avenue. All rights reserved.
          </p>
          <p className="text-center">
            Developed by{" "}
            <a 
              href="https://anthrixtechnologies.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors font-medium hover:underline underline-offset-2"
            >
              Anthrix Technologies
            </a>
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-neutral-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-neutral-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
