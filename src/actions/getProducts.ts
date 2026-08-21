"use server";

import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/database.types";

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("tu-proyecto") && !url.includes("placeholder"));
};

/**
 * Server Action para obtener los productos de una categoría por su slug
 * @param categorySlug Slug de la categoría (ej: 'plasticos', 'limpieza', 'frutas-y-verduras')
 * @returns Lista de productos pertenecientes a la categoría
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (categoryError || !category) {
      return [];
    }

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_available", true);

    if (productsError) {
      return [];
    }

    return products || [];
  } catch (error) {
    console.error("Excepción al consultar productos por categoría en Supabase:", error);
    return [];
  }
}

/**
 * Server Action para obtener todos los productos del catálogo
 * @returns Lista completa de productos disponibles
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true);

    if (error) {
      return [];
    }

    return products || [];
  } catch (error) {
    console.error("Excepción al consultar todos los productos en Supabase:", error);
    return [];
  }
}
