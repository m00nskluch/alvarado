'use client';

import React, { useRef } from 'react';
import { Product } from '@/lib/database.types';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductCarousel({
  products = [],
  title = "Productos Destacados",
  subtitle = "Todo lo que tu negocio y hogar necesitan en un solo lugar",
}: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.clientWidth * 0.75;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4 py-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-emerald-100/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1.5 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selección Especial 🐾</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-600 text-sm mt-0.5 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Navigation Arrow Controls */}
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-white text-emerald-800 border border-slate-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Ver productos anteriores"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-white text-emerald-800 border border-slate-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
            aria-label="Ver siguientes productos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div className="relative group px-1">
        {/* Floating Left Button (Overlay for Large Screens) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-emerald-800 p-3 rounded-full shadow-lg border border-slate-200/80 backdrop-blur-md hover:scale-110 active:scale-95 transition-all items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll Snap Slider */}
        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none py-3 px-0.5"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[265px] sm:w-[285px] md:w-[305px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Floating Right Button (Overlay for Large Screens) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-emerald-800 p-3 rounded-full shadow-lg border border-slate-200/80 backdrop-blur-md hover:scale-110 active:scale-95 transition-all items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

export default ProductCarousel;
