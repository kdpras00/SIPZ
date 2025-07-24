import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Heart, 
  Bell, 
  BarChart3, 
  Shield, 
  Users,
  Building2,
  Hand
} from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">SIPZ</h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Masuk
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <Building2 className="h-20 w-20 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sistem Informasi Pengelolaan Zakat
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Platform komprehensif untuk menghitung, mengelola, dan melacak kewajiban zakat serta 
              kontribusi infaq dan shadaqah Anda dengan mudah dan tepat sesuai syariat Islam.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              Mulai Sekarang
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/calculator'}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Coba Kalkulator
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/30 dark:bg-gray-900/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Fitur Lengkap untuk Pengelolaan Zakat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Kalkulator Zakat
                </CardTitle>
                <CardDescription>
                  Hitung zakat penghasilan, emas, perdagangan, dan pertanian dengan akurat sesuai nisab terkini
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Hand className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Infaq & Shadaqah
                </CardTitle>
                <CardDescription>
                  Catat dan kelola seluruh kontribusi infaq, shadaqah, wakaf, dan amal jariyah Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Notifikasi Pembayaran
                </CardTitle>
                <CardDescription>
                  Pengingat otomatis untuk jadwal pembayaran zakat dan kewajiban lainnya
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Laporan & Analisis
                </CardTitle>
                <CardDescription>
                  Laporan tahunan lengkap dengan statistik dan analisis kontribusi Anda
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Keamanan Data
                </CardTitle>
                <CardDescription>
                  Data finansial Anda tersimpan aman dengan enkripsi tingkat bank
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Multi-User
                </CardTitle>
                <CardDescription>
                  Kelola data zakat untuk seluruh keluarga dengan akun terpisah yang aman
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Mengapa Memilih SIPZ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Perhitungan Akurat</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Menggunakan data nisab terkini dan formula yang sesuai dengan ketentuan syariah
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Mudah Digunakan</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Interface yang intuitif dan user-friendly untuk semua kalangan
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Laporan Komprehensif</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Dapatkan laporan detail untuk keperluan administrasi dan pelaporan
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-lg p-8 text-center">
              <Building2 className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Mulai Mengelola Zakat Anda Hari Ini
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Bergabunglah dengan ribuan Muslim yang telah mempercayakan pengelolaan zakat mereka kepada SIPZ
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
              >
                Daftar Gratis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 dark:bg-emerald-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-8 w-8" />
              <span className="text-xl font-bold">SIPZ</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-emerald-200">
                © 2025 Sistem Informasi Pengelolaan Zakat. 
              </p>
              <p className="text-emerald-300 text-sm mt-1">
                Membantu umat Muslim menjalankan kewajiban zakat dengan mudah dan tepat.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}