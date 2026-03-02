"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: ShoppingCart, label: "Orders", href: "/orders" },
  { icon: Users, label: "Customers", href: "/customers" },
];

export function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const Logo = (
    <div className="flex items-center">
      <span className="text-xl font-bold text-indigo-600 tracking-tight">
        ModernKedai<span className="text-slate-400 text-sm">.pos</span>
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-16 flex items-center px-6 border-b md:border-none">
        {isMobile ? (
          <SheetHeader className="text-left">
            <SheetTitle asChild>{Logo}</SheetTitle>
          </SheetHeader>
        ) : (
          Logo
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="px-4 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            v1.0.0-beta
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-72 border-r bg-white h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}
