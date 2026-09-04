import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Sanitiza cadenas de texto para prevenir inyección de operadores PostgREST y caracteres especiales.
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  return query.replace(/[,.:()"'%_]/g, '').trim();
}
