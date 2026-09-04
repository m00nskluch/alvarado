"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Store, Menu, X, PhoneCall, Leaf } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const { totalItems, isOpen, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Plásticos", href: "/plasticos" },
    { label: "Frutas y Verduras", href: "/frutas-y-verduras" },
    { label: "Limpieza", href: "/limpieza" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm overflow-x-hidden">
      {/* Top Banner Bar - Eco-friendly & Pet-friendly Badge */}
      <div className="w-full bg-emerald-950 text-emerald-100 text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between sm:justify-center gap-2 border-b border-emerald-900">
        <div className="flex items-center gap-1.5 mx-auto">
          <span className="inline-flex items-center gap-1 bg-emerald-800/90 text-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-emerald-700/60">
            <Leaf className="w-3 h-3 text-emerald-300" />
            Eco-friendly & Pet-friendly 🐾
          </span>
          <span className="hidden md:inline text-emerald-200/90 font-medium">
            · Envíos y retiro directo en local comercial
          </span>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Branding & Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 group-hover:scale-105 transition-all">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg md:text-xl text-slate-800 tracking-tight group-hover:text-emerald-800 transition-colors block leading-tight">
              Dónde Álvaro
            </span>
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 block">
              Distribuidora Alvarado
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 font-medium text-slate-700">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (WhatsApp & Cart) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/56912345678"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 px-3.5 py-2.5 rounded-xl transition-all border border-slate-200/80 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contacto Directo</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Ver mi pedido"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-bold">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
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
                    ? "bg-emerald-700 text-white"
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

export default Navbar;
