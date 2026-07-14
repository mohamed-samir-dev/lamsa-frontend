"use client";

import CategoryLandingClient from "../../components/CategoryLandingClient";
import type { SubCategoryCard } from "../../components/CategoryLandingClient";
import type { Product } from "../../components/products/types";

const subCategories: SubCategoryCard[] = [
  { slug: "anker-batteries", label: "بطاريات متنقلة", emoji: "🔋", href: "/accessories/anker-batteries" },
  { slug: "airpods", label: "سماعات AirPods", emoji: "🎧", href: "/accessories/airpods" },
];

const filterFn = (p: Product) =>
  p.category?.includes("بطاريات متنقله") ||
  p.category?.includes("بطاريات متنقلة") ||
  p.name?.toLowerCase().includes("airpods") ||
  p.name?.includes("ايربودز") ||
  p.name?.includes("سماعة ابل") ||
  false;

export default function AccessoriesClient() {
  return (
    <CategoryLandingClient
      title="الاكسسوارات"
      emoji="🎒"
      subCategories={subCategories}
      filterFn={filterFn}
    />
  );
}
