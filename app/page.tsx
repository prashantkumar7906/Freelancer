"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/bento-grid";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 grid-tiling pointer-events-none opacity-[0.2] dark:opacity-[0.05]" />

      {/* Navigation */}
      <nav className="h-24 px-8 md:px-20 lg:px-40 flex items-center justify-between transition-all absolute top-0 left-0 right-0 z-50" data-scroll-section>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center text-primary font-black text-xl border border-primary/50">
            F
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground">FreelancePro</span>
        </div>

        <div className="flex items-center space-x-6">
          <ThemeToggle />
          <Link href="/auth" className="hidden md:inline-flex bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full font-bold transition-all text-foreground hover:scale-105 active:scale-95">
            Log In
          </Link>
          <Link href="/auth" className="btn-primary rounded-full px-8 shadow-xl shadow-primary/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Sections */}
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTA />

      {/* Footer */}
      <footer className="py-20 border-t border-border/50 px-8 md:px-20 lg:px-40 bg-background/50 backdrop-blur-sm relative z-10" data-scroll-section>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">F</div>
            <span className="text-xl font-black tracking-tighter text-foreground">FreelancePro</span>
          </div>
          <div className="flex space-x-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 FreelancePro • Built with Passion</p>
        </div>
      </footer>
    </div>
  );
}

