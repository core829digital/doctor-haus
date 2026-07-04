"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Image, DollarSign, FileText, Mail, Settings, LogOut, Menu, X, Bell, ChevronDown, UserCheck,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Lead", icon: Users },
  { href: "/admin/users", label: "Utenti", icon: UserCheck },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/finances", label: "Finanze", icon: DollarSign },
  { href: "/admin/reports", label: "Report", icon: FileText },
  { href: "/admin/emails", label: "Email", icon: Mail },
  { href: "/admin/automation", label: "Automazione", icon: Settings },
];

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { user, loading, logout, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/register") {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="animate-pulse text-white/40 text-sm">Caricamento...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1A1A1A] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            Doctor Haus <span className="text-green-400">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-green-500/10 text-green-400 font-medium"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/40 hover:text-white">
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative text-white/30 hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500" />
              </button>
              <button
                onClick={async () => { await logout(); router.push("/admin/login"); }}
                className="flex items-center gap-2 text-sm text-white/30 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Esci</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [convex] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexReactClient(url);
  });
  if (!convex) return <>{children}</>;
  return (
    <ConvexProvider client={convex}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ConvexProvider>
  );
}
