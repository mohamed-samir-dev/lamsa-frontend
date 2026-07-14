"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoArrowBack, IoChevronForward, IoChevronBack } from "react-icons/io5";
import type { Product } from "../../../../components/products/types";
import { slugConfigs } from "../../../../lib/categoryConfig";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;
const fmt = (n: number) => n.toLocaleString("en-US");

interface Props {
  products: Product[];
}

const modelSlugs = [
  { slug: "iphone-17-pro-max", label: "17 Pro Max" },
  { slug: "iphone-17-pro", label: "17 Pro" },
  { slug: "iphone-17-air", label: "17 Air" },
  { slug: "iphone-17", label: "17" },
  { slug: "iphone-16-pro-max", label: "16 Pro Max" },
  { slug: "iphone-16-pro", label: "16 Pro" },
  { slug: "iphone-16", label: "16" },
  { slug: "iphone-15-pro-max", label: "15 Pro Max" },
  { slug: "iphone-15-pro", label: "15 Pro" },
  { slug: "iphone-15", label: "15" },
];

function filterBySlug(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return [];
  const { brand, category, nameIncludes, nameExcludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category === category : true;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    const matchExclude = nameExcludes?.length
      ? !nameExcludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    return matchBrand && matchCategory && matchName && matchExclude;
  });
}

export default function LatestPhones({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalDots = 5;

  const picks: (Product & { modelLabel: string })[] = [];
  const usedIds = new Set<string>();

  for (const model of modelSlugs) {
    const filtered = filterBySlug(products, model.slug);
    const found = filtered.find((p) => !usedIds.has(p._id));
    if (found) {
      usedIds.add(found._id);
      picks.push({ ...found, modelLabel: model.label });
    }
  }

  if (picks.length === 0 && products.length > 0) {
    products.slice(0, 6).forEach((p, i) => {
      picks.push({ ...p, modelLabel: `iPhone ${i + 1}` });
    });
  }

  const updateActiveIndex = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1);
    setActiveIndex(Math.round(scrollRatio * (totalDots - 1)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex);
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [picks.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -220 : 220;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (picks.length === 0) return null;

  return (
    <section className="mb-16">
      {/* Centered title with decorative lines */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#DFC4A4] to-[#DFC4A4]" />
        <h2 className="text-lg sm:text-xl font-black whitespace-nowrap" style={{ color: "#DFC4A4" }}>
          أحدث المنتجات
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#DFC4A4] to-[#DFC4A4]" />
      </motion.div>

      <div className="relative">
        {/* Right arrow */}
        <button onClick={() => scroll("right")} className="absolute top-1/2 -translate-y-1/2 right-0 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: "#1F2C3E" }}>
          <IoChevronForward size={16} style={{ color: "#DFC4A4" }} />
        </button>
        {/* Left arrow */}
        <button onClick={() => scroll("left")} className="absolute top-1/2 -translate-y-1/2 left-0 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ backgroundColor: "#1F2C3E" }}>
          <IoChevronBack size={16} style={{ color: "#DFC4A4" }} />
        </button>

        <div className="px-12">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {picks.map((p, i) => {
              const img = p.images?.[0] || p.image;
              const price = p.salePrice && p.salePrice > 0 ? p.salePrice : p.originalPrice || p.price || 0;
              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 70, damping: 15 }}
                  className="flex-shrink-0"
                >
                  <Link href={`/product/${p._id}`} className="group block w-[180px] sm:w-[210px] rounded-[22px] overflow-hidden border border-[#EBE6E2] hover:border-[#DFC4A4] transition-all duration-300 hover:shadow-xl bg-white">
                    <div className="relative h-[180px] sm:h-[210px] overflow-hidden" style={{ backgroundColor: "#F9F6F2" }}>
                      {img && (
                        <Image src={resolveImg(img)} alt={p.name} fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2" sizes="210px" />
                      )}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ backgroundColor: "#1F2C3E", color: "#DFC4A4" }}>
                        {p.modelLabel}
                      </div>
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-[11px] sm:text-[12px] font-bold line-clamp-2 leading-relaxed" style={{ color: "#1F2C3E" }}>{p.name}</h3>
                      <div className="flex items-center justify-between mt-2.5">
                        <p className="text-[12px] sm:text-[13px] font-black" style={{ color: "#1F2C3E" }}>{fmt(price)} ر.س</p>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:-translate-x-1" style={{ backgroundColor: "#DFC4A4" }}>
                          <IoArrowBack size={12} style={{ color: "#1F2C3E" }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalDots }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: activeIndex === i ? 20 : 6,
              height: 6,
              backgroundColor: activeIndex === i ? "#DFC4A4" : "#E5E0DB",
            }}
          />
        ))}
      </div>
    </section>
  );
}
