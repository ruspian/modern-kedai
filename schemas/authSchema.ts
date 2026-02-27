import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(30, "Nama maksimal 30 karakter"),
  email: z.string().email("Email tidak valid!"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Email tidak valid!"),
  password: z.string().min(8, "Password harus minimal 8 karakter!"),
});
