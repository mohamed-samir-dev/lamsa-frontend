"use client";

import { motion } from "framer-motion";
import { HiShieldCheck, HiCreditCard, HiTruck } from "react-icons/hi2";

const features = [
  { icon: HiCreditCard, title: "دفع آمن", desc: "طرق دفع متعددة ومشفّرة" },
  { icon: HiShieldCheck, title: "ضمان رسمي", desc: "ضمان معتمد على جميع الأجهزة" },
  { icon: HiTruck, title: "توصيل سريع", desc: "شحن سريع لجميع المناطق" },
];

export default function WhyLamsa() {
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
          لماذا لمسة؟
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#DFC4A4] to-[#DFC4A4]" />
      </motion.div>

      {/* Features in a horizontal row */}
      <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: "#1F2C3E" }}>
              <f.icon size={20} style={{ color: "#DFC4A4" }} />
            </div>
            <div>
              <span className="text-[13px] sm:text-[14px] font-bold block" style={{ color: "#1F2C3E" }}>{f.title}</span>
              <span className="text-[11px] sm:text-[12px]" style={{ color: "rgba(31,44,62,0.55)" }}>{f.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
