'use server';

import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  try {
    // 1. Obtener ID de la categoría por slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (categoryError) {
      console.error(`[Server Action] Error al buscar categoría "${categorySlug}":`, categoryError.message);
      return [];
    }

    if (!categoryData) {
      console.warn(`[Server Action] No se encontró categoría con slug "${categorySlug}"`);
      return [];
    }

    // 2. Obtener productos vinculados al category_id
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, category_id, name, price, stock_quantity, image_url, is_available')
      .eq('category_id', categoryData.id)
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (productsError) {
      console.error(`[Server Action] Error al consultar productos para "${categorySlug}":`, productsError.message);
      return [];
    }

    return productsData || [];
  } catch (err) {
    console.error('[Server Action] Error inesperado en getProductsByCategorySlug:', err);
    return [];
  }
}
