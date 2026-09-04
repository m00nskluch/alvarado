'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/database.types';
import ProductCard from '@/components/ProductCard';
import { Search, X, SearchX } from 'lucide-react';

interface ProductGridProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
}

type PillarCategory = 'all' | 'plasticos' | 'limpieza' | 'frutas-y-verduras';

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function ProductGrid({ initialProducts = [], title, subtitle }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<PillarCategory>('all');
  const [visibleCount, setVisibleCount] = useState(18);

  const pillars = [
    { id: 'all' as PillarCategory, label: 'Todos', icon: '🏠' },
    { id: 'plasticos' as PillarCategory, label: 'Plásticos', icon: '🧃' },
    { id: 'limpieza' as PillarCategory, label: 'Limpieza', icon: '🧹' },
    { id: 'frutas-y-verduras' as PillarCategory, label: 'Frutas y Verduras', icon: '🥑' },
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filter by Pillar Category
      if (activeCategory !== 'all') {
        const catId = (product.category_id || '').toLowerCase();
        const name = normalizeText(product.name);

        if (activeCategory === 'plasticos') {
          const isPlastic = catId.includes('plastic') || name.includes('bidon') || name.includes('balde') || name.includes('bolsa') || name.includes('contenedor');
          if (!isPlastic) return false;
        } else if (activeCategory === 'limpieza') {
          const isClean = catId.includes('limpie') || name.includes('cloro') || name.includes('detergente') || name.includes('desinfectante') || name.includes('papel') || name.includes('amonio');
          if (!isClean) return false;
        } else if (activeCategory === 'frutas-y-verduras') {
          const isFresh = catId.includes('fruta') || catId.includes('verdura') || name.includes('papa') || name.includes('cebolla') || name.includes('tomate') || name.includes('manzana');
          if (!isFresh) return false;
        }
      }

      // Filter by Search Query
      if (searchTerm.trim()) {
        const query = normalizeText(searchTerm);
        const matchName = normalizeText(product.name).includes(query);
        const matchStock = normalizeText(product.stock_quantity || '').includes(query);
        if (!matchName && !matchStock) return false;
      }

      return true;
    });
  }, [searchTerm, activeCategory, initialProducts]);

  const handleCategoryChange = (cat: PillarCategory) => {
    setActiveCategory(cat);
    setVisibleCount(18);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(18);
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section className="space-y-6 px-2 sm:px-4">
      {(title || subtitle) && (
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          {title && (
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Capsule Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar envases, bolsas, detergente, papas..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-white border border-slate-200 rounded-full shadow-xs focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm.length > 0 && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sticky 3-Pillar Category Filter Navigation Bar */}
      <div className="sticky top-14 sm:top-20 z-30 bg-white/95 backdrop-blur-md py-2 px-1 border-b border-slate-100/90 shadow-xs rounded-2xl">
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none py-1">
          {pillars.map((pillar) => {
            const isActive = activeCategory === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => handleCategoryChange(pillar.id)}
                className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                    : 'bg-slate-100/80 hover:bg-emerald-50 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{pillar.icon}</span>
                <span>{pillar.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Mobile Grid ("3 Pilares") */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button for Progressive Loading */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center pt-6 pb-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Cargar más productos (mostrando {displayedProducts.length} de {filteredProducts.length})
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 px-4 bg-emerald-50/40 border border-dashed border-emerald-200/80 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No encontramos productos disponibles
          </h3>
          <p className="text-slate-600 text-xs max-w-md mx-auto">
            Intenta cambiar de pilar o limpia la búsqueda para explorar todo el catálogo.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
