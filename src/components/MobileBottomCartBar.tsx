'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function MobileBottomCartBar() {
  const { totalItems, totalPrice, setIsOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="block sm:hidden fixed bottom-3 inset-x-3 z-40 bg-emerald-800/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-3 border border-emerald-600/50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="relative bg-emerald-700 p-2 rounded-xl border border-emerald-500/40">
            <ShoppingBag className="w-5 h-5 text-emerald-100" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-200 block tracking-wider leading-none">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </span>
            <span className="text-sm font-black text-white leading-tight">
              ${totalPrice.toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 bg-white text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
        >
          <span>Ver Pedido</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
        </button>
      </div>
    </div>
  );
}

export default MobileBottomCartBar;
