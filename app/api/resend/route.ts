import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { orderId, customerName } = await req.json();

  if (!orderId) {
    return NextResponse.json({ ok: false, error: "بيانات ناقصة" }, { status: 400 });
  }

  const text = [
    `🔄 تم طلب إعادة ارسال كود`,
    `🆔 رقم الطلب: ${orderId}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
  ].join("\n");

  const chatIds = [process.env.TELEGRAM_CHAT_ID, "967729669"].filter(Boolean);
  let sent = false;
  for (const chatId of chatIds) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text }),
          }
        );
        if (res.ok) { sent = true; break; }
      } catch {}
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  return NextResponse.json({ ok: sent });
}
