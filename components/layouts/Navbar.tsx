"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  LogOut,
  Menu,
  User,
  Settings,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarContent } from "./Sidebar";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data: session } = useSession();

  // Bikin inisial otomatis
  const getInitials = (name?: string | null) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // fungsi enter pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-4 md:px-6 backdrop-blur-md">
      {/* sidebar hp */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>

      {/* pencarian */}
      <div className="flex-1 flex items-center gap-4">
        <form
          onSubmit={handleSearch}
          className="relative hidden sm:block w-full max-w-100"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari transaksi, produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/50 border-none h-9 pl-9 focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 flex h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 mt-2">
            <DropdownMenuLabel>Notifikasi Sistem</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex gap-3 items-start p-3"
              onClick={() => router.push("/products")}
            >
              <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Cek Stok Produk
                </p>
                <p className="text-xs text-slate-500">
                  Ada beberapa produk yang hampir habis.
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* profil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white text-xs font-bold transition-all shrink-0 uppercase"
            >
              {getInitials(session?.user?.name)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "Kasir Kedai"}
                </p>
                <p className="text-xs leading-none text-slate-500 truncate">
                  {session?.user?.email || "loading..."}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
