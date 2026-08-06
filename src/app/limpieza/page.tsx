import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Productos de Limpieza | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de artículos de aseo e higiene industrial: cloro en bidón 5L, detergente líquido, amonio cuaternario y papel jumbo.',
};

export default function LimpiezaPage() {
  const limpiezaProducts = PRODUCTS.filter((p) => p.category === "limpieza");

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <CategoryNav />

      <div className="bg-gradient-to-r from-blue-900 to-emerald-800 text-white p-6 md:p-8 rounded-2xl shadow-lg">
        <span className="text-blue-200 font-bold text-xs uppercase tracking-wider block mb-1">
          Higiene & Sanitización Industrial
        </span>
        <h1 className="text-2xl md:text-4xl font-black">
          🧹 Productos de Limpieza e Higiene
        </h1>
        <p className="text-blue-100 text-sm mt-2 max-w-2xl">
          Formatos convenientes de 5 Litros en desinfectantes, detergentes y cloro concentrado, junto a insumos institucionales de alto rendimiento.
        </p>
      </div>

      <ProductGrid
        products={limpiezaProducts}
        title="Catálogo de Artículos de Limpieza"
        subtitle="Selecciona los insumos de desinfección y aseo que necesites para tu pedido."
      />
    </main>
  );
}
