"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../admin.css";

const CATEGORIES = ["Ayurvedic", "Handicraft", "Spices", "Herbs", "Honey", "Tea", "General"];

export default function NewCataloguePage() {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    displayOrder: "0",
    status: "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      showToast("error", "Please select a PDF file");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("displayOrder", formData.displayOrder);
      fd.append("status", formData.status);
      fd.append("pdf", pdfFile);
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      const res = await fetch("/api/catalogues", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        showToast("success", "Catalogue created successfully!");
        router.push("/admin/catalogues");
      } else {
        showToast("error", data.error || "Failed to create catalogue");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="New Catalogue">
      <div className="admin-content">
        <div className="admin-page-header">
          <button onClick={() => router.back()} className="admin-btn-back">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="admin-title">Add New Catalogue</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Catalogue Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="admin-form-input" placeholder="e.g., Handicraft Export Catalogue" required />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-form-select" required>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="admin-form-textarea" rows={3} placeholder="Short description of the catalogue..." required />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="admin-form-input" min="0" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-form-select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* PDF Upload */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">PDF File * (max 20MB)</label>
              <div className="admin-upload-zone" onClick={() => document.getElementById("pdf-upload")?.click()}>
                <Upload />
                <p>{pdfName || "Click to select a PDF file"}</p>
                <input id="pdf-upload" type="file" accept=".pdf,application/pdf" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPdfFile(f); setPdfName(f.name); }
                }} style={{ display: "none" }} />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Thumbnail Image (optional)</label>
              <div className="admin-upload-zone" onClick={() => document.getElementById("thumb-upload")?.click()}>
                <Upload />
                <p>{thumbnailFile ? thumbnailFile.name : "Click to select a thumbnail image"}</p>
                <input id="thumb-upload" type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setThumbnailFile(f);
                }} style={{ display: "none" }} />
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => router.back()} className="admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="admin-btn-primary">
              <Save className="h-4 w-4" /> {loading ? "Uploading..." : "Create Catalogue"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}