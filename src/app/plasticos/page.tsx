import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/lib/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Productos Plásticos | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de insumos plásticos: bidones 20L, baldes reforzados, bolsas de basura pesada y contenedores herméticos en Santiago.',
};

export const revalidate = 0;

export default async function PlasticosPage() {
  let products: Product[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes("tu-proyecto") && !supabaseUrl.includes("placeholder");

  if (isConfigured) {
    try {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "plasticos")
        .single();

      if (category?.id) {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", category.id)
          .eq("is_available", true);

        if (data && data.length > 0) {
          products = data;
        }
      }
    } catch (error) {
      console.error("Error al consultar productos desde Supabase:", error);
    }
  }

  // Fallback a productos locales si la base de datos Supabase aún no está configurada o sembrada
  if (products.length === 0) {
    products = PRODUCTS.filter((p) => p.category_id === "c_plasticos");
  }

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
        initialProducts={products}
        title="Catálogo de Productos Plásticos"
        subtitle="Selecciona las unidades requeridas y agrégalas a tu pedido."
      />
    </main>
  );
}
