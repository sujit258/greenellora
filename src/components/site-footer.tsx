import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 bg-primary-strong text-white">
      <div className="page-shell grid gap-12 py-14 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/65">Green Ellora</p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to import premium organic products from India?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            Reach out to discuss product availability, minimum order quantities, pricing, or to request a free sample shipment for quality evaluation.
          </p>
        </div>

        <div className="space-y-5 rounded-3xl border border-white/10 bg-white/6 p-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-white/60">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="font-medium hover:text-accent">
                {siteConfig.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-white/60">Phone</p>
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="font-medium hover:text-accent">
                {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-white/60">Origin</p>
              <p className="font-medium">{siteConfig.location}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-3 py-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
