import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { PRODUCTS } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Productos Plásticos | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de insumos plásticos: bidones 20L, baldes reforzados, bolsas de basura pesada y contenedores herméticos en Santiago.',
};

export default function PlasticosPage() {
  const plasticosProducts = PRODUCTS.filter((p) => p.category === "plasticos");

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <CategoryNav />

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-lg">
        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">
          Catálogo Especializado
        </span>
        <h1 className="text-2xl md:text-4xl font-black">
          🪣 Insumos & Contenedores Plásticos
        </h1>
        <p className="text-slate-300 text-sm mt-2 max-w-2xl">
          Bidones de alta densidad, baldes reforzados graduados, contenedores herméticos y bolsas de basura resistentes para residencias y comercios.
        </p>
      </div>

      <ProductGrid
        products={plasticosProducts}
        title="Catálogo de Productos Plásticos"
        subtitle="Selecciona las unidades requeridas y agrégalas a tu pedido."
      />
    </main>
  );
}
