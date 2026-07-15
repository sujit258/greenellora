"use client";

import { useEffect, useState } from "react";
import { FileText, ExternalLink, Download, Calendar, FolderOpen } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

interface Catalogue {
  _id: string;
  title: string;
  description: string;
  category: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  updatedAt: string;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
    <div className="flex gap-2">
      <div className="h-9 bg-slate-200 rounded-lg w-24" />
      <div className="h-9 bg-slate-200 rounded-lg w-24" />
    </div>
  </div>
);

interface CatalogueSectionProps {
  category: string;
}

export default function CatalogueSection({ category }: CatalogueSectionProps) {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogues() {
      try {
        const res = await fetch(`/api/catalogues?category=${encodeURIComponent(category)}`);
        const data = await res.json();
        if (data.success) setCatalogues(data.data);
      } catch (e) {
        console.error("Failed to fetch catalogues", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogues();
  }, [category]);

  if (loading) {
    return (
      <section className="section-space bg-white">
        <div className="page-shell">
          <SectionHeading
            center
            eyebrow="Resources"
            title="Product Catalogues"
            description="Download detailed catalogues containing product specifications, export packaging, certifications, and company information."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (catalogues.length === 0) {
    return null; // Don't show the section if no catalogues
  }

  return (
    <section className="section-space bg-white">
      <div className="page-shell">
        <SectionHeading
          center
          eyebrow="Resources"
          title="Product Catalogues"
          description="Download detailed catalogues containing product specifications, export packaging, certifications, and company information."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {catalogues.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Icon + Title Row */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 text-base leading-tight group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <FolderOpen className="h-3 w-3" />
                    {cat.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                {cat.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {cat.fileSize}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(cat.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <a
                  href={cat.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-strong transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View PDF
                </a>
                <a
                  href={`${cat.pdfUrl}?fl_attachment=true`}
                  download={`${cat.title}.pdf`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-primary/30 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}