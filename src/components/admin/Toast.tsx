"use client";

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useAdmin } from "./AdminProvider";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export default function Toast() {
  const { toasts, dismissToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="admin-toast-container">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`admin-toast ${toast.type} ${toast.exiting ? "exiting" : ""}`}
          >
            <Icon className="admin-toast-icon" />
            <span className="admin-toast-message">{toast.message}</span>
            <button
              className="admin-toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
              id={`toast-close-${toast.id}`}
            >
              <X size={16} />
            </button>
            <div className="admin-toast-progress" />
          </div>
        );
      })}
    </div>
  );
}
