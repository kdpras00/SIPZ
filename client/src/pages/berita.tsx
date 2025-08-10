import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

export default function Berita() {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("semua");
    const [searchQuery, setSearchQuery] = useState("");

    // News data
    const newsArticles = [
        {
            id: 1,
            category: "Khazanah Islam",
            title: "Inilah Keutamaan Menyantuni Anak Yatim di Bulan Muharram",
            date: "29 Juli 2024",
            image: "/images/news1.jpg",
            excerpt: "Muharram menjadi momen penting dalam Islam. Peristiwa ini membuat bulan Muharam jadi sangat istimewa bagi umat muslim. Melalui Al-Qur'an, Allah Swt juga menyampaikan berbagai keutamaan menyantuni anak yatim di bulan ini.",
            slug: "keutamaan-menyantuni-anak-yatim-muharram"
        },
        {
            id: 2,
            category: "Kabar",
            title: "Berbagi Bahagia di Pelosok Negeri, SIPZ Distribusikan 5.000 Hewan Kurban",
            date: "14 Juni 2024",
            image: "/images/news2.jpg",
            excerpt: "Selama beberapa tahun SIPZ terus menjaga amanah para pekurban dalam menyalurkan hewan kurbannya ke pelosok negeri. Di tahun 1446 Hijriah ini, SIPZ mencatatkan sebanyak 5.000 hewan kurban telah didistribusikan ke berbagai wilayah di Indonesia.",
            slug: "distribusi-hewan-kurban-pelosok-negeri"
        },
        {
            id: 3,
            category: "Khazanah Islam",
            title: "Jodoh dalam Islam, Benarkah Ketentuan Allah SWT?",
            date: "8 November 2023",
            image: "/images/news3.jpg",
            excerpt: "Banyak ungkapan seperti \"jodoh pasti bertemu\" yang sering kita temui di masyarakat. Memang benar bahwa jodoh dalam Islam itu sudah ditentukan oleh Allah SWT. Namun, manusia tetap diwajibkan untuk berikhtiar dan berdoa.",
            slug: "jodoh-dalam-islam-ketentuan-allah"
        },
        {
            id: 4,
            category: "Siaran Pers",
            title: "Gerakan Sejuta Beasiswa Resmi Diluncurkan, Sejuta Kesempatan untuk Masa Depan Indonesia",
            date: "26 Juli 2024",
            image: "/images/news4.jpg",
            excerpt: "Sebagai bagian dari upaya menciptakan talenta unggul melalui program beasiswa yang inklusif dan berkelanjutan, SIPZ bersama Asosiasi Jaringan Pendidikan Indonesia meluncurkan program Gerakan Sejuta Beasiswa untuk membantu pelajar berprestasi dari keluarga kurang mampu.",
            slug: "gerakan-sejuta-beasiswa-diluncurkan"
        },
        {
            id: 5,
            category: "Kabar",
            title: "Asa Pendidikan di Seberang Sungai: Ketika Perjalanan Sekolah adalah Pertaruhan Nyawa",
            date: "23 Juli 2024",
            image: "/images/news5.jpg",
            excerpt: "Setiap pagi, di Desa Cibitung, Kecamatan Cibitung, Kabupaten Sukabumi, perjalanan menuju pencarian ilmu adalah sebuah perjuangan. Bagi para siswa Sekolah Dasar Negeri Ciloma dan SMPN 4 Cibitung, menyeberangi sungai dengan perahu sederhana adalah rutinitas harian yang penuh risiko.",
            slug: "asa-pendidikan-seberang-sungai"
        },
        {
            id: 6,
            category: "Kabar",
            title: "Momentum Hijrah, Perluas Kebaikan Muharram 1447 H bersama SIPZ",
            date: "23 Juli 2024",
            image: "/images/news6.jpg",
            excerpt: "SIPZ telah lama berdiri sebagai pilar utama dalam pengelolaan Zakat, Infak, Sedekah, dan Wakaf (ZISWAF) di Indonesia. Bukan sekadar lembaga penghimpun dan penyalur dana, SIPZ secara konsisten mengembangkan program-program pemberdayaan yang menyentuh berbagai aspek kehidupan masyarakat.",
            slug: "momentum-hijrah-muharram-1447h"
        },
        {
            id: 7,
            category: "Khazanah Islam",
            title: "Hukuman Bagi Orang yang Menghardik Anak Yatim",
            date: "14 November 2022",
            image: "/images/news7.jpg",
            excerpt: "Dalam Al-Quran surah Ad-Dhuha, Allah Swt dengan tegas melarang umat Islam berlaku sewenang-wenang terhadap anak yatim, termasuk tidak boleh menghardik anak yatim. Pasalnya, anak yatim selalu berada dalam penjagaan dan lindungan Allah SWT.",
            slug: "hukuman-menghardik-anak-yatim"
        },
        {
            id: 8,
            category: "Khazanah Islam",
            title: "Bagaimana Hukum Menyalurkan Zakat untuk Anak Yatim?",
            date: "7 November 2020",
            image: "/images/news8.jpg",
            excerpt: "Anak yatim adalah salah satu golongan yang dicintai oleh Rasulullah SAW. Karena kecintaannya tersebut, Rasulullah sering kali menyantuni dan memelihara anak yatim tersebut dengan penuh keikhlasan. Namun, bagaimana hukum menyalurkan zakat untuk anak yatim?",
            slug: "hukum-zakat-untuk-anak-yatim"
        },
        {
            id: 9,
            category: "Siaran Pers",
            title: "SIPZ Resmikan Gedung Baru Ponpes Muzdatul Falah: Wakaf Membangun Peradaban",
            date: "10 Juli 2024",
            image: "/images/news9.jpg",
            excerpt: "Sebuah semangat baru membuncah dari kaki perbukitan di Desa Babakan Sadeng, Kecamatan Leuwisadeng, Kabupaten Bogor. SIPZ secara resmi meresmikan bangunan baru Pondok Pesantren Muzdatul Falah yang dibangun dari dana wakaf para donatur.",
            slug: "peresmian-gedung-ponpes-muzdatul-falah"
        }
    ];

    // Filter articles based on active tab and search query
    const filteredArticles = newsArticles.filter(article => {
        const matchesCategory = activeTab === "semua" || article.category.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Berita & Artikel</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Dapatkan informasi terbaru tentang program-program SIPZ, artikel keislaman,
                    dan berbagai kegiatan kemanusiaan yang kami lakukan.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <Tabs defaultValue="semua" className="w-full md:w-auto" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
                            <TabsTrigger value="semua">Semua</TabsTrigger>
                            <TabsTrigger value="Kabar">Kabar</TabsTrigger>
                            <TabsTrigger value="Khazanah Islam">Khazanah</TabsTrigger>
                            <TabsTrigger value="Siaran Pers">Siaran Pers</TabsTrigger>
                            <TabsTrigger value="Video">Video</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                    <Card key={article.id} className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                            {/* Replace with actual image when available */}
                            <div className="absolute bottom-0 left-0 bg-emerald-600 text-white px-3 py-1 text-sm">
                                {article.category}
                            </div>
                        </div>
                        <CardHeader className="pt-4 pb-2">
                            <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200 hover:text-emerald-600 cursor-pointer" onClick={() => setLocation(`/berita/${article.slug}`)}>
                                {article.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-sm mb-3">{article.date}</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                {article.excerpt}
                            </p>
                            <Button
                                variant="link"
                                className="text-emerald-600 p-0 h-auto"
                                onClick={() => setLocation(`/berita/${article.slug}`)}
                            >
                                Baca Selengkapnya
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada artikel yang ditemukan.</p>
                    <Button
                        variant="link"
                        className="text-emerald-600 mt-2"
                        onClick={() => {
                            setSearchQuery("");
                            setActiveTab("semua");
                        }}
                    >
                        Reset pencarian
                    </Button>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                    <Button variant="outline" className="rounded-l-md">Sebelumnya</Button>
                    <Button variant="outline" className="rounded-none bg-emerald-50 text-emerald-600 border-emerald-200">1</Button>
                    <Button variant="outline" className="rounded-none">2</Button>
                    <Button variant="outline" className="rounded-none">3</Button>
                    <Button variant="outline" className="rounded-r-md">Selanjutnya</Button>
                </nav>
            </div>
        </div>
    );
} 