import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { getFlatNavLinks, siteConfig } from "@/lib/site";

export function SiteFooter() {
  const navLinks = getFlatNavLinks();

  return (
    <footer id="contact" className="site-footer">
      <div className="page-shell py-12 md:py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="brand-logo">GE</span>
            <p className="text-xl font-serif font-semibold text-white">{siteConfig.name}</p>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-white/75">
            Premium organic spices, wellness superfoods, artisan handicrafts, and Ayurvedic formulations — exported globally from India with certified traceability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#ffd700]" />
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#ffd700]" />
              {siteConfig.phone}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ffd700]" />
              {siteConfig.location}
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-2">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-white/70 hover:text-[#ffd700]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell py-5 text-center text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} Pvt. Ltd. All rights reserved.
          </p>
          <p className="mt-1 tracking-wide">ORGANIC PRODUCTS MANUFACTURER & EXPORTER</p>
        </div>
      </div>
    </footer>
  );
}
