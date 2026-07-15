"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../admin.css";

const CATEGORIES = ["Ayurvedic", "Handicraft", "Spices", "Herbs", "Honey", "Tea", "General"];

export default function EditCataloguePage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    displayOrder: "0",
    status: "active",
  });

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        const res = await fetch(`/api/catalogues/${params.catalogueId}`);
        const data = await res.json();
        if (data.success) {
          const c = data.data;
          setFormData({
            title: c.title || "",
            description: c.description || "",
            category: c.category || "General",
            displayOrder: String(c.displayOrder ?? 0),
            status: c.status || "active",
          });
          setCurrentPdfUrl(c.pdfUrl || "");
          setPdfName(c.pdfUrl ? c.title + ".pdf" : "");
        } else {
          showToast("error", "Catalogue not found");
          router.push("/admin/catalogues");
        }
      } catch {
        showToast("error", "Failed to load catalogue");
        router.push("/admin/catalogues");
      } finally {
        setFetching(false);
      }
    }
    fetchCatalogue();
  }, [params.catalogueId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("displayOrder", formData.displayOrder);
      fd.append("status", formData.status);
      if (pdfFile) fd.append("pdf", pdfFile);
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      const res = await fetch(`/api/catalogues/${params.catalogueId}`, { method: "PUT", body: fd });
      const data = await res.json();

      if (data.success) {
        showToast("success", "Catalogue updated!");
        router.push("/admin/catalogues");
      } else {
        showToast("error", data.error || "Failed to update");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title="Edit Catalogue">
        <div className="flex items-center justify-center py-12"><div className="text-slate-500">Loading catalogue...</div></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Catalogue">
      <div className="admin-content">
        <div className="admin-page-header">
          <button onClick={() => router.back()} className="admin-btn-back"><ArrowLeft className="h-4 w-4" /> Back</button>
          <h1 className="admin-title">Edit Catalogue</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="admin-form-input" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-form-select" required>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="admin-form-textarea" rows={3} required />
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

            {/* Current PDF */}
            {currentPdfUrl && (
              <div className="admin-form-group admin-form-full">
                <label className="admin-form-label">Current PDF</label>
                <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary underline text-sm">
                  <FileText className="h-4 w-4" /> View current PDF
                </a>
              </div>
            )}

            {/* PDF Upload */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Replace PDF (optional, max 20MB)</label>
              <div className="admin-upload-zone" onClick={() => document.getElementById("edit-pdf")?.click()}>
                <Upload />
                <p>{pdfName || "Click to select a new PDF"}</p>
                <input id="edit-pdf" type="file" accept=".pdf" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPdfFile(f); setPdfName(f.name); }
                }} style={{ display: "none" }} />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Replace Thumbnail (optional)</label>
              <div className="admin-upload-zone" onClick={() => document.getElementById("edit-thumb")?.click()}>
                <Upload />
                <p>{thumbnailFile ? thumbnailFile.name : "Click to select a new thumbnail"}</p>
                <input id="edit-thumb" type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setThumbnailFile(f);
                }} style={{ display: "none" }} />
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => router.back()} className="admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="admin-btn-primary">
              <Save className="h-4 w-4" /> {loading ? "Updating..." : "Update Catalogue"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}