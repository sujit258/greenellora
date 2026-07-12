import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Box, PackageCheck, Palette } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getHandicraftProductBySlug, getHandicraftProducts } from "@/lib/handicrafts";
import { siteConfig } from "@/lib/site";

type HandicraftProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getHandicraftProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: HandicraftProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getHandicraftProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.summary,
    alternates: {
      canonical: product.href,
    },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.summary,
      url: `${siteConfig.url}${product.href}`,
    },
    twitter: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.summary,
    },
  };
}

export default async function HandicraftProductPage({
  params,
}: HandicraftProductPageProps) {
  const { slug } = await params;
  const product = await getHandicraftProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getHandicraftProducts();
  const relatedProducts = allProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <div className="relative">
      <SiteHeader />
      <main>
        {/* Intro Product Hero */}
        <section className="section-space overflow-hidden">
          <div className="page-shell">
            <div className="surface-card relative overflow-hidden px-6 py-10 md:px-12 md:py-16 rounded-3xl border border-border">
              {/* Organic overlay gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,92,56,0.06),transparent_40%),linear-gradient(135deg,rgba(184,92,56,0.03),transparent_60%)] pointer-events-none" />

              <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold uppercase tracking-wider text-primary/80">
                    <Link href="/" className="transition hover:text-primary">
                      Home
                    </Link>
                    <span>/</span>
                    <Link href="/services/handicraft-products" className="transition hover:text-primary">
                      Handicraft Products
                    </Link>
                    <span>/</span>
                    <span className="text-subtle">{product.name}</span>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface-muted/30 p-3 overflow-hidden shadow-inner max-w-lg">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-[800ms] hover:scale-105"
                        priority
                      />
                    </div>
                  </div>

                  <p className="section-kicker mt-6">{product.category}</p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-heading leading-tight max-w-xl">
                    {product.name}
                  </h1>
                  <p className="text-sm sm:text-base leading-relaxed text-muted max-w-lg">
                    {product.description}
                  </p>

                  <div className="pt-4 flex flex-col gap-4 sm:flex-row">
                    <a href="#enquiry-form" className="button-primary text-sm gap-2">
                      Get the Product
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link href="/services/handicraft-products" className="button-secondary text-sm">
                      Back to collection
                    </Link>
                  </div>
                </div>

                <div className="space-y-6 lg:mt-14">
                  <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-serif text-heading font-medium">Design Snapshot</h3>
                    <div className="mt-6 space-y-3">
                      {product.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted/30 px-4 py-4"
                        >
                          <BadgeCheck className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-accent" />
                          <p className="text-xs font-semibold leading-relaxed text-body">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary p-6 md:p-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                      Artisan Note
                    </p>
                    <p className="mt-4 text-xl font-serif font-light">Handcrafted using Time-Honored Methods</p>
                    <p className="mt-3 text-xs leading-relaxed text-white/70">
                      Each piece is crafted by skilled Indian maker groups, preserving heritage skills and bringing unique warmth to modern interiors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Materials & Suited splits */}
        <section className="section-space pt-0">
          <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl">
              <SectionHeading
                eyebrow="Materials"
                title="Sourced Finishes"
                description={`Explore the authentic natural materials and artisan elements used in our ${product.name}.`}
              />

              <div className="mt-8 space-y-4">
                {product.materials.map((material) => (
                  <div
                    key={material}
                    className="flex items-start gap-3.5 rounded-xl border border-primary/10 bg-surface-muted/30 px-5 py-4"
                  >
                    <Palette className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-xs font-semibold leading-relaxed text-body">{material}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl">
              <SectionHeading
                eyebrow="Commercial Fit"
                title="Best Suited For"
                description="Boutique homeware retail programs, corporate wellness gifting, and custom hospitality designs."
              />

              <div className="mt-8 space-y-4">
                {product.idealFor.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-surface-muted/20 px-5 py-4"
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <p className="text-xs font-semibold leading-relaxed text-body">{useCase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Packaging Details */}
        <section className="section-dark section-space">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Logistics Coordination"
              title="Packaging & Dispatched Details"
              description="Standard wholesale packages, custom private label presentation boxes, and estimated production parameters."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="surface-card p-8 bg-surface border border-border rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <Box className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-heading mb-3">Packaging & Labeling</h3>
                <p className="text-sm leading-relaxed text-muted">{product.packaging}</p>
              </article>

              <article className="surface-card p-8 bg-surface border border-border rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-heading mb-3">Fulfillment Timeline</h3>
                <p className="text-sm leading-relaxed text-muted">{product.leadTime}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-space pt-0">
            <div className="page-shell">
              <SectionHeading
                eyebrow="Related Pieces"
                title="Browse More Handicraft Designs"
                description="Explore complementary handcrafted interior accents and lifestyle items."
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.slug}
                    href={relatedProduct.href}
                    name={relatedProduct.name}
                    category={relatedProduct.category}
                    image={relatedProduct.image}
                    summary={relatedProduct.summary}
                    linkLabel="View Details"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enquiry form splits */}
        <section id="enquiry-form" className="section-space scroll-mt-24">
          <div className="page-shell">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-8">
                <SectionHeading
                  eyebrow="Product Request"
                  title={`Enquire About ${product.name}`}
                  description="Coordinate presentation packaging design, custom sample production runs, and global delivery quotes."
                />

                <div className="space-y-4">
                  {[
                    { icon: "📦", heading: "Sample Development", body: `Request design or structural sample finishes of the ${product.name}.` },
                    { icon: "🏷️", heading: "Custom Packaging & Brand", body: "Coordinate barcoding, tags, insert cards, and custom gift boxes." },
                    { icon: "📄", heading: "Safe Ocean/Air Packaging", body: "Drop-tested export-grade cartoning and bubble wrap buffers." },
                    { icon: "⏱️", heading: "Direct Craft Desk", body: "Direct timeline coordination and quote analysis within 24 hours." },
                  ].map((item) => (
                    <div key={item.heading} className="surface-card flex items-start gap-4 p-5 bg-surface border border-border rounded-xl">
                      <span className="text-2xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-serif text-base text-heading font-semibold">{item.heading}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6 md:p-10 bg-surface border border-border rounded-3xl shadow-xl">
                <QuoteForm
                  lockedProduct={product.name}
                  productReference={product.slug}
                  productPageUrl={`${siteConfig.url}${product.href}`}
                  enquiryTypeDefault="Bulk Order Pricing"
                  messageDefault={`I am interested in sourcing the ${product.name}. Please share pricing, availability, and lead times.`}
                  submitLabel="Send Product Enquiry"
                  pendingLabel="Sending enquiry..."
                  successHref={product.href}
                  successLabel="Submit another enquiry for this product"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA section banner */}
        <section className="pb-24">
          <div className="page-shell">
            <div className="cta-band">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#fef9c3]">
                    Interested in Sourcing?
                  </p>
                  <h2 className="mt-4 text-3xl font-serif font-light text-white md:text-5xl leading-tight">
                    Let&apos;s Detail Your {product.name} Sourcing.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
                    Coordinate custom container loads, request samples, outline your packing layouts, and map timelines with our trade desk coordinators.
                  </p>
                </div>
                <a
                  href="#enquiry-form"
                  className="button-primary bg-white text-primary-dark hover:bg-accent-soft hover:text-primary-dark shadow-xl text-sm shrink-0"
                >
                  Get a quote
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
