'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, Send, ImageOff } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '56912345678';

  if (!isOpen) return null;

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
      <aside className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-emerald-800 text-white">
            <h2 className="text-lg font-bold">Mi Pedido</h2>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-emerald-700 rounded-lg">
              <X className="w-5 h-5"/>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-12">Tu carrito está vacío.</p>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageOff className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h4>
                    <span className="text-xs text-gray-500">${product.price.toLocaleString('es-CL')} c/u</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                      <Minus className="w-3 h-3"/>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                      <Plus className="w-3 h-3"/>
                    </button>
                    <button onClick={() => removeFromCart(product.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center text-base font-bold text-gray-900">
                <span>Total Estimado:</span>
                <span className="text-xl text-emerald-800">${totalPrice.toLocaleString('es-CL')}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4"/>
                Enviar Pedido a WhatsApp
              </button>
              <button onClick={clearCart} className="w-full text-xs text-gray-500 hover:text-red-600 text-center">
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
