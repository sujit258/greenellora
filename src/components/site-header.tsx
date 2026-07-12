"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMenu } from "@/components/nav-menu";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="main-header">
      <div className="page-shell main-header-inner">
        <Link href="/" className="brand-mark">
          <span className="brand-logo">GE</span>
          <span className="font-serif text-lg font-semibold text-heading hidden sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <NavMenu />

        <div className="flex items-center gap-3">
          <Link href="/#contact" className="button-enquire hidden md:inline-flex">
            Enquire Now
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

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-40 bg-white/98 backdrop-blur-md md:hidden">
          <nav className="flex h-full flex-col overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading"
              >
                Home
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>

              <p className="pt-4 text-xs font-bold uppercase tracking-widest text-subtle">Products</p>
              <Link
                href="/services/ayurvedic-products"
                className="flex items-center justify-between border-b border-border/50 py-3 pl-2 text-sm font-medium text-body hover:text-primary"
              >
                Ayurvedic Products
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link
                href="/services/handicraft-products"
                className="flex items-center justify-between border-b border-border/50 py-3 pl-2 text-sm font-medium text-body hover:text-primary"
              >
                Handicraft Products
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link
                href="/services/export-services"
                className="flex items-center justify-between border-b border-border/50 py-3 pl-2 text-sm font-medium text-body hover:text-primary"
              >
                Export Services
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>

              <Link
                href="/videos"
                className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading"
              >
                Videos
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link
                href="/#why-us"
                className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading"
              >
                Why Us
                <ChevronRight className="h-4 w-4 text-subtle" />
              </Link>
              <Link
                href="/#contact"
                className="flex items-center justify-between border-b border-border py-4 text-base font-semibold text-heading"
              >
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
