"use client";

import { useEffect, useState } from "react";

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  x: string;
  responseTime: string;
  workshopLocation: string;
}

// Backend band ho ya CMS mein abhi kuch save na hua ho to yahi dikhega
export const DEFAULT_CONTACT: ContactInfo = {
  email: "office@loomstone.in",
  phone: "+91 9916199988",
  address: "Gurgaon, India",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  x: "https://x.com",
  responseTime: "Within 12 hours",
  workshopLocation: "Gurgaon, India",
};

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const waHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;

const FETCH_TIMEOUT_MS = 4000;

let cached: ContactInfo | null = null;
let inflight: Promise<ContactInfo | null> | null = null;

function loadContactInfo(): Promise<ContactInfo | null> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return Promise.resolve(null);

  inflight = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(`${base}/api/contact-info`, {
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const json = await res.json();
      const data = json?.data ?? json;

      // Record hi nahi bana (_id nahi) to hardcoded rehne do.
      // Record hai to wahi sach hai: khali field matlab "dikhana nahi" (jaise X link hatana).
      if (!data?._id) return null;

      const merged = { ...DEFAULT_CONTACT } as ContactInfo;
      (Object.keys(DEFAULT_CONTACT) as (keyof ContactInfo)[]).forEach((k) => {
        merged[k] = typeof data[k] === "string" ? data[k] : "";
      });
      cached = merged;
      return merged;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
      inflight = null;
    }
  })();

  return inflight;
}

export function useContactInfo(): ContactInfo {
  const [info, setInfo] = useState<ContactInfo>(cached ?? DEFAULT_CONTACT);

  useEffect(() => {
    let alive = true;
    loadContactInfo().then((data) => {
      if (alive && data) setInfo(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return info;
}
