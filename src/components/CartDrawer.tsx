"use client";

import { useCart } from "@/context/CartContext";
import { formatCLP } from "@/lib/utils";
import { X, Trash2, ShoppingBag, Send, User, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export const CartDrawer = () => {
  const { state, dispatch } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  if (!state.isOpen) return null;

  const totalCLP = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleSendWhatsApp = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56912345678";
    
    let message = `¡Hola Distribuidora Alvarado! Me gustaría realizar el siguiente pedido desde la página web:\n\n`;
    
    state.items.forEach(({ product, quantity }) => {
      const subtotal = product.price * quantity;
      message += `• ${quantity}x ${product.name} (${product.unit}) -> ${formatCLP(subtotal)}\n`;
    });

    message += `\n*TOTAL ESTIMADO: ${formatCLP(totalCLP)} CLP*\n`;

    if (customerName.trim()) {
      message += `\n*Cliente:* ${customerName.trim()}`;
    }
    if (address.trim()) {
      message += `\n*Dirección/Comuna:* ${address.trim()}`;
    }

    message += `\n\n¿Tienen disponibilidad para coordinar despacho o retiro en local?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-200" />
            <h2 className="font-extrabold text-lg tracking-tight">Mi Pedido</h2>
            <span className="bg-emerald-800 text-emerald-100 text-xs font-bold px-2 py-0.5 rounded-full">
              {state.items.reduce((acc, i) => acc + i.quantity, 0)} ítems
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: "TOGGLE_CART" })}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors"
            title="Cerrar Carrito"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {state.items.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-600">El carrito está vacío</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explora nuestras categorías de Plásticos, Frutas y Verduras o Limpieza para agregar productos.
              </p>
            </div>
          ) : (
            state.items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-tight truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500">{product.unit}</p>
                  <p className="text-emerald-700 font-extrabold text-sm mt-0.5">
                    {formatCLP(product.price * quantity)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { id: product.id, quantity: quantity - 1 },
                      })
                    }
                    className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { id: product.id, quantity: quantity + 1 },
                      })
                    }
                    className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() =>
                    dispatch({ type: "REMOVE_ITEM", payload: product.id })
                  }
                  className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & WhatsApp Dispatch Form */}
        {state.items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shadow-lg">
            <div className="space-y-2">
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tu Nombre o Empresa (Opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs md:text-sm pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Dirección o Comuna en Santiago (Opcional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs md:text-sm pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-600 text-sm">Total Estimado:</span>
              <span className="font-black text-xl text-emerald-700">
                {formatCLP(totalCLP)} CLP
              </span>
            </div>

            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
            >
              <Send className="w-5 h-5" /> Enviar Pedido a WhatsApp
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Se abrirá WhatsApp con el resumen de tu carrito.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
