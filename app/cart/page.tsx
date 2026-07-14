"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCartOutline, IoChevronBack, IoSparkles } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");
const subscribe = (cb: () => void) => { cb(); return () => {}; };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined : undefined;

  if (!mounted) return null;

  if (items.length === 0)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" dir="rtl" style={{ background: "linear-gradient(to bottom, #ffffff, #f5f0e8)" }}>
        <div className="text-center space-y-5">
          <div className="w-28 h-28 mx-auto rounded-3xl rotate-6 flex items-center justify-center" style={{ backgroundColor: "rgba(188,146,85,0.08)", border: "2px dashed rgba(188,146,85,0.3)" }}>
            <IoCartOutline size={48} style={{ color: "#BC9255" }} className="-rotate-6" />
          </div>
          <h2 className="text-2xl font-black" style={{ color: "#0A1825" }}>سلتك فاضية!</h2>
          <p className="text-sm" style={{ color: "#A77D4B" }}>ابدأ التسوق واضف منتجاتك المفضلة</p>
          <button
            onClick={() => router.push("/")}
            className="px-10 py-3.5 rounded-xl font-bold text-sm transition hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#BC9255", color: "#fff" }}
          >
            ابدأ التسوق
          </button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen pb-24 lg:pb-8" dir="rtl" style={{ background: "linear-gradient(to bottom, #ffffff, #f5f0e8)" }}>
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(188,146,85,0.15)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-bold transition hover:opacity-70" style={{ color: "#A77D4B" }}>
            <IoChevronBack size={18} />
            رجوع
          </button>
          <h1 className="text-sm font-black tracking-wide" style={{ color: "#0A1825" }}>
            سلة التسوق
          </h1>
          <Link href="/" className="text-xs font-bold px-3 py-1.5 rounded-lg transition hover:opacity-80" style={{ backgroundColor: "rgba(188,146,85,0.1)", color: "#A77D4B" }}>
            الرئيسية
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Main Column: Items + Form ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cart Items */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(188,146,85,0.1)" }}>
                  <IoCartOutline size={16} style={{ color: "#BC9255" }} />
                </div>
                <h2 className="text-base font-black" style={{ color: "#0A1825" }}>منتجاتك</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(188,146,85,0.1)", color: "#A77D4B" }}>{count}</span>
              </div>
              <div className="space-y-3">
                {items.map(({ product, qty }) => (
                  <CartItem key={product._id} product={product} qty={qty} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </div>
            </section>

            {/* Customer Form */}
            <section>
              <CustomerForm
                total={total}
                itemCount={count}
                initialData={customer}
                installmentMonths={installmentMonths}
                onSubmit={(info: CustomerInfo) => {
                  setCustomer(info);
                  router.push("/checkout");
                }}
              />
            </section>
          </div>

          {/* ── Sidebar: Order Summary (desktop only) ── */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="lg:sticky lg:top-20">
              <div className="rounded-3xl overflow-hidden shadow-md" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.15)" }}>
                {/* Header */}
                <div className="p-5 text-center" style={{ backgroundColor: "#faf7f2" }}>
                  <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: "rgba(188,146,85,0.1)" }}>
                    <IoSparkles size={18} style={{ color: "#BC9255" }} />
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#A77D4B" }}>إجمالي الطلب</p>
                  <p className="text-3xl font-black" style={{ color: "#0A1825" }}>{fmt(total)}</p>
                  <p className="text-xs" style={{ color: "#A77D4B" }}>ريال سعودي</p>
                </div>

                {/* Items breakdown */}
                <div className="p-4 space-y-2.5">
                  {items.map(({ product, qty }) => {
                    const price = product.salePrice ?? product.originalPrice ?? product.price;
                    return (
                      <div key={product._id} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(188,146,85,0.06)" }}>
                        <span className="text-xs truncate max-w-[55%]" style={{ color: "#0A1825" }}>{product.name}</span>
                        <div className="text-left">
                          <span className="text-xs font-bold" style={{ color: "#A77D4B" }}>{fmt(price * qty)}</span>
                          {qty > 1 && <span className="text-[9px] mr-1" style={{ color: "rgba(167,125,75,0.5)" }}>×{qty}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-4" style={{ backgroundColor: "#faf7f2", borderTop: "1px solid rgba(188,146,85,0.1)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs" style={{ color: "#A77D4B" }}>المجموع</span>
                    <span className="text-sm font-bold flex items-center gap-0.5" style={{ color: "#0A1825" }}>{fmt(total)} <img src="/money-icon.webp" alt="ر.س" className="inline-block w-4 h-4" /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "#A77D4B" }}>الشحن</span>
                    <span className="text-xs font-bold" style={{ color: "#BC9255" }}>مجاني</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Fixed Bottom Bar (total only) ── */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden" style={{ backgroundColor: "#fff", borderTop: "1px solid rgba(188,146,85,0.2)", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px]" style={{ color: "#A77D4B" }}>الإجمالي</p>
            <p className="text-xl font-black flex items-center gap-1" style={{ color: "#0A1825" }}>{fmt(total)} <img src="/money-icon.webp" alt="ر.س" className="inline-block w-5 h-5" /></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ backgroundColor: "rgba(188,146,85,0.1)", color: "#A77D4B" }}>{count} منتج</span>
            <span className="text-[10px] font-bold" style={{ color: "#BC9255" }}>شحن مجاني</span>
          </div>
        </div>
      </div>
    </main>
  );
}
