import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServicePageBySlug, servicePages } from "@/lib/services";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return servicePages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.cardTitle,
    description: service.description,
    alternates: {
      canonical: service.href,
    },
    openGraph: {
      title: `${service.cardTitle} | ${siteConfig.name}`,
      description: service.description,
      url: `${siteConfig.url}${service.href}`,
    },
    twitter: {
      title: `${service.cardTitle} | ${siteConfig.name}`,
      description: service.description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServicePageBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = servicePages.filter((page) => page.slug !== service.slug).slice(0, 2);

  return (
    <div className="relative">
      <SiteHeader />
      <main>
        {/* Intro Hero Shell */}
        <section className="section-space overflow-hidden">
          <div className="page-shell">
            <div className="surface-card relative overflow-hidden px-8 py-12 md:px-16 md:py-20 rounded-3xl border border-border">
              {/* Organic overlay gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,138,4,0.06),transparent_40%),linear-gradient(135deg,rgba(56,93,50,0.03),transparent_60%)] pointer-events-none" />
              
              <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold uppercase tracking-wider text-primary/80">
                    <Link href="/" className="transition hover:text-primary">
                      Home
                    </Link>
                    <span>/</span>
                    <span className="text-subtle">{service.navLabel}</span>
                  </div>

                  <p className="section-kicker mt-4">{service.eyebrow}</p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-heading leading-tight max-w-2xl">
                    {service.title}
                  </h1>
                  <p className="text-sm sm:text-base leading-relaxed text-muted max-w-xl">
                    {service.description}
                  </p>

                  <div className="pt-4 flex flex-col gap-4 sm:flex-row">
                    <Link href="/#contact" className="button-primary text-sm gap-2">
                      Request a quote
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href={slug === "handicraft-products" ? "/services/handicraft-products" : slug === "ayurvedic-products" ? "/services/ayurvedic-products" : "/#products"} className="button-secondary text-sm">
                      Browse Collection
                    </Link>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-surface-muted/30 p-6 md:p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-serif text-heading font-medium">Service Outline</h3>
                    <div className="mt-6 space-y-3">
                      {service.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-4.5"
                        >
                          <BadgeCheck className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-accent" />
                          <p className="text-xs font-semibold leading-relaxed text-body">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary p-6 md:p-8 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                      Export Ready Support
                    </p>
                    <p className="mt-4 text-xl font-serif font-light">
                      Compliance and coordination backed by Green Ellora standards.
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-white/70">
                      Share product details, destination market preferences, and packaging dimensions and let our coordinators outline the path.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Sections */}
        <section className="section-dark section-space">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Catalog Overview"
              title={service.catalogTitle}
              description={service.catalogDescription}
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {service.catalogSections.map((section) => (
                <article key={section.title} className="surface-card h-full p-8 bg-surface border border-border rounded-2xl">
                  <h3 className="text-2xl font-serif font-medium text-heading mb-3">{section.title}</h3>
                  <p className="text-xs leading-relaxed text-muted mb-6">{section.description}</p>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs font-medium text-body">
                        <BadgeCheck className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-accent" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Splits */}
        <section className="section-space pt-0">
          <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl">
              <SectionHeading
                eyebrow="Sourcing Promise"
                title={service.promiseTitle}
                description="Each export process is managed by direct coordination, regular batch testing, and clear client milestones."
              />

              <div className="mt-8 space-y-4">
                {service.promisePoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3.5 rounded-xl border border-primary/10 bg-surface-muted/30 px-5 py-4"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-xs font-semibold leading-relaxed text-body">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-8 md:p-10 bg-surface border border-border rounded-3xl flex flex-col justify-between">
              <div>
                <p className="section-kicker">Also Explore</p>
                <h3 className="mt-4 text-3xl font-serif font-light text-heading mb-4">
                  Alternative Sourcing Lines
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Explore other export portfolios and trade coordination lines managed under our unified global standards.
                </p>

                <div className="mt-8 space-y-4">
                  {relatedServices.map((relatedService) => (
                    <Link
                      key={relatedService.slug}
                      href={relatedService.href}
                      className="block rounded-xl border border-border bg-surface-muted/30 px-5 py-5 transition-all duration-300 hover:border-primary/30 hover:bg-surface"
                    >
                      <p className="text-base font-serif font-medium text-heading">{relatedService.cardTitle}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{relatedService.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        View details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic CTA Banner */}
        <section className="pb-24">
          <div className="page-shell">
            <div className="cta-band">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#fef9c3]">
                    Request Custom Specifications?
                  </p>
                  <h2 className="mt-4 text-3xl font-serif font-light text-white md:text-5xl leading-tight">
                    Let&apos;s Detail Your {service.cardTitle} Sourcing.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
                    Coordinate packaging pouches, sample requirements, custom configurations, and certificate documents with our trade desk coordinators.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col shrink-0">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Email coordination
                  </a>
                  <Link
                    href="/#contact"
                    className="button-primary bg-white text-primary-dark hover:bg-accent-soft hover:text-primary-dark shadow-xl text-sm"
                  >
                    Request a quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
