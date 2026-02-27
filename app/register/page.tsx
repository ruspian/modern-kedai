"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    const toastId = toast.loading("Mendaftarkan akun...");

    console.log("formData", formData);

    try {
      const result = await registerUser(formData);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        setIsLoading(false);
        return;
      }

      toast.success(result.message, { id: toastId });
      router.push("/login");
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-indigo-600">
            ModernKedai<span className="text-slate-400">.pos</span>
          </CardTitle>
          <CardDescription>
            Buat akun kasir baru untuk mulai mengelola toko
          </CardDescription>
        </CardHeader>
        <form action={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="kasir@kedai.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar Akun"}
            </Button>
            <p className="text-sm text-center text-slate-500">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
