import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Calculator,
  Heart,
  CreditCard,
  Bell,
  BookOpen,
  BarChart3,
  Building2,
  LineChart,
  LogOut,
  Phone
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, requiresAuth: true },
  { name: "Kalkulator Zakat", href: "/kalkulator", icon: Calculator, requiresAuth: false },
  { name: "Infaq & Shadaqah", href: "/infaq", icon: Heart, requiresAuth: true },
  { name: "Pembayaran Zakat", href: "/pembayaran", icon: CreditCard, requiresAuth: true },
  { name: "Status Penyaluran", href: "/status", icon: LineChart, requiresAuth: true },
  { name: "Notifikasi", href: "/notifikasi", icon: Bell, requiresAuth: true },
  { name: "Laporan Donasi", href: "/laporan", icon: BarChart3, requiresAuth: true },
  { name: "Informasi Zakat", href: "/edukasi", icon: BookOpen, requiresAuth: false },
];

export function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("Attempting to logout...");

      // Check if we're running locally (localhost)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // Use local logout endpoint with POST method
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log("Local logout response:", response);

        if (!response.ok) {
          throw new Error('Gagal logout');
        }
      } else {
        // Use Replit auth logout for non-local environments
        const response = await fetch('/logout', {
          method: 'GET', // Replit auth uses GET for logout
          credentials: 'include',
        });

        console.log("Replit logout response:", response);

        if (!response.ok) {
          throw new Error('Gagal logout');
        }
      }

      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      });

      // Reload halaman untuk memperbarui state auth
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SIPZ</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;

              // Skip items that require auth if user is not authenticated
              if (item.requiresAuth && !isAuthenticated) {
                return null;
              }

              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      isActive
                        ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                      "group flex items-center px-3 py-2.5 text-sm font-medium border-l-4 rounded-md whitespace-nowrap"
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-emerald-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                </Link>
              );
            })}

            {/* Logout button - only show when authenticated */}
            {isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white whitespace-nowrap"
                >
                  <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  <span className="truncate">Keluar</span>
                </button>
              </div>
            )}

            {/* Login/Register buttons - only show when not authenticated */}
            {!isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <Link href="/login">
                  <a className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white whitespace-nowrap">
                    <span className="truncate">Masuk</span>
                  </a>
                </Link>
                <Link href="/register">
                  <a className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md border-l-4 border-transparent text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900 dark:hover:text-emerald-300 whitespace-nowrap">
                    <span className="truncate">Daftar</span>
                  </a>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}