"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import CategorySelect from "@/components/admin/CategorySelect";
import { useAdmin } from "@/components/admin/AdminProvider";
import Link from "next/link";
import "../../../../admin.css";

export default function EditAyurvedicProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState<string>("");

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
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const resolvedParams = await params;
      setProductId(resolvedParams.productId);

      try {
        const response = await fetch(`/api/ayurvedic-products/${resolvedParams.productId}`);
        const data = await response.json();

        if (data.success) {
          const product = data.data;
          setFormData({
            slug: product.slug || "",
            name: product.name || "",
            category: product.category || "",
            image: product.image || "",
            summary: product.summary || "",
            description: product.description || "",
            benefits: product.benefits ? product.benefits.join(", ") : "",
            idealFor: product.idealFor ? product.idealFor.join(", ") : "",
            packaging: product.packaging || "",
            leadTime: product.leadTime || "",
            href: product.href || "",
          });
          setImagePreview(product.image || "");
        } else {
          showToast("error", "Failed to load product");
          router.push("/admin/products/ayurvedic");
        }
      } catch (error) {
        showToast("error", "An error occurred");
        router.push("/admin/products/ayurvedic");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params, router, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/ayurvedic-products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          benefits: formData.benefits.split(",").map(b => b.trim()).filter(b => b),
          idealFor: formData.idealFor.split(",").map(i => i.trim()).filter(i => i),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Product updated successfully!");
        router.push("/admin/products/ayurvedic");
      } else {
        showToast("error", data.error || "Failed to update product");
      }
    } catch (error) {
      showToast("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Ayurvedic Product">
        <div className="admin-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading product...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Ayurvedic Product">
      <div className="admin-content">
        <div className="admin-page-header">
          <Link
            href="/admin/products/ayurvedic"
            className="admin-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="admin-title">Edit Ayurvedic Product</h1>
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
                  "Herbal Powder",
                  "Immunity Booster",
                  "Wellness Blend",
                  "Traditional Formula",
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
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <Link
              href="/admin/products/ayurvedic"
              className="admin-btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
