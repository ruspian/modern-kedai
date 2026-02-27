// actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import { registerUserSchema } from "@/schemas/authSchema";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const validate = registerUserSchema.safeParse(Object.fromEntries(formData));

  if (!validate.success) {
    return {
      message: validate.error.issues[0].message,
      success: false,
    };
  }

  const { name, email, password } = validate.data;

  try {
    // apakah email udah dipakai
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah terdaftar!" };
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Registrasi berhasil!" };
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return { success: false, message: "Terjadi kesalahan server!" };
  }
}
