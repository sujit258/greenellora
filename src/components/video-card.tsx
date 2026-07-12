import Image from "next/image";
import { Play, Youtube } from "lucide-react";
import { getYoutubeThumbnail } from "@/lib/video-utils";

type VideoCardProps = {
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  thumbnail: string;
};

/**
 * Returns true when the URL is a known-safe remote origin that is configured
 * in next.config.ts remotePatterns (YouTube CDN only).
 * Local paths are always safe.
 */
function isSafeForNextImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return hostname === "img.youtube.com" || hostname === "i.ytimg.com";
  } catch {
    return false;
  }
}

export function VideoCard({ title, description, youtubeId, category, thumbnail }: VideoCardProps) {
  const watchUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : "#";
  const imageSrc = thumbnail || getYoutubeThumbnail(youtubeId);

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card group flex flex-col h-full bg-surface"
      aria-disabled={!youtubeId}
    >
      <div className="video-card-thumb relative overflow-hidden rounded-t-[1.25rem]">
        {imageSrc ? (
          isSafeForNextImage(imageSrc) ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
              unoptimized={imageSrc.endsWith(".svg")}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-dark text-white/50">
            <Youtube className="h-12 w-12" />
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-300 group-hover:bg-black/25">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white">
          <Youtube className="h-3 w-3 text-red-500 fill-current" />
          YouTube
        </div>
      </div>
      
      <div className="video-card-body flex flex-col flex-1 p-6">
        <span className="video-card-category self-start mb-2">{category}</span>
        <h3 className="video-card-title text-lg font-serif text-heading font-medium tracking-tight mb-2 min-h-[2.5rem]">
          {title}
        </h3>
        <p className="video-card-description text-sm leading-relaxed text-muted mb-4">
          {description}
        </p>
        <span className="video-card-link mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:text-primary-strong">
          Watch on YouTube
          <Youtube className="h-4 w-4 text-red-500 fill-current transition-transform duration-300 group-hover:scale-110" />
        </span>
      </div>
    </a>
  );
}
