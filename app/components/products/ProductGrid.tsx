"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ProductCard from "./ProductCard";
import type { Product } from "./types";
import CategoryBanner from "../banner/CategoryBanner";
import { sortProducts } from "../../lib/sortProducts";

const LIMIT = 4;

const categoryPageMap: Record<string, string> = {
  smartphone: "/smartphones/apple-only",
  smartphones: "/smartphones/apple-only",
  watch: "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "ابل ايفون 14 بلس": "/smartphones/iphone-14-plus",
  "ابل ايفون 13 برو ماكس": "/smartphones/iphone-13-pro-max",
  "سامسونج جالكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S22": "/smartphones/samsung-s22-ultra",
  "سامسونج جالاكسي S23": "/smartphones/samsung-s23-ultra",
  "سامسونج جالاكسي S24": "/smartphones/samsung-s24-ultra",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-s26-ultra",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

function CategoryRow({ category, items, isFirst, accentIdx }: { category: string; items: Product[]; isFirst?: boolean; accentIdx: number }) {
  const visible = items.slice(0, LIMIT);
  const href = categoryPageMap[category] ?? categoryPageMap[category.toLowerCase()] ?? "#";
  const isGold = accentIdx % 2 === 0;
  const accentColor = isGold ? '#A77D4B' : '#0d9488';
  const accentGradient = isGold
    ? 'linear-gradient(135deg, #BC9255, #A77D4B)'
    : 'linear-gradient(135deg, #14b8a6, #0d9488)';
  const bgTint = isGold
    ? 'linear-gradient(160deg, #fffdf8 0%, #faf5ed 100%)'
    : 'linear-gradient(160deg, #f8fffe 0%, #f0fdf9 100%)';
  const borderColor = isGold ? 'rgba(188,146,85,0.2)' : 'rgba(13,148,136,0.15)';

  return (
    <div className="mb-10" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-9 rounded-full"
            style={{ background: accentGradient }}
          />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#1a1a2e]">{category}</h2>
        </div>
        <Link
          href={href}
          className="group flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ background: accentGradient, boxShadow: `0 4px 14px -3px ${accentColor}50` }}
        >
          عرض الكل
          <IoArrowBack size={13} className="transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {/* Products Container */}
      <div
        className="rounded-[20px] p-4 sm:p-5"
        style={{ background: bgTint, border: `1px solid ${borderColor}`, boxShadow: '0 4px 24px -8px rgba(0,0,0,0.04)' }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {visible.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={isFirst && i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

type HomeSettings = { category: string; subCategory: string; showInHome: boolean; order: number };
type HomeConfig = { settings: HomeSettings[]; max: number };

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [bannerMap, setBannerMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products`).then((r) => r.json()),
      fetch("/api/sub-categories-home").then((r) => r.json()).catch(() => ({ settings: [], max: 4 })),
    ])
      .then(([prods, config]) => {
        setProducts(prods);
        setHomeConfig(Array.isArray(config) ? { settings: config, max: 4 } : config);
        const cats = [...new Set((prods as Product[]).map((p) => p.category).filter(Boolean))];
        if (cats.length) {
          fetch(`/api/admin/category-banners-bulk?categories=${encodeURIComponent(cats.join(","))}`)
            .then((r) => r.json())
            .then((data) => { if (data && typeof data === "object") setBannerMap(data); })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    Object.keys(map).forEach((cat) => { map[cat] = sortProducts(map[cat]); });
    return map;
  }, [products]);

  const orderedCategories = useMemo(() => {
    const allCats = Object.keys(grouped).filter((c) => c !== "أخرى");
    if (!homeConfig) return allCats;
    const { settings, max } = homeConfig;
    const visibleSettings = settings.filter((s) => s.showInHome);
    if (visibleSettings.length === 0) return allCats;
    const orderedCats = visibleSettings
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
      .map((s) => s.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .filter((c) => allCats.includes(c));
    const unconfigured = allCats.filter((c) => !settings.some((s) => s.category === c) && c !== "أخرى");
    return [...orderedCats, ...unconfigured];
  }, [grouped, homeConfig]);

  /* ── Loading skeleton ── */
  if (loading) return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-8">
      {[1, 2, 3].map((g) => (
        <div key={g} className="mb-10">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="w-1.5 h-9 rounded-full bg-[#BC9255]/20 animate-pulse" />
            <div className="h-5 w-32 bg-gray-200/80 animate-pulse rounded-full" />
          </div>
          <div className="rounded-[20px] p-4 sm:p-5" style={{ background: '#faf7f2', border: '1px solid rgba(188,146,85,0.1)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="w-full aspect-square bg-gray-100/60 animate-pulse" />
                  <div className="p-3 space-y-2.5">
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full w-3/4" />
                    <div className="h-4 bg-gray-100 animate-pulse rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );

  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full py-6 sm:py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        {orderedCategories.map((category, catIdx) => (
          <div key={category}>
            {/* Category banner (full-bleed) */}
            {bannerMap[category]?.length > 0 && (
              <div className="-mx-3 sm:-mx-6 mb-4">
                <CategoryBanner category={category} images={bannerMap[category]} />
              </div>
            )}
            <CategoryRow category={category} items={grouped[category]} isFirst={catIdx === 0} accentIdx={catIdx} />
          </div>
        ))}
      </div>
    </section>
  );
}
