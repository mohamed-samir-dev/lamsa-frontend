"use client";
import { useState } from "react";

interface Props {
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  fingerprint?: string;
  ip?: string;
}

export default function BlockModal({ onClose, onConfirm, fingerprint, ip }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" dir="rtl">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-1">حظر الجهاز</h2>
        <p className="text-gray-400 text-sm mb-5">
          {fingerprint && <span className="block">Fingerprint: <span className="text-gray-300 font-mono text-xs">{fingerprint}</span></span>}
          {ip && <span className="block">IP: <span className="text-gray-300 font-mono text-xs">{ip}</span></span>}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">سبب الحظر</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: محاولة احتيال، سلوك مشبوه..."
              required
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 placeholder-gray-600 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              {loading ? "جاري الحظر..." : "تأكيد الحظر"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
