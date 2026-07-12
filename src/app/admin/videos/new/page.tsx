"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../admin.css";

export default function NewVideoPage() {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    youtubeId: "",
    category: "",
    thumbnail: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Video created successfully!");
        router.push("/admin/videos");
      } else {
        showToast("error", data.error || "Failed to create video");
      }
    } catch (error) {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Video">
      <div className="admin-content">
        <div className="admin-page-header">
          <button
            onClick={() => router.back()}
            className="admin-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="admin-title">New Video</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Video ID *</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., video-001"
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
                placeholder="e.g., Organic Farming Techniques"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">YouTube ID *</label>
              <input
                type="text"
                name="youtubeId"
                value={formData.youtubeId}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="e.g., dQw4w9WgXcQ"
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
                <option value="Organic Farming">Organic Farming</option>
                <option value="Handicraft Techniques">Handicraft Techniques</option>
                <option value="Ayurvedic Traditions">Ayurvedic Traditions</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Thumbnail URL *</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="admin-form-input"
                placeholder="https://img.youtube.com/vi/ID/maxresdefault.jpg"
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
                rows={4}
                placeholder="Brief video description"
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
              {loading ? "Creating..." : "Create Video"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
