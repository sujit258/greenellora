"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import Link from "next/link";
import "../../../admin.css";

export default function EditVideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoId, setVideoId] = useState<string>("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    youtubeId: "",
    category: "",
    thumbnail: "",
  });

  useEffect(() => {
    async function loadVideo() {
      const resolvedParams = await params;
      setVideoId(resolvedParams.videoId);
      
      try {
        const response = await fetch(`/api/videos/${resolvedParams.videoId}`);
        const data = await response.json();
        
        if (data.success) {
          const video = data.data;
          setFormData({
            id: video.id || "",
            title: video.title || "",
            description: video.description || "",
            youtubeId: video.youtubeId || "",
            category: video.category || "",
            thumbnail: video.thumbnail || "",
          });
        } else {
          showToast("error", "Failed to load video");
          router.push("/admin/videos");
        }
      } catch (error) {
        showToast("error", "An error occurred");
        router.push("/admin/videos");
      } finally {
        setLoading(false);
      }
    }
    
    loadVideo();
  }, [params, router, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Video updated successfully!");
        router.push("/admin/videos");
      } else {
        showToast("error", data.error || "Failed to update video");
      }
    } catch (error) {
      showToast("error", "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Video">
        <div className="admin-content">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading video...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Video">
      <div className="admin-content">
        <div className="admin-page-header">
          <Link
            href="/admin/videos"
            className="admin-btn-back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="admin-title">Edit Video</h1>
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
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <Link
              href="/admin/videos"
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
