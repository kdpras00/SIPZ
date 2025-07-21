import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ZakatCalculator from "@/components/zakat-calculator";
import InfaqForm from "@/components/infaq-form";
import PaymentNotifications from "@/components/payment-notifications";
import Reports from "@/components/reports";
import { 
  Calculator, 
  Heart, 
  BarChart3, 
  HandHeart, 
  Coins, 
  Calendar,
  TrendingUp
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

function DashboardOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: nisabData } = useQuery({
    queryKey: ["/api/nisab"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex items-center">
                <div className="h-3 bg-gray-200 rounded w-16 mr-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Assalamu'alaikum, Ahmad</h2>
        <p className="text-gray-600">Kelola zakat, infaq, dan shadaqoh Anda dengan mudah</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Zakat Tahun Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.zakatTotal) : formatCurrency(0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-islamic-100 rounded-lg flex items-center justify-center">
                <HandHeart className="text-islamic-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">dari tahun lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Infaq & Shadaqoh</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.infaqTotal) : formatCurrency(0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
                <Heart className="text-gold-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-2">bulan ini</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zakat Terjadwal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? stats.scheduledCount : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">2 mendatang</span>
              <span className="text-gray-500 ml-2">minggu ini</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nisab Emas Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.nisabGold) : formatCurrency(85000000)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Coins className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600 font-medium">85 gram</span>
              <span className="text-gray-500 ml-2">emas 24k</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Button
          onClick={() => scrollToSection('calculator')}
          className="bg-gradient-to-br from-islamic-600 to-islamic-700 text-white rounded-xl p-6 h-auto text-left hover:from-islamic-700 hover:to-islamic-800 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <h3 className="text-lg font-semibold">Hitung Zakat</h3>
            <Calculator className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-islamic-100 text-sm">Kalkulator zakat lengkap untuk berbagai jenis harta</p>
        </Button>

        <Button
          onClick={() => scrollToSection('infaq')}
          className="bg-gradient-to-br from-gold-500 to-gold-600 text-white rounded-xl p-6 h-auto text-left hover:from-gold-600 hover:to-gold-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <h3 className="text-lg font-semibold">Catat Infaq</h3>
            <Heart className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-gold-100 text-sm">Rekam infaq dan shadaqoh dengan mudah</p>
        </Button>

        <Button
          onClick={() => scrollToSection('laporan')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 h-auto text-left hover:from-blue-700 hover:to-blue-800 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <h3 className="text-lg font-semibold">Lihat Laporan</h3>
            <BarChart3 className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm">Analisis dan laporan keuangan spiritual</p>
        </Button>
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardOverview />
        <ZakatCalculator />
        <InfaqForm />
        <PaymentNotifications />
        <Reports />
      </main>

      <Footer />
    </div>
  );
}
