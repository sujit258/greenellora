import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CertificationsStrip } from "@/components/certifications-strip";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import CatalogueSection from "@/components/CatalogueSection";
import { getAyurvedicProducts } from "@/lib/ayurvedic";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<{
  title: string;
  description: string;
}> {
  return {
    title: `Ayurvedic Products | ${siteConfig.name}`,
    description: "Explore our premium range of Ayurvedic products, including immunity boosters, herbal powders, and traditional formulations for holistic wellness.",
  };
}

export default async function AyurvedicProductsPage() {
  const products = await getAyurvedicProducts();

  return (
    <div className="relative">
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="page-shell">
            <SectionHeading
              center
              eyebrow="Our Wellness Collection"
              title="Traditional Ayurvedic Products"
              description="Discover our premium range of Ayurvedic ingredients, organic wellness blends, and botanical inputs prepared to match standard export expectations."
            />
          </div>
        </section>
        <CertificationsStrip />

        <section className="section-space pt-12">
          <div className="page-shell">
            {products.length === 0 ? (
              <div className="mt-12 text-center py-20">
                <p className="text-lg text-muted">No Ayurvedic products available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    variant="detailed"
                    href={`/services/ayurvedic-products/${product.slug}`}
                    name={product.name}
                    category={product.category}
                    image={product.image}
                    summary={product.summary}
                    tags={product.benefits}
                    linkLabel="View Product"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Product Catalogues Section */}
        <CatalogueSection category="Ayurvedic" />

        {/* CTA section */}
        <section className="pb-24">
          <div className="page-shell">
            <div className="cta-band text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                Bulk Sourcing Available
              </p>
              <h2 className="mt-4 text-3xl font-serif font-light text-white md:text-5xl leading-tight">
                Need Large Quantities or Custom Formulations?
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm md:text-base leading-relaxed text-white/80">
                We coordinate wholesale quantities, custom packaging, labeling, and complete export compliance. Reach out to discuss specifications and get a personalized contract quote.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/#contact" className="button-primary text-sm shadow-xl">
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
