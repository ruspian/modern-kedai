"use server";

import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/schemas/productSchema";
import { revalidatePath } from "next/cache";

export async function getProducts(cursor?: string) {
  try {
    const limit = 8;

    const items = await prisma.product.findMany({
      take: limit,
      skip: cursor ? 1 : 0, // Lewatin item cursor
      cursor: cursor ? { id: cursor } : undefined,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // data selanjutnya kalo ada
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : undefined;

    return {
      items,
      nextCursor,
    };
  } catch (error) {
    console.log("GAGAL MENGAMBIL PRODUK: ", error);
    return { message: "Terjadi kesalahan server!", success: false };
  }
}

export async function createProduct(formData: FormData) {
  // Validasi input
  const validatedFields = ProductSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues[0].message,
      success: false,
    };
  }

  const { name, price, costPrice, stock, categoryName } = validatedFields.data;

  try {
    // Cari atau bikin kategori baru otomatis
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    // Simpan ke database
    await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
        price,
        costPrice,
        stock,
        categoryId: category.id,
      },
    });

    // Refresh data
    revalidatePath("/products");

    return {
      success: true,
      message: "Produk berhasil dibuat!",
    };
  } catch (error) {
    console.log("GAGAL BUAT PRODUCT: ", error);

    return { message: "Terjadi kesalahan server!", success: false };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Cek apakah riwayat transaksi produk
    const hasOrders = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (hasOrders) {
      return {
        message:
          "Produk tidak bisa dihapus karena sudah memiliki riwayat transaksi. Cukup ubah stok jadi 0 saja.",
        success: false,
      };
    }

    // hapus produk
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    return { success: true, message: "Produk berhasil dihapus!" };
  } catch (error) {
    console.log("GAGAL HAPUS PRODUCT: ", error);

    return { message: "Terjadi kesalahan server!", success: false };
  }
}
