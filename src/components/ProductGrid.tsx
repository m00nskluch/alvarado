'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/database.types';
import ProductCard from '@/components/ProductCard';
import { Search, X, PackageX } from 'lucide-react';

interface ProductGridProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ initialProducts = [], title, subtitle }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = (initialProducts || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {(title || subtitle) && (
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          {title && (
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Capsule Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar envases, bolsas kraft, artículos de limpieza..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3.5 pl-12 pr-12 bg-white border border-slate-200 rounded-full shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Items Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-emerald-50/40 border border-dashed border-emerald-200/80 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <PackageX className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">
            No se encontraron coincidencias para &quot;{searchTerm}&quot;
          </h3>
          <p className="text-slate-600 text-xs max-w-md mx-auto">
            Intenta buscando con palabras clave como &quot;bidón&quot;, &quot;papas&quot;, &quot;detergente&quot; o limpia la búsqueda.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Mostrar todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
