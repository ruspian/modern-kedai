"use client";

import { Search, Bell, LogOut, Menu, User, Settings } from "lucide-react";
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
        <div className="relative hidden sm:block w-full max-w-100">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari transaksi, produk..."
            className="w-full bg-slate-100/50 border-none h-9 pl-9 focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* notofikasi */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 flex h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* profil */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white text-xs font-bold transition-all shrink-0"
            >
              RM
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Ruspian Majid
                </p>
                <p className="text-xs leading-none text-slate-500">
                  ruspian@example.com
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
            <DropdownMenuItem className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
