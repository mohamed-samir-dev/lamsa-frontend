"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApple } from "react-icons/fa";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

interface FilterItem {
  slug: string;
  label: string;
  desc: string;
}

interface Props {
  filters: FilterItem[];
  activeFilter: string | null;
  categoryImages: Record<string, string>;
  categoryCounts: Record<string, number>;
  onFilterClick: (slug: string) => void;
  displayCount: number;
}

export default function ShopByModel({ filters, categoryImages, categoryCounts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleCategories = filters.filter((cat) => categoryCounts[cat.slug] > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalDots = Math.min(visibleCategories.length, 5);

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
  }, [visibleCategories.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -200 : 200;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (visibleCategories.length === 0) return null;

  return (
    <section className="mb-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: "#1F2C3E" }}>
          <FaApple size={18} style={{ color: "#DFC4A4" }} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black" style={{ color: "#1F2C3E" }}>تسوّق حسب الطراز</h2>
          <p className="text-[10px] sm:text-[11px] opacity-50" style={{ color: "#1F2C3E" }}>اضغط على الطراز للذهاب لصفحته</p>
        </div>
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
          <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {visibleCategories.map((cat, i) => {
              const img = categoryImages[cat.slug];
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, type: "spring", stiffness: 80 }}
                >
                  <Link
                    href={`/smartphones/${cat.slug}`}
                    className="relative flex-shrink-0 w-[140px] sm:w-[170px] rounded-[20px] overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-[#EBE6E2] hover:border-[#DFC4A4]/50 block group"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="relative w-full h-[110px] sm:h-[130px] overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
                      {img ? (
                        <Image src={img} alt={cat.label} fill className="object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110" sizes="170px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaApple size={32} style={{ color: "#1F2C3E", opacity: 0.2 }} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold backdrop-blur-sm" style={{ backgroundColor: "rgba(31,44,62,0.9)", color: "#DFC4A4" }}>
                        {categoryCounts[cat.slug]}
                      </div>
                    </div>
                    <div className="px-3 py-2.5 text-center">
                      <p className="text-[11px] sm:text-[12px] font-bold truncate" style={{ color: "#1F2C3E" }}>{cat.label}</p>
                      <p className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: "rgba(31,44,62,0.5)" }}>{cat.desc}</p>
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
