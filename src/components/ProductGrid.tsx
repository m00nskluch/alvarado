'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/database.types';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

interface ProductGridProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = (initialProducts || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-600 font-medium">No se encontraron productos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product}/>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
