import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Earth,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { QuoteForm } from "@/components/quote-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  highlights,
  markets,
  metrics,
  productCategories,
  siteConfig,
  trustPillars,
  whyChooseUs,
} from "@/lib/site";

const icons = [ShieldCheck, BadgeCheck, Boxes, Truck];

export default function Home() {
  return (
    <div className="relative">
      <SiteHeader />
      <main>
        <section id="home" className="section-space overflow-hidden">
          <div className="page-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="section-kicker">Pure roots. Global reach.</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
                Premium organic & agro exports straight from India.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
                {siteConfig.name} sources and exports certified organic spices, superfoods, pulses, and herbal products
                — delivering authentic Indian quality to buyers and distributors in 20+ countries.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="#products" className="button-primary gap-2">
                  Explore products
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#why-us" className="button-secondary">
                  Discover why buyers choose us
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="glass-card flex items-start gap-3 px-5 py-4">
                    <Leaf className="mt-1 h-5 w-5 text-accent" />
                    <p className="text-sm font-medium text-slate-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-card relative overflow-hidden p-8 md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,155,55,0.18),transparent_32%),linear-gradient(135deg,rgba(15,77,60,0.06),transparent_60%)]" />
                <div className="relative">
                  <div className="inline-flex rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                    Certified organic · Export-grade quality
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-primary/10 bg-white/85 p-5">
                        <p className="text-3xl font-semibold text-primary md:text-4xl">{metric.value}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-3xl bg-primary p-6 text-white">
                    <div className="flex items-center gap-3 text-accent">
                      <Sparkles className="h-5 w-5" />
                      <p className="text-sm font-semibold uppercase tracking-[0.24em]">Positioning</p>
                    </div>
                    <p className="mt-4 text-2xl font-semibold">Nature&apos;s best. Delivered worldwide.</p>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/78">
                      From certified Indian farms to your warehouse — every Green Ellora shipment carries our promise of purity, consistency, and on-time delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="page-shell grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustPillars.map((pillar, index) => {
              const Icon = icons[index];
              return (
                <div key={pillar.title} className="glass-card px-6 py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="products" className="section-space">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Our product range"
              title="Sourced from India's finest farms for the world's best buyers"
              description="Green Ellora offers a curated range of organically grown, carefully processed, and export-compliant Indian products — each category backed by quality documentation and flexible packaging."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {productCategories.map((category, index) => (
                <article
                  key={category.title}
                  className="glass-card group relative overflow-hidden px-7 py-7 transition hover:-translate-y-1"
                >
                  <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-accent/10 blur-3xl transition group-hover:bg-accent/20" />
                  <div className="relative">
                    <div className="inline-flex rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                      Category {index + 1}
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-slate-950">{category.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{category.description}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {category.points.map((point) => (
                        <li key={point} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                          <BadgeCheck className="h-4 w-4 text-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space pt-4">
          <div className="page-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-card overflow-hidden p-8 md:p-10">
              <p className="section-kicker">Our story</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Rooted in India. Trusted by global buyers.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Green Ellora was founded on one belief — that India&apos;s rich agricultural heritage deserves
                a premium export platform built on trust, quality, and transparency. We work directly with
                certified organic farms across India to bring authentic, clean-label products to importers,
                distributors, and retailers around the world.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  "Direct farm partnerships for full supply-chain traceability",
                  "State-of-the-art processing with temperature-controlled grading",
                  "All exports are FSSAI, APEDA & phytosanitary certified",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/4 px-4 py-4">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="why-us" className="space-y-5">
              <SectionHeading
                eyebrow="Why choose Green Ellora"
                title="The sourcing partner that delivers on every promise"
                description="From quality control at origin to on-time delivery at destination — here is what makes Green Ellora the preferred choice for organic import buyers worldwide."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                {whyChooseUs.map((item) => (
                  <div key={item.title} className="glass-card px-6 py-6">
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="markets" className="section-space">
          <div className="page-shell">
            <div className="glass-card overflow-hidden px-8 py-10 md:px-10 md:py-12">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <SectionHeading
                    eyebrow="Worldwide reach"
                    title="Serving organic importers and distributors across 6 continents"
                    description="Green Ellora actively supplies buyers in North America, Europe, the Middle East, Asia-Pacific, and Africa — with export documentation tailored to each destination's import requirements."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {markets.map((market) => (
                    <div key={market} className="rounded-2xl border border-primary/10 bg-primary/4 px-5 py-5">
                      <div className="flex items-center gap-3">
                        <Earth className="h-5 w-5 text-primary" />
                        <p className="font-semibold text-slate-900">{market}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Destination-compliant documentation, competitive FOB pricing, and logistics support.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Get a Quote ── */}
        <section id="contact" className="section-space">
          <div className="page-shell">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              {/* Left: info */}
              <div className="space-y-8">
                <SectionHeading
                  eyebrow="Get a quote"
                  title="Tell us what you need — we'll handle the rest."
                  description="Fill in the form and our export team will get back to you within 24 hours with product availability, pricing, and sample details."
                />

                <div className="space-y-4">
                  {[
                    { icon: "📦", heading: "Free Samples", body: "Request trial samples before committing to a bulk order." },
                    { icon: "🏷️", heading: "Private Label", body: "Your brand, our quality — full custom packaging available." },
                    { icon: "📄", heading: "Full Documentation", body: "COA, MSDS, phytosanitary, and all export certificates included." },
                    { icon: "⏱️", heading: "24-Hour Response", body: "We respond to every enquiry within one business day." },
                  ].map((item) => (
                    <div key={item.heading} className="glass-card flex items-start gap-4 px-5 py-5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-950">{item.heading}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div className="glass-card p-7 md:p-9">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="pb-20">
          <div className="page-shell">
            <div className="rounded-[2rem] bg-primary px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,77,60,0.2)] md:px-12 md:py-14">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Ready to source?</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                    Let&apos;s build a long-term organic sourcing partnership.
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/78">
                    Whether you need a trial order, bulk contract pricing, or a private-label programme — our team is ready to discuss your requirements and provide a detailed quote within 24 hours.
                  </p>
                </div>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-accent-soft">
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
