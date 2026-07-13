import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../admin/_lib";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const fields = "name,originalPrice,salePrice,image,images,color,storage,category,subCategory,inStock,freeDelivery,warrantyYears,installment";
  const res = await fetch(
    `${getBackend()}/api/products?q=${encodeURIComponent(q)}&fields=${fields}`,
    { ...forwardCookies(req, { method: "GET" }), next: { revalidate: 60 } }
  );
  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
