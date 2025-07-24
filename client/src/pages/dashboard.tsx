import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
  Calculator, 
  Heart, 
  BarChart3, 
  HandHeart, 
  Coins, 
  Calendar,
  CreditCard,
  Bell,
  BookOpen,
  TrendingUp,
  Users
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: upcomingPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/zakat/upcoming"],
  });

  const quickActions = [
    {
      title: "Hitung Zakat",
      description: "Kalkulator zakat untuk berbagai jenis harta",
      icon: Calculator,
      href: "/kalkulator",
      color: "text-islamic-600",
      bgColor: "bg-islamic-50 hover:bg-islamic-100"
    },
    {
      title: "Kelola Pembayaran", 
      description: "Jadwalkan dan pantau pembayaran zakat",
      icon: CreditCard,
      href: "/pembayaran",
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Infaq & Shadaqoh",
      description: "Catat sedekah dan amal jariyah Anda",
      icon: Heart,
      href: "/infaq",
      color: "text-red-600", 
      bgColor: "bg-red-50 hover:bg-red-100"
    },
    {
      title: "Status Penyaluran",
      description: "Pantau status distribusi zakat Anda",
      icon: Users,
      href: "/status",
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Laporan",
      description: "Lihat laporan dan statistik lengkap",
      icon: BarChart3,
      href: "/laporan", 
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Notifikasi",
      description: "Atur pengingat dan notifikasi",
      icon: Bell,
      href: "/notifikasi",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 hover:bg-yellow-100"
    },
    {
      title: "Edukasi Zakat",
      description: "Pelajari tuntunan zakat dalam Islam",
      icon: BookOpen,
      href: "/edukasi",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 hover:bg-indigo-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-islamic-600 via-islamic-700 to-islamic-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sistem Informasi Pengelolaan Zakat
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Kelola zakat, infaq, dan shadaqoh dengan mudah dan sesuai syariat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kalkulator">
              <Button size="lg" className="bg-white text-islamic-600 hover:bg-gray-100">
                <Calculator className="mr-2 h-5 w-5" />
                Hitung Zakat
              </Button>
            </Link>
            <Link href="/infaq">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-islamic-600">
                <Heart className="mr-2 h-5 w-5" />
                Infaq & Shadaqoh
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Aktivitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Coins className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
                    <p className="text-sm text-gray-600">Total Zakat</p>
                    <p className="text-xl font-bold text-islamic-700">
                      {stats?.totalZakat ? formatCurrency(stats.totalZakat) : formatCurrency(0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <HandHeart className="mx-auto mb-2 h-8 w-8 text-red-600" />
                    <p className="text-sm text-gray-600">Total Infaq</p>
                    <p className="text-xl font-bold text-red-700">
                      {stats?.totalInfaq ? formatCurrency(stats.totalInfaq) : formatCurrency(0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
                    <p className="text-sm text-gray-600">Pembayaran Tertunda</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {upcomingPayments?.length || 0} item
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-600" />
                    <p className="text-sm text-gray-600">Bulan Ini</p>
                    <p className="text-xl font-bold text-green-700">
                      {stats?.thisMonth ? formatCurrency(stats.thisMonth) : formatCurrency(0)}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Upcoming Payments Alert */}
        {upcomingPayments && upcomingPayments.length > 0 && (
          <section className="mb-12">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Pembayaran yang Akan Jatuh Tempo
                </h3>
                <div className="space-y-2">
                  {upcomingPayments.slice(0, 3).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.type}</p>
                        <p className="text-sm text-gray-600">
                          Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-700">
                          {formatCurrency(Number(payment.amount))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {upcomingPayments.length > 3 && (
                  <p className="text-sm text-yellow-700 mt-3">
                    Dan {upcomingPayments.length - 3} pembayaran lainnya...
                  </p>
                )}
                <div className="mt-4">
                  <Link href="/pembayaran">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Lihat Semua Pembayaran
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Akses Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${action.bgColor}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${action.bgColor.replace('hover:', '').replace('bg-', 'bg-opacity-50 bg-')}`}>
                          <IconComponent className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Belum ada aktivitas terbaru</p>
                <p className="text-sm text-gray-400">
                  Mulai dengan menghitung zakat atau mencatat infaq Anda
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}