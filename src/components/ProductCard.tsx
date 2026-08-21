"use client";

import Image from "next/image";
import { Product } from "@/lib/database.types";
import { useCart } from "@/context/CartContext";
import { formatCLP } from "@/lib/utils";
import { Plus, Check, Minus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop";

export const ProductCard = ({ product }: ProductCardProps) => {
  const { state, dispatch } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const cartItem = state.items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: product });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleUpdateQuantity = (newQty: number) => {
    if (newQty <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: product.id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: product.id, quantity: newQty },
      });
    }
  };

  const imageUrl = product.image_url || DEFAULT_IMAGE;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
            {product.stock_quantity}
          </div>
          {product.is_available ? (
            <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
              En Stock
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-rose-500/90 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
              Agotado
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Precio Neto</span>
            <span className="text-xl font-black text-emerald-700">
              {formatCLP(product.price)}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            CLP
          </span>
        </div>

        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1.5">
            <button
              onClick={() => handleUpdateQuantity(quantityInCart - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white text-emerald-700 font-bold rounded-lg shadow-sm hover:bg-emerald-100 active:scale-95 transition-all"
              title="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-slate-800 text-sm">
              {quantityInCart} {quantityInCart === 1 ? "unidad" : "unidades"}
            </span>
            <button
              onClick={() => handleUpdateQuantity(quantityInCart + 1)}
              className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
              title="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              addedAnimation
                ? "bg-emerald-800 text-white scale-98"
                : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-600/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> ¡Añadido!
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> + Añadir al Pedido
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
