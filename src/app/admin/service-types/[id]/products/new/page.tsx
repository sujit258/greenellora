"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "@/app/admin/admin.css";

export default function NewServiceProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin();
  const [serviceTypeName, setServiceTypeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    slug: "", name: "", image: "", summary: "", description: "",
    benefits: "", highlights: "", materials: "", idealFor: "",
    packaging: "", leadTime: "", href: "",
  });

  useEffect(() => {
    fetch(`/api/service-types/${params.id}`).then(r => r.json()).then(d => {
      if (d.success) setServiceTypeName(d.data.name);
    });
  }, [params.id]);

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({ ...prev, name: value, slug: generateSlug(value), href: `/services/${generateSlug(value)}` }));
    if (fieldErrors.name && value.trim()) {
      setFieldErrors(prev => ({ ...prev, name: '' }));
    }
  }

  function validateForm(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const errors: Record<string, string> = {};

    if (!name) errors.name = "Product name is required.";
    if (!slug) errors.slug = "Slug is required.";
    if (!summary) errors.summary = "Summary is required.";
    if (!description) errors.description = "Description is required.";
    if (!form.image.trim()) errors.image = "Please upload an image.";

    const firstError = Object.keys(errors)[0] as string | undefined;
    if (firstError) {
      event.preventDefault();
      setFieldErrors(errors);
      const field = event.currentTarget.elements.namedItem(firstError) as HTMLElement | null;
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      field?.focus({ preventScroll: true });
      return;
    }

    setFieldErrors({});
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { 
        setForm(prev => ({ ...prev, image: data.data.url })); 
        setFieldErrors(prev => ({ ...prev, image: '' }));
        showToast("success", "Image uploaded"); 
      }
      else showToast("error", data.error || "Upload failed");
    } catch { showToast("error", "Upload failed"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    validateForm(e);
    
    if (Object.keys(fieldErrors).length > 0) {
      showToast("error", "Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/service-products", {
        method: "POST",
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
      if (data.success) { showToast("success", "Product created"); router.push(`/admin/service-types/${params.id}/products`); }
      else showToast("error", data.error || "Failed to create");
    } catch { showToast("error", "Network error"); }
    finally { setLoading(false); }
  }

  return (
    <AdminLayout title={serviceTypeName ? `New ${serviceTypeName} Product` : "New Product"}>
      <div className="max-w-3xl">
        <Link href={`/admin/service-types/${params.id}/products`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6">
          Back to Products
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Basic Info {serviceTypeName && <span className="text-sm font-normal text-slate-500">— {serviceTypeName}</span>}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.name ? 'border-red-500' : 'border-slate-300'}`} />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => { setForm(p => ({ ...p, slug: e.target.value })); if (fieldErrors.slug && e.target.value.trim()) setFieldErrors(prev => ({ ...prev, slug: '' })); }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.slug ? 'border-red-500' : 'border-slate-300'}`} />
                {fieldErrors.slug && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {fieldErrors.slug}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Summary *</label>
              <textarea required value={form.summary} onChange={(e) => { setForm(p => ({ ...p, summary: e.target.value })); if (fieldErrors.summary && e.target.value.trim()) setFieldErrors(prev => ({ ...prev, summary: '' })); }} rows={2}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.summary ? 'border-red-500' : 'border-slate-300'}`} />
              {fieldErrors.summary && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.summary}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea required value={form.description} onChange={(e) => { setForm(p => ({ ...p, description: e.target.value })); if (fieldErrors.description && e.target.value.trim()) setFieldErrors(prev => ({ ...prev, description: '' })); }} rows={4}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.description ? 'border-red-500' : 'border-slate-300'}`} />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Image</h3>
            <div className="flex items-center gap-4">
              <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-200 transition text-sm font-medium ${fieldErrors.image ? 'bg-red-100 text-red-700' : 'bg-slate-100'}`}>
                <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {form.image && <img src={form.image} alt="" className="h-12 w-12 object-cover rounded-lg" />}
            </div>
            {fieldErrors.image && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {fieldErrors.image}
              </p>
            )}
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

          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-strong transition font-semibold text-sm disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}