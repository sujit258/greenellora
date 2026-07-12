"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { isNavDropdown, siteConfig, type NavDropdown, type NavLink } from "@/lib/site";

const navItemClassName =
  "nav-link inline-flex h-10 items-center text-sm font-medium transition-all duration-300";

function NavAnchor({ href, label }: NavLink) {
  return (
    <Link href={href} className={navItemClassName}>
      {label}
    </Link>
  );
}

function NavDropdownMenu({ item }: { item: NavDropdown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const closeMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        clearCloseTimeout();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearCloseTimeout();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex h-10 items-center"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        onClick={() => {
          if (open) {
            clearCloseTimeout();
            setOpen(false);
            return;
          }
          openMenu();
        }}
        className={`${navItemClassName} gap-1 whitespace-nowrap`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 pt-2.5 animate-[fadeInUp_0.2s_ease]">
          <div className="nav-dropdown rounded-xl border border-border/80 bg-surface/95 p-1.5 shadow-xl backdrop-blur-md">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="block rounded-lg px-4 py-2.5 text-xs font-semibold text-body transition-all duration-200 hover:bg-primary/5 hover:text-primary"
                onClick={() => {
                  clearCloseTimeout();
                  setOpen(false);
                }}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function NavMenu() {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {siteConfig.nav.map((item) =>
        isNavDropdown(item) ? (
          <NavDropdownMenu key={item.label} item={item} />
        ) : (
          <NavAnchor key={item.href} {...item} />
        ),
      )}
    </nav>
  );
}
