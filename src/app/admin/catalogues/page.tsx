"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, FileText, ExternalLink, Download, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import DeleteModal from "@/components/admin/DeleteModal";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../admin.css";

interface Catalogue {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  status: "active" | "inactive";
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["Ayurvedic", "Handicraft", "Spices", "Herbs", "Honey", "Tea", "General"];

export default function CataloguesPage() {
  const router = useRouter();
  const { showToast } = useAdmin();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCatalogues = async () => {
    try {
      const res = await fetch("/api/catalogues?all=true");
      const data = await res.json();
      if (data.success) setCatalogues(data.data);
    } catch {
      showToast("error", "Failed to load catalogues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCatalogues(); }, []);

  const filtered = catalogues.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleToggleStatus = async (catalogue: Catalogue) => {
    const newStatus = catalogue.status === "active" ? "inactive" : "active";
    setTogglingId(catalogue._id);
    try {
      const res = await fetch(`/api/catalogues/${catalogue._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Catalogue ${newStatus === "active" ? "activated" : "deactivated"}`);
        setCatalogues((prev) =>
          prev.map((c) => (c._id === catalogue._id ? { ...c, status: newStatus } : c))
        );
      } else {
        showToast("error", data.error || "Failed to update status");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/catalogues/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Catalogue deleted");
        setCatalogues((prev) => prev.filter((c) => c._id !== deleteId));
      } else {
        showToast("error", data.error || "Failed to delete");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Catalogues">
      <div className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-title">Product Catalogues</h1>
          <button onClick={() => router.push("/admin/catalogues/new")} className="admin-btn-primary">
            <Plus className="h-4 w-4" /> Add Catalogue
          </button>
        </div>

        {/* Search & Filter */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search />
            <input type="text" placeholder="Search catalogues..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="admin-filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="text-slate-500">Loading catalogues...</div></div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty-state">
            <FileText className="h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-600 mt-4">No catalogues found</h3>
            <p className="text-slate-500 mt-2">Add your first product catalogue to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat._id}>
                    <td className="font-medium">{cat.title}</td>
                    <td><span className="admin-badge admin-badge-green">{cat.category}</span></td>
                    <td className="text-sm text-slate-500">{cat.fileSize}</td>
                    <td className="text-sm text-slate-500">{cat.displayOrder}</td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        cat.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>{cat.status}</span>
                    </td>
                    <td className="text-sm text-slate-500">{new Date(cat.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-table-actions">
                        <a href={cat.pdfUrl} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" title="View PDF">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={`${cat.pdfUrl}?fl_attachment=true`} download={`${cat.title}.pdf`} className="admin-btn-icon" title="Download">
                          <Download className="h-4 w-4" />
                        </a>
                        <button onClick={() => router.push(`/admin/catalogues/${cat._id}`)} className="admin-btn-icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className="admin-btn-icon"
                          title={cat.status === "active" ? "Deactivate" : "Activate"}
                          disabled={togglingId === cat._id}
                        >
                          {togglingId === cat._id ? (
                            <span className="h-4 w-4 block animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                          ) : cat.status === "active" ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                        <button onClick={() => setDeleteId(cat._id)} className="admin-btn-icon admin-btn-icon-danger" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={deleting}
        itemName="Catalogue"
        itemType="Catalogue"
      />
    </AdminLayout>
  );
}