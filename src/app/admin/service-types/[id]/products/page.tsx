"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../../../admin.css";

interface ProductItem {
  _id: string;
  slug: string;
  name: string;
  image: string;
  summary: string;
  createdAt: string;
}

export default function ServiceTypeProductsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useAdmin();
  const [serviceType, setServiceType] = useState<{ name: string; slug: string } | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [typeRes, prodRes] = await Promise.all([
        fetch(`/api/service-types/${params.id}`).then((r) => r.json()),
        fetch(`/api/service-products?serviceTypeId=${params.id}`).then((r) => r.json()),
      ]);

      if (typeRes.success) setServiceType(typeRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch {
      showToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/service-products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== id));
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
    <AdminLayout title={serviceType ? `${serviceType.name} Products` : "Products"}>
      <div className="admin-toolbar">
        <div className="admin-search-box" style={{ maxWidth: 'none', flex: 'none' }}>
          <Link href="/admin/service-types" className="admin-btn admin-btn-back" style={{ marginBottom: '0.5rem', height: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8125rem', display: 'inline-flex' }}>
            Back
          </Link>
          <h2 className="admin-header-title" style={{ fontSize: '1.5rem', margin: '0.5rem 0 0' }}>
            {serviceType ? serviceType.name : "Loading..."} Products
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Manage products in this service type</p>
        </div>
        <div className="admin-toolbar-spacer" />
        <Link href={`/admin/service-types/${params.id}/products/new`}
          className="admin-btn admin-btn-primary" style={{ height: 'auto', padding: '0.625rem 1.25rem' }}>
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="admin-spinner-wrapper"><div className="admin-spinner" /></div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border)' }}>
          <Package style={{ width: 48, height: 48, color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--muted)' }}>No products in this service type yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Summary</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {product.image && (
                        <img src={product.image} alt="" className="admin-table-thumb" />
                      )}
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>/{product.slug}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--muted)', maxWidth: '12rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.summary}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                      <Link href={`/admin/service-types/${params.id}/products/${product._id}`}
                        className="admin-btn-ghost admin-btn-icon">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id}
                        className="admin-btn-ghost admin-btn-icon">
                        {deleting === product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}