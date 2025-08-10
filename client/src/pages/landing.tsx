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
  Hand,
  BookOpen,
  ArrowRight,
  Phone,
  CheckCircle,
  Wallet,
  MessageSquare,
  Landmark,
  BookOpen as Education,
  Heart as HeartHandshake,
  BookOpen as PrayingHands,
  Building as Mosque,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

// Custom TikTok icon since it's not in Lucide
const TikTok = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

export function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("semua");

  // Mock news data
  const news = [
    {
      category: "Khazanah Islam",
      title: "Inilah Keutamaan Menyantuni Anak Yatim di Bulan Muharram",
      date: "29 Juli 2024",
      image: "/images/news1.jpg",
      excerpt: "Muharram menjadi momen penting dalam Islam. Peristiwa ini membuat bulan Muharam jadi sangat istimewa bagi umat muslim..."
    },
    {
      category: "Kabar",
      title: "Berbagi Bahagia di Pelosok Negeri, SIPZ Distribusikan 5.000 Hewan Kurban",
      date: "14 Juni 2024",
      image: "/images/news2.jpg",
      excerpt: "Selama beberapa tahun SIPZ terus menjaga amanah para pekurban dalam menyalurkan hewan kurbannya ke pelosok negeri..."
    },
    {
      category: "Khazanah Islam",
      title: "Jodoh dalam Islam, Benarkah Ketentuan Allah SWT?",
      date: "8 November 2023",
      image: "/images/news3.jpg",
      excerpt: "Banyak ungkapan seperti \"jodoh pasti bertemu\" yang sering kita temui di masyarakat. Memang benar bahwa jodoh dalam Islam..."
    }
  ];

  // Mock program data
  const programs = [
    {
      title: "Kesehatan",
      icon: Shield,
      description: "Program layanan kesehatan untuk melayani kaum dhuafa melalui intervensi preventif, promotif dan kuratif.",
      link: "/program/kesehatan"
    },
    {
      title: "Ekonomi",
      icon: Wallet,
      description: "Pemberdayaan ekonomi untuk mengangkat harkat hidup mustahik, dhuafa dan masyarakat prasejahtera.",
      link: "/program/ekonomi"
    },
    {
      title: "Pendidikan",
      icon: Education,
      description: "Program pendidikan menyentuh siswa hingga tenaga pendidik untuk membentuk SDM berkarakter dan berkompetensi global.",
      link: "/program/pendidikan"
    },
    {
      title: "Sosial",
      icon: HeartHandshake,
      description: "Layanan sosial untuk berbagai masalah masyarakat, dari pemenuhan basic needs hingga tanggap darurat bencana.",
      link: "/program/sosial"
    },
    {
      title: "Dakwah & Budaya",
      icon: PrayingHands,
      description: "Pengembangan aktivitas dakwah dan budaya melalui berbagai program yang menyentuh berbagai lapisan masyarakat.",
      link: "/program/dakwah"
    },
    {
      title: "Wakaf",
      icon: Mosque,
      description: "Salurkan wakaf untuk program-program produktif agar manfaatnya terus tumbuh dan mengalir abadi.",
      link: "/program/wakaf"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Banner with Donation Campaign */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 py-24 px-4 mt-16">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Pilih Donasi Kebaikanmu di Sini
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Berani berbuat baik, karena kebaikan itu akan kembali kepadamu suatu saat nanti
          </p>
          <Button
            size="lg"
            onClick={() => setLocation('/donasi')}
            className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-6 text-lg font-semibold"
          >
            Lihat Semua Kampanye Donasi
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Bagaimana Kami Dapat Membantu Anda?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Layanan kami memberikan kemudahan bagi Anda dalam berdonasi
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Hand className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Jemput Zakat
                </CardTitle>
                <CardDescription className="text-base">
                  Tidak perlu kemana-mana, kami akan menjemput donasi Ziswaf Anda. Mudah bukan?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  className="text-emerald-600 p-0 h-auto flex items-center"
                  onClick={() => setLocation('/jemput-zakat')}
                >
                  Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Kalkulator Zakat
                </CardTitle>
                <CardDescription className="text-base">
                  Hitung kewajiban zakat Anda. Cukup masukkan angka dan ketahui hasilnya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  className="text-emerald-600 p-0 h-auto flex items-center"
                  onClick={() => setLocation('/kalkulator')}
                >
                  Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Konfirmasi Donasi
                </CardTitle>
                <CardDescription className="text-base">
                  Sudah transfer? Yuk konfirmasikan donasi Anda agar tercatat!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  className="text-emerald-600 p-0 h-auto flex items-center"
                  onClick={() => setLocation('/konfirmasi')}
                >
                  Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-emerald-600 mb-4" />
                <CardTitle className="text-emerald-800 dark:text-emerald-200">
                  Konsultasi Ziswaf
                </CardTitle>
                <CardDescription className="text-base">
                  Konsultasi dengan konsultan Zakat kami, sehingga Anda jadi lebih paham.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  className="text-emerald-600 p-0 h-auto flex items-center"
                  onClick={() => setLocation('/konsultasi')}
                >
                  Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => setLocation('/donasi')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              Donasi Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Program Kami
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            SIPZ memiliki 6 pilar program utama dengan tujuan besar mengentaskan kemiskinan
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <program.icon className="h-12 w-12 text-emerald-600 mb-4" />
                  <CardTitle className="text-emerald-800 dark:text-emerald-200">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="link"
                    className="text-emerald-600 p-0 h-auto flex items-center"
                    onClick={() => setLocation(program.link)}
                  >
                    Selengkapnya <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Tentang Kami
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            SIPZ adalah lembaga filantropi dan kemanusiaan yang bergerak untuk pemberdayaan umat (Empowering People) dan kemanusiaan.
            Pemberdayaannya bergulir melalui pengelolaan dana zakat, infak, sedekah dan wakaf (Ziswaf), serta dana sosial lainnya
            yang terkelola secara modern dan amanah.
          </p>

          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/tentang')}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Berita Pilihan
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
            Aktivitas ikhtiar SIPZ untuk terus menebar kebaikan melalui berbagai kolaborAksi.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {/* Replace with actual image when available */}
                  <div className="absolute bottom-0 left-0 bg-emerald-600 text-white px-3 py-1 text-sm">
                    {item.category}
                  </div>
                </div>
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200 hover:text-emerald-600 cursor-pointer">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm mb-3">{item.date}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/berita')}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Baca Semua Berita
            </Button>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-16 px-4 bg-emerald-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Bantu lebih banyak dengan bergabung sebagai Relawan SIPZ!
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-10">
            Selain menjadi donatur, Anda dapat turut aktif dalam program dan kegiatan kami secara langsung dengan bergabung sebagai #relawanSIPZ!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setLocation('/relawan')}
              className="bg-white hover:bg-gray-100 text-emerald-600 px-8"
            >
              Gabung Sekarang
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation('/aksi-relawan')}
              className="border-white text-white hover:bg-emerald-700 px-8"
            >
              Lihat Aksi Kami
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}