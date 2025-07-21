import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, User, Church } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: notificationCount } = useQuery({
    queryKey: ["/api/notifications/count"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    enabled: false, // Will implement user context later
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-islamic-600 to-islamic-700 rounded-lg flex items-center justify-center">
                <Church className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SIPZ</h1>
                <p className="text-xs text-gray-500">Sistem Informasi Pengelolaan Zakat</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-islamic-600 font-medium border-b-2 border-islamic-600 pb-1">
              Dashboard
            </a>
            <a href="#calculator" className="text-gray-600 hover:text-islamic-600 transition-colors">
              Kalkulator
            </a>
            <a href="#infaq" className="text-gray-600 hover:text-islamic-600 transition-colors">
              Infaq & Shadaqoh
            </a>
            <a href="#laporan" className="text-gray-600 hover:text-islamic-600 transition-colors">
              Laporan
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount?.count > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount.count}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-islamic-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-islamic-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.name || "Ahmad Rahman"}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <a href="#dashboard" className="text-islamic-600 font-medium py-2 px-3 rounded bg-islamic-50">
                Dashboard
              </a>
              <a href="#calculator" className="text-gray-600 hover:text-islamic-600 py-2 px-3 rounded hover:bg-gray-50">
                Kalkulator
              </a>
              <a href="#infaq" className="text-gray-600 hover:text-islamic-600 py-2 px-3 rounded hover:bg-gray-50">
                Infaq & Shadaqoh
              </a>
              <a href="#laporan" className="text-gray-600 hover:text-islamic-600 py-2 px-3 rounded hover:bg-gray-50">
                Laporan
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
