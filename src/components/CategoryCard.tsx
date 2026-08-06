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
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow">
          {badge}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center text-emerald-600 font-bold text-sm pt-2 group-hover:translate-x-1 transition-transform">
          Ver Catálogo <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};
