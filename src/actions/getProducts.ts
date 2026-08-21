"use server";

import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/database.types';
import { getProductsByCategorySlug } from './get-products';

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return getProductsByCategorySlug(categorySlug);
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al consultar todos los productos en Supabase:', error.message);
      return [];
    }

    return (data as unknown as Product[]) || [];
  } catch (error) {
    console.error('Excepción inesperada en getAllProducts:', error);
    return [];
  }
}
