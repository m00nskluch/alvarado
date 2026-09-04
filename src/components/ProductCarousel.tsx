'use client';

import React from 'react';
import { Product } from '@/lib/database.types';
import ProductCard from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';

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
  if (!products || products.length === 0) return null;

  // Duplicamos el array de productos para lograr un bucle infinito continuo sin saltos visuales
  const duplicatedProducts = [...products, ...products];

  return (
    <section className="space-y-4 py-2 overflow-hidden">
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
      </div>

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Soft fade gradients on edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 md:w-16 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 md:w-16 bg-gradient-to-l from-slate-50 to-transparent" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] will-change-transform gap-4 sm:gap-5">
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="shrink-0 w-[240px] sm:w-[265px] md:w-[285px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
