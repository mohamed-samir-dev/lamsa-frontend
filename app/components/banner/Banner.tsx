"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    image: "/hero1.webp",
    tag: "أحدث الأجهزة",
    title: "أداء يفوق التوقعات",
    titleHighlight: "بتقنية لا تُلمس",
    description: "اكتشف أحدث الإصدارات من الهواتف الذكية بأفضل الأسعار وضمان موثوق",
    buttons: [
      { text: "تسوّق الآن", filled: true },
      { text: "اكتشف الأجهزة", filled: false },
    ],
  },
  {
    image: "/hero2.webp",
    tag: "عالم Apple",
    title: "كل ما تحتاجه",
    titleHighlight: "من عالم Apple",
    description: "اكتشف مجموعة واسعة من أجهزة آيفون، الملحقات الأصلية، الساعات والسماعات بأفضل الأسعار",
    buttons: [{ text: "اكتشف المنتجات", filled: true }],
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isFirst, setIsFirst] = useState(true);

  const next = useCallback(() => {
    setIsFirst(false);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-[40vh] sm:min-h-[55vh] md:min-h-[85vh] flex items-center overflow-hidden" style={{ backgroundColor: "#0A1825" }}>
      {/* Background Images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={isFirst ? false : { opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={slide.image}
            alt={slide.tag}
            fill
            className="object-cover object-center"
            priority={current === 0}
            sizes="100vw"
            quality={75}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-2xl text-right"
            style={{ fontFamily: "'Cairo', sans-serif" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
              exit: {},
            }}
          >
            {/* Tag */}
            <motion.span
              className="inline-block font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase mb-3 sm:mb-4 border-b-2 pb-1"
              style={{ color: "#BC9255", borderColor: "#BC9255" }}
              variants={{
                hidden: { opacity: 0, x: 40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
              }}
            >
              {slide.tag}
            </motion.span>

            {/* Title */}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-5 leading-tight text-[#0A1825]"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
                exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
              }}
            >
              {slide.title}
              <br />
              <span style={{ color: "#BC9255" }}>{slide.titleHighlight}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg font-semibold sm:font-normal text-[#0A1825]/80 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
              }}
            >
              {slide.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                exit: { opacity: 0, transition: { duration: 0.2 } },
              }}
            >
              {slide.buttons.map((btn) => (
                <motion.a
                  key={btn.text}
                  href="#products"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-lg font-bold ${
                    btn.filled ? "" : "border-2"
                  }`}
                  style={
                    btn.filled
                      ? { backgroundColor: "#BC9255", color: "#0A1825" }
                      : { borderColor: "#BC9255", color: "#BC9255" }
                  }
                >
                  {btn.text}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-2 rounded-full"
            animate={{
              width: i === current ? 24 : 8,
              backgroundColor: i === current ? "#BC9255" : "rgba(255,255,255,0.4)",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        ))}
      </div>
    </section>
  );
}
