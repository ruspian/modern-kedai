"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/actions/product";
import { ProductWithCategory } from "@/types/product";
import { ProductAksi } from "./ProductAksi";

export function ProductList({
  initialData,
  initialCursor,
}: {
  initialData: ProductWithCategory[];
  initialCursor?: string;
}) {
  const [products, setProducts] = useState(initialData);
  const [cursor, setCursor] = useState(initialCursor);

  // loading
  const isFetching = useRef(false);
  const { ref, inView } = useInView();

  useEffect(() => {
    // stop kalau lagi loading
    if (!inView || !cursor || isFetching.current) return;

    let isMounted = true;
    const loadMore = async () => {
      isFetching.current = true; // Kunci gemboknya

      try {
        const res = await getProducts(cursor);
        if (isMounted) {
          setProducts((prev) => [...prev, ...(res?.items || [])]);

          setCursor(res?.nextCursor || undefined);
        }
      } catch (error) {
        console.error("Gagal muat data:", error);
      } finally {
        if (isMounted) {
          isFetching.current = false; // Buka lagi gemboknya
        }
      }
    };

    loadMore();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [inView, cursor]);

  const handleUpdateProduct = (updatedItem: ProductWithCategory) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  useEffect(() => {
    setProducts(initialData);
  }, [initialData]);

  return (
    <>
      <tbody className="divide-y divide-slate-100">
        {products.map((product) => (
          <tr
            key={product.id}
            className="hover:bg-slate-50/50 transition-colors"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Package className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-900">
                  {product.name}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <Badge variant="secondary">
                {product.category?.name || "Tanpa Kategori"}
              </Badge>
            </td>
            <td className="px-6 py-4 font-mono">
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
              <ProductAksi product={product} onUpdate={handleUpdateProduct} />
            </td>
          </tr>
        ))}
      </tbody>

      {/* loading */}
      {cursor && (
        <tfoot className="w-full">
          <tr>
            <td colSpan={5}>
              <div
                ref={ref}
                className="p-4 text-center text-slate-400 text-xs flex justify-center items-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Memuat data...
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </>
  );
}
