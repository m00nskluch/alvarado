import { CategoryCard } from "@/components/CategoryCard";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCarousel } from "@/components/ProductCarousel";
import { getAllProducts } from "@/actions/getProducts";
import { getFeaturedProducts } from "@/actions/get-products";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/lib/database.types";
import { MapPin, Clock, Truck, Sparkles, Leaf } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  let products: Product[] = [];
  let featuredProducts: Product[] = [];

  try {
    const [allData, featuredData] = await Promise.all([
      getAllProducts(),
      getFeaturedProducts(12),
    ]);
    products = allData;
    featuredProducts = featuredData;
  } catch (error) {
    console.error("Error al obtener productos en HomePage:", error);
  }

  // Fallbacks si la base de datos Supabase aún no cuenta con registros cargados
  if (products.length === 0) {
    products = PRODUCTS;
  }
  if (featuredProducts.length === 0) {
    featuredProducts = products.slice(0, 12);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner Section with EcoPraha Aesthetics */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white p-8 md:p-14 rounded-3xl shadow-xl text-center space-y-6">
        {/* Glow ambient background circle */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist Cat Paw Watermark 🐾 */}
        <div className="absolute right-6 bottom-6 pointer-events-none opacity-10 text-emerald-300 select-none">
          <svg className="w-24 h-24 fill-current" viewBox="0 0 24 24">
            <path d="M12 14c-1.8 0-3.5 1.1-4 2.7-.3.9.2 1.9 1.1 2.2 1.8.6 3.9.6 5.7 0 .9-.3 1.4-1.3 1.1-2.2-.4-1.6-2.1-2.7-3.9-2.7zm-4.5-4c-.8 0-1.5.7-1.5 1.5S6.7 13 7.5 13s1.5-.7 1.5-1.5S8.3 10 7.5 10zm9 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6.5-3c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
          </svg>
        </div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-200 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-emerald-400/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Atención Directa en Santiago, Chile
          </span>

          <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-100 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-emerald-300/30 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            Eco-friendly & Pet-friendly 🐾
          </span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Distribuidora Alvarado<br />
          <span className="text-emerald-300 font-extrabold">&quot;Dónde Álvaro&quot;</span>
        </h1>

        <p className="text-emerald-100/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-normal">
          Venta al por mayor y menor de insumos plásticos industriales, frutas y verduras frescas seleccionadas y productos de limpieza de alto rendimiento.
        </p>
      </section>

      {/* Category Navigation Bar */}
      <CategoryNav />

      {/* Category Redirection Banners */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Nuestras Categorías de Productos
          </h2>
          <p className="text-slate-600 text-sm">
            Haz clic en cualquiera de nuestras secciones para explorar el catálogo completo por rubro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            title="Productos Plásticos"
            badge="Bidones & Envases"
            description="Bidones industriales de 20L, baldes multiuso, contenedores herméticos y bolsas de basura pesada."
            href="/plasticos"
            image="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop"
          />
          <CategoryCard
            title="Frutas y Verduras"
            badge="Frescura Garantizada"
            description="Sacos de papas seleccionadas, mallas de cebolla de guardado, tomates larga vida y manzanas premium."
            href="/frutas-y-verduras"
            image="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop"
          />
          <CategoryCard
            title="Productos de Limpieza"
            badge="Bidones 5L & Aseo"
            description="Cloro concentrado en bidón 5L, detergente líquido industrial, amonio cuaternario y papel institucional jumbo."
            href="/limpieza"
            image="https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Product Carousel Section - Located immediately below category shortcuts */}
      <ProductCarousel
        products={featuredProducts}
        title="Productos Destacados"
        subtitle="Todo lo que tu negocio y hogar necesitan en un solo lugar"
      />

      {/* Featured Products Grid */}
      <section className="pt-4 border-t border-slate-200/60">
        <ProductGrid
          initialProducts={products}
          title="Todos los Productos Disponibles"
          subtitle="Agrega los productos que necesites a tu pedido y envíalo directamente a nuestro WhatsApp."
        />
      </section>

      {/* Business Info Features */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <Truck className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base">Envíos y Retiro</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Despachos programados en Santiago o retiro directo en nuestro local comercial.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <Clock className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base">Horarios de Atención</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Lunes a Sábado: 08:30 - 18:30 hrs.<br />Atención continua para clientes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <MapPin className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base">Ubicación Estratégica</h4>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              Santiago, Región Metropolitana, Chile.<br />Cobertura en múltiples comunas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
