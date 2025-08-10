import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield,
    Wallet,
    BookOpen,
    Heart,
    BookOpen as PrayingHands,
    Building as Mosque,
    ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function Program() {
    const [, setLocation] = useLocation();

    // Program data
    const programs = [
        {
            title: "Kesehatan",
            icon: Shield,
            description: "Program layanan kesehatan untuk melayani kaum dhuafa melalui intervensi preventif, promotif dan kuratif.",
            longDescription: "Sejak 2001, SIPZ telah memulai peran aktif di bidang kesehatan untuk melayani kaum dhuafa. Melalui program Layanan Kesehatan Cuma-cuma (LKC), beragam intervensi di bidang kesehatan hadir. Baik bersifat preventif, promotif dan kuratif. LKC memberikan akses layanan kesehatan yang layak dan optimal secara tidak berbayar bagi kaum dhuafa.",
            link: "/program/kesehatan"
        },
        {
            title: "Ekonomi",
            icon: Wallet,
            description: "Pemberdayaan ekonomi untuk mengangkat harkat hidup mustahik, dhuafa dan masyarakat prasejahtera.",
            longDescription: "Pemberdayaan ekonomi SIPZ tujukan untuk mengangkat harkat hidup mustahik, dhuafa dan masyaraka prasejahtera dengan orientasi peningkatan penghasilan. Dari program tersebut, donatur SIPZ mengharapkan para mustahik memiliki pengetahuan tentang usaha, kemampuan untuk mengakses modal, meminimalkan resiko, mengelola usaha, pasar dan mengendalikan aset ekonomi.",
            link: "/program/ekonomi"
        },
        {
            title: "Pendidikan",
            icon: BookOpen,
            description: "Program pendidikan menyentuh siswa hingga tenaga pendidik untuk membentuk SDM berkarakter dan berkompetensi global.",
            longDescription: "Program pendidikan SIPZ hadir menyentuh siswa hingga tenaga pendidik. Sehingga dapat membentuk SDM berkarakter dan berkompetensi global menuju Indonesia berdaya.",
            link: "/program/pendidikan"
        },
        {
            title: "Sosial",
            icon: Heart,
            description: "Layanan sosial untuk berbagai masalah masyarakat, dari pemenuhan basic needs hingga tanggap darurat bencana.",
            longDescription: "Di bidang sosial SIPZ memberikan beragam program dan pelayanan berbagai masalah sosial masyarakat. Mulai dari pemenuhan pelayanan basic needs kepada masyarakat, baik material maupun spiritual. Hingga layanan tanggap darurat dan pemulihan paska bencana.",
            link: "/program/sosial"
        },
        {
            title: "Dakwah & Budaya",
            icon: PrayingHands,
            description: "Pengembangan aktivitas dakwah dan budaya melalui berbagai program yang menyentuh berbagai lapisan masyarakat.",
            longDescription: "Di program Dakwah dan Budaya SIPZ mengembangkan beragam aktivitas yang di antaranya adalah Corps Dai SIPZ (Cordofa), Dai Ambasaador, Pesantren Muallaf, Bina Rohani Pasien, Bina Santri Lapas, Badan Pemulasaran Jenazah, Kampung Silat Jampang, Jampang English Village, dan Serambi Budaya.",
            link: "/program/dakwah"
        },
        {
            title: "Wakaf",
            icon: Mosque,
            description: "Salurkan wakaf untuk program-program produktif agar manfaatnya terus tumbuh dan mengalir abadi.",
            longDescription: "Salurkan wakaf anda untuk program-program produktif agar manfaatnya terus tumbuh dan mengalir abadi. Portofolio wakaf kami sangat luas, mulai dari sarana pendidikan, sarana kesehatan, pertanian, masjid, sumur dan lain sebagainya.",
            link: "/program/wakaf"
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Program SIPZ</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    SIPZ memiliki 6 pilar program utama dengan tujuan besar mengentaskan kemiskinan
                    dan memberdayakan umat melalui pengelolaan dana zakat, infak, sedekah dan wakaf.
                </p>
            </div>

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
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                {program.longDescription}
                            </p>
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

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Ingin Berkontribusi pada Program Kami?
                </h2>
                <Button
                    size="lg"
                    onClick={() => setLocation('/donasi')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                >
                    Donasi Sekarang
                </Button>
            </div>
        </div>
    );
} 