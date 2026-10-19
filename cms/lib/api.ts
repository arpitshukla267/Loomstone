import { getToken, clearToken, API_URL } from "./auth";

const API = API_URL;

function handleUnauthorized() {
  clearToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-logout"));
  }
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isForm =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error || json.message || "API error");
  }
  return (json.data ?? json) as T;
}

// ─── Hero Slide Types & API ───────────────────────────────────────────────────

export type HeroSlide = {
  _id: string;
  image?: string;
  imageUrl?: string;
  imagePublicId?: string;
  heading: string;
  description?: string;
  primaryText?: string;
  secondaryText?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const heroApi = {
  list: () => req<HeroSlide[]>("/api/hero-section?all=true"),
  create: (data: FormData) =>
    req<HeroSlide>("/api/hero-section", { method: "POST", body: data }),
  update: (id: string, data: FormData) =>
    req<HeroSlide>(`/api/hero-section/${id}`, { method: "PUT", body: data }),
  toggle: (id: string) =>
    req<HeroSlide>(`/api/hero-section/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/hero-section/${id}`, { method: "DELETE" }),
};

// ─── Room Types & API ─────────────────────────────────────────────────────────

export type Room = {
  _id: string;
  name: string;
  heading?: string;
  desc: string;
  image: string;
  imageId?: string;
  href?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const roomApi = {
  list: () => req<Room[]>("/api/rooms?all=true"),
  create: (data: FormData) =>
    req<Room>("/api/rooms", { method: "POST", body: data }),
  update: (id: string, data: FormData) =>
    req<Room>(`/api/rooms/${id}`, { method: "PUT", body: data }),
  toggle: (id: string) =>
    req<Room>(`/api/rooms/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/rooms/${id}`, { method: "DELETE" }),
};

// ─── Category Types & API ───────────────────────────────────────────────────

export type Category = {
  _id: string;
  name: string;
  desc?: string;
  text?: string;
  image?: string;
  imageId?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const categoryApi = {
  list: () => req<Category[]>("/api/categories?all=true"),
  create: (data: FormData | Partial<Category>) =>
    req<Category>("/api/categories", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  update: (id: string, data: FormData | Partial<Category>) =>
    req<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  toggle: (id: string) =>
    req<Category>(`/api/categories/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/categories/${id}`, { method: "DELETE" }),
};

// ─── Product Types & API ────────────────────────────────────────────────────

export type ProductImage = {
  url: string;
  imageId: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  category: string;
  rooms: string[];
  sizes: string[];
  options: string[];
  images: ProductImage[];
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const productApi = {
  list: () => req<Product[]>("/api/products?all=true"),
  get: (idOrSlug: string) => req<Product>(`/api/products/${idOrSlug}?all=true`),
  create: (data: FormData) =>
    req<Product>("/api/products", { method: "POST", body: data }),
  update: (id: string, data: FormData) =>
    req<Product>(`/api/products/${id}`, { method: "PUT", body: data }),
  toggle: (id: string) =>
    req<Product>(`/api/products/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/products/${id}`, { method: "DELETE" }),
};

// ─── Contact Info Types & API ───────────────────────────────────────────────

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  x: string;
  responseTime: string;
  responseNote: string;
  workshopLocation: string;
  workshopNote: string;
};

export const contactApi = {
  // record abhi nahi bana to backend {} bhejta hai (_id nahi hoti)
  get: () => req<Partial<ContactInfo> & { _id?: string }>("/api/contact-info"),
  update: (data: ContactInfo) =>
    req<ContactInfo>("/api/contact-info", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/`);
    return res.ok;
  } catch {
    return false;
  }
}
