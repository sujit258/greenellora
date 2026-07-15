"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Video,
  ImageUp,
  FileText,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/banners", label: "Banners", icon: ImageUp },
  { href: "/admin/catalogues", label: "Catalogues", icon: FileText },
  { href: "/admin/service-types", label: "Service Types", icon: Layers },
  { href: "/admin/videos", label: "Videos", icon: Video },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-badge">GE</div>
          <div className="admin-sidebar-brand-text">
            <h2>Green Ellora</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-nav-link ${isActive(item.href, item.exact) ? "active" : ""}`}
                onClick={onClose}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}

          <div className="admin-sidebar-divider" />
          <div className="admin-sidebar-spacer" />
          <div className="admin-sidebar-divider" />

          <button
            className="admin-sidebar-nav-link"
            onClick={handleLogout}
            id="sidebar-nav-logout"
            style={{ cursor: "pointer" }}
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
