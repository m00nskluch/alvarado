import Link from "next/link";
import { MapPin, Clock, Phone, Store, ShieldCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Dónde Álvaro</h3>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Distribuidora Alvarado
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tu distribuidora comercial de confianza en Santiago de Chile. Especialistas en insumos plásticos, frutas y verduras frescas y artículos de limpieza industrial.
          </p>
        </div>

        {/* Col 2: Fast Navigation */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-400">
            Catálogos
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/plasticos" className="hover:text-emerald-400 transition-colors">
                🪣 Productos Plásticos
              </Link>
            </li>
            <li>
              <Link href="/frutas-y-verduras" className="hover:text-emerald-400 transition-colors">
                🍎 Frutas y Verduras Frescas
              </Link>
            </li>
            <li>
              <Link href="/limpieza" className="hover:text-emerald-400 transition-colors">
                🧹 Limpieza Industrial
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Service & Hours */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-400">
            Atención al Cliente
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Lun a Sáb: 08:30 - 18:30 hrs</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Santiago, Región Metropolitana</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Pedidos Directos por WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Quality Guarantee */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider text-emerald-400">
            Garantía Comercial
          </h4>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Venta Mayorista y Minorista</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Despachos coordinados directamente a tu local, negocio o domicilio en Santiago.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Distribuidora Alvarado (&quot;Dónde Álvaro&quot;). Todos los derechos reservados.
      </div>
    </footer>
  );
};
