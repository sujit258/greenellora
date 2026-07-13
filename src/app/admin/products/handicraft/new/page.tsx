"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import CategorySelect from "@/components/admin/CategorySelect";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../../admin.css";

export default function NewHandicraftProductPage() {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    category: "",
    image: "",
    summary: "",
    description: "",
    materials: "",
    highlights: "",
    idealFor: "",
    packaging: "",
    leadTime: "",
    href: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/handicraft-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          materials: formData.materials.split(",").map(m => m.trim()).filter(m => m),
          highlights: formData.highlights.split(",").map(h => h.trim()).filter(h => h),
          idealFor: formData.idealFor.split(",").map(i => i.trim()).filter(i => i),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Product created successfully!");
        router.push("/admin/products/handicraft");
      } else {
        showToast("error", data.error || "Failed to create product");
      }
    } catch (error) {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Handicraft Product">
      <div className="admin-content">
        <div className="admin-page-header">
          <button
            onClick={() => router.back()}
            className="admin-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="admin-title">New Handicraft Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., marble-coaster-collection"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Marble Coaster Collection"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <CategorySelect
                name="category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={[
                  "Marble",
                  "Ceramic",
                  "Brass",
                  "Wood",
                  "Textile",
                  "Other",
                ]}
                required
              />
            </div>

            <ImageUpload
              currentImage={formData.image}
              onImageChange={(path) => setFormData({ ...formData, image: path })}
              label="Product Image *"
            />

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Summary *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="Brief product summary"
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={6}
                placeholder="Detailed product description"
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Materials (comma-separated)</label>
              <textarea
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="e.g., Marble, Stone, Hand-painted"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Highlights (comma-separated)</label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="e.g., Handcrafted, Eco-friendly, Durable"
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Ideal For (comma-separated)</label>
              <textarea
                name="idealFor"
                value={formData.idealFor}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="e.g., Home decor, Gifts, Corporate gifting"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Packaging *</label>
              <input
                type="text"
                name="packaging"
                value={formData.packaging}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., Gift box with foam padding"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Lead Time *</label>
              <input
                type="text"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., 7-10 days"
                required
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Product Page URL *</label>
              <input
                type="text"
                name="href"
                value={formData.href}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="/services/handicraft-products/slug"
                required
              />
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
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
