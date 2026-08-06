export type CategoryType = "plasticos" | "frutas-y-verduras" | "limpieza";

export interface Product {
  id: string;
  name: string;
  price: number; // Monto entero en Pesos Chilenos (CLP)
  category: CategoryType;
  image: string;
  unit: string;  // ej: "Bidón 5L", "Saco 20kg", "Unidad", "Caja 18kg"
  inStock: boolean;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
