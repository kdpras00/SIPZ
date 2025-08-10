import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

export default function FAQ() {
    const [, setLocation] = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("umum");

    // FAQ data
    const faqCategories = [
        {
            id: "umum",
            name: "Umum",
            questions: [
                {
                    id: "apa-itu-zakat",
                    question: "Apa itu zakat?",
                    answer: "Zakat adalah salah satu rukun Islam yang wajib dikeluarkan oleh setiap muslim yang telah memenuhi syarat (nisab) dan ketentuan yang berlaku. Zakat merupakan bentuk ibadah yang memiliki dimensi sosial, di mana harta yang dikeluarkan akan disalurkan kepada golongan yang berhak menerimanya (mustahik)."
                },
                {
                    id: "siapa-yang-wajib-zakat",
                    question: "Siapa yang wajib mengeluarkan zakat?",
                    answer: "Zakat wajib dikeluarkan oleh setiap muslim yang merdeka, baligh (dewasa), berakal, dan memiliki harta yang mencapai nisab (batas minimal) serta haul (masa kepemilikan satu tahun) untuk jenis harta tertentu."
                },
                {
                    id: "perbedaan-zakat-infak-sedekah",
                    question: "Apa perbedaan antara zakat, infak, dan sedekah?",
                    answer: "Zakat adalah kewajiban yang harus dikeluarkan oleh setiap muslim yang memenuhi syarat dengan ketentuan jumlah dan waktu tertentu. Infak adalah pemberian harta untuk kebaikan dengan jumlah yang tidak ditentukan. Sedekah memiliki makna lebih luas, tidak hanya berupa harta tetapi juga bisa berupa kebaikan non-material."
                },
                {
                    id: "manfaat-zakat",
                    question: "Apa manfaat menunaikan zakat?",
                    answer: "Menunaikan zakat memiliki banyak manfaat, di antaranya: membersihkan harta dan jiwa, menumbuhkan keberkahan pada harta, membantu mengurangi kesenjangan sosial, meningkatkan kesejahteraan masyarakat, dan mendapatkan pahala dari Allah SWT."
                }
            ]
        },
        {
            id: "jenis-zakat",
            name: "Jenis Zakat",
            questions: [
                {
                    id: "jenis-jenis-zakat",
                    question: "Apa saja jenis-jenis zakat?",
                    answer: "Secara umum, zakat terbagi menjadi dua jenis utama: Zakat Fitrah dan Zakat Mal (harta). Zakat Mal sendiri terbagi menjadi beberapa jenis seperti zakat penghasilan, zakat emas dan perak, zakat perdagangan, zakat pertanian, zakat peternakan, zakat rikaz (harta temuan), dan zakat profesi."
                },
                {
                    id: "zakat-fitrah",
                    question: "Kapan waktu mengeluarkan zakat fitrah?",
                    answer: "Zakat fitrah dikeluarkan selama bulan Ramadhan dan paling lambat sebelum shalat Idul Fitri. Namun, disarankan untuk mengeluarkannya beberapa hari sebelum Idul Fitri agar dapat didistribusikan tepat waktu kepada yang berhak menerimanya."
                },
                {
                    id: "zakat-penghasilan",
                    question: "Bagaimana cara menghitung zakat penghasilan?",
                    answer: "Zakat penghasilan dikeluarkan sebesar 2,5% dari total penghasilan setelah dikurangi kebutuhan pokok dan hutang. Nisab zakat penghasilan setara dengan 85 gram emas. Jika penghasilan telah mencapai nisab, maka wajib dikeluarkan zakatnya."
                },
                {
                    id: "zakat-emas",
                    question: "Berapa nisab zakat emas dan perak?",
                    answer: "Nisab zakat emas adalah 85 gram emas murni, sedangkan nisab zakat perak adalah 595 gram perak. Jika kepemilikan emas atau perak telah mencapai nisab dan telah dimiliki selama satu tahun (haul), maka wajib dikeluarkan zakatnya sebesar 2,5%."
                }
            ]
        },
        {
            id: "penyaluran",
            name: "Penyaluran",
            questions: [
                {
                    id: "penerima-zakat",
                    question: "Siapa saja yang berhak menerima zakat?",
                    answer: "Berdasarkan Al-Qur'an Surah At-Taubah ayat 60, ada delapan golongan (asnaf) yang berhak menerima zakat: fakir (orang yang tidak memiliki harta), miskin (orang yang penghasilannya tidak mencukupi kebutuhan), amil (pengelola zakat), muallaf (orang yang baru masuk Islam), riqab (untuk memerdekakan budak), gharimin (orang yang berhutang untuk kebutuhan hidup), fisabilillah (orang yang berjuang di jalan Allah), dan ibnu sabil (musafir yang kehabisan bekal)."
                },
                {
                    id: "lembaga-zakat",
                    question: "Apakah zakat harus disalurkan melalui lembaga resmi?",
                    answer: "Meskipun tidak wajib, menyalurkan zakat melalui lembaga resmi seperti SIPZ memiliki beberapa kelebihan: penyaluran lebih tepat sasaran, terorganisir, transparan, dan dapat dipertanggungjawabkan. Lembaga zakat juga memiliki data mustahik yang akurat dan program pemberdayaan yang berkelanjutan."
                },
                {
                    id: "bukti-pembayaran",
                    question: "Apakah saya akan mendapatkan bukti pembayaran zakat?",
                    answer: "Ya, setiap pembayaran zakat melalui SIPZ akan mendapatkan bukti pembayaran resmi yang dapat digunakan untuk keperluan administrasi, termasuk untuk pengurangan pajak penghasilan sesuai dengan ketentuan yang berlaku."
                },
                {
                    id: "laporan-penyaluran",
                    question: "Bagaimana saya bisa memastikan zakat saya tersalurkan dengan baik?",
                    answer: "SIPZ secara rutin menerbitkan laporan penyaluran zakat yang dapat diakses oleh publik melalui website resmi. Donatur juga dapat melihat laporan penyaluran zakat mereka melalui akun donatur yang telah terdaftar."
                }
            ]
        },
        {
            id: "teknis",
            name: "Teknis",
            questions: [
                {
                    id: "cara-bayar-zakat",
                    question: "Bagaimana cara membayar zakat melalui SIPZ?",
                    answer: "Anda dapat membayar zakat melalui SIPZ dengan beberapa cara: transfer bank ke rekening resmi SIPZ, pembayaran online melalui website atau aplikasi SIPZ, atau datang langsung ke kantor SIPZ terdekat. Anda juga dapat menggunakan layanan jemput zakat dengan menghubungi call center kami."
                },
                {
                    id: "rekening-zakat",
                    question: "Apa saja rekening resmi SIPZ untuk pembayaran zakat?",
                    answer: "Rekening resmi SIPZ untuk pembayaran zakat adalah: Bank Syariah Indonesia (BSI) No. Rek. 7000123456, Bank Mandiri Syariah No. Rek. 7001234567, Bank BNI Syariah No. Rek. 7002345678, dan Bank Muamalat No. Rek. 7003456789. Pastikan untuk melakukan konfirmasi setelah transfer."
                },
                {
                    id: "konfirmasi-donasi",
                    question: "Bagaimana cara konfirmasi donasi setelah transfer?",
                    answer: "Setelah melakukan transfer, Anda dapat melakukan konfirmasi melalui website SIPZ di menu 'Konfirmasi Donasi', melalui WhatsApp ke nomor 628111544488, atau menghubungi call center kami di 0804-100-4000. Sertakan bukti transfer, nama lengkap, jenis donasi, dan nomor telepon."
                },
                {
                    id: "layanan-jemput-zakat",
                    question: "Bagaimana cara menggunakan layanan jemput zakat?",
                    answer: "Untuk menggunakan layanan jemput zakat, Anda dapat menghubungi call center kami di 0804-100-4000 atau mengisi formulir jemput zakat di website SIPZ. Tim kami akan menghubungi Anda untuk konfirmasi waktu dan lokasi penjemputan zakat."
                }
            ]
        },
        {
            id: "program",
            name: "Program",
            questions: [
                {
                    id: "program-sipz",
                    question: "Apa saja program penyaluran zakat di SIPZ?",
                    answer: "SIPZ memiliki berbagai program penyaluran zakat yang mencakup lima pilar utama: Kesehatan (layanan kesehatan gratis untuk dhuafa), Pendidikan (beasiswa dan pembangunan sarana pendidikan), Ekonomi (pemberdayaan ekonomi masyarakat), Sosial (bantuan kemanusiaan dan tanggap darurat), serta Dakwah dan Budaya."
                },
                {
                    id: "program-kesehatan",
                    question: "Bagaimana program kesehatan SIPZ?",
                    answer: "Program kesehatan SIPZ meliputi layanan kesehatan gratis untuk dhuafa melalui klinik dan rumah sakit mitra, layanan kesehatan keliling untuk daerah terpencil, bantuan biaya pengobatan untuk pasien tidak mampu, dan program kesehatan preventif seperti penyuluhan kesehatan dan sanitasi."
                },
                {
                    id: "program-pendidikan",
                    question: "Apa saja program pendidikan yang dijalankan SIPZ?",
                    answer: "Program pendidikan SIPZ meliputi beasiswa untuk siswa dan mahasiswa kurang mampu, pembangunan dan renovasi sekolah di daerah tertinggal, pelatihan guru, dan program pendidikan non-formal seperti pelatihan keterampilan dan kewirausahaan."
                },
                {
                    id: "program-ekonomi",
                    question: "Bagaimana SIPZ memberdayakan ekonomi masyarakat?",
                    answer: "SIPZ memberdayakan ekonomi masyarakat melalui program pemberian modal usaha, pendampingan usaha mikro, pelatihan kewirausahaan, pengembangan desa mandiri, dan pembentukan kelompok usaha bersama yang dikelola oleh masyarakat setempat."
                }
            ]
        }
    ];

    // Filter questions based on search query and active tab
    const filteredQuestions = faqCategories
        .find(category => category.id === activeTab)?.questions
        .filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

    // Get all questions for search across all categories
    const allQuestions = faqCategories.flatMap(category => category.questions)
        .filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Display all questions when searching
    const displayQuestions = searchQuery ? allQuestions : filteredQuestions;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pertanyaan yang Sering Diajukan</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Temukan jawaban untuk pertanyaan umum seputar zakat, infak, sedekah, dan program-program SIPZ.
                    Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi kami.
                </p>
            </div>

            {/* Search */}
            <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            {/* Categories Tabs */}
            <Tabs
                defaultValue="umum"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mb-8"
            >
                <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
                    {faqCategories.map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* FAQ Accordion */}
            <div className="max-w-3xl mx-auto">
                {displayQuestions.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {displayQuestions.map((item, index) => (
                            <AccordionItem key={item.id} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium text-gray-900 dark:text-white">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 dark:text-gray-300">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Tidak ada pertanyaan yang ditemukan.</p>
                        <Button
                            variant="link"
                            className="text-emerald-600 mt-2"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveTab("umum");
                            }}
                        >
                            Reset pencarian
                        </Button>
                    </div>
                )}
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-8 text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Masih Punya Pertanyaan?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Jika Anda memiliki pertanyaan yang belum terjawab, jangan ragu untuk menghubungi tim kami.
                    Kami siap membantu Anda dengan informasi lebih lanjut tentang zakat dan program-program SIPZ.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Button
                        onClick={() => setLocation('/kontak')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Hubungi Kami
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setLocation('/konsultasi')}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                        Konsultasi Ziswaf
                    </Button>
                </div>
            </div>
        </div>
    );
} 