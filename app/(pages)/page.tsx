import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 🔥 Narik semua data berbarengan (Concurrent Fetching) biar super ngebut
  const [
    revenueResult,
    totalOrders,
    uniqueCustomers,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    // 1. Total Pendapatan
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    // 2. Total Transaksi
    prisma.order.count(),
    // 3. Pelanggan Unik
    prisma.order.groupBy({
      by: ["customerName"],
      where: { customerName: { not: null } },
    }),
    // 4. Produk Stok Menipis (Stok <= 5)
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      take: 5,
      orderBy: { stock: "asc" },
    }),
    // 5. 5 Transaksi Terakhir
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } }, // Tarik nama kasirnya aja
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;
  const totalCustomers = uniqueCustomers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Ringkasan performa ModernKedai hari ini.
        </p>
      </div>

      {/* --- 4 KOTAK METRIK UTAMA --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 1. Pendapatan */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Pendapatan
            </CardTitle>
            <div className="h-8 w-8 bg-indigo-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        {/* 2. Transaksi */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Transaksi
            </CardTitle>
            <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalOrders}
            </div>
          </CardContent>
        </Card>

        {/* 3. Pelanggan */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pelanggan Terdaftar
            </CardTitle>
            <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalCustomers}
            </div>
          </CardContent>
        </Card>

        {/* 4. Stok Peringatan */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Stok Menipis
            </CardTitle>
            <div className="h-8 w-8 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lowStockProducts.length} Produk
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- BAGIAN BAWAH (GRAFIK/TABEL) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* KIRI: Transaksi Terakhir (Lebar 4 kolom) */}
        <Card className="shadow-sm border-0 bg-white lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Transaksi Terakhir</CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Penjualan terbaru dari kasir.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/orders/history">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Belum ada transaksi hari ini.
                </p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.customerName || "Pelanggan Umum"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.orderNumber} • Kasir:{" "}
                        {order.user?.name || "Sistem"}
                      </p>
                    </div>
                    <div className="font-bold text-indigo-600">
                      +Rp {order.totalAmount.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* KANAN: Peringatan Stok (Lebar 3 kolom) */}
        <Card className="shadow-sm border-0 bg-white lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Butuh Restock Segera</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Produk dengan stok 5 atau kurang.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  Semua stok produk aman! 🎉
                </p>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Rp {product.costPrice.toLocaleString("id-ID")}/item
                        </p>
                      </div>
                    </div>
                    <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">
                      Sisa {product.stock}
                    </div>
                  </div>
                ))
              )}
            </div>
            {lowStockProducts.length > 0 && (
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/products">
                  Kelola Inventaris <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
