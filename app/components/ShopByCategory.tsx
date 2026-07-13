"use client";

import { ArrowLeft } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { motion } from "framer-motion";

const categories = [
  { name: "iPhone", icon: <FaApple className="w-4 h-4" />, desc: "أكثر من مجرد هاتف", image: "/iphone.webp" },
  { name: "Samsung", icon: null, desc: "تقنية بلا حدود", image: "/samsong.webp" },
  { name: "MacBook Air", icon: <FaApple className="w-4 h-4" />, desc: "خفة وأداء استثنائي", image: "/mac.webp" },
  { name: "Apple Watch", icon: <FaApple className="w-4 h-4" />, desc: "ساعتك الذكية", image: "/watch.webp" },
  { name: "AirPods", icon: <FaApple className="w-4 h-4" />, desc: "صوت نقي بلا حدود", image: "/air-pod.webp" },
  { name: "الاكسسوارات", icon: null, desc: "كل ما تحتاجه", image: "/acc.webp" },
  { name: "الصوتيات", icon: null, desc: "تجربة صوت مذهلة", image: "/audio.webp" },
];

export default function ShopByCategory() {
  return (
    <section className="w-full py-10 sm:py-16 overflow-hidden" dir="rtl" style={{ background: "linear-gradient(to bottom, #ffffff, #f5f0e8)" }}>
      {/* Header */}
      <motion.div
        className="text-center mb-8 sm:mb-12 px-4"
        style={{ fontFamily: "'Cairo', sans-serif" }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span
          className="inline-block font-bold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-3 sm:mb-4 border-b-2 pb-1"
          style={{ color: "#BC9255", borderColor: "#BC9255" }}
        >
          تسوّق حسب الأقسام
        </span>
        <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight" style={{ color: "#0A1825" }}>
          اختر قسمك المفضّل
          <br />
          <span style={{ color: "#BC9255" }}>وابدأ التسوّق</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base font-semibold sm:font-normal text-[#0A1825]/60 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          أفضل الأجهزة الأصلية بأسعار لا تُقاوم وضمان موثوق
        </p>
      </motion.div>

      {/* Marquee */}
      <motion.div
        className="relative overflow-hidden px-2 sm:px-0"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <div className="flex animate-marquee-rtl gap-3 sm:gap-4 w-max">
          {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
            <div
              key={`${cat.name}-${i}`}
              className="group relative w-40 sm:w-52 md:w-60 flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white/80 backdrop-blur-sm border border-[#BC9255]/10 hover:border-[#BC9255]/40 shadow-[0_4px_20px_rgba(188,146,85,0.08)] hover:shadow-[0_12px_40px_rgba(188,146,85,0.18)] hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-28 sm:h-36 md:h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f9f6f1] to-[#efe8dc]" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative px-3 sm:px-4 pb-3 sm:pb-4 -mt-3">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                  {cat.icon && <span style={{ color: "#BC9255" }}>{cat.icon}</span>}
                  <h3 className="text-[13px] sm:text-[15px] font-bold text-[#0A1825]">{cat.name}</h3>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0A1825]/50 mb-2 sm:mb-3 leading-relaxed">{cat.desc}</p>
                <div
                  className="flex items-center justify-center gap-1.5 sm:gap-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border-2 border-[#BC9255]/40 group-hover:border-[#BC9255] group-hover:bg-[#BC9255] transition-all duration-300"
                >
                  <span className="text-[10px] sm:text-xs font-extrabold text-[#BC9255] group-hover:text-white transition-colors duration-300">تسوّق الآن</span>
                  <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#BC9255] group-hover:text-white group-hover:-translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 80s linear infinite;
        }
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
