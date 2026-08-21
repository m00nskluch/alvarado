import { getProductsByCategorySlug } from '@/actions/get-products';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LimpiezaPage() {
  const products = await getProductsByCategorySlug('limpieza');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-emerald-800 text-white rounded-2xl p-6 mb-6 shadow-sm">
        <h1 className="text-3xl font-bold">Catálogo de Productos de Limpieza e Higiene</h1>
        <p className="text-emerald-100 text-sm mt-1">Detergentes, toallas, guantes y aseo institucional.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Link className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium text-center text-sm transition-colors" href="/plasticos">
          🪣 Plásticos
        </Link>
        <Link className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium text-center text-sm transition-colors" href="/frutas-y-verduras">
          🍎 Frutas y Verduras
        </Link>
      </div>

      <ProductGrid initialProducts={products}/>
    </main>
  );
}
