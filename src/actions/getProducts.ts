"use server";

import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';
import { getProductsByCategorySlug } from './get-products';

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return getProductsByCategorySlug(categorySlug);
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, category_id, name, price, stock_quantity, image_url, is_available')
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (productsError) {
      console.error('[Server Action] Error al consultar todos los productos:', productsError.message);
      return [];
    }

    return productsData || [];
  } catch (err) {
    console.error('[Server Action] Error inesperado en getAllProducts:', err);
    return [];
  }
}
