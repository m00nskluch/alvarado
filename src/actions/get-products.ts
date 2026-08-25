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

    if (productsData && productsData.length > 0) {
      return productsData;
    }

    // Fallback si la BD Supabase aún no cuenta con registros cargados
    const { PRODUCTS } = await import('@/data/products');
    const slugMap: Record<string, string> = {
      'plasticos': 'c_plasticos',
      'frutas-y-verduras': 'c_frutas_verduras',
      'limpieza': 'c_limpieza',
    };
    const targetCatId = slugMap[categorySlug] || categorySlug;
    return PRODUCTS.filter((p) => p.category_id === targetCatId && p.is_available);
  } catch (err) {
    console.error('[Server Action] Error inesperado en getProductsByCategorySlug:', err);
    try {
      const { PRODUCTS } = await import('@/data/products');
      const slugMap: Record<string, string> = {
        'plasticos': 'c_plasticos',
        'frutas-y-verduras': 'c_frutas_verduras',
        'limpieza': 'c_limpieza',
      };
      const targetCatId = slugMap[categorySlug] || categorySlug;
      return PRODUCTS.filter((p) => p.category_id === targetCatId && p.is_available);
    } catch {
      return [];
    }
  }
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  try {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('id, category_id, name, price, stock_quantity, image_url, is_available')
      .eq('is_available', true);

    let activeProducts: Product[] = (productsData && productsData.length > 0) ? productsData : [];

    if (error) {
      console.error('[Server Action] Error al consultar productos destacados en Supabase:', error.message);
    }

    // Fallback si la BD aún no cuenta con registros cargados
    if (activeProducts.length === 0) {
      const { PRODUCTS } = await import('@/data/products');
      activeProducts = PRODUCTS.filter((p) => p.is_available);
    }

    // Mezcla aleatoria/balanceada
    const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (err) {
    console.error('[Server Action] Error inesperado en getFeaturedProducts:', err);
    try {
      const { PRODUCTS } = await import('@/data/products');
      return PRODUCTS.filter((p) => p.is_available).slice(0, limit);
    } catch {
      return [];
    }
  }
}

