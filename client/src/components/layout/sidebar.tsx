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
  Building2
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Kalkulator", href: "/kalkulator", icon: Calculator },
  { name: "Infaq & Shadaqah", href: "/infaq", icon: Heart },
  { name: "Pembayaran", href: "/pembayaran", icon: CreditCard },
  { name: "Notifikasi", href: "/notifikasi", icon: Bell },
  { name: "Laporan", href: "/laporan", icon: BarChart3 },
  { name: "Edukasi", href: "/edukasi", icon: BookOpen },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SIPZ</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      isActive
                        ? "bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium border-l-4 rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-emerald-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                    />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}