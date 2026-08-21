export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  stock_quantity: string;
  image_url: string | null;
  is_available: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
