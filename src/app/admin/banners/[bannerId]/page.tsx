"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../admin.css";

interface BannerData {
  image: string;
  alt: string;
  title: string;
  titleAccent: string;
  titleEnd: string;
  copy: string;
  order: number;
  active: boolean;
}

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    image: "",
    alt: "",
    title: "",
    titleAccent: "",
    titleEnd: "",
    copy: "",
    order: "0",
    active: true,
  });

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`/api/banners/${params.bannerId}`);
        const data = await res.json();
        if (data.success) {
          const b = data.data;
          setFormData({
            image: b.image || "",
            alt: b.alt || "",
            title: b.title || "",
            titleAccent: b.titleAccent || "",
            titleEnd: b.titleEnd || "",
            copy: b.copy || "",
            order: String(b.order ?? 0),
            active: b.active ?? true,
          });
        } else {
          showToast("error", "Banner not found");
          router.push("/admin/banners");
        }
      } catch {
        showToast("error", "Failed to load banner");
        router.push("/admin/banners");
      } finally {
        setFetching(false);
      }
    }
    fetchBanner();
  }, [params.bannerId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/banners/${params.bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Banner updated successfully!");
        router.push("/admin/banners");
      } else {
        showToast("error", data.error || "Failed to update banner");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="Edit Banner">
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading banner...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Banner">
      <div className="admin-content">
        <div className="admin-page-header">
          <button onClick={() => router.back()} className="admin-btn-back">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="admin-title">Edit Banner</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <ImageUpload
              currentImage={formData.image}
              onImageChange={(path) => setFormData({ ...formData, image: path })}
              label="Banner Image *"
            />

            <div className="admin-form-group">
              <label className="admin-form-label">Alt Text *</label>
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Premium Indian spices and herbs"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Premium Indian Herbs &"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Title Accent *</label>
              <input
                type="text"
                name="titleAccent"
                value={formData.titleAccent}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Agricultural Exports"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Title End *</label>
              <input
                type="text"
                name="titleEnd"
                value={formData.titleEnd}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Worldwide"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Copy / Description *</label>
              <textarea
                name="copy"
                value={formData.copy}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="Banner description text..."
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-checkbox">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary"
            >
              <Save className="h-4 w-4" />
              {loading ? "Updating..." : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}