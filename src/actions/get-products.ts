'use server';

import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        category_id,
        name,
        price,
        stock_quantity,
        image_url,
        is_available,
        categories!inner(slug, name)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (error) {
      console.error(`Error al consultar productos (${categorySlug}):`, error.message);
      return [];
    }

    return (data as unknown as Product[]) || [];
  } catch (error) {
    console.error('Error de conexión con Supabase:', error);
    return [];
  }
}
