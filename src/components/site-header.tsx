import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between py-4">
        <a href="#home" className="flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
            GE
          </span>
          <span>{siteConfig.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong md:inline-flex">
          Get Quote
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
