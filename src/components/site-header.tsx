"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Mail, Phone, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMenu } from "@/components/nav-menu";
import { siteConfig, getActiveServices, type NavLink } from "@/lib/site";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState<NavLink[]>([]);
  const pathname = usePathname();

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    async function loadServices() {
      const services = await getActiveServices();
      setMobileServices(services);
    }
    loadServices();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header className="site-header-wrap">
      {/* ── Announcement Bar ── */}
      <div className="announce-bar">
        <div className="page-shell announce-inner">
          <span className="announce-text">
            Premium Herbs, Spices &amp; Natural Products – Sourced in India, Delivered Worldwide.
          </span>
          <div className="announce-right">
            <a href={`mailto:${siteConfig.email}`} className="announce-link">
              <Mail className="h-3.5 w-3.5" />
              Email Us
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="announce-link">
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phone}
            </a>
            <div className="relative announce-link group">
              <Globe className="h-3.5 w-3.5" />
              <select
                className="appearance-none bg-transparent cursor-pointer text-[0.75rem] font-medium outline-none pr-4"
                defaultValue="en"
                aria-label="Select language"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "en") {
                    alert(`Language pack for ${val} coming soon. Currently the site is in English.`);
                    e.target.value = "en";
                  }
                }}
              >
                <option value="en" className="text-xs">English</option>
                <option value="es" className="text-xs">Español</option>
                <option value="ar" className="text-xs">العربية</option>
                <option value="fr" className="text-xs">Français</option>
                <option value="de" className="text-xs">Deutsch</option>
                <option value="zh" className="text-xs">中文</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="main-header">
        <div className="page-shell main-header-inner">
          <Link href="/" className="brand-mark">
            <img
              src="/logo.png"
              alt="Green Ellora logo"
              className="h-16 w-auto"
            />
          </Link>

          <NavMenu />

          <div className="flex items-center gap-3">
            <Link href="/#contact" className="button-enquire hidden md:inline-flex">
              Enquire Now <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-body hover:text-primary md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-white/98 backdrop-blur-md md:hidden">
          <nav className="flex h-full flex-col overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-1">
              <Link href="/" className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading">
                Home
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <p className="pt-4 text-xs font-bold uppercase tracking-widest text-subtle">Services</p>
              {mobileServices.map((service) => (
                <Link key={service.href} href={service.href} className="flex items-center justify-between border-b border-border/50 py-3 pl-2 text-sm font-medium text-body hover:text-primary">
                  {service.label}
                  <ChevronRight className="h-4 w-4 text-subtle" />
                </Link>
              ))}
              <Link href="/videos" className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading">
                Videos
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link href="/#why-us" className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading">
                Why Us
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link href="/#contact" className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading">
                Contact
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
            </div>
            <div className="mt-auto pt-6">
              <Link href="/#contact" className="button-primary w-full justify-center">
                Send Inquiry
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
