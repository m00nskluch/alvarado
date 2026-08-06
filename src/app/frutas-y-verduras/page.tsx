import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Frutas y Verduras | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de frutas y verduras frescas al por mayor: sacos de papa 25kg, mallas de cebolla, cajas de tomate y manzanas seleccionadas.',
};

export default function FrutasYVerdurasPage() {
  const produceProducts = PRODUCTS.filter((p) => p.category === "frutas-y-verduras");

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <CategoryNav />

      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-6 md:p-8 rounded-2xl shadow-lg">
        <span className="text-emerald-200 font-bold text-xs uppercase tracking-wider block mb-1">
          Frescura Directa del Campo
        </span>
        <h1 className="text-2xl md:text-4xl font-black">
          🍎 Frutas & Verduras Seleccionadas
        </h1>
        <p className="text-emerald-100 text-sm mt-2 max-w-2xl">
          Productos agrícolas de primera calidad empacados en sacos, mallas y cajas especiales para restaurantes, ferias, minimarkets y hogares.
        </p>
      </div>

      <ProductGrid
        products={produceProducts}
        title="Catálogo de Frutas y Verduras"
        subtitle="Selecciona los formatos al por mayor o menor que necesites en tu compra."
      />
    </main>
  );
}
