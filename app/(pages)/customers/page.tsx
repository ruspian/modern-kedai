// app/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  //   kelompokkan data berdasarkan customerName
  const customerStats = await prisma.order.groupBy({
    by: ["customerName"],
    _count: {
      id: true, // Ngitung total jumlah transaksi per orang
    },
    _sum: {
      totalAmount: true, // Ngitung total uang yang dihabiskan
    },
    where: {
      customerName: {
        not: null, // Cuma ambil transaksi yang ada nama pelanggannya
      },
    },
    orderBy: {
      _sum: {
        totalAmount: "desc",
      },
    },
  });

  // filter untuk pelanggan yang ada namanya
  const validCustomers = customerStats.filter(
    (c) => c.customerName && c.customerName.trim() !== "",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Pelanggan
          </h1>
          <p className="text-sm text-slate-500">
            Pantau pelanggan setiamu dan total transaksinya.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4 text-center">Total Transaksi</th>
                <th className="px-6 py-4 text-right">Total Belanja (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {validCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada data pelanggan yang tercatat.</p>
                  </td>
                </tr>
              ) : (
                validCustomers.map((customer, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">
                          {customer.customerName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {customer.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded-md">
                        {customer._count.id}x Belanja
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      Rp{" "}
                      {(customer._sum.totalAmount || 0).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
