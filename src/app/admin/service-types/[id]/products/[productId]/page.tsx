"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "@/app/admin/admin.css";

export default function EditServiceProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serviceTypeName, setServiceTypeName] = useState("");
  const [form, setForm] = useState({
    slug: "", name: "", image: "", summary: "", description: "",
    benefits: "", highlights: "", materials: "", idealFor: "",
    packaging: "", leadTime: "", href: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/service-types/${params.id}`).then(r => r.json()),
      fetch(`/api/service-products/${params.productId}`).then(r => r.json()),
    ]).then(([typeData, prodData]) => {
      if (typeData.success) setServiceTypeName(typeData.data.name);
      if (prodData.success) {
        const p = prodData.data;
        setForm({
          slug: p.slug || "", name: p.name || "", image: p.image || "",
          summary: p.summary || "", description: p.description || "",
          benefits: Array.isArray(p.benefits) ? p.benefits.join("\n") : "",
          highlights: Array.isArray(p.highlights) ? p.highlights.join("\n") : "",
          materials: Array.isArray(p.materials) ? p.materials.join("\n") : "",
          idealFor: Array.isArray(p.idealFor) ? p.idealFor.join("\n") : "",
          packaging: p.packaging || "", leadTime: p.leadTime || "", href: p.href || "",
        });
      }
    }).catch(() => showToast("error", "Failed to load product"))
    .finally(() => setLoading(false));
  }, [params.id, params.productId, showToast]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { setForm(prev => ({ ...prev, image: data.data.url })); showToast("success", "Image uploaded"); }
      else showToast("error", data.error || "Upload failed");
    } catch { showToast("error", "Upload failed"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/service-products/${params.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: params.id, ...form,
          benefits: form.benefits.split("\n").filter(Boolean),
          highlights: form.highlights.split("\n").filter(Boolean),
          materials: form.materials.split("\n").filter(Boolean),
          idealFor: form.idealFor.split("\n").filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) { showToast("success", "Product updated"); router.push(`/admin/service-types/${params.id}/products`); }
      else showToast("error", data.error || "Failed to update");
    } catch { showToast("error", "Network error"); }
    finally { setSaving(false); }
  }

  if (loading) {
    return <AdminLayout title="Edit Product"><div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div></AdminLayout>;
  }

  return (
    <AdminLayout title={serviceTypeName ? `Edit ${serviceTypeName} Product` : "Edit Product"}>
      <div className="max-w-3xl">
        <Link href={`/admin/service-types/${params.id}/products`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Basic Info {serviceTypeName && <span className="text-sm font-normal text-slate-500">— {serviceTypeName}</span>}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary *</label>
              <textarea required value={form.summary} onChange={(e) => setForm(p => ({ ...p, summary: e.target.value }))} rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea required value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Image</h3>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-sm font-medium">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Change Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {form.image && <img src={form.image} alt="" className="h-16 w-16 object-cover rounded-lg" />}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Details</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Benefits (one per line)</label>
                <textarea value={form.benefits} onChange={(e) => setForm(p => ({ ...p, benefits: e.target.value }))} rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Highlights (one per line)</label>
                <textarea value={form.highlights} onChange={(e) => setForm(p => ({ ...p, highlights: e.target.value }))} rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Materials (one per line)</label>
                <textarea value={form.materials} onChange={(e) => setForm(p => ({ ...p, materials: e.target.value }))} rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ideal For (one per line)</label>
                <textarea value={form.idealFor} onChange={(e) => setForm(p => ({ ...p, idealFor: e.target.value }))} rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Packaging</label>
                <input type="text" value={form.packaging} onChange={(e) => setForm(p => ({ ...p, packaging: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lead Time</label>
                <input type="text" value={form.leadTime} onChange={(e) => setForm(p => ({ ...p, leadTime: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Href</label>
                <input type="text" value={form.href} onChange={(e) => setForm(p => ({ ...p, href: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-strong transition font-semibold text-sm disabled:opacity-50">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}