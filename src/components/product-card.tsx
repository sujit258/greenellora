import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ProductCardProps = {
  href: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  tags?: string[];
  linkLabel?: string;
  variant?: "overlay" | "detailed";
};

/**
 * Returns true when the URL is a known-safe remote origin that is configured
 * in next.config.ts remotePatterns (YouTube CDN only).
 * Local paths (/uploads/..., /handicrafts/...) are always safe.
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

/** Renders the image using the right strategy depending on the URL. */
function ProductImage({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return <div className="absolute inset-0 bg-surface-muted" />;
  }

  if (isSafeForNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-focus-visible:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        unoptimized={src.endsWith(".svg")}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      loading="lazy"
    />
  );
}

export function ProductCard({
  href,
  name,
  category,
  image,
  summary,
  tags,
  linkLabel = "View details",
  variant = "overlay",
}: ProductCardProps) {
  if (variant === "detailed") {
    return (
      <Link href={href} className="product-card product-card--detailed group">
        <div className="product-card-image relative overflow-hidden rounded-t-[1.25rem]">
          <ProductImage src={image} alt={name} />
        </div>
        <div className="product-card-body flex flex-col flex-1 p-6 bg-surface">
          <span className="product-card-label self-start mb-3">{category}</span>
          <h3 className="product-card-name text-xl font-serif text-heading font-medium tracking-tight mb-2">
            {name}
          </h3>
          <p className="product-card-text text-sm leading-relaxed text-muted mb-4">
            {summary}
          </p>
          {tags && tags.length > 0 && (
            <div className="product-card-tag-list flex flex-wrap gap-2 mb-6">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="product-card-chip text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="product-card-action mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300">
            {linkLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="product-card product-card--overlay group relative">
      <div className="product-card-image relative overflow-hidden rounded-[1.25rem] aspect-square w-full">
        {/* Normal state: Product Image */}
        <div className="transition-opacity duration-500 ease-out group-hover:opacity-0 w-full h-full absolute inset-0 z-0">
          <ProductImage src={image} alt={name} />
        </div>
        {/* Hover state: Solid details card */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-[var(--surface)] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 border border-[var(--border)] rounded-[1.25rem] z-10">
          <div className="space-y-3">
            <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              {category}
            </span>
            <h3 className="text-lg font-serif font-medium text-[var(--heading-card)] leading-snug line-clamp-2">
              {name}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--body-card)] line-clamp-4">
              {summary}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary-card)] transition-all duration-300">
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
