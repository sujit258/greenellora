"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, ImageUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import DeleteModal from "@/components/admin/DeleteModal";
import { useAdmin } from "@/components/admin/AdminProvider";
import Image from "next/image";
import "../admin.css";

interface Banner {
  _id: string;
  image: string;
  alt: string;
  title: string;
  titleAccent: string;
  titleEnd: string;
  copy: string;
  order: number;
  active: boolean;
}

export default function BannersPage() {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = async () => {
    try {
      // Fetch all banners including inactive ones for admin
      const res = await fetch("/api/banners?all=true");
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch {
      showToast("error", "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/banners/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Banner deleted successfully");
        setBanners((prev) => prev.filter((b) => b._id !== deleteId));
      } else {
        showToast("error", data.error || "Failed to delete banner");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Homepage Banners">
      <div className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-title">Homepage Banners</h1>
          <button
            onClick={() => router.push("/admin/banners/new")}
            className="admin-btn-primary"
          >
            <Plus className="h-4 w-4" />
            Add Banner
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading banners...</div>
          </div>
        ) : banners.length === 0 ? (
          <div className="admin-empty-state">
            <ImageUp className="h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-600 mt-4">No banners yet</h3>
            <p className="text-slate-500 mt-2">Add your first homepage banner to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Preview */}
                  <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0 bg-slate-100">
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Slide {index + 1}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              banner.active
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {banner.active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-slate-400">
                            Order: {banner.order}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {banner.title}{" "}
                          <span className="text-primary">{banner.titleAccent}</span>{" "}
                          {banner.titleEnd}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {banner.copy}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Alt text: {banner.alt}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/admin/banners/${banner._id}`)}
                          className="admin-btn-icon"
                          title="Edit banner"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(banner._id)}
                          className="admin-btn-icon admin-btn-icon-danger"
                          title="Delete banner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={deleting}
        itemName="Banner"
        itemType="Banner"
      />
    </AdminLayout>
  );
}