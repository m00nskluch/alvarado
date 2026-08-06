"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const CategoryNav = () => {
  const pathname = usePathname();

  const categories = [
    { name: "🏠 Todos los Rubros", href: "/" },
    { name: "🪣 Plásticos", href: "/plasticos" },
    { name: "🍎 Frutas y Verduras", href: "/frutas-y-verduras" },
    { name: "🧹 Limpieza", href: "/limpieza" },
  ];

  return (
    <nav className="flex flex-wrap gap-2 md:gap-3 my-6 justify-center" aria-label="Navegación de Categorías">
      {categories.map((cat) => {
        const isActive = pathname === cat.href;
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm md:text-base transition-all duration-200 shadow-sm ${
              isActive
                ? "bg-emerald-600 text-white shadow-emerald-600/30 shadow-md scale-105"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
};
