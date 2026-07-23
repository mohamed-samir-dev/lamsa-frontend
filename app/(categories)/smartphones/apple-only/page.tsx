import type { Metadata } from "next";
import AppleOnlyClient from "./AppleOnlyClient";
import type { Product } from "../../../components/products/types";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const siteName = company.nameAr || "لمسه للاجهزه الذكيه";
  return {
    title: `منتجات أبل | ${siteName}`,
    description: `تسوق جميع منتجات أبل - آيفون بجميع الإصدارات بأفضل الأسعار وبالأقساط في ${siteName}`,
  };
}

async function getProducts(): Promise<Product[]> {
  try {
    const r = await fetch(`${BACKEND}/api/products?page=1&limit=100`, { next: { revalidate: 300 } });
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data) ? data : (data.products ?? []);
  } catch {
    return [];
  }
}

export default async function AppleOnlyPage() {
  const products = await getProducts();
  return <AppleOnlyClient initialProducts={products} />;
}
