import { prisma } from "@/lib/prisma";
import { Package, MoreHorizontal, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "@/components/layouts/AddProductDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "@/components/layouts/DeleteButton";

export default async function ProductsPage() {
  // Ambil data produk langsung dari DB (Server Component)
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventaris Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola stok dan harga produk ModernKedai lo di sini.
          </p>
        </div>
        {/* Tombol yang manggil Modal Form kita tadi */}
        <AddProductDialog />
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Jual</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox className="h-8 w-8" />
                      <p>
                        Belum ada produk. Klik &quot;Tambah Produk&quot; untuk
                        mulai.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                          <Package className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="font-medium text-slate-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-normal">
                        {product.category.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          product.stock <= 5
                            ? "text-red-600 font-bold"
                            : "text-slate-600"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <DeleteButton id={product.id} name={product.name} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
