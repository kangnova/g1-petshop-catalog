export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type Role = "admin" | "agent" | "sub-agent";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  store_name: string | null;
  store_slug: string | null;
  phone_number: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  base_price: number;
  stock_status: StockStatus;
  image_url: string | null;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface AgentCatalogItem {
  id: string;
  agent_id: string;
  product_id: string;
  custom_price: number;
  is_active: boolean;
}

export interface StorefrontItem extends AgentCatalogItem {
  products: ProductWithCategory | null;
}

export interface Announcement {
  id: string;
  product_id: string | null;
  title: string;
  message: string | null;
  created_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  stock?: StockStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductInput {
  title: string;
  category_id: string | null;
  description: string;
  base_price: number;
  stock_status: StockStatus;
  image_url: string;
}
