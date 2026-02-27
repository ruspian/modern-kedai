"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProduct } from "@/actions/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Edit } from "lucide-react";
import { EditProductProps } from "@/types/product";

export function EditProductDialog({ product }: EditProductProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const toastId = toast.loading("Mengupdate produk...");

    try {
      const result = await updateProduct(product.id, formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message, { id: toastId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="cursor-pointer font-medium"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Produk
      </DropdownMenuItem>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit {product.name}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
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
  );
}
