"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, ShieldCheck, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Signed in successfully");
        router.push("/admin");
        router.refresh(); 
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Brand Panel */}
      <div className="relative hidden w-full flex-col bg-slate-900 p-12 lg:flex lg:w-1/2 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-accent/20 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
              <Home className="size-4" />
              Return to Website
            </Link>
          </div>
          
          <div className="max-w-xl">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
              Next Avenue <br />
              <span className="text-primary-foreground/60">Core System.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-md">
              Securely manage your premium real estate listings, analyze market submissions, and publish insights across Pakistan.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>Enterprise Grade</span>
            <div className="size-1.5 rounded-full bg-slate-700" />
            <span>Encrypted Access</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-12 relative overflow-hidden">
        {/* Subtle background element for right side */}
        <div className="absolute -top-40 -right-40 h-[300px] w-[300px] rounded-full bg-slate-50 blur-[60px] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          
          <div className="mb-10 lg:hidden">
             <Link href="/" className="inline-block">
               <Image 
                  src="/NA logo.png" 
                  alt="Next Avenue" 
                  width={200} 
                  height={64} 
                  className="h-12 w-auto object-contain"
                />
             </Link>
          </div>

          <div className="hidden lg:flex mb-12 justify-center">
             <Link href="/" className="inline-block">
               <Image 
                  src="/NA logo.png" 
                  alt="Next Avenue" 
                  width={250} 
                  height={80} 
                  className="h-20 w-auto object-contain scale-[1.3]"
                />
             </Link>
          </div>

          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your executive credentials to securely sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nextavenue.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium focus-visible:ring-primary/20 transition-all hover:bg-slate-100/50"
              />
            </div>
            
            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-xl bg-slate-50 border-slate-200 px-4 text-sm font-medium focus-visible:ring-primary/20 transition-all hover:bg-slate-100/50"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="group mt-8 h-14 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              {isLoading ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                <>
                  Authenticate Access
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
