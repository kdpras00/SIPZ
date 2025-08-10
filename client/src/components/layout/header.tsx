import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Calendar,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  LogOut,
  Building2,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, isAuthenticated, refetch } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

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
        const response = await fetch('logout', {
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

  const userInitials = user?.firstName ?
    `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}` :
    "U";

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-emerald-800 text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold"></span>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>0804-100-4000</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>WhatsApp: 628111544488</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>info@sipz.org</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Rekening Donasi</span>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <select className="bg-emerald-800 text-white text-sm border-none focus:ring-0">
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-emerald-600" />
                <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">SIPZ</h1>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 flex items-center">
                  PROGRAM <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setLocation('/program/kesehatan')}>
                  Kesehatan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/program/ekonomi')}>
                  Ekonomi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/program/pendidikan')}>
                  Pendidikan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/program/sosial')}>
                  Sosial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/program/dakwah')}>
                  Dakwah & Budaya
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/program/wakaf')}>
                  Wakaf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400 flex items-center">
                  LAYANAN <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setLocation('/jemput-zakat')}>
                  Jemput Zakat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/kalkulator')}>
                  Kalkulator Zakat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/konfirmasi')}>
                  Konfirmasi Donasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/konsultasi')}>
                  Konsultasi Ziswaf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/berita">
              <a className="font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400">
                BERITA
              </a>
            </Link>

            <Link href="/tentang">
              <a className="font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400">
                TENTANG KAMI
              </a>
            </Link>

            <Link href="/faq">
              <a className="font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400">
                FAQ
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400">
              <Search className="h-5 w-5" />
            </button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/notifikasi")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation("/profil")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation("/pengaturan")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme} className="md:hidden">
                      {theme === "light" ? (
                        <Moon className="mr-2 h-4 w-4" />
                      ) : (
                        <Sun className="mr-2 h-4 w-4" />
                      )}
                      <span>{theme === "light" ? "Mode Gelap" : "Mode Terang"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => setLocation('/donasi')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white hidden md:flex"
                >
                  Donasi
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/login")}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Login Donatur
                </Button>
                <Button
                  size="sm"
                  onClick={() => setLocation("/donasi")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Donasi
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">PROGRAM</p>
                <div className="pl-4 mt-1 space-y-1">
                  <a href="/program/kesehatan" className="block py-1 text-gray-600 dark:text-gray-300">Kesehatan</a>
                  <a href="/program/ekonomi" className="block py-1 text-gray-600 dark:text-gray-300">Ekonomi</a>
                  <a href="/program/pendidikan" className="block py-1 text-gray-600 dark:text-gray-300">Pendidikan</a>
                  <a href="/program/sosial" className="block py-1 text-gray-600 dark:text-gray-300">Sosial</a>
                  <a href="/program/dakwah" className="block py-1 text-gray-600 dark:text-gray-300">Dakwah & Budaya</a>
                  <a href="/program/wakaf" className="block py-1 text-gray-600 dark:text-gray-300">Wakaf</a>
                </div>
              </div>

              <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">LAYANAN</p>
                <div className="pl-4 mt-1 space-y-1">
                  <a href="/jemput-zakat" className="block py-1 text-gray-600 dark:text-gray-300">Jemput Zakat</a>
                  <a href="/kalkulator" className="block py-1 text-gray-600 dark:text-gray-300">Kalkulator Zakat</a>
                  <a href="/konfirmasi" className="block py-1 text-gray-600 dark:text-gray-300">Konfirmasi Donasi</a>
                  <a href="/konsultasi" className="block py-1 text-gray-600 dark:text-gray-300">Konsultasi Ziswaf</a>
                </div>
              </div>

              <a href="/berita" className="block py-2 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                BERITA
              </a>

              <a href="/tentang" className="block py-2 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                TENTANG KAMI
              </a>

              <a href="/faq" className="block py-2 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                FAQ
              </a>

              <div className="py-2 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tema</span>
                  <button onClick={toggleTheme} className="flex items-center">
                    {theme === "light" ? (
                      <>
                        <Moon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Mode Gelap</span>
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 mr-1" />
                        <span className="text-sm">Mode Terang</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Bahasa</span>
                  <select className="text-sm bg-transparent border-none">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="py-2 space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400"></p>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <Phone className="h-3 w-3" />
                  <span>0804-100-4000</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <Phone className="h-3 w-3" />
                  <span>WhatsApp: 628111544488</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <Mail className="h-3 w-3" />
                  <span>info@sipz.org</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* WhatsApp Fixed Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/628111544488"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      </div>
    </>
  );
}