'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Product, CartItem } from '@/lib/database.types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM': {
      const index = state.items.findIndex((item) => item.product.id === action.payload.id);
      if (index > -1) {
        const updated = [...state.items];
        updated[index].quantity += 1;
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, { product: action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.product.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.product.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('alvarado_cart');
      if (stored) {
        dispatch({ type: 'SET_CART', payload: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Error cargando carrito local:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('alvarado_cart', JSON.stringify(state.items));
    } catch (e) {
      console.error('Error guardando carrito local:', e);
    }
  }, [state.items]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        state,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider');
  return ctx;
}
