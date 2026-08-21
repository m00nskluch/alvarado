"use client";

import { Product } from "@/lib/database.types";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { Search, PackageX } from "lucide-react";

interface ProductGridProps {
  initialProducts?: Product[];
  products?: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid = ({ initialProducts, products, title, subtitle }: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const activeProducts = initialProducts || products || [];

  const filteredProducts = activeProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.stock_quantity && product.stock_quantity.toLowerCase().includes(searchTerm.toLowerCase()))
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
          {subtitle && <p className="text-slate-600 text-sm md:text-base">{subtitle}</p>}
        </div>
      )}

      {/* Internal Category Search Filter Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar producto o formato en este catálogo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Limpiar
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No se encontraron productos</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? `No hay ningún artículo que coincida con "${searchTerm}". Intenta buscar con otro término.`
              : "No hay productos disponibles en este catálogo por el momento."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
