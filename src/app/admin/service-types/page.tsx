"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Loader2, Package, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../admin.css";

interface ServiceType {
  _id: string;
  name: string;
  slug: string;
  navLabel: string;
  description: string;
  summary: string;
  isActive: boolean;
  order: number;
}

export default function AdminServiceTypesPage() {
  const { showToast } = useAdmin();
  const [types, setTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [navLabel, setNavLabel] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => { fetchTypes(); }, []);

  async function fetchTypes() {
    try {
      const res = await fetch("/api/service-types");
      const data = await res.json();
      if (data.success) setTypes(data.data);
    } catch {
      showToast("error", "Failed to load service types");
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function resetForm() {
    setName(""); setNavLabel(""); setDescription(""); setSummary("");
    setEditing(null); setShowForm(false);
  }

  function startEdit(t: ServiceType) {
    setName(t.name); setNavLabel(t.navLabel);
    setDescription(t.description); setSummary(t.summary);
    setEditing(t._id); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !navLabel.trim()) return;
    setSaving(true);
    try {
      const slug = generateSlug(name);
      const payload = { name: name.trim(), slug, navLabel: navLabel.trim(), description: description.trim(), summary: summary.trim() };

      let res;
      if (editing) {
        res = await fetch(`/api/service-types/${editing}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/service-types", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast("success", editing ? "Service type updated" : "Service type created");
        resetForm();
        fetchTypes();
      } else {
        showToast("error", data.error || "Failed to save");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(t: ServiceType) {
    setTogglingId(t._id);
    try {
      const res = await fetch(`/api/service-types/${t._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !t.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Service type ${t.isActive ? "deactivated" : "activated"}`);
        setTypes((prev) =>
          prev.map((st) => (st._id === t._id ? { ...st, isActive: !st.isActive } : st))
        );
      } else {
        showToast("error", data.error || "Failed to update status");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service type? All products under it will remain but lose their type reference.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/service-types/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Service type deleted");
        setTypes((prev) => prev.filter((t) => t._id !== id));
      } else {
        showToast("error", data.error || "Failed to delete");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout title="Service Types">
      <div className="admin-toolbar">
        <div className="admin-search-box" style={{ maxWidth: 'none', flex: 'none' }}>
          <h2 className="admin-header-title" style={{ fontSize: '1.5rem', margin: 0 }}>Manage Service Types</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Create custom service types (e.g. Handicraft Products, Ayurvedic Products, Export Services)
          </p>
        </div>
        <div className="admin-toolbar-spacer" />
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="admin-btn admin-btn-primary" style={{ height: 'auto', padding: '0.625rem 1.25rem' }}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "New Service Type"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Name <span className="required">*</span></label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Spices" className="admin-form-input" />
              <p className="admin-form-hint" style={{ marginTop: '0.25rem' }}>Slug: {generateSlug(name) || "—"}</p>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Nav Label <span className="required">*</span></label>
              <input type="text" required value={navLabel} onChange={(e) => setNavLabel(e.target.value)}
                placeholder="e.g. Spices" className="admin-form-input" />
            </div>
          </div>
          <div className="admin-form-group" style={{ marginTop: '1rem' }}>
            <label className="admin-form-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="Full description of this service type" className="admin-form-textarea" />
          </div>
          <div className="admin-form-group" style={{ marginTop: '1rem' }}>
            <label className="admin-form-label">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
              rows={2} placeholder="Short summary for cards" className="admin-form-textarea" />
          </div>
          <button type="submit" disabled={saving || !name.trim() || !navLabel.trim()}
            className="admin-btn admin-btn-primary" style={{ marginTop: '1rem', height: 'auto', padding: '0.625rem 1.25rem' }}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : editing ? "Update Service Type" : "Create Service Type"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="admin-spinner-wrapper"><div className="admin-spinner" /></div>
      ) : types.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <Package style={{ width: 48, height: 48, color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--muted)' }}>No service types yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {types.map((t) => (
            <div key={t._id} className="admin-table-wrapper" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{t.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.125rem' }}>/{t.slug} · Nav: {t.navLabel}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                  <Link href={`/admin/service-types/${t._id}/products`}
                    className="admin-btn-ghost admin-btn-icon" title="Manage products">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleToggleStatus(t)}
                    className="admin-btn-ghost admin-btn-icon"
                    title={t.isActive ? "Deactivate" : "Activate"}
                    disabled={togglingId === t._id}>
                    {togglingId === t._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : t.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  <button onClick={() => startEdit(t)}
                    className="admin-btn-ghost admin-btn-icon">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} disabled={deleting === t._id}
                    className="admin-btn-ghost admin-btn-icon">
                    {deleting === t._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {t.description && <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.5rem', lineHeight: 1.5 }} className="line-clamp-2">{t.description}</p>}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, background: t.isActive ? 'rgba(34,197,94,0.1)' : '#f1f5f9', color: t.isActive ? '#16a34a' : '#64748b' }}>
                  {t.isActive ? "Active" : "Inactive"}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Order: {t.order}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}