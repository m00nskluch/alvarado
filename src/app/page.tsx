import { CategoryCard } from "@/components/CategoryCard";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllProducts } from "@/actions/getProducts";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/lib/database.types";
import { MapPin, Clock, Truck, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("Error al obtener todos los productos en HomePage:", error);
  }

  // Fallback si la base de datos Supabase aún no cuenta con registros cargados
  if (products.length === 0) {
    products = PRODUCTS;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-emerald-400/20">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          Atención Directa en Santiago, Chile
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Distribuidora Alvarado<br />
          <span className="text-emerald-300 font-extrabold">&quot;Dónde Álvaro&quot;</span>
        </h1>

        <p className="text-emerald-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Venta al por mayor y menor de insumos plásticos industriales, frutas y verduras frescas seleccionadas y productos de limpieza de alto rendimiento.
        </p>
      </section>

      {/* Category Navigation Bar */}
      <CategoryNav />

      {/* Category Redirection Banners */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
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

      {/* Featured Products Overview */}
      <section className="pt-4">
        <ProductGrid
          initialProducts={products}
          title="Todos los Productos Disponibles"
          subtitle="Agrega los productos que necesites a tu pedido y envíalo directamente a nuestro WhatsApp."
        />
      </section>

      {/* Business Info Features */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
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
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
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
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
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
