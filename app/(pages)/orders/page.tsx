import { PosTerminal } from "@/components/layouts/PosTerminal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Kasir (Point of Sale)
        </h1>
        <p className="text-sm text-slate-500">
          Pilih produk untuk ditambahkan ke pesanan pelanggan.
        </p>
      </div>

      <PosTerminal products={products} />
    </div>
  );
}
