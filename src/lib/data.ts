import { isSupabaseConfigured } from "@/lib/env";
import { demoDb } from "@/lib/mock-data";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type {
  AgentCatalogItem,
  Announcement,
  Category,
  Product,
  ProductFilters,
  ProductInput,
  ProductWithCategory,
  Profile,
  StockStatus,
  StorefrontItem,
} from "@/lib/types";

function withCategory(product: Product): ProductWithCategory {
  return {
    ...product,
    categories:
      demoDb.categories.find((c) => c.id === product.category_id) ?? null,
  };
}

function matchFilters(product: Product, filters: ProductFilters): boolean {
  if (
    filters.search &&
    !product.title.toLowerCase().includes(filters.search.toLowerCase())
  ) {
    return false;
  }
  if (filters.category) {
    const category = demoDb.categories.find(
      (c) => c.slug === filters.category
    );
    if (!category || product.category_id !== category.id) return false;
  }
  if (filters.stock && product.stock_status !== filters.stock) return false;
  if (filters.minPrice !== undefined && product.base_price < filters.minPrice)
    return false;
  if (filters.maxPrice !== undefined && product.base_price > filters.maxPrice)
    return false;
  return true;
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    return (data as Category[]) ?? [];
  }
  return [...demoDb.categories].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as Category | null) ?? null;
  }
  return demoDb.categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductWithCategory[]> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    let query = supabase
      .from("products")
      .select("*, categories(*)")
      .order("updated_at", { ascending: false });

    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    if (filters.category)
      query = query.eq("categories.slug", filters.category);
    if (filters.stock) query = query.eq("stock_status", filters.stock);
    if (filters.minPrice !== undefined)
      query = query.gte("base_price", filters.minPrice);
    if (filters.maxPrice !== undefined)
      query = query.lte("base_price", filters.maxPrice);

    const { data } = await query;
    return (data as ProductWithCategory[]) ?? [];
  }

  return demoDb.products
    .filter((p) => matchFilters(p, filters))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .map(withCategory);
}

export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("id", id)
      .maybeSingle();
    return (data as ProductWithCategory | null) ?? null;
  }
  const product = demoDb.products.find((p) => p.id === id);
  return product ? withCategory(product) : null;
}

export async function getProfileBySlug(
  slug: string
): Promise<Profile | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("store_slug", slug)
      .maybeSingle();
    return (data as Profile | null) ?? null;
  }
  return demoDb.profiles.find((p) => p.store_slug === slug) ?? null;
}

export async function getStorefront(
  agentId: string
): Promise<StorefrontItem[]> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("agent_catalogs")
      .select("*, products(*, categories(*))")
      .eq("agent_id", agentId)
      .eq("is_active", true);
    return (data as StorefrontItem[]) ?? [];
  }
  return demoDb.agentCatalogs
    .filter((item) => item.agent_id === agentId && item.is_active)
    .map((item) => ({
      ...item,
      products: (() => {
        const product = demoDb.products.find(
          (p) => p.id === item.product_id
        );
        return product ? withCategory(product) : null;
      })(),
    }));
}

export async function getStorefrontItem(
  agentId: string,
  productId: string
): Promise<AgentCatalogItem | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("agent_catalogs")
      .select("*")
      .eq("agent_id", agentId)
      .eq("product_id", productId)
      .eq("is_active", true)
      .maybeSingle();
    return (data as AgentCatalogItem | null) ?? null;
  }
  return (
    demoDb.agentCatalogs.find(
      (item) =>
        item.agent_id === agentId &&
        item.product_id === productId &&
        item.is_active
    ) ?? null
  );
}

export async function getAgentCatalogItems(
  agentId: string
): Promise<StorefrontItem[]> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("agent_catalogs")
      .select("*, products(*, categories(*))")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });
    return (data as StorefrontItem[]) ?? [];
  }
  return demoDb.agentCatalogs
    .filter((item) => item.agent_id === agentId)
    .map((item) => ({
      ...item,
      products: (() => {
        const product = demoDb.products.find(
          (p) => p.id === item.product_id
        );
        return product ? withCategory(product) : null;
      })(),
    }));
}

export async function getAnnouncements(limit?: number): Promise<Announcement[]> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    let query = supabase
      .from("product_announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data as Announcement[]) ?? [];
  }
  const sorted = [...demoDb.announcements].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export interface DashboardStats {
  products: number;
  categories: number;
  agents: number;
  announcements: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const [products, categories, agents, announcements] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .in("role", ["agent", "sub-agent"]),
      supabase
        .from("product_announcements")
        .select("id", { count: "exact", head: true }),
    ]);
    return {
      products: products.count ?? 0,
      categories: categories.count ?? 0,
      agents: agents.count ?? 0,
      announcements: announcements.count ?? 0,
    };
  }
  return {
    products: demoDb.products.length,
    categories: demoDb.categories.length,
    agents: demoDb.profiles.filter((p) => p.role !== "admin").length,
    announcements: demoDb.announcements.length,
  };
}

export async function createProduct(
  input: ProductInput
): Promise<ProductWithCategory> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("products")
      .insert(input)
      .select("*, categories(*)")
      .single();
    if (error) throw new Error(error.message);
    return data as ProductWithCategory;
  }
  const product: Product = {
    id: crypto.randomUUID(),
    ...input,
    updated_at: new Date().toISOString(),
  };
  demoDb.products.unshift(product);
  return withCategory(product);
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ProductWithCategory> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("products")
      .update(input)
      .eq("id", id)
      .select("*, categories(*)")
      .single();
    if (error) throw new Error(error.message);
    return data as ProductWithCategory;
  }
  const index = demoDb.products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Produk tidak ditemukan");
  demoDb.products[index] = {
    ...demoDb.products[index],
    ...input,
    updated_at: new Date().toISOString(),
  };
  return withCategory(demoDb.products[index]);
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  demoDb.products = demoDb.products.filter((p) => p.id !== id);
  demoDb.agentCatalogs = demoDb.agentCatalogs.filter(
    (item) => item.product_id !== id
  );
}

export async function createCategory(name: string): Promise<Category> {
  const slug = slugify(name);
  if (!slug) throw new Error("Nama kategori tidak valid");

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  }
  if (demoDb.categories.some((c) => c.slug === slug)) {
    throw new Error("Kategori dengan nama serupa sudah ada");
  }
  const category: Category = { id: crypto.randomUUID(), name: name.trim(), slug };
  demoDb.categories.push(category);
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  demoDb.categories = demoDb.categories.filter((c) => c.id !== id);
  demoDb.products.forEach((p) => {
    if (p.category_id === id) p.category_id = null;
  });
}

export interface AnnouncementInput {
  title: string;
  message: string;
  product_id?: string | null;
}

export async function createAnnouncement(
  input: AnnouncementInput
): Promise<Announcement> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("product_announcements")
      .insert({
        title: input.title,
        message: input.message,
        product_id: input.product_id ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Announcement;
  }
  const announcement: Announcement = {
    id: crypto.randomUUID(),
    product_id: input.product_id ?? null,
    title: input.title,
    message: input.message,
    created_at: new Date().toISOString(),
  };
  demoDb.announcements.unshift(announcement);
  return announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("product_announcements")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  demoDb.announcements = demoDb.announcements.filter((a) => a.id !== id);
}

export async function upsertStorefrontItem(
  agentId: string,
  productId: string,
  customPrice: number
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("agent_catalogs").upsert(
      {
        agent_id: agentId,
        product_id: productId,
        custom_price: customPrice,
        is_active: true,
      },
      { onConflict: "agent_id,product_id" }
    );
    if (error) throw new Error(error.message);
    return;
  }
  const existing = demoDb.agentCatalogs.find(
    (item) => item.agent_id === agentId && item.product_id === productId
  );
  if (existing) {
    existing.custom_price = customPrice;
    existing.is_active = true;
  } else {
    demoDb.agentCatalogs.push({
      id: crypto.randomUUID(),
      agent_id: agentId,
      product_id: productId,
      custom_price: customPrice,
      is_active: true,
    });
  }
}

export async function updateStorefrontPrice(
  itemId: string,
  customPrice: number
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("agent_catalogs")
      .update({ custom_price: customPrice })
      .eq("id", itemId);
    if (error) throw new Error(error.message);
    return;
  }
  const item = demoDb.agentCatalogs.find((i) => i.id === itemId);
  if (item) item.custom_price = customPrice;
}

export async function setStorefrontActive(
  itemId: string,
  isActive: boolean
): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("agent_catalogs")
      .update({ is_active: isActive })
      .eq("id", itemId);
    if (error) throw new Error(error.message);
    return;
  }
  const item = demoDb.agentCatalogs.find((i) => i.id === itemId);
  if (item) item.is_active = isActive;
}

export async function removeStorefrontItem(itemId: string): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("agent_catalogs")
      .delete()
      .eq("id", itemId);
    if (error) throw new Error(error.message);
    return;
  }
  demoDb.agentCatalogs = demoDb.agentCatalogs.filter((i) => i.id !== itemId);
}

export async function ensureUniqueAgentSlug(storeName: string): Promise<string> {
  const base = slugify(storeName) || "agen";
  let slug = base;
  let suffix = 2;
  while (await getProfileBySlug(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function createDemoAgent(input: {
  id: string;
  full_name: string;
  store_name: string;
  store_slug: string;
  phone_number: string;
}): Promise<void> {
  demoDb.profiles.push({
    id: input.id,
    role: "agent",
    full_name: input.full_name,
    store_name: input.store_name,
    store_slug: input.store_slug,
    phone_number: input.phone_number,
  });
}

export type { StockStatus };
