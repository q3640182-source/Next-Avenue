import Image from "next/image";
import { BarChart3, Camera, Megaphone, ShieldCheck, Home, Briefcase, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Next Avenue",
  description: "Learn more about Next Avenue and our story.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* ── 1. Hero Section ────────────────────────────────────── */}
      <section className="relative flex h-[500px] md:h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-neutral-900">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
            alt="Skyscrapers"
            fill
            className="object-cover object-bottom opacity-60"
            priority
          />
          {/* Dual Shading Gradients & Glow matching Homepage */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[140px] md:h-[700px] md:w-[700px]" />
        </div>

        {/* Hero Content */}
        <div className="z-10 flex flex-col items-center text-center px-4 -mt-16">
          <Image
            src="/NA logo.png"
            alt="Next Avenue Logo"
            width={400}
            height={160}
            className="mb-8 h-32 md:h-48 w-auto object-contain drop-shadow-md"
          />
          <p className="mt-4 text-sm font-semibold text-white/90 md:text-base tracking-wide uppercase drop-shadow">
            Building Your Future, One Property at a Time.
          </p>
        </div>
      </section>

      {/* ── 2. Overlapping "Our Story" Card ────────────────────── */}
      <section className="relative z-20 mx-auto max-w-5xl px-4 -mt-32 md:-mt-40">
        <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          {/* Left Text Content */}
          <div className="flex flex-1 flex-col justify-center p-8 md:p-12 lg:p-16">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f3460]">
              Our Story
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold text-slate-900 md:text-4xl">
              Our Story
            </h2>
            <div className="space-y-4 text-[13px] md:text-sm leading-relaxed text-slate-500">
              <p>
                Next Avenue was founded with a singular vision: to revolutionize the property market in Pakistan by providing transparent, trustworthy, and premium real estate services.
              </p>
              <p>
                Over the years, we have grown from a small local agency into a trusted nationwide partner, helping countless families and businesses find their perfect space.
              </p>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative min-h-[300px] flex-1 md:min-h-full bg-slate-50">
            <Image
              src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1000"
              alt="Global Vision"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Who We Are ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 mt-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f3460]">Who We Are</span>
            <h2 className="font-heading text-3xl font-bold text-slate-900 md:text-4xl">Who We Are</h2>
            <p className="text-[13px] md:text-sm leading-relaxed text-slate-500">
              Next Avenue is a dedicated team of real estate professionals, market analysts, and investment consultants. We are passionate about bridging the gap between property owners and serious buyers, bringing innovation and modern marketing strategies to Pakistan's traditional real estate landscape.
            </p>
          </div>
          <div className="relative w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-sm bg-slate-100">
            <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000" fill className="object-cover" alt="Who We Are" />
          </div>
        </div>
      </section>

      {/* ── 4. What We Do ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 mt-24 md:mt-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f3460]">Our Expertise</span>
          <h2 className="mt-3 font-heading text-3xl font-black text-slate-900 md:text-5xl">What We Do</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            We provide an end-to-end real estate experience. Our goal is to sell your property faster, at the best possible price, with zero stress.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Accurate Valuations",
              desc: "Data-driven market analysis to price your property competitively from day one.",
              icon: <BarChart3 className="h-6 w-6 text-[#BE4614]" />,
            },
            {
              title: "Premium Presentation",
              desc: "High-quality photography and virtual tours to make your listing stand out.",
              icon: <Camera className="h-6 w-6 text-[#BE4614]" />,
            },
            {
              title: "Aggressive Marketing",
              desc: "Targeted digital campaigns to reach thousands of qualified buyers quickly.",
              icon: <Megaphone className="h-6 w-6 text-[#BE4614]" />,
            },
            {
              title: "Secure Legal Closings",
              desc: "End-to-end documentation and compliance for a transparent, risk-free transfer.",
              icon: <ShieldCheck className="h-6 w-6 text-[#BE4614]" />,
            }
          ].map((item, i) => (
            <div key={i} className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-100">
                {item.icon}
              </div>
              <h3 className="mb-3 font-heading text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Targeted Customers ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 mt-24 md:mt-32 mb-20">
        <div className="rounded-[40px] bg-slate-950 px-6 py-16 md:p-20 relative overflow-hidden">
          {/* Background Pattern/Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#0f3460] opacity-50 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[#BE4614] opacity-20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="lg:w-1/3 space-y-6 text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Our Audience</span>
              <h2 className="font-heading text-3xl font-black text-white md:text-5xl">Who We Serve</h2>
              <p className="text-base leading-relaxed text-slate-400">
                If you value transparency, speed, and professionalism, Next Avenue is built precisely for you.
              </p>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  title: "Homeowners",
                  desc: "Looking to sell residential properties quickly and at peak market value.",
                  icon: <Home className="h-5 w-5 text-slate-300" />
                },
                {
                  title: "Investors",
                  desc: "Seeking lucrative commercial and residential opportunities in prime sectors.",
                  icon: <Briefcase className="h-5 w-5 text-slate-300" />
                },
                {
                  title: "Expats",
                  desc: "Overseas Pakistanis needing a trustworthy partner for remote transactions.",
                  icon: <Globe className="h-5 w-5 text-slate-300" />
                }
              ].map((audience, i) => (
                <div key={i} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    {audience.icon}
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold text-white">{audience.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{audience.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
