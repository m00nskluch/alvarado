"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Store, Menu, X, PhoneCall } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const { state, dispatch } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Plásticos", href: "/plasticos" },
    { label: "Frutas y Verduras", href: "/frutas-y-verduras" },
    { label: "Limpieza", href: "/limpieza" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg md:text-xl text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors block leading-tight">
              Dónde Álvaro
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600 block">
              Distribuidora Alvarado
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg font-bold text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: WhatsApp Callout & Cart Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/56912345678"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors border border-slate-200/60"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contacto Directo</span>
          </a>

          <button
            onClick={() => dispatch({ type: "TOGGLE_CART" })}
            className="relative bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            aria-label="Ver mi pedido"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-bold">Mi Pedido</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl font-bold text-sm ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
