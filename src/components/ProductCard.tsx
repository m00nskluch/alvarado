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
    <div className="relative group flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden h-full">
      {/* Background Watermark Paw */}
      <div className="absolute right-2 bottom-2 pointer-events-none opacity-10 text-emerald-800 select-none">
        <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 14c-1.8 0-3.5 1.1-4 2.7-.3.9.2 1.9 1.1 2.2 1.8.6 3.9.6 5.7 0 .9-.3 1.4-1.3 1.1-2.2-.4-1.6-2.1-2.7-3.9-2.7zm-4.5-4c-.8 0-1.5.7-1.5 1.5S6.7 13 7.5 13s1.5-.7 1.5-1.5S8.3 10 7.5 10zm9 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6.5-3c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      </div>

      <div>
        {/* Product Image / Eco Fallback */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-emerald-50/60 mb-3 border border-emerald-100/50 flex items-center justify-center">
          {product.image_url && !imgError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-emerald-800/40 p-4 text-center space-y-1">
              <Package className="w-10 h-10 stroke-[1.5]" />
              <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-800/60">
                Empaque Eco
              </span>
            </div>
          )}
        </div>

        {/* Format Badge */}
        <span className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full inline-block mb-2">
          {product.stock_quantity ? `Formato: ${product.stock_quantity}` : 'Disponible'}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
          {product.name}
        </h3>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 z-10">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Precio CLP
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-950">
            ${Number(product.price).toLocaleString('es-CL')}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ${
            isAdded
              ? 'bg-emerald-900 text-white ring-2 ring-emerald-400'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/10'
          }`}
          aria-label={`Añadir ${product.name} al pedido`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
              <span>¡Añadido!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Añadir al Pedido</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
