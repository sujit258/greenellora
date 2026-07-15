import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CertificationsStrip } from "@/components/certifications-strip";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import CatalogueSection from "@/components/CatalogueSection";
import { getHandicraftProducts } from "@/lib/handicrafts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<{
  title: string;
  description: string;
}> {
  return {
    title: `Handicraft Products | ${siteConfig.name}`,
    description: "Explore our exquisite collection of traditional handicraft products, including marble coasters, ceramic mugs, brass diyas, and more.",
  };
}

export default async function HandicraftProductsPage() {
  const products = await getHandicraftProducts();

  return (
    <div className="relative">
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="page-shell">
            <SectionHeading
              center
              eyebrow="Our Craft Collection"
              title="Artisanal Handicraft Products"
              description="Discover our exquisite range of traditional handicraft products, handcrafted by skilled Indian artisans using time-honored techniques."
            />
          </div>
        </section>
        <CertificationsStrip />

        <section className="section-space pt-12">
          <div className="page-shell">
            {products.length === 0 ? (
              <div className="mt-12 text-center py-20">
                <p className="text-lg text-muted">No handicraft products available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    variant="detailed"
                    href={`/services/handicraft-products/${product.slug}`}
                    name={product.name}
                    category={product.category}
                    image={product.image}
                    summary={product.summary}
                    tags={product.materials}
                    linkLabel="View Product"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Product Catalogues Section */}
        <CatalogueSection category="Handicraft" />

        {/* CTA Section */}
        <section className="pb-24">
          <div className="page-shell">
            <div className="cta-band text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#fef3c7]">
                Custom Orders Welcome
              </p>
              <h2 className="mt-4 text-3xl font-serif font-light text-white md:text-5xl leading-tight">
                Looking for Something Specific?
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm md:text-base leading-relaxed text-white/80">
                We coordinate custom production runs and bulk orders for all our handicraft items. Contact our design desk to share sketches, packaging needs, or timeline requests.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/#contact" className="button-primary text-sm bg-white text-primary-dark hover:bg-accent-soft hover:text-primary-dark shadow-xl">
                  Request a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
