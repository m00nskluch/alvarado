'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, Send, Package, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '56912345678';
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleCheckout = () => {
    let msg = `*NUEVO PEDIDO - DISTRIBUIDORA ALVARADO*\n`;
    msg += `--------------------------------------\n`;
    items.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toLocaleString('es-CL')})\n`;
    });
    msg += `--------------------------------------\n`;
    msg += `*TOTAL ESTIMADO: $${totalPrice.toLocaleString('es-CL')}*\n\n`;
    msg += `Hola, me gustaría coordinar el despacho y pago de este pedido.`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      <aside className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-emerald-900/40 flex items-center justify-between bg-emerald-900 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <h2 className="text-lg font-black tracking-tight">Mi Pedido</h2>
              {totalItems > 0 && (
                <span className="bg-emerald-500 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-full animate-pulse">
                  {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-emerald-800 text-emerald-100 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 custom-scrollbar">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 space-y-3">
                <div className="p-4 rounded-full bg-emerald-50 text-emerald-700">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <p className="font-semibold text-slate-600 text-sm">Tu carrito está vacío.</p>
                <p className="text-xs text-slate-400 max-w-xs text-center">
                  Explora nuestros productos e insumos y agrégalos a tu pedido.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 flex items-center justify-between gap-3 group">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-center">
                    {product.image_url && !imageErrors[product.id] ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <Package className="w-6 h-6 text-emerald-800/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 truncate leading-snug">
                      {product.name}
                    </h4>
                    <span className="text-xs text-emerald-800 font-extrabold block mt-0.5">
                      ${(product.price * quantity).toLocaleString('es-CL')}
                      <span className="text-slate-400 font-normal ml-1">
                        (${product.price.toLocaleString('es-CL')} c/u)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/60">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 text-slate-600 hover:text-emerald-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-800 w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 text-slate-600 hover:text-emerald-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg ml-0.5 transition-colors cursor-pointer"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200/80 bg-slate-50/90 space-y-3">
              <div className="flex justify-between items-center text-base font-bold text-slate-800">
                <span className="text-sm font-semibold text-slate-600">Total Estimado:</span>
                <span className="text-2xl font-black text-emerald-950">
                  ${totalPrice.toLocaleString('es-CL')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pedido a WhatsApp</span>
              </button>
              <button
                onClick={clearCart}
                className="w-full text-xs font-semibold text-slate-400 hover:text-rose-600 text-center py-1 transition-colors cursor-pointer"
              >
                Vaciar Carrito
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
