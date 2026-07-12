import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Leaf, PackageCheck, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAyurvedicProductBySlug, getAyurvedicProducts } from "@/lib/ayurvedic";
import { siteConfig } from "@/lib/site";

type AyurvedicProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getAyurvedicProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: AyurvedicProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getAyurvedicProductBySlug(slug);

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

export default async function AyurvedicProductPage({
  params,
}: AyurvedicProductPageProps) {
  const { slug } = await params;
  const product = await getAyurvedicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAyurvedicProducts();
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(39,90,57,0.06),transparent_40%),linear-gradient(135deg,rgba(39,90,57,0.03),transparent_60%)] pointer-events-none" />

              <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold uppercase tracking-wider text-primary/80">
                    <Link href="/" className="transition hover:text-primary">
                      Home
                    </Link>
                    <span>/</span>
                    <Link href="/services/ayurvedic-products" className="transition hover:text-primary">
                      Ayurvedic Products
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
                    <Link href="/services/ayurvedic-products" className="button-secondary text-sm">
                      Back to collection
                    </Link>
                  </div>
                </div>

                <div className="space-y-6 lg:mt-14">
                  <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-serif text-heading font-medium">Product Snapshot</h3>
                    <div className="mt-6 space-y-3">
                      {product.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted/30 px-4 py-4"
                        >
                          <BadgeCheck className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-accent" />
                          <p className="text-xs font-semibold leading-relaxed text-body">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary p-6 md:p-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                      Wellness Note
                    </p>
                    <p className="mt-4 text-xl font-serif font-light">Traditional Formulation for Holistic Balance</p>
                    <p className="mt-3 text-xs leading-relaxed text-white/70">
                      Our Ayurvedic solutions are prepared in batches matching rigorous parameters, ensuring standard botanical active profiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Suited splits */}
        <section className="section-space pt-0">
          <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl">
              <SectionHeading
                eyebrow="Benefits"
                title="Primary Advantages"
                description={`Discover the organic compounds and holistic wellness benefits of our ${product.name}.`}
              />

              <div className="mt-8 space-y-4">
                {product.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3.5 rounded-xl border border-primary/10 bg-surface-muted/30 px-5 py-4"
                  >
                    <Leaf className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-xs font-semibold leading-relaxed text-body">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl">
              <SectionHeading
                eyebrow="Application Fit"
                title="Best Suited For"
                description="Industry formulations, wellness programs, and consumer retail applications."
              />

              <div className="mt-8 space-y-4">
                {product.idealFor.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-3.5 rounded-xl border border-border bg-surface-muted/20 px-5 py-4"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
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
              description="Standard wholesale packages, custom private label weights, and estimated fulfillment parameters."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="surface-card p-8 bg-surface border border-border rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-heading mb-3">Packaging Options</h3>
                <p className="text-sm leading-relaxed text-muted">{product.packaging}</p>
              </article>

              <article className="surface-card p-8 bg-surface border border-border rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  <ShieldCheck className="h-6 w-6" />
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
                eyebrow="Related Botanicals"
                title="Explore More Ayurvedic Formulations"
                description="Browse related certified organic powders, blends, and herbal ingredients."
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
                    linkLabel="View Product"
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
                  description="Coordinate samples, packaging design, and request destination-specific pricing analysis."
                />

                <div className="space-y-4">
                  {[
                    { icon: "🌿", heading: "100% Pure Botanical", body: `Certified quality ${product.name} sourced under farm-level traceability.` },
                    { icon: "🏷️", heading: "Private Label Execution", body: "Barcode labeling, customized print bags, and packaging options." },
                    { icon: "📄", heading: "Export Standards Certificate", body: "COA, testing validation, phytosanitary clearance documents." },
                    { icon: "⏱️", heading: "Direct Sourcing Desk", body: "Response on availability and custom quotations within one day." },
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
                  messageDefault={`I am interested in sourcing the ${product.name}. Please share pricing, availability, and export requirements.`}
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
                  className="button-primary shadow-xl text-sm shrink-0"
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
