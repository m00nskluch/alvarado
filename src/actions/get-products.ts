'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';

// Esquemas de validación Zod defensivos
const categorySlugSchema = z.string().trim().regex(/^[a-z0-9-]+$/).max(50);
const limitSchema = z.number().int().positive().max(100).default(12);

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  // 1. Validación estricta con Zod
  const parseResult = categorySlugSchema.safeParse(categorySlug);
  if (!parseResult.success) {
    console.warn('[Security] Solicitud rechazada por slug inválido:', categorySlug);
    return [];
  }
  const sanitizedSlug = parseResult.data;

  try {
    // 2. Consulta parametrizada en Supabase (Categoría)
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', sanitizedSlug)
      .maybeSingle();

    if (categoryError) {
      console.error('[DB_ERROR] Error al consultar la categoría en la base de datos');
      return [];
    }

    if (!categoryData) {
      console.warn('[Security] No se encontró categoría activa para el slug parametrizado');
      return [];
    }

    // 3. Consulta parametrizada en Supabase (Productos)
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, category_id, name, price, stock_quantity, image_url, is_available')
      .eq('category_id', categoryData.id)
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (productsError) {
      console.error('[DB_ERROR] Error al consultar productos por categoría');
      return [];
    }

    if (productsData && productsData.length > 0) {
      return productsData;
    }

    // Fallback estático seguro si la BD no cuenta con registros cargados
    const { PRODUCTS } = await import('@/data/products');
    const slugMap: Record<string, string> = {
      'plasticos': 'c_plasticos',
      'frutas-y-verduras': 'c_frutas_verduras',
      'limpieza': 'c_limpieza',
    };
    const targetCatId = slugMap[sanitizedSlug] || sanitizedSlug;
    return PRODUCTS.filter((p) => p.category_id === targetCatId && p.is_available);
  } catch {
    console.error('[DB_ERROR] Excepción inesperada en getProductsByCategorySlug');
    try {
      const { PRODUCTS } = await import('@/data/products');
      const slugMap: Record<string, string> = {
        'plasticos': 'c_plasticos',
        'frutas-y-verduras': 'c_frutas_verduras',
        'limpieza': 'c_limpieza',
      };
      const targetCatId = slugMap[sanitizedSlug] || sanitizedSlug;
      return PRODUCTS.filter((p) => p.category_id === targetCatId && p.is_available);
    } catch {
      return [];
    }
  }
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  // Validación de parámetro limit
  const limitResult = limitSchema.safeParse(limit);
  const safeLimit = limitResult.success ? limitResult.data : 12;

  try {
    const { data: productsData, error } = await supabase
      .from('products')
      .select('id, category_id, name, price, stock_quantity, image_url, is_available')
      .eq('is_available', true);

    let activeProducts: Product[] = (productsData && productsData.length > 0) ? productsData : [];

    if (error) {
      console.error('[DB_ERROR] Error al obtener productos destacados');
    }

    // Fallback estático si la BD está vacía
    if (activeProducts.length === 0) {
      const { PRODUCTS } = await import('@/data/products');
      activeProducts = PRODUCTS.filter((p) => p.is_available);
    }

    const shuffled = [...activeProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, safeLimit);
  } catch {
    console.error('[DB_ERROR] Excepción inesperada en getFeaturedProducts');
    try {
      const { PRODUCTS } = await import('@/data/products');
      return PRODUCTS.filter((p) => p.is_available).slice(0, safeLimit);
    } catch {
      return [];
    }
  }
}
