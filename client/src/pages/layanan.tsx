import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Hand,
    Calculator,
    CheckCircle,
    MessageSquare,
    CreditCard,
    Calendar,
    FileText,
    ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function Layanan() {
    const [, setLocation] = useLocation();

    // Services data
    const services = [
        {
            title: "Jemput Zakat",
            icon: Hand,
            description: "Tidak perlu kemana-mana, kami akan menjemput donasi Ziswaf Anda. Mudah bukan?",
            longDescription: "Layanan jemput zakat memudahkan Anda untuk menyalurkan zakat, infaq, dan sedekah tanpa perlu datang ke kantor kami. Petugas kami akan datang ke lokasi Anda pada waktu yang telah disepakati untuk menjemput donasi Anda.",
            link: "/jemput-zakat"
        },
        {
            title: "Kalkulator Zakat",
            icon: Calculator,
            description: "Hitung kewajiban zakat Anda. Cukup masukkan angka dan ketahui hasilnya.",
            longDescription: "Kalkulator zakat membantu Anda menghitung dengan tepat jumlah zakat yang harus dikeluarkan sesuai dengan ketentuan syariah. Tersedia berbagai jenis kalkulator untuk zakat penghasilan, zakat emas dan perak, zakat perdagangan, dan zakat pertanian.",
            link: "/kalkulator"
        },
        {
            title: "Konfirmasi Donasi",
            icon: CheckCircle,
            description: "Sudah transfer? Yuk konfirmasikan donasi Anda agar tercatat!",
            longDescription: "Setelah melakukan transfer donasi, konfirmasikan donasi Anda melalui layanan ini agar donasi Anda tercatat dengan baik dalam sistem kami dan dapat disalurkan sesuai dengan program yang Anda pilih.",
            link: "/konfirmasi"
        },
        {
            title: "Konsultasi Ziswaf",
            icon: MessageSquare,
            description: "Konsultasi dengan konsultan Zakat kami, sehingga Anda jadi lebih paham.",
            longDescription: "Layanan konsultasi zakat, infaq, sedekah, dan wakaf (Ziswaf) membantu Anda memahami lebih dalam tentang kewajiban zakat dan keutamaan bersedekah. Konsultan kami siap membantu menjawab pertanyaan Anda seputar Ziswaf.",
            link: "/konsultasi"
        },
        {
            title: "Pembayaran Online",
            icon: CreditCard,
            description: "Bayar zakat, infaq, dan sedekah secara online dengan mudah dan aman.",
            longDescription: "Layanan pembayaran online memungkinkan Anda untuk menyalurkan zakat, infaq, dan sedekah secara digital melalui berbagai metode pembayaran seperti transfer bank, e-wallet, dan kartu kredit dengan aman dan nyaman.",
            link: "/pembayaran"
        },
        {
            title: "Pengingat Zakat",
            icon: Calendar,
            description: "Dapatkan pengingat untuk membayar zakat tepat waktu sesuai jadwal Anda.",
            longDescription: "Layanan pengingat zakat akan membantu Anda untuk tidak melewatkan kewajiban membayar zakat. Anda dapat mengatur jadwal pengingat sesuai dengan kebutuhan Anda, baik untuk zakat bulanan maupun tahunan.",
            link: "/pengingat"
        },
        {
            title: "Laporan Donasi",
            icon: FileText,
            description: "Akses laporan donasi Anda untuk keperluan administrasi dan perpajakan.",
            longDescription: "Layanan laporan donasi memberikan akses kepada Anda untuk melihat riwayat donasi yang telah dilakukan. Laporan ini dapat digunakan untuk keperluan administrasi dan pengurangan pajak penghasilan.",
            link: "/laporan"
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Layanan SIPZ</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Kami menyediakan berbagai layanan untuk memudahkan Anda dalam menunaikan kewajiban zakat
                    dan berkontribusi dalam program-program kemanusiaan.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <service.icon className="h-12 w-12 text-emerald-600 mb-4" />
                            <CardTitle className="text-emerald-800 dark:text-emerald-200">
                                {service.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                                {service.longDescription}
                            </p>
                            <Button
                                variant="link"
                                className="text-emerald-600 p-0 h-auto flex items-center"
                                onClick={() => setLocation(service.link)}
                            >
                                Gunakan Layanan <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Butuh Bantuan Lebih Lanjut?
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={() => setLocation('/kontak')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                    >
                        Hubungi Kami
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setLocation('/faq')}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                        Lihat FAQ
                    </Button>
                </div>
            </div>
        </div>
    );
} 