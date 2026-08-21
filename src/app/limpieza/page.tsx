import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/lib/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Productos de Limpieza | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de artículos de aseo e higiene industrial: cloro en bidón 5L, detergente líquido, amonio cuaternario y papel jumbo.',
};

export const revalidate = 0;

export default async function LimpiezaPage() {
  let products: Product[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes("tu-proyecto") && !supabaseUrl.includes("placeholder");

  if (isConfigured) {
    try {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "limpieza")
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
    products = PRODUCTS.filter((p) => p.category_id === "c_limpieza");
  }

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
        initialProducts={products}
        title="Catálogo de Artículos de Limpieza"
        subtitle="Selecciona los insumos de desinfección y aseo que necesites para tu pedido."
      />
    </main>
  );
}
