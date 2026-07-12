"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";

type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  href: string;
};

type ProductSliderProps = {
  products: Product[];
  title: string;
  description: string;
  viewAllHref?: string;
};

export function ProductSlider({ products, title, description, viewAllHref }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1.2);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - Math.ceil(itemsPerView));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart === 0 || touchEnd === 0) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const autoAdvance = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(autoAdvance);
  }, [currentIndex, maxIndex]);

  return (
    <section className="section-band section-space">
      <div className="page-shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div className="text-center sm:text-left">
            <p className="section-kicker">Featured Collection</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-copy">{description}</p>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="button-secondary hidden sm:inline-flex shrink-0">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="overflow-hidden py-4 px-1"
          >
            <div
              className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="flex-shrink-0"
                  style={{ flexBasis: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`, maxWidth: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})` }}
                >
                  <ProductCard
                    href={product.href}
                    name={product.name}
                    category={product.category}
                    image={product.image}
                    summary={product.summary}
                    variant="detailed"
                  />
                </div>
              ))}
            </div>
          </div>

          {products.length > Math.floor(itemsPerView) && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="slider-nav-btn absolute left-2 top-1/2 -translate-y-1/2 md:-translate-x-6"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="slider-nav-btn absolute right-2 top-1/2 -translate-y-1/2 md:translate-x-6"
                aria-label="Next products"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`slider-dot w-2 h-2 ${
                      currentIndex === index ? "slider-dot--active" : ""
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {viewAllHref && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="button-secondary w-full"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
