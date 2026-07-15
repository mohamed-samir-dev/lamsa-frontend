"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { motion } from "framer-motion";

interface FilterItem {
  slug: string;
  label: string;
  desc: string;
}

interface Props {
  filters: FilterItem[];
  categoryImages: Record<string, string>;
  categoryCounts: Record<string, number>;
}

export default function ShopByModel({ filters, categoryImages, categoryCounts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleCategories = filters.filter((cat) => categoryCounts[cat.slug] > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalDots = Math.min(visibleCategories.length, 5);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1);
      setActiveIndex(Math.round(scrollRatio * (totalDots - 1)));
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [visibleCategories.length, totalDots]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  if (visibleCategories.length === 0) return null;

  return (
    <section className="mb-14">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/20" style={{ background: "linear-gradient(135deg, #1a237e, #1565c0)" }}>
            <span className="text-white font-bold text-[11px]">S</span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black" style={{ color: "#1a237e" }}>تسوّق حسب الطراز</h2>
            <p className="text-[10px] sm:text-[11px] text-[#1a237e]/40">اضغط على الطراز للذهاب لصفحته</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full flex items-center justify-center border border-[#1a237e]/10 hover:bg-[#1a237e] hover:text-blue-200 text-[#1a237e] transition-all duration-300">
            <IoChevronForward size={14} />
          </button>
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full flex items-center justify-center border border-[#1a237e]/10 hover:bg-[#1a237e] hover:text-blue-200 text-[#1a237e] transition-all duration-300">
            <IoChevronBack size={14} />
          </button>
        </div>
      </motion.div>

      <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {visibleCategories.map((cat, i) => {
          const img = categoryImages[cat.slug];
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/smartphones/${cat.slug}`}
                className="relative flex-shrink-0 w-[130px] sm:w-[175px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-400 group block border border-transparent hover:border-blue-400/40"
                style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F0F4FF 100%)", boxShadow: "0 4px 20px rgba(26,35,126,0.06)" }}
              >
                <div className="relative w-full h-[95px] sm:h-[140px] overflow-hidden">
                  {img ? (
                    <Image src={img} alt={cat.label} fill className="object-contain p-3 sm:p-4 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1" sizes="(max-width: 640px) 130px, 175px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#1a237e]/15 font-bold text-2xl">S</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold" style={{ backgroundColor: "#1a237e", color: "#93c5fd" }}>
                    {categoryCounts[cat.slug]}
                  </div>
                </div>
                <div className="px-2 py-2 sm:px-3 sm:py-3 text-center border-t border-blue-100/60">
                  <p className="text-[11px] sm:text-[13px] font-bold truncate" style={{ color: "#1a237e" }}>{cat.label}</p>
                  <p className="text-[9px] sm:text-[11px] mt-0.5 sm:mt-1 text-[#1a237e]/50 truncate">{cat.desc}</p>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style={{ background: "radial-gradient(circle at 50% 30%, rgba(59,130,246,0.08), transparent 70%)" }} />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-5">
        {Array.from({ length: totalDots }).map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300" style={{ width: activeIndex === i ? 22 : 6, height: 6, backgroundColor: activeIndex === i ? "#3b82f6" : "#dbeafe" }} />
        ))}
      </div>
    </section>
  );
}
