export const dynamic = "force-dynamic";

import { AddProductDialog } from "@/components/layouts/AddProductDialog";
import { ProductList } from "@/components/layouts/ProductList";
import { getProducts } from "@/actions/product";

export default async function ProductsPage() {
  const { items, nextCursor } = await getProducts();

  if (!items) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventaris Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola stok dan harga produk ModernKedai lo di sini.
          </p>
        </div>
        <AddProductDialog />
      </div>

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
            <ProductList
              key={items[0]?.id || "empty"} // reset state kalo data berubah
              initialData={items}
              initialCursor={nextCursor}
            />
          </table>
        </div>
      </div>
    </div>
  );
}
