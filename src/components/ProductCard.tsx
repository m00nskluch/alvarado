'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/database.types';
import { useCart } from '@/context/CartContext';
import { Plus, Package, Check } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="relative group flex flex-col justify-between bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xs hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 overflow-hidden h-full">
      {/* Background Watermark Paw */}
      <div className="absolute right-1 bottom-1 pointer-events-none opacity-5 sm:opacity-10 text-emerald-800 select-none">
        <svg className="w-6 h-6 sm:w-10 sm:h-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 14c-1.8 0-3.5 1.1-4 2.7-.3.9.2 1.9 1.1 2.2 1.8.6 3.9.6 5.7 0 .9-.3 1.4-1.3 1.1-2.2-.4-1.6-2.1-2.7-3.9-2.7zm-4.5-4c-.8 0-1.5.7-1.5 1.5S6.7 13 7.5 13s1.5-.7 1.5-1.5S8.3 10 7.5 10zm9 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6.5-3c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      </div>

      <div>
        {/* Product Image / Eco Fallback */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-emerald-50/60 mb-1.5 sm:mb-3 border border-emerald-100/50 flex items-center justify-center">
          {product.image_url && !imgError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-emerald-800/40 p-2 sm:p-4 text-center space-y-0.5 sm:space-y-1">
              <Package className="w-5 h-5 sm:w-10 sm:h-10 stroke-[1.5]" />
              <span className="text-[7px] sm:text-[10px] font-semibold tracking-wider uppercase text-emerald-800/60 line-clamp-1">
                Eco
              </span>
            </div>
          )}
        </div>

        {/* Format Badge */}
        <span className="text-[8px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full inline-block mb-1 sm:mb-2 truncate max-w-full">
          {product.stock_quantity ? `${product.stock_quantity}` : 'Disponible'}
        </span>

        {/* Product Name */}
        <h3 className="font-semibold text-slate-800 text-[11px] sm:text-sm line-clamp-2 min-h-[28px] sm:min-h-[38px] leading-tight sm:leading-snug group-hover:text-emerald-900 transition-colors">
          {product.name}
        </h3>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-2 sm:mt-4 pt-1.5 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 z-10">
        <div>
          <span className="hidden sm:block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Precio CLP
          </span>
          <span className="text-xs sm:text-base font-bold text-emerald-700 sm:text-emerald-950 block">
            ${Number(product.price).toLocaleString('es-CL')}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold py-1 px-1.5 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto ${
            isAdded
              ? 'bg-emerald-900 text-white ring-1 sm:ring-2 ring-emerald-400'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/10'
          }`}
          aria-label={`Añadir ${product.name} al pedido`}
        >
          {isAdded ? (
            <>
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 animate-bounce" />
              <span className="sm:inline">¡Listo!</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Añadir al Pedido</span>
              <span className="inline sm:hidden">Añadir</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
