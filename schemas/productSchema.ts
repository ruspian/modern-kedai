import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
  costPrice: z.coerce.number().min(1, "Modal harus lebih dari 0"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  categoryName: z.string().min(1, "Kategori wajib diisi"),
});
