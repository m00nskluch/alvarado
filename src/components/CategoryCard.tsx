import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  image: string;
  badge: string;
}

export const CategoryCard = ({
  title,
  description,
  href,
  image,
  badge,
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-md hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full"
    >
      {/* Subtle Cat Paw Watermark */}
      <div className="absolute right-3 bottom-3 pointer-events-none opacity-10 text-emerald-800 select-none z-10">
        <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
          <path d="M12 14c-1.8 0-3.5 1.1-4 2.7-.3.9.2 1.9 1.1 2.2 1.8.6 3.9.6 5.7 0 .9-.3 1.4-1.3 1.1-2.2-.4-1.6-2.1-2.7-3.9-2.7zm-4.5-4c-.8 0-1.5.7-1.5 1.5S6.7 13 7.5 13s1.5-.7 1.5-1.5S8.3 10 7.5 10zm9 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm-6.5-3c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm4 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
        </svg>
      </div>

      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
        <span className="absolute top-3 left-3 bg-emerald-800/90 text-emerald-100 text-[11px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-emerald-600/40">
          {badge}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-800 transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center text-emerald-700 font-extrabold text-sm pt-2 group-hover:translate-x-1.5 transition-transform">
          Explorar Catálogo <ArrowRight className="w-4 h-4 ml-1.5" />
        </div>
      </div>
    </Link>
  );
};
