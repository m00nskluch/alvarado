import { Product as DBProduct } from "@/lib/database.types";

export type CategoryType = "plasticos" | "frutas-y-verduras" | "limpieza";

export type Product = DBProduct;

export interface CartItem {
  product: Product;
  quantity: number;
}
