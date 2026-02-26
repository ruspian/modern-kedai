"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Package, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/layouts/DeleteButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProducts } from "@/actions/product";
import { ProductWithCategory } from "@/types/product";

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
  }, [inView, cursor]); // Cukup pantau dua ini aja

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
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
        ))}
      </tbody>

      {/* 3. Trigger Area yang lebih clean */}
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
