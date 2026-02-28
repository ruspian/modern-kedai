"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CheckoutItem } from "@/types/orders";

export async function processCheckout(
  cart: CheckoutItem[],
  totalAmount: number,
  paymentMethod: "CASH" | "TRANSFER" | "QRIS",
  customerName?: string,
) {
  // Ambil ID Kasir yang lagi login
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Anda belum login!" };
  }

  try {
    // Buat Nomor Nota
    const orderNumber = `ORD-${Date.now()}`;

    // Lakukan transaksi
    await prisma.$transaction(
      async (tx) => {
        await tx.order.create({
          data: {
            orderNumber,
            totalAmount,
            paymentMethod,
            paymentStatus: "PAID",
            userId: userId,
            customerName: customerName || null,
            items: {
              create: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                costPrice: item.costPrice,
              })),
            },
          },
        });

        // Kurangi stok barang
        for (const item of cart) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      },
      {
        maxWait: 5000, // Maksimal nunggu koneksi database 5 detik
        timeout: 10000, // Maksimal transaksi selesai dalam 10 detik
      },
    );

    // Refresh cache
    revalidatePath("/orders");
    revalidatePath("/products");

    return { success: true, message: "Transaksi berhasil dibayar!" };
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return { success: false, message: "Gagal memproses transaksi!" };
  }
}
