// app/orders/history/page.tsx
import { prisma } from "@/lib/prisma";
import { Receipt, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function OrderHistoryPage() {
  // Tarik 50 data transaksi terakhir dari database
  const orders = await prisma.order.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Riwayat Transaksi
          </h1>
          <p className="text-sm text-slate-500">
            Daftar 50 penjualan terakhir di ModernKedai.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nomor Nota & Waktu</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Kasir</th>
                <th className="px-6 py-4 text-center">Metode</th>
                <th className="px-6 py-4 text-right">Total Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada riwayat transaksi.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const formattedDate = new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt));

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Nota & Tanggal */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-indigo-600 mb-1">
                          {order.orderNumber}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {formattedDate} WIB
                        </div>
                      </td>

                      {/*  Pelanggan & Jumlah Item */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {order.customerName || "Pelanggan Umum"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {order._count.items} macam produk
                        </div>
                      </td>

                      {/*  Nama Kasir */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {order.user?.name || "Sistem"}
                        </span>
                      </td>

                      {/*  Metode Pembayaran */}
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant="secondary"
                          className={
                            order.paymentMethod === "CASH"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : order.paymentMethod === "QRIS"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          }
                        >
                          {order.paymentMethod}
                        </Badge>
                      </td>

                      {/*  Total Harga */}
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
