import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/lib/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Frutas y Verduras | Distribuidora Alvarado ("Dónde Álvaro")',
  description: 'Catálogo de frutas y verduras frescas al por mayor: sacos de papa 25kg, mallas de cebolla, cajas de tomate y manzanas seleccionadas.',
};

export const revalidate = 0;

export default async function FrutasYVerdurasPage() {
  let products: Product[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes("tu-proyecto") && !supabaseUrl.includes("placeholder");

  if (isConfigured) {
    try {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "frutas-y-verduras")
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
    products = PRODUCTS.filter((p) => p.category_id === "c_frutas_verduras");
  }

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
        initialProducts={products}
        title="Catálogo de Frutas y Verduras"
        subtitle="Selecciona los formatos al por mayor o menor que necesites en tu compra."
      />
    </main>
  );
}
