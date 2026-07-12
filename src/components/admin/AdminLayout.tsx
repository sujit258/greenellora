"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useAdmin } from "./AdminProvider";
import { CheckCircle, XCircle, Info, AlertCircle } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, dismissToast } = useAdmin();
  const router = useRouter();

  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getToastColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminHeader title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">{children}</main>
      </div>

      {/* Toast Notifications */}
      <div className="admin-toasts">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`admin-toast ${getToastColor(toast.type)} ${toast.exiting ? "exiting" : ""}`}
          >
            <div className="flex items-center gap-3">
              {getToastIcon(toast.type)}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-current opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
