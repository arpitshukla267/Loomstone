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

// ─── Product Types & API ────────────────────────────────────────────────────

export type ProductImage = {
  url: string;
  imageId: string;
};

export type Product = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  desc: string;
  description?: string;
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

// ─── Why Loomstone Types & API ──────────────────────────────────────────────

export type WhyFeature = {
  icon?: string;
  title: string;
  text: string;
  order: number;
};

export type WhyLoomstone = {
  _id?: string;
  heading: string;
  subheading: string;
  image?: string;
  imageId?: string;
  features: WhyFeature[];
  createdAt?: string;
  updatedAt?: string;
};

export const whyLoomstoneApi = {
  get: () => req<WhyLoomstone>("/api/why-loomstone"),
  update: (data: FormData | Partial<WhyLoomstone>) =>
    req<WhyLoomstone>("/api/why-loomstone", {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
};

// ─── Industries We Serve Types & API ──────────────────────────────────────────

export type IndustryCard = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  image: string;
  imageId?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type IndustriesData = {
  heading: string;
  description: string;
  eyebrow?: string;
  cards: IndustryCard[];
};

export const industryApi = {
  get: (all = true) =>
    req<IndustriesData>(`/api/industries${all ? "?all=true" : ""}`),
  updateSection: (data: {
    sectionHeading?: string;
    heading?: string;
    sectionDesc?: string;
    description?: string;
    eyebrow?: string;
  }) =>
    req<{ heading: string; description: string; eyebrow: string }>(
      "/api/industries/section",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),
  createCard: (data: FormData) =>
    req<IndustryCard>("/api/industries/cards", { method: "POST", body: data }),
  updateCard: (id: string, data: FormData) =>
    req<IndustryCard>(`/api/industries/cards/${id}`, {
      method: "PUT",
      body: data,
    }),
  deleteCard: (id: string) =>
    req<{ message: string; id: string }>(`/api/industries/cards/${id}`, {
      method: "DELETE",
    }),
  reorderCards: (orderedIds: string[]) =>
    req<{ message: string }>("/api/industries/cards/reorder", {
      method: "PATCH",
      body: JSON.stringify({ orderedIds }),
    }),
};

// ─── Founder Types & API ───────────────────────────────────────────────────

export type Founder = {
  _id?: string;
  sectionTitle: string;
  founderName: string;
  designation: string;
  tagline: string;
  quote: string;
  image?: string;
  imagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const founderApi = {
  get: () => req<Founder>("/api/founder"),
  update: (data: FormData) =>
    req<Founder>("/api/founder", { method: "PUT", body: data }),
};

// ─── Process Types & API ───────────────────────────────────────────────────

export type ProcessStep = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  media?: string;
  mediaPublicId?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProcessData = {
  _id?: string;
  heading: string;
  intro: string;
  steps: ProcessStep[];
  createdAt?: string;
  updatedAt?: string;
};

export const processApi = {
  get: () => req<ProcessData>("/api/process"),
  updateSection: (data: { heading: string; intro: string }) =>
    req<{ heading: string; intro: string }>("/api/process/section", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  createStep: (data: FormData) =>
    req<ProcessStep>("/api/process/steps", { method: "POST", body: data }),
  updateStep: (id: string, data: FormData) =>
    req<ProcessStep>(`/api/process/steps/${id}`, { method: "PUT", body: data }),
  deleteStep: (id: string) =>
    req<{ message: string; id: string }>(`/api/process/steps/${id}`, {
      method: "DELETE",
    }),
  reorderSteps: (orderedIds: string[]) =>
    req<{ message: string; steps: ProcessStep[] }>(
      "/api/process/steps/reorder",
      {
        method: "PATCH",
        body: JSON.stringify({ orderedIds }),
      }
    ),
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
