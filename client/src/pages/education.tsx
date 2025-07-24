import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Calculator, Lightbulb, MessageCircle, Heart } from "lucide-react";

const educationArticles = [
  {
    id: 1,
    title: "Pengertian dan Hukum Zakat dalam Islam",
    category: "Dasar Zakat",
    description: "Memahami definisi zakat, dalil-dalil Al-Quran dan Hadits, serta hikmah di balik kewajiban zakat",
    content: `
      <h3>Pengertian Zakat</h3>
      <p>Zakat secara bahasa berarti "tumbuh" dan "berkah". Secara istilah syariat, zakat adalah ibadah wajib berupa mengeluarkan sebagian harta tertentu untuk diberikan kepada golongan yang berhak menerimanya.</p>
      
      <h3>Dalil Kewajiban Zakat</h3>
      <p><strong>Al-Quran:</strong></p>
      <blockquote>"Dan dirikanlah shalat, tunaikanlah zakat dan ruku'lah besama orang-orang yang ruku'." (QS. Al-Baqarah: 43)</blockquote>
      
      <p><strong>Hadits:</strong></p>
      <blockquote>"Islam dibangun atas lima perkara: bersaksi bahwa tidak ada Tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, berpuasa di bulan Ramadhan, dan berhaji ke Baitullah." (HR. Bukhari Muslim)</blockquote>
      
      <h3>Hikmah Zakat</h3>
      <ul>
        <li>Membersihkan jiwa dari sifat kikir dan tamak</li>
        <li>Mengurangi kesenjangan sosial</li>
        <li>Meningkatkan solidaritas umat</li>
        <li>Mengembangkan ekonomi masyarakat</li>
      </ul>
    `,
    readTime: "5 menit",
    author: "Tim SIPZ"
  },
  {
    id: 2,
    title: "Jenis-Jenis Zakat dan Nisabnya",
    category: "Jenis Zakat",
    description: "Mengenal berbagai jenis zakat dan batas minimum (nisab) yang wajib dikeluarkan zakatnya",
    content: `
      <h3>1. Zakat Mal (Harta)</h3>
      
      <h4>Zakat Emas dan Perak</h4>
      <ul>
        <li><strong>Nisab Emas:</strong> 85 gram emas murni</li>
        <li><strong>Nisab Perak:</strong> 595 gram perak</li>
        <li><strong>Kadar:</strong> 2.5% dari nilai harta</li>
        <li><strong>Haul:</strong> Dimiliki selama 1 tahun</li>
      </ul>
      
      <h4>Zakat Penghasilan</h4>
      <ul>
        <li><strong>Nisab:</strong> Setara dengan 85 gram emas</li>
        <li><strong>Kadar:</strong> 2.5% dari penghasilan bersih</li>
        <li><strong>Waktu:</strong> Setiap menerima penghasilan</li>
      </ul>
      
      <h4>Zakat Perdagangan</h4>
      <ul>
        <li><strong>Nisab:</strong> Setara dengan 85 gram emas</li>
        <li><strong>Kadar:</strong> 2.5% dari modal + keuntungan</li>
        <li><strong>Haul:</strong> Dimiliki selama 1 tahun</li>
      </ul>
      
      <h4>Zakat Pertanian</h4>
      <ul>
        <li><strong>Nisab:</strong> 5 wasaq (≈ 653 kg)</li>
        <li><strong>Kadar:</strong> 10% (tadah hujan) atau 5% (disiram)</li>
        <li><strong>Waktu:</strong> Setiap panen</li>
      </ul>
      
      <h3>2. Zakat Fitrah</h3>
      <ul>
        <li><strong>Kadar:</strong> 3.5 liter makanan pokok atau uang senilainya</li>
        <li><strong>Waktu:</strong> Menjelang shalat Ied</li>
        <li><strong>Wajib untuk:</strong> Setiap jiwa Muslim</li>
      </ul>
    `,
    readTime: "8 menit",
    author: "Tim SIPZ"
  },
  {
    id: 3,
    title: "Siapa Saja yang Berhak Menerima Zakat?",
    category: "Mustahik",
    description: "Mengenal 8 golongan yang berhak menerima zakat sesuai dengan Al-Quran",
    content: `
      <h3>8 Golongan Penerima Zakat (Mustahik)</h3>
      <p>Berdasarkan QS. At-Taubah ayat 60:</p>
      
      <blockquote>"Sesungguhnya zakat-zakat itu, hanyalah untuk orang-orang fakir, orang-orang miskin, pengurus-pengurus zakat, para mu'allaf yang dibujuk hatinya, untuk (memerdekakan) budak, orang-orang yang berhutang, untuk jalan Allah dan untuk mereka yang sedang dalam perjalanan, sebagai suatu ketetapan yang diwajibkan Allah, dan Allah Maha Mengetahui lagi Maha Bijaksana."</blockquote>
      
      <h4>1. Fakir</h4>
      <p>Orang yang tidak memiliki harta atau penghasilan yang cukup untuk memenuhi kebutuhan pokok.</p>
      
      <h4>2. Miskin</h4>
      <p>Orang yang memiliki harta atau penghasilan, tetapi tidak mencukupi kebutuhan sehari-hari.</p>
      
      <h4>3. Amil Zakat</h4>
      <p>Petugas yang ditugaskan untuk mengumpulkan, mengelola, dan mendistribusikan zakat.</p>
      
      <h4>4. Muallaf</h4>
      <p>Orang yang baru masuk Islam atau yang hatinya perlu dilembutkan terhadap Islam.</p>
      
      <h4>5. Riqab (Memerdekakan Budak)</h4>
      <p>Dalam konteks modern, bisa diartikan untuk membebaskan orang dari jeratan hutang atau membantu korban perdagangan manusia.</p>
      
      <h4>6. Gharim (Orang Berhutang)</h4>
      <p>Orang yang memiliki hutang untuk kepentingan yang tidak maksiat dan tidak mampu melunasinya.</p>
      
      <h4>7. Fi Sabilillah</h4>
      <p>Untuk kepentingan di jalan Allah, seperti dakwah, pendidikan Islam, dan jihad.</p>
      
      <h4>8. Ibn Sabil</h4>
      <p>Musafir yang kehabisan bekal dalam perjalanan untuk kepentingan yang tidak maksiat.</p>
    `,
    readTime: "6 menit",
    author: "Tim SIPZ"
  },
  {
    id: 4,
    title: "Tata Cara Menghitung Zakat Penghasilan",
    category: "Perhitungan",
    description: "Panduan lengkap menghitung zakat penghasilan atau profesi sesuai syariat Islam",
    content: `
      <h3>Langkah-Langkah Menghitung Zakat Penghasilan</h3>
      
      <h4>1. Tentukan Penghasilan Kotor</h4>
      <p>Jumlahkan seluruh penghasilan dalam satu bulan:</p>
      <ul>
        <li>Gaji pokok</li>
        <li>Tunjangan tetap</li>
        <li>Bonus dan insentif</li>
        <li>Penghasilan sampingan</li>
      </ul>
      
      <h4>2. Kurangi Kebutuhan Pokok</h4>
      <p>Penghasilan dikurangi dengan kebutuhan dasar:</p>
      <ul>
        <li>Biaya makan sehari-hari</li>
        <li>Biaya tempat tinggal</li>
        <li>Biaya transportasi</li>
        <li>Biaya kesehatan</li>
        <li>Biaya pendidikan anak</li>
      </ul>
      
      <h4>3. Kurangi Hutang yang Mendesak</h4>
      <p>Seperti cicilan rumah, kendaraan, atau hutang konsumtif lainnya.</p>
      
      <h4>4. Cek Nisab</h4>
      <p>Sisa penghasilan bersih harus mencapai nisab (setara 85 gram emas).</p>
      
      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h4>Contoh Perhitungan</h4>
        <p><strong>Penghasilan kotor per bulan:</strong> Rp 8.000.000</p>
        <p><strong>Kebutuhan pokok:</strong> Rp 4.000.000</p>
        <p><strong>Cicilan hutang:</strong> Rp 1.000.000</p>
        <p><strong>Penghasilan bersih:</strong> Rp 3.000.000</p>
        <p><strong>Nisab emas (85 gram x Rp 1.000.000):</strong> Rp 85.000.000/12 = Rp 7.083.333 per bulan</p>
        <p><strong>Kesimpulan:</strong> Belum mencapai nisab, tidak wajib zakat</p>
      </div>
      
      <h4>5. Hitung Zakat (Jika Sudah Mencapai Nisab)</h4>
      <p><strong>Zakat = Penghasilan Bersih x 2.5%</strong></p>
      
      <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h4>Contoh jika Mencapai Nisab</h4>
        <p><strong>Penghasilan bersih:</strong> Rp 10.000.000</p>
        <p><strong>Zakat:</strong> Rp 10.000.000 x 2.5% = Rp 250.000</p>
      </div>
    `,
    readTime: "10 menit",
    author: "Tim SIPZ"
  }
];

const faqs = [
  {
    question: "Apakah hutang mengurangi kewajiban zakat?",
    answer: "Ya, hutang yang mendesak dan untuk kebutuhan yang tidak maksiat dapat mengurangi kewajiban zakat. Namun, hutang konsumtif berlebihan tidak semuanya bisa mengurangi zakat."
  },
  {
    question: "Bagaimana jika penghasilan tidak tetap setiap bulan?",
    answer: "Untuk penghasilan tidak tetap, bisa dihitung per tahun. Jumlahkan penghasilan selama setahun, kurangi kebutuhan pokok dan hutang, lalu cek apakah mencapai nisab tahunan."
  },
  {
    question: "Apakah zakat bisa dibayar dengan barang?",
    answer: "Zakat sebaiknya dibayar sesuai dengan jenis hartanya. Zakat uang dibayar dengan uang, zakat beras dengan beras. Namun jika ada maslahat yang lebih besar, bisa diganti dengan yang senilai."
  },
  {
    question: "Bolehkah memberikan zakat kepada keluarga sendiri?",
    answer: "Boleh memberikan zakat kepada keluarga yang termasuk mustahik, kecuali kepada istri/suami, anak, dan orang tua. Bahkan memberikan zakat kepada saudara yang membutuhkan mendapat pahala yang lebih besar."
  },
  {
    question: "Bagaimana jika terlambat membayar zakat?",
    answer: "Zakat yang terlambat tetap harus dibayar (qadha) dan sebaiknya segera dilunasi. Ini termasuk hutang kepada Allah yang harus dipenuhi meskipun terlambat."
  }
];

export default function Education() {
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const categories = ["semua", "Dasar Zakat", "Jenis Zakat", "Mustahik", "Perhitungan"];

  const filteredArticles = selectedCategory === "semua" 
    ? educationArticles 
    : educationArticles.filter(article => article.category === selectedCategory);

  if (selectedArticle) {
    const article = educationArticles.find(a => a.id === selectedArticle);
    if (article) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button 
              onClick={() => setSelectedArticle(null)}
              variant="ghost" 
              className="mb-6"
            >
              ← Kembali ke Daftar Artikel
            </Button>

            <article className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span>Oleh {article.author}</span>
                  <span>•</span>
                  <span>Waktu baca: {article.readTime}</span>
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>
          </main>

          <Footer />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edukasi Zakat</h1>
          <p className="text-gray-600">Pelajari tuntunan syariat Islam tentang zakat dan infaq</p>
        </div>

        <Tabs defaultValue="artikel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="artikel">Artikel & Panduan</TabsTrigger>
            <TabsTrigger value="faq">Tanya Jawab</TabsTrigger>
          </TabsList>

          <TabsContent value="artikel" className="space-y-6">
            {/* Filter Kategori */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-islamic-600 hover:bg-islamic-700" : ""}
                    >
                      {category === "semua" ? "Semua Kategori" : category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daftar Artikel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{article.readTime}</span>
                      <span>{article.author}</span>
                    </div>
                    <Button 
                      onClick={() => setSelectedArticle(article.id)}
                      className="w-full bg-islamic-600 hover:bg-islamic-700"
                    >
                      Baca Artikel
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 text-islamic-600" />
                  Pertanyaan yang Sering Diajukan
                </CardTitle>
                <p className="text-sm text-gray-600">Temukan jawaban atas pertanyaan umum seputar zakat</p>
              </CardHeader>
            </Card>

            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 flex items-start">
                    <span className="bg-islamic-100 text-islamic-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed ml-9">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-r from-islamic-50 to-islamic-100 border-islamic-200">
              <CardContent className="p-6 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-islamic-600" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Masih Ada Pertanyaan?</h3>
                <p className="text-gray-600 mb-4">
                  Hubungi tim ulama kami untuk konsultasi langsung seputar zakat dan hukum Islam
                </p>
                <Button className="bg-islamic-600 hover:bg-islamic-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Konsultasi Sekarang
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}