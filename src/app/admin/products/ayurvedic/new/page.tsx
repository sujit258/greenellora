"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../../admin.css";

export default function NewAyurvedicProductPage() {
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
    benefits: "",
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
      const response = await fetch("/api/ayurvedic-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          benefits: formData.benefits.split(",").map(b => b.trim()).filter(b => b),
          idealFor: formData.idealFor.split(",").map(i => i.trim()).filter(i => i),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Product created successfully!");
        router.push("/admin/products/ayurvedic");
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
    <AdminLayout title="New Ayurvedic Product">
      <div className="admin-content">
        <div className="admin-page-header">
          <button
            onClick={() => router.back()}
            className="admin-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="admin-title">New Ayurvedic Product</h1>
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
                placeholder="e.g., immunity-kadha-blend"
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
                placeholder="e.g., Immunity Kadha Blend"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="admin-form-select"
                required
              >
                <option value="">Select category</option>
                <option value="Herbal Powder">Herbal Powder</option>
                <option value="Immunity Booster">Immunity Booster</option>
                <option value="Wellness Blend">Wellness Blend</option>
                <option value="Traditional Formula">Traditional Formula</option>
                <option value="Other">Other</option>
              </select>
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
              <label className="admin-form-label">Benefits (comma-separated)</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="admin-form-textarea"
                rows={3}
                placeholder="e.g., Boosts immunity, Improves digestion, Natural ingredients"
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
                placeholder="e.g., Daily wellness, Seasonal care, Immunity support"
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
                placeholder="e.g., 100g pouch"
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
                placeholder="e.g., 3-5 days"
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
                placeholder="/services/ayurvedic-products/slug"
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
