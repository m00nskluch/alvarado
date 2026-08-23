'use client';

import Image from 'next/image';
import { Product } from '@/lib/database.types';
import { useCart } from '@/context/CartContext';
import { Plus, ImageOff } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-100 mb-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageOff className="w-8 h-8" />
            </div>
          )}
        </div>

        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full inline-block mb-2">
          {product.stock_quantity ? `Formato: ${product.stock_quantity}` : 'Disponible'}
        </span>
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
          {product.name}
        </h3>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500 block">Precio CLP</span>
          <span className="text-lg font-extrabold text-emerald-900">
            ${Number(product.price).toLocaleString('es-CL')}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4"/>
          + Añadir al Pedido
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
