"use client";
import { useState, useEffect, useCallback } from "react";
import BlockModal from "./BlockModal";

interface DeviceLog {
  _id: string;
  fingerprint: string | null;
  ip: string | null;
  userAgent: string | null;
  firstSeen: string;
  lastSeen: string;
  requestsCount: number;
}

function parseUA(ua: string | null) {
  if (!ua) return { browser: "—", os: "—" };
  const browser =
    ua.includes("Chrome") && !ua.includes("Edg") ? "Chrome" :
    ua.includes("Firefox") ? "Firefox" :
    ua.includes("Safari") && !ua.includes("Chrome") ? "Safari" :
    ua.includes("Edg") ? "Edge" :
    ua.includes("OPR") || ua.includes("Opera") ? "Opera" : "أخرى";
  const os =
    ua.includes("Windows") ? "Windows" :
    ua.includes("Mac") ? "Mac" :
    ua.includes("Android") ? "Android" :
    ua.includes("iPhone") || ua.includes("iPad") ? "iOS" :
    ua.includes("Linux") ? "Linux" : "أخرى";
  return { browser, os };
}

export default function DeviceLogsTable() {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [blockTarget, setBlockTarget] = useState<DeviceLog | null>(null);
  const [toast, setToast] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/secret/devices?type=logs&page=${page}&limit=20&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleBlock(reason: string) {
    if (!blockTarget) return;
    const res = await fetch("/api/secret/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "block",
        fingerprint: blockTarget.fingerprint,
        ip: blockTarget.ip,
        userAgent: blockTarget.userAgent,
        reason,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("تم الحظر بنجاح ✓");
      setBlockTarget(null);
    } else {
      showToast("حدث خطأ أثناء الحظر");
    }
  }

  async function handleDeleteLog(id: string) {
    if (!confirm("حذف هذا السجل؟")) return;
    await fetch("/api/secret/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-log", id }),
    });
    fetchLogs();
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl">
          {toast}
        </div>
      )}

      {blockTarget && (
        <BlockModal
          fingerprint={blockTarget.fingerprint || undefined}
          ip={blockTarget.ip || undefined}
          onClose={() => setBlockTarget(null)}
          onConfirm={handleBlock}
        />
      )}

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
          placeholder="بحث بـ IP أو Fingerprint أو Browser..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 placeholder-gray-600"
        />
        <button
          onClick={() => { setSearch(searchInput); setPage(1); }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          بحث
        </button>
      </div>

      <p className="text-gray-500 text-xs mb-3">إجمالي: {total} جهاز</p>

      {loading ? (
        <div className="text-center py-16 text-gray-500">جاري التحميل...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-gray-600">لا توجد سجلات</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/60 text-gray-400 text-xs">
                <th className="px-4 py-3 text-right font-medium">IP</th>
                <th className="px-4 py-3 text-right font-medium">Fingerprint</th>
                <th className="px-4 py-3 text-right font-medium">المتصفح</th>
                <th className="px-4 py-3 text-right font-medium">النظام</th>
                <th className="px-4 py-3 text-right font-medium">آخر زيارة</th>
                <th className="px-4 py-3 text-right font-medium">الطلبات</th>
                <th className="px-4 py-3 text-right font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map((log) => {
                const { browser, os } = parseUA(log.userAgent);
                return (
                  <tr key={log._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{log.ip || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[120px] truncate" title={log.fingerprint || ""}>
                      {log.fingerprint ? log.fingerprint.slice(0, 12) + "..." : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{browser}</td>
                    <td className="px-4 py-3 text-gray-300">{os}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(log.lastSeen).toLocaleString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded-lg">
                        {log.requestsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBlockTarget(log)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          حظر
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            السابق
          </button>
          <span className="text-gray-400 text-sm">{page} / {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
