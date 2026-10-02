import { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/app/actions/settings";
import { MapPin, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Next Avenue",
  description: "Get in touch with Next Avenue for any real estate inquiries in Pakistan.",
};

export default async function ContactPage() {
  // Gracefully fetch settings
  let settings = { phone: "", email: "", address: "" };
  try {
    settings = await getSettings();
  } catch (e) {
    // fallback if DB isn't seeded yet
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* ── 1. Hero Section ────────────────────────────────────── */}
      <section className="relative flex h-[350px] md:h-[450px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
            alt="Contact Us"
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Dual Shading Gradients & Glow matching Homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        </div>

        <div className="z-10 flex flex-col items-center text-center px-4 -mt-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-4 block drop-shadow-sm">
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl font-black text-white md:text-5xl lg:text-6xl tracking-tight mb-4 drop-shadow-lg">
            We're Here to Help
          </h1>
          <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl font-medium drop-shadow">
            Whether you are looking to buy, sell, or simply want some expert advice on the current real estate market, our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* ── 2. Contact Grid ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Address Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <MapPin className="size-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Our Office</h3>
            <p className="text-sm text-slate-500 whitespace-pre-line">{settings.address || "Islamabad, Pakistan"}</p>
          </div>

          {/* Phone Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Phone className="size-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Call Us</h3>
            <p className="text-sm text-slate-500 mb-1">Mon-Sat from 9am to 6pm.</p>
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="font-bold text-primary hover:underline mt-1">
              {settings.phone || "+92 300 0000000"}
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Mail className="size-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
            <p className="text-sm text-slate-500 mb-1">We'll respond within 24 hours.</p>
            <a href={`mailto:${settings.email}`} className="font-bold text-primary hover:underline mt-1">
              {settings.email || "info@nextavenue.com"}
            </a>
          </div>
        </div>
      </section>

      {/* ── 3. Form & Map ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 mt-16 md:mt-24">
        <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          {/* Left: Contact Form */}
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Right: Map Placeholder */}
          <div className="flex-1 flex flex-col">
            <div className="w-full flex-1 min-h-[300px] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106198.54415893309!2d72.96695275811771!3d33.61633519842828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b6!2sIslamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
