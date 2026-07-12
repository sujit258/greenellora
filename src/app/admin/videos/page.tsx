"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Play } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/components/admin/AdminProvider";
import "../admin.css";

type Video = {
  _id: string;
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  thumbnail: string;
  createdAt: string;
};

export default function AdminVideos() {
  const { showToast } = useAdmin();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data);
      }
    } catch (error) {
      showToast("error", "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this video?")) return;
    if (!id) {
      showToast("error", "Invalid video ID");
      return;
    }

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        showToast("success", "Video deleted successfully");
        fetchVideos();
      } else {
        showToast("error", data.error || "Failed to delete video");
      }
    } catch (error) {
      showToast("error", "Failed to delete video");
    }
  }

  const filteredVideos = videos.filter((videoitem) =>
    videoitem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    videoitem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Videos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Videos</h2>
            <p className="mt-1 text-slate-600">Manage your video gallery</p>
          </div>
          <a
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-primary-strong transition"
          >
            <Plus className="h-4 w-4" />
            Add Video
          </a>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-500">Loading videos...</div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No videos found</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((videoitem) => (
              <div key={videoitem.id || videoitem._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={videoitem.thumbnail}
                    alt={videoitem.title}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${videoitem.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/90">
                      <Play className="h-5 w-5 text-slate-900 ml-1" />
                    </div>
                  </a>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 truncate">{videoitem.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{videoitem.category}</p>
                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={`https://www.youtube.com/watch?v=${videoitem.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-strong"
                    >
                      View on YouTube
                    </a>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/videos/${videoitem.id || videoitem._id}/edit`}
                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(videoitem.id || videoitem._id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
