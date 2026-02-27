"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
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
import { loginUserSchema } from "@/schemas/authSchema";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    const toastId = toast.loading("Memeriksa kredensial...");

    const validate = loginUserSchema.safeParse(Object.fromEntries(formData));

    if (!validate.success) {
      toast.error(validate.error.issues[0].message, { id: toastId });
      setIsLoading(false);
      return;
    }

    const { email, password } = validate.data;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Jangan auto-redirect
      });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setIsLoading(false);
        return;
      }

      toast.success("Login berhasil!", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message, { id: toastId });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-indigo-600">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Masukkan email dan password untuk masuk ke sistem
          </CardDescription>
        </CardHeader>
        <form action={onSubmit}>
          <CardContent className="space-y-4">
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
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
            <p className="text-sm text-center text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
