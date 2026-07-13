"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  Globe,
  Headphones,
  Package,
  Search,
  Shield,
  Ship,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { QuoteForm } from "@/components/quote-form";
import { ProductSlider } from "@/components/product-slider";
import { VideoSlider } from "@/components/video-slider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { normalizeVideos, type VideoItem } from "@/lib/video-utils";
import { coreServices, siteConfig } from "@/lib/site";
import heroBanner1 from "@/assets/hero_banner_1.png";
import heroBanner2 from "@/assets/hero_banner_2.png";
import heroBanner3 from "@/assets/hero_banner_3.png";
import heroBanner4 from "@/assets/hero_banner_4.png";
import heroBanner5 from "@/assets/hero_banner_5.png";
import mixAdrak from "@/assets/mix_adrak.png";
import packaging from "@/assets/packaging.png";
import warehouse from "@/assets/warehouse.png";

/* ─── Data ─── */
const bannerSlides = [
  {
    src: heroBanner1,
    alt: "Premium Indian spices and herbs",
    title: "Premium Indian Herbs &",
    titleAccent: "Agricultural Exports",
    titleEnd: "Worldwide",
    copy: "From authentic sourcing to global delivery, we ensure quality, purity, and trust in every shipment.",
  },
  {
    src: heroBanner2,
    alt: "Organic honey exports",
    title: "Certified Organic",
    titleAccent: "Natural Products",
    titleEnd: "From India",
    copy: "Premium quality organic spices, superfoods, and agro products — delivered with trust from India.",
  },
  {
    src: heroBanner3,
    alt: "Organic tea leaves",
    title: "Your Trusted",
    titleAccent: "Global Trade",
    titleEnd: "Partner",
    copy: "Reliable supply, full documentation, and dedicated export support for importers across 50+ countries.",
  },
  {
    src: heroBanner4,
    alt: "Premium quality products",
    title: "Quality Assured",
    titleAccent: "Export Excellence",
    titleEnd: "From India",
    copy: "Certified organic products with international standards and reliable worldwide logistics.",
  },
  {
    src: heroBanner5,
    alt: "Global delivery network",
    title: "Global Delivery",
    titleAccent: "Network",
    titleEnd: "Worldwide",
    copy: "Shipping to 20+ countries with full documentation and dedicated support throughout the export process.",
  },
];

const trustStrip = [
  { icon: Shield, label: "Trusted by 250+ Buyers", sub: "Worldwide" },
  { icon: Globe, label: "Exporting to 50+", sub: "Countries" },
  { icon: Award, label: "FSSAI, APEDA, ISO &", sub: "Organic Certified" },
  { icon: FileText, label: "Complete Export", sub: "Documentation" },
];

const whyChoose = [
  {
    icon: Shield,
    title: "Premium Quality",
    desc: "Carefully sourced and rigorously tested for purity and authenticity.",
  },
  {
    icon: Award,
    title: "Certified Excellence",
    desc: "FSSAI, APEDA, ISO, Organic & Phytosanitary compliant.",
  },
  {
    icon: Truck,
    title: "Global Delivery",
    desc: "Reliable logistics and on-time delivery across the world.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our team is always here to support your business.",
  },
];

const statsData = [
  { icon: CheckCircle2, value: "250+", label: "Happy Clients" },
  { icon: Globe, value: "50+", label: "Countries Served" },
  { icon: Award, value: "100+", label: "Quality Products" },
  { icon: Truck, value: "98%", label: "On-Time Delivery" },
];

const exportSteps = [
  { icon: Search, label: "Sourcing", desc: "We source the best quality products." },
  { icon: Shield, label: "Quality Check", desc: "Rigorous quality inspection & testing." },
  { icon: Package, label: "Packaging", desc: "Safe & customized packaging." },
  { icon: FileText, label: "Documentation", desc: "Complete export documentation." },
  { icon: Ship, label: "Shipping", desc: "Fast & secure global delivery." },
];

/* ─── Component ─── */
export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [handicraftProducts, setHandicraftProducts] = useState<any[]>([]);
  const [ayurvedicProducts, setAyurvedicProducts] = useState<any[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNext = () => setActiveSlide((p) => (p + 1) % bannerSlides.length);

  useEffect(() => {
    const t = setInterval(handleNext, 6000);
    return () => clearInterval(t);
  }, [activeSlide]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [h, a, v] = await Promise.all([
          fetch("/api/handicraft-products"),
          fetch("/api/ayurvedic-products"),
          fetch("/api/videos"),
        ]);
        const hd = await h.json();
        const ad = await a.json();
        const vd = await v.json();
        if (hd.success) setHandicraftProducts(hd.data);
        if (ad.success) setAyurvedicProducts(ad.data);
        if (vd.success) setVideos(normalizeVideos(vd.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    const d = touchStart - e.changedTouches[0].clientX;
    if (d > 50) handleNext();
    if (d < -50) setActiveSlide((p) => (p - 1 + bannerSlides.length) % bannerSlides.length);
    setTouchStart(0); setTouchEnd(0);
  };

  return (
    <div className="relative">
      <SiteHeader />
      <main>

        {/* ── HERO ── */}
        <section className="hero-slider">
          <div ref={bannerRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="h-full w-full relative">
            {bannerSlides.map((slide, i) => (
              <div
                key={slide.alt}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  activeSlide === i ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-105"
                }`}
              >
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority={i === 0} />
                <div className="hero-slide-overlay" />
              </div>
            ))}

            <div className="page-shell hero-content hero-content-left">
              <div className="hero-text-block">
                <h1 className="hero-title-new">
                  {bannerSlides[activeSlide].title}{" "}
                  <span className="hero-title-accent">{bannerSlides[activeSlide].titleAccent}</span>
                  <br />
                  {bannerSlides[activeSlide].titleEnd}
                </h1>
                <p className="hero-copy">{bannerSlides[activeSlide].copy}</p>
                <div className="hero-actions">
                  <Link href="#contact" className="hero-btn-primary">
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="#services" className="hero-btn-outline">
                    Explore Products <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="hero-dots">
              {bannerSlides.map((slide, i) => (
                <button
                  key={slide.alt}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 border-none cursor-pointer ${
                    activeSlide === i ? "bg-white w-8" : "bg-white/40 w-2.5"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="trust-strip-section">
          <div className="page-shell">
            <div className="trust-strip-grid">
              {trustStrip.map((item, i) => (
                <div key={i} className="trust-strip-item">
                  <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="trust-strip-label">{item.label}</p>
                    <p className="trust-strip-sub">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE GREEN ELLORA ── */}
        <section id="why-us" className="why-section scroll-mt-24">
          <div className="page-shell">
            <div className="section-header-center">
              <p className="section-kicker">WHY CHOOSE GREEN ELLORA</p>
              <h2 className="section-title-dark">Quality You Can Trust, Service You Can Rely On</h2>
            </div>
            <div className="why-grid">
              {whyChoose.map((item) => (
                <div key={item.title} className="why-card">
                  <div className="why-card-icon">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="services-section scroll-mt-24">
          <div className="page-shell">
            <div className="section-header-center">
              <p className="section-kicker">OUR SERVICES</p>
              <h2 className="section-title-dark">Complete Solutions for Global Trade</h2>
            </div>
            <div className="services-grid">
              {[
                { ...coreServices[0], img: mixAdrak,  alt: "Mixed Adrak – Product Sourcing",    icon: <Search  className="h-5 w-5 text-white" /> },
                { ...coreServices[1], img: packaging,  alt: "Custom Packaging Solutions",         icon: <Package className="h-5 w-5 text-white" /> },
                { ...coreServices[2], img: warehouse,  alt: "Warehouse & Logistics",              icon: <Globe   className="h-5 w-5 text-white" /> },
              ].map((service) => (
                <article key={service.title} className="service-card">
                  {/* ── image with overlay + icon badge ── */}
                  <div className="service-card-img">
                    <Image
                      src={service.img}
                      alt={service.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="service-card-overlay" />
                    <div className="service-card-icon-badge">
                      {service.icon}
                    </div>
                  </div>
                  <div className="service-card-body">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.description}</p>
                    <Link href="/#contact" className="service-card-link">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BANNER ── */}
        <section className="stats-banner">
          <div className="page-shell">
            <div className="stats-grid">
              {statsData.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <div className="stat-icon-wrap">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPORT PROCESS ── */}
        <section className="process-section">
          <div className="page-shell">
            <div className="section-header-center">
              <p className="section-kicker">OUR EXPORT PROCESS</p>
              <h2 className="section-title-dark">From India to Your Doorstep</h2>
            </div>
            <div className="process-steps">
              {exportSteps.map((step, i) => (
                <div key={step.label} className="process-step-wrap">
                  <div className="process-step">
                    <div className="process-icon">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="process-step-title">{step.label}</h4>
                    <p className="process-step-desc">{step.desc}</p>
                  </div>
                  {i < exportSteps.length - 1 && (
                    <div className="process-connector" aria-hidden="true">
                      <div className="process-dot" />
                      <div className="process-line" />
                      <div className="process-dot" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DYNAMIC PRODUCT SLIDERS ── */}
        {!loading && (
          <>
            <ProductSlider
              products={handicraftProducts}
              title="Artisanal Handicraft Collections"
              description="Handcrafted decor and lifestyle accessories made by Indian makers for global retail programs."
              viewAllHref="/services/handicraft-products"
            />
            <ProductSlider
              products={ayurvedicProducts}
              title="Organic Ayurvedic Powders & Herbs"
              description="Certified traditional Ayurvedic ingredients, wellness formulations, and botanicals."
              viewAllHref="/services/ayurvedic-products"
            />
          </>
        )}

        {/* ── VIDEO SLIDER ── */}
        {!loading && videos.length > 0 && (
          <VideoSlider
            videos={videos}
            title="Sourcing Stories & Craft Processes"
            description="Take an inside look at our farming practices, artisan workshops, and export coordination."
            viewAllHref="/videos"
          />
        )}

        {/* ── CTA BANNER ── */}
        <section className="cta-banner-section">
          <div className="page-shell">
            <div className="cta-banner-inner">
              {/* Leaf SVG decoration */}
              <div className="cta-leaf-decor" aria-hidden="true">
                <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M40 200 C40 200 20 140 60 100 C100 60 150 50 170 20" stroke="#4a7c23" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M60 100 C60 100 30 90 20 60" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M90 75 C90 75 70 55 50 50" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M120 55 C120 55 110 30 95 22" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                  <ellipse cx="25" cy="55" rx="18" ry="10" transform="rotate(-30 25 55)" fill="#4a7c23" fillOpacity="0.4"/>
                  <ellipse cx="52" cy="44" rx="20" ry="11" transform="rotate(-50 52 44)" fill="#4a7c23" fillOpacity="0.4"/>
                  <ellipse cx="98" cy="18" rx="18" ry="10" transform="rotate(-70 98 18)" fill="#4a7c23" fillOpacity="0.35"/>
                  <ellipse cx="60" cy="98" rx="22" ry="12" transform="rotate(-20 60 98)" fill="#4a7c23" fillOpacity="0.3"/>
                  <ellipse cx="30" cy="88" rx="14" ry="8" transform="rotate(-10 30 88)" fill="#4a7c23" fillOpacity="0.25"/>
                </svg>
              </div>
              <div className="cta-banner-content">
                <h2 className="cta-banner-title">Looking for a Reliable Export Partner?</h2>
                <p className="cta-banner-sub">Let&apos;s build a long-term business relationship.</p>
              </div>
              <Link href="#contact" className="cta-banner-btn">
                Send Your Inquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── INQUIRY FORM ── */}
        <section id="contact" className="contact-section scroll-mt-24">
          <div className="contact-blob contact-blob-1" aria-hidden="true" />
          <div className="contact-blob contact-blob-2" aria-hidden="true" />
          <div className="page-shell contact-shell">
            <div className="contact-grid">
              {/* Left Panel */}
              <div className="contact-left">
                <div className="contact-brand">
                  <span className="brand-logo text-sm">GE</span>
                  <span className="font-serif text-base font-semibold text-heading">Green Ellora</span>
                </div>
                <div className="contact-heading-block">
                  <h2 className="contact-heading">Let&apos;s Grow<br />Together</h2>
                  <p className="contact-subtext">
                    Share your requirements and our export team will get back to you within one business day.
                  </p>
                </div>
                <div className="contact-features">
                  <div className="contact-feature">
                    <div className="contact-feature-icon"><Shield className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h3 className="contact-feature-title">Quality Assured</h3>
                      <p className="contact-feature-text">Premium quality herbs, spices &amp; natural products.</p>
                    </div>
                  </div>
                  <div className="contact-feature">
                    <div className="contact-feature-icon"><Globe className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h3 className="contact-feature-title">Global Delivery</h3>
                      <p className="contact-feature-text">Reliable worldwide shipping with on-time delivery.</p>
                    </div>
                  </div>
                  <div className="contact-feature">
                    <div className="contact-feature-icon"><Headphones className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h3 className="contact-feature-title">Dedicated Support</h3>
                      <p className="contact-feature-text">Our team is always here to support your business.</p>
                    </div>
                  </div>
                </div>
                <div className="contact-leaf-decor" aria-hidden="true">
                  <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M40 200 C40 200 20 140 60 100 C100 60 150 50 170 20" stroke="#4a7c23" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M60 100 C60 100 30 90 20 60" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M90 75 C90 75 70 55 50 50" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M120 55 C120 55 110 30 95 22" stroke="#4a7c23" strokeWidth="2" strokeLinecap="round"/>
                    <ellipse cx="25" cy="55" rx="18" ry="10" transform="rotate(-30 25 55)" fill="#4a7c23" fillOpacity="0.3"/>
                    <ellipse cx="52" cy="44" rx="20" ry="11" transform="rotate(-50 52 44)" fill="#4a7c23" fillOpacity="0.3"/>
                    <ellipse cx="98" cy="18" rx="18" ry="10" transform="rotate(-70 98 18)" fill="#4a7c23" fillOpacity="0.3"/>
                    <ellipse cx="60" cy="98" rx="22" ry="12" transform="rotate(-20 60 98)" fill="#4a7c23" fillOpacity="0.25"/>
                    <ellipse cx="30" cy="88" rx="14" ry="8" transform="rotate(-10 30 88)" fill="#4a7c23" fillOpacity="0.2"/>
                  </svg>
                </div>
              </div>
              {/* Right Panel */}
              <div className="contact-form-card">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
