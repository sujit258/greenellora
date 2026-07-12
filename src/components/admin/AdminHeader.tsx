"use client";

import { Menu, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function AdminHeader({ title, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-header-hamburger"
          onClick={onToggleSidebar}
          id="admin-header-menu-btn"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="admin-header-title">{title}</h1>
      </div>
      <div className="admin-header-user">
        <User size={16} />
        Admin
      </div>
    </header>
  );
}
