"use client";

import { useMemo, useState } from "react";
// Pastikan tipe data ini sesuai sama yang lo punya
import { ProductWithCategory } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processCheckout } from "@/actions/orders";
import { CartItem } from "@/types/orders";
import { Input } from "../ui/input";

export function PosTerminal({ products }: { products: ProductWithCategory[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // daftar kategori
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((p) => p.category?.name).filter(Boolean),
    );
    return ["Semua", ...Array.from(uniqueCategories)];
  }, [products]);

  // Filter produk berdasarkan Search & Kategori
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "Semua" || product.category?.name === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // fungsi tambah barang ke keranjang
  const addToCart = (product: ProductWithCategory) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      // Cegah kalau barang ditambah melebihi stok di database
      if (existing && existing.quantity >= product.stock) {
        toast.error(`Stok ${product.name} tidak mencukupi!`);
        return prev;
      }
      if (!existing && product.stock < 1) {
        toast.error("Stok barang habis!");
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // fungsi kurangi jumlah barang di keranjang
  const decreaseQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  // fungsi hapus barang dari keranjang
  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Hitung total harga otomatis
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // fungsi checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);
    const toastId = toast.loading("Memproses pembayaran...");

    try {
      const result = await processCheckout(
        cart,
        totalAmount,
        "CASH",
        customerName,
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message, { id: toastId });
      setCart([]);
      setCustomerName("");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="space-y-3 shrink-0 pr-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama produk (contoh: Kopi)..."
              className="pl-9 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Kategori Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat as string}
                variant={activeCategory === cat ? "default" : "outline"}
                className={`rounded-full shrink-0 h-8 text-xs ${
                  activeCategory === cat
                    ? "bg-indigo-600"
                    : "bg-white text-slate-600"
                }`}
                onClick={() => setActiveCategory(cat as string)}
              >
                {cat as string}
              </Button>
            ))}
          </div>
        </div>

        {/* List Produk yang udah difilter */}
        <div className="flex-1 overflow-y-auto pr-2 pb-20 lg:pb-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Search className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">Produk tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full"
                  onClick={() => addToCart(product)}
                >
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-slate-100/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Habis
                      </span>
                    </div>
                  )}

                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-2 font-bold text-2xl">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-indigo-600 font-bold text-sm">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Stok: {product.stock}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* keranjang belanja */}
      <div className="w-full lg:w-100 h-130 bg-white border rounded-xl flex flex-col shadow-sm overflow-hidden shrink-0">
        <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800">Pesanan Saat Ini</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">Belum ada barang dipilih</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start gap-2 border-b pb-3"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm leading-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-indigo-600 font-medium">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5 border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-600 hover:bg-white rounded-sm"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-600 hover:bg-white rounded-sm"
                      onClick={() => addToCart(item as ProductWithCategory)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 space-y-4 z-10">
          <div className="space-y-1.5 mb-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nama Pelanggan (Opsional)
            </label>
            <Input
              placeholder="Otong Surotong "
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="flex justify-between items-end">
            <span className="font-semibold text-slate-500 text-sm">
              Total Tagihan
            </span>
            <span className="font-black text-2xl text-indigo-600 leading-none">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg font-bold shadow-md shadow-indigo-200"
            disabled={cart.length === 0 || isLoading}
            onClick={handleCheckout}
          >
            {isLoading ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  );
}
