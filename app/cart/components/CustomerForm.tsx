"use client";

import { useState, useMemo } from "react";
import { IoPersonOutline, IoCallOutline, IoWalletOutline, IoCalendarOutline, IoCheckmarkCircle } from "react-icons/io5";
import type { CustomerInfo } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const MONTHS_OPTIONS = Array.from({ length: installmentMonths ?? 24 }, (_, i) => i + 1);
  const minDownPayment = 1000 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [months, setMonths] = useState(initialData?.months ?? 24);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const downPayment = minDownPayment + downPaymentExtra;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const monthlyPayment = useMemo(() => {
    if (installmentType === "full") return 0;
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return { index: i + 1, date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, amount: monthlyPayment };
    });
  }, [months, monthlyPayment]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "مطلوب";
    if (!nationalId.trim()) newErrors.nationalId = "مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) newErrors.nationalId = "رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام";
    if (!whatsapp.trim()) newErrors.whatsapp = "مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) newErrors.whatsapp = "يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) newErrors.address = "مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(`field-${firstErrorField}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
  };

  const inputBase = "w-full h-11 rounded-lg px-4 text-sm font-medium focus:outline-none transition";
  const getInputStyle = (field: string) => ({
    backgroundColor: "#faf7f2",
    border: errors[field] ? "1.5px solid #ef4444" : "1.5px solid rgba(188,146,85,0.2)",
    color: "#0A1825",
  });

  return (
    <div className="space-y-4">
      {/* ── Section: Personal ── */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.12)" }}>
        <SectionHeader icon={<IoPersonOutline size={16} />} title="البيانات الشخصية" />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div id="field-name">
            <Label text="الاسم الكامل" required error={errors.name} />
            <input
              value={name}
              onChange={(e) => { setName(e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="أدخل اسمك"
              className={inputBase}
              style={getInputStyle("name")}
            />
          </div>
          <div id="field-nationalId">
            <Label text="رقم الهوية" required error={errors.nationalId} />
            <input
              value={nationalId}
              onChange={(e) => { setNationalId(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, nationalId: "" })); }}
              placeholder="10XXXXXXXX"
              maxLength={10}
              className={inputBase}
              style={getInputStyle("nationalId")}
            />
          </div>
        </div>
      </div>

      {/* ── Section: Contact ── */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.12)" }}>
        <SectionHeader icon={<IoCallOutline size={16} />} title="التواصل والعنوان" />
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div id="field-whatsapp">
            <Label text="واتساب" required error={errors.whatsapp} />
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, whatsapp: "" })); }}
              placeholder="05XXXXXXXX"
              className={inputBase}
              style={getInputStyle("whatsapp")}
              dir="ltr"
            />
          </div>
          <div id="field-address">
            <Label text="العنوان" required error={errors.address} />
            <input
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
              placeholder="المدينة - الحي"
              className={inputBase}
              style={getInputStyle("address")}
            />
          </div>
        </div>
      </div>

      {/* ── Section: Payment ── */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.12)" }}>
        <SectionHeader icon={<IoWalletOutline size={16} />} title="طريقة السداد" />
        <div className="p-4 space-y-4">
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1.5px solid rgba(188,146,85,0.25)" }}>
            <button
              type="button"
              onClick={() => setInstallmentType("full")}
              className="flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: installmentType === "full" ? "rgba(188,146,85,0.12)" : "#fff",
                color: installmentType === "full" ? "#0A1825" : "#A77D4B",
              }}
            >
              {installmentType === "full" && <IoCheckmarkCircle size={14} style={{ color: "#BC9255" }} />}
              كاش
            </button>
            <button
              type="button"
              onClick={() => setInstallmentType("installment")}
              className="flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: installmentType === "installment" ? "rgba(188,146,85,0.12)" : "#fff",
                color: installmentType === "installment" ? "#0A1825" : "#A77D4B",
              }}
            >
              {installmentType === "installment" && <IoCheckmarkCircle size={14} style={{ color: "#BC9255" }} />}
              تقسيط
            </button>
          </div>

          {installmentType === "installment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label text="عدد الأشهر" />
                  <select
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className={`${inputBase} cursor-pointer`}
                    style={{ backgroundColor: "#faf7f2", border: "1.5px solid rgba(188,146,85,0.2)", color: "#0A1825" }}
                  >
                    {MONTHS_OPTIONS.map((m) => <option key={m} value={m}>{m} شهر</option>)}
                  </select>
                </div>
                <div>
                  <Label text="الدفعة الأولى" />
                  <select
                    value={String(downPaymentExtra)}
                    onChange={(e) => setDownPaymentExtra(Number(e.target.value))}
                    className={`${inputBase} cursor-pointer`}
                    style={{ backgroundColor: "#faf7f2", border: "1.5px solid rgba(188,146,85,0.2)", color: "#0A1825" }}
                  >
                    {DOWN_PAYMENT_OPTIONS.map((v) => <option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>)}
                    <option value={total - minDownPayment}>كامل ({fmt(total)})</option>
                  </select>
                </div>
              </div>

              {/* Monthly highlight */}
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(188,146,85,0.08)", border: "1.5px solid rgba(188,146,85,0.2)" }}>
                <p className="text-[10px] mb-1" style={{ color: "#A77D4B" }}>القسط الشهري</p>
                <p className="text-2xl font-black" style={{ color: "#0A1825" }}>{fmt(monthlyPayment)} <span className="text-xs font-normal" style={{ color: "#A77D4B" }}>ر.س</span></p>
              </div>

              {/* Schedule */}
              {months > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(188,146,85,0.15)" }}>
                  <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#faf7f2", borderBottom: "1px solid rgba(188,146,85,0.1)" }}>
                    <IoCalendarOutline size={13} style={{ color: "#BC9255" }} />
                    <span className="text-xs font-bold" style={{ color: "#0A1825" }}>جدول السداد</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {schedule.map((row, i) => (
                      <div
                        key={row.index}
                        className="flex items-center justify-between px-4 py-2 text-xs"
                        style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#faf7f2", borderBottom: "1px solid rgba(188,146,85,0.06)" }}
                      >
                        <span className="font-bold w-6" style={{ color: "#A77D4B" }}>{row.index}</span>
                        <span style={{ color: "#0A1825" }}>{row.date}</span>
                        <span className="font-bold" style={{ color: "#0A1825" }}>{fmt(row.amount)} ر.س</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-xl font-black text-base transition hover:scale-[1.01] active:scale-[0.98] shadow-xl"
        style={{ backgroundColor: "#BC9255", color: "#0A1825" }}
      >
        إتمام الطلب ←
      </button>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "#faf7f2", borderBottom: "1px solid rgba(188,146,85,0.12)" }}>
      <span style={{ color: "#BC9255" }}>{icon}</span>
      <span className="text-xs font-bold" style={{ color: "#0A1825" }}>{title}</span>
    </div>
  );
}

function Label({ text, required, error }: { text: string; required?: boolean; error?: string }) {
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <span className="text-xs font-bold" style={{ color: "#0A1825" }}>{text}</span>
      {required && <span className="text-red-400 text-[9px]">*</span>}
      {error && <span className="text-red-500 text-[10px] font-bold mr-auto">{error}</span>}
    </div>
  );
}
