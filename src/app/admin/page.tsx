"use client";

import { useEffect, useState } from "react";
import { Layers, Package, Video, ImageUp, TrendingUp, PlusCircle, Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "./admin.css";

interface Stats {
  serviceTypes: number;
  totalProducts: number;
  videos: number;
  banners: number;
}

export default function AdminDashboard() {
  const { showToast } = useAdmin();
  const [stats, setStats] = useState<Stats>({
    serviceTypes: 0,
    totalProducts: 0,
    videos: 0,
    banners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [typesRes, productsRes, videosRes, bannersRes] = await Promise.all([
          fetch("/api/service-types"),
          fetch("/api/service-products"),
          fetch("/api/videos"),
          fetch("/api/banners?all=true"),
        ]);

        const typesData = await typesRes.json();
        const productsData = await productsRes.json();
        const videosData = await videosRes.json();
        const bannersData = await bannersRes.json();

        setStats({
          serviceTypes: typesData.success ? typesData.data.length : 0,
          totalProducts: productsData.success ? productsData.data.length : 0,
          videos: videosData.success ? videosData.data.length : 0,
          banners: bannersData.success ? bannersData.data.length : 0,
        });
      } catch (error) {
        showToast("error", "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [showToast]);

  const statCards = [
    {
      title: "Service Types",
      value: stats.serviceTypes,
      icon: Layers,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/service-types",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-green-50 text-green-600",
      href: "/admin/service-types",
    },
    {
      title: "Banners",
      value: stats.banners,
      icon: ImageUp,
      color: "bg-orange-50 text-orange-600",
      href: "/admin/banners",
    },
    {
      title: "Videos",
      value: stats.videos,
      icon: Video,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/videos",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome to Admin Panel</h2>
          <p className="mt-2 text-slate-600">Overview of your content and statistics</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading statistics...</div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.title}
                  href={card.href}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:border-primary/30 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{card.title}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <a
                href="/admin/banners/new"
                className="block p-4 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <ImageUp className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Add New Banner</p>
                    <p className="text-sm text-slate-600">Create a new homepage banner with image and text</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/service-types"
                className="block p-4 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Manage Service Types</p>
                    <p className="text-sm text-slate-600">Create and manage service types & their products</p>
                  </div>
                </div>
              </a>
              <a
                href="/admin/videos/new"
                className="block p-4 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Add New Video</p>
                    <p className="text-sm text-slate-600">Upload a new video to the gallery</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Database Connection</p>
                  <p className="text-sm text-slate-600">Connected to MongoDB Atlas</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">API Status</p>
                  <p className="text-sm text-slate-600">All endpoints operational</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
