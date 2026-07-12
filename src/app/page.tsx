"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CertificationsStrip } from "@/components/certifications-strip";
import { QuoteForm } from "@/components/quote-form";
import { ProductSlider } from "@/components/product-slider";
import { VideoSlider } from "@/components/video-slider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { normalizeVideos, type VideoItem } from "@/lib/video-utils";
import {
  coreServices,
  exportProcess,
  productCategories,
  siteConfig,
  testimonials,
  trustPoints,
} from "@/lib/site";
import chana from "@/assets/chana.jpeg";
import haladi from "@/assets/haladi.jpeg";
import honey from "@/assets/honey.jpeg";
import jaggury from "@/assets/jaggury.jpeg";
import tea from "@/assets/tea.jpeg";

const serviceImages = { honey, jaggury, chana };
const categoryImages = [haladi, honey, chana, tea];

const bannerSlides = [
  {
    src: honey,
    alt: "Organic honey",
    title: "Sourcing India's Best for the Globe",
    copy: "Premium quality organic spices, superfoods, and agro products — delivered with trust and integrity from India.",
  },
  {
    src: haladi,
    alt: "Haladi turmeric",
    title: "Premium Spices from Indian Farms",
    copy: "Certified organic turmeric, chilli, coriander, and spices processed to international food safety standards.",
  },
  {
    src: tea,
    alt: "Organic tea leaves",
    title: "Global Organic Trade Partner",
    copy: "Reliable supply, full documentation, and dedicated export support for importers across 20+ countries.",
  },
  {
    src: jaggury,
    alt: "Organic jaggery",
    title: "Best-in-Class Processing",
    copy: "Every shipment is lab-tested, traceable, and backed by FSSAI, APEDA, and phytosanitary compliance.",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [handicraftProducts, setHandicraftProducts] = useState<any[]>([]);
  const [ayurvedicProducts, setAyurvedicProducts] = useState<any[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  useEffect(() => {
    const autoAdvance = setInterval(handleNext, 7000);
    return () => clearInterval(autoAdvance);
  }, [activeSlide]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [handicraftRes, ayurvedicRes, videosRes] = await Promise.all([
          fetch("/api/handicraft-products"),
          fetch("/api/ayurvedic-products"),
          fetch("/api/videos"),
        ]);

        const handicraftData = await handicraftRes.json();
        const ayurvedicData = await ayurvedicRes.json();
        const videosData = await videosRes.json();

        if (handicraftData.success) setHandicraftProducts(handicraftData.data);
        if (ayurvedicData.success) setAyurvedicProducts(ayurvedicData.data);
        if (videosData.success) setVideos(normalizeVideos(videosData.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart === 0 || touchEnd === 0) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) {
      setActiveSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="hero-slider">
          <div
            ref={bannerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="h-full w-full relative"
          >
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.alt}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  activeSlide === index ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-105"
                }`}
              >
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority={index === 0} />
                <div className="hero-slide-overlay" />
              </div>
            ))}

            <div className="page-shell hero-content">
              <h1 className="hero-title">{bannerSlides[activeSlide].title}</h1>
              <p className="hero-copy">{bannerSlides[activeSlide].copy}</p>
              <div className="hero-actions">
                <a href="#contact" className="button-primary">
                  Enquire Now
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#products" className="button-hero-outline">
                  View Products
                </a>
              </div>
            </div>

            <div className="hero-dots">
              {bannerSlides.map((slide, index) => (
                <button
                  key={slide.alt}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 border-none cursor-pointer ${
                    activeSlide === index ? "bg-white w-8" : "bg-white/40 w-2.5"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <CertificationsStrip />

        {/* Services */}
        <section className="section-space">
          <div className="page-shell">
            <h2 className="section-title text-center">Our Services</h2>
            <div className="cards-grid mt-10">
              {coreServices.map((service, index) => (
                <article
                  key={service.title}
                  className="vistara-card"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="vistara-card-image">
                    <Image
                      src={serviceImages[service.imageKey]}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section id="products" className="section-space scroll-mt-24 bg-white">
          <div className="page-shell">
            <h2 className="section-title text-center">Product Categories</h2>
            <div className="cards-grid mt-10">
              {productCategories.map((category, index) => (
                <article
                  key={category.title}
                  className="vistara-card"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="vistara-card-image">
                    <Image
                      src={categoryImages[index]}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3>{category.title.toUpperCase()}</h3>
                  <p>{category.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Product Sliders */}
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

        {/* Why Trust Us */}
        <section id="why-us" className="trust-section scroll-mt-24">
          <div className="page-shell">
            <h2 className="section-title">Why You Should Trust Us?</h2>
            <div className="trust-points">
              {trustPoints.map((point, index) => (
                <div
                  key={point}
                  className="trust-box flex items-center gap-3"
                  style={{ animationDelay: `${(index + 1) * 0.15}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#005577]" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Export Process */}
        <section className="timeline-section">
          <div className="page-shell">
            <h2 className="section-title">Our Export Process</h2>
            <div className="timeline">
              {exportProcess.map((step, index) => (
                <div key={step} className="timeline-step">
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="page-shell">
            <h2 className="section-title">What Our Clients Say</h2>
            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <blockquote key={item.author} className="testimonial-card">
                  &ldquo;{item.quote}&rdquo;
                  <span className="testimonial-author">— {item.author}</span>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Videos */}
        {!loading && videos.length > 0 && (
          <VideoSlider
            videos={videos}
            title="Sourcing Stories & Craft Processes"
            description="Take an inside look at our farming practices, artisan workshops, and export coordination."
            viewAllHref="/videos"
          />
        )}

        {/* Inquiry Form */}
        <section id="contact" className="section-space scroll-mt-24">
          <div className="page-shell max-w-2xl">
            <h2 className="section-title text-center">Send Your Inquiry</h2>
            <p className="section-copy text-center mx-auto mt-2">
              Share your requirements and our export team will respond within one business day.
            </p>
            <div className="inquiry-section mt-8">
              <QuoteForm />
            </div>
          </div>
        </section>

        {/* Location Map */}
        <section id="location" className="section-space pt-0 scroll-mt-24">
          <div className="page-shell">
            <h2 className="section-title text-center mb-8">Visit {siteConfig.name}</h2>
            <div className="surface-card overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
                <div className="p-8 flex flex-col justify-center text-center lg:text-left">
                  <p className="text-sm leading-relaxed text-muted">
                    Green Ellora Pvt. Ltd. near Ram Mandir, Chandol, taluka Dist. Buldhana — PIN 411057.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Green+Ellora+Pvt.+Ltd+near+Ram+Mandir+Chandol+Dist+Buldhana+411057"
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary mt-6 inline-flex self-center lg:self-start"
                  >
                    Open in Google Maps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="min-h-[18rem] relative lg:min-h-[22rem]">
                  <iframe
                    title="Green Ellora location"
                    src="https://maps.google.com/maps?q=Green+Ellora+Pvt.+Ltd+near+Ram+Mandir+Chandol+Dist+Buldhana+411057&output=embed"
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
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
