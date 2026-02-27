"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit } from "lucide-react";
import { updateProduct } from "@/actions/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteButton } from "./DeleteButton";
import { ProductWithCategory } from "@/types/product";

export function ProductAksi({
  product,
  onUpdate,
}: {
  product: ProductWithCategory;
  onUpdate: (updatedItem: ProductWithCategory) => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  async function handleEditSubmit(formData: FormData) {
    const toastId = toast.loading("Mengupdate produk...");

    try {
      const result = await updateProduct(product.id, formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      if (result.data) {
        onUpdate(result.data);
      }

      toast.success(result.message, { id: toastId });
      setIsEditOpen(false);

      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => setIsEditOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Produk
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <DeleteButton id={product.id} name={product.name} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit {product.name}</DialogTitle>
          </DialogHeader>
          <form action={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nama Produk</Label>
              <Input name="name" defaultValue={product.name} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Harga Jual</Label>
                <Input
                  name="price"
                  type="number"
                  defaultValue={product.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Modal</Label>
                <Input
                  name="costPrice"
                  type="number"
                  defaultValue={product.costPrice}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stok</Label>
                <Input
                  name="stock"
                  type="number"
                  defaultValue={product.stock}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  name="categoryName"
                  defaultValue={product.category?.name || ""}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-600">
              Simpan Perubahan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
