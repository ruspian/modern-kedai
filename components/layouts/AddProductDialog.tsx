"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createProduct } from "@/actions/product";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddProductDialog() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const toastId = toast.loading("Menyimpan produk...");

    try {
      const result = await createProduct(formData);

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
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Plus className="w-4 h-4" /> Tambah Produk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Nama Produk</Label>
            <Input name="name" placeholder="Contoh: Kopi Susu" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Harga Jual</Label>
              <Input name="price" type="number" placeholder="15000" required />
            </div>
            <div className="space-y-2">
              <Label>Modal</Label>
              <Input
                name="costPrice"
                type="number"
                placeholder="8000"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stok</Label>
              <Input name="stock" type="number" placeholder="50" required />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input name="categoryName" placeholder="Minuman" required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600">
            Simpan Produk
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
