import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Award, Target, Clock, MapPin } from "lucide-react";
import { useLocation } from "wouter";

export default function Tentang() {
    const [, setLocation] = useLocation();

    // Team members data
    const teamMembers = [
        {
            name: "Ahmad Fauzi",
            position: "Direktur Utama",
            image: "/images/team1.jpg",
            bio: "Memiliki pengalaman lebih dari 15 tahun di bidang keuangan syariah dan pengelolaan zakat."
        },
        {
            name: "Siti Aminah",
            position: "Direktur Program",
            image: "/images/team2.jpg",
            bio: "Spesialis dalam pengembangan program pemberdayaan masyarakat berbasis zakat."
        },
        {
            name: "Budi Santoso",
            position: "Direktur Keuangan",
            image: "/images/team3.jpg",
            bio: "Ahli dalam pengelolaan keuangan lembaga nirlaba dengan sertifikasi internasional."
        },
        {
            name: "Fatimah Azzahra",
            position: "Manajer Pengembangan Program",
            image: "/images/team4.jpg",
            bio: "Berpengalaman dalam mengembangkan program-program inovatif untuk pemberdayaan ekonomi."
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tentang SIPZ</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Mengenal lebih dekat Sistem Informasi Pengelolaan Zakat (SIPZ), lembaga filantropi dan kemanusiaan
                    yang bergerak untuk pemberdayaan umat dan kemanusiaan.
                </p>
            </div>

            <Tabs defaultValue="profil" className="w-full mb-16">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
                    <TabsTrigger value="profil">Profil</TabsTrigger>
                    <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
                    <TabsTrigger value="tim">Tim Kami</TabsTrigger>
                    <TabsTrigger value="sejarah">Sejarah</TabsTrigger>
                </TabsList>

                <TabsContent value="profil" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
                                Lembaga Filantropi untuk Pemberdayaan Umat
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                SIPZ adalah lembaga filantropi dan kemanusiaan yang bergerak untuk pemberdayaan umat (Empowering People) dan kemanusiaan.
                                Pemberdayaannya bergulir melalui pengelolaan dana zakat, infak, sedekah dan wakaf (Ziswaf), serta dana sosial lainnya
                                yang terkelola secara modern dan amanah.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Dalam pengelolaannya mengedepankan konsep welas asih atau kasih sayang sebagai akar gerakan filantropis yang
                                mengedepankan lima pilar program yaitu Kesehatan, Pendidikan, Ekonomi, Sosial, serta Dakwah dan Budaya.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Button
                                    onClick={() => setLocation('/program')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    Lihat Program Kami
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setLocation('/laporan')}
                                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                                >
                                    Laporan Tahunan
                                </Button>
                            </div>
                        </div>
                        <div className="bg-emerald-100 dark:bg-emerald-900 rounded-lg p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-3">
                                        <Building2 className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Berdiri Sejak</h3>
                                    <p className="text-emerald-700 dark:text-emerald-300">2001</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-3">
                                        <Users className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Penerima Manfaat</h3>
                                    <p className="text-emerald-700 dark:text-emerald-300">1.2 Juta+</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-3">
                                        <Award className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Penghargaan</h3>
                                    <p className="text-emerald-700 dark:text-emerald-300">12+</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-3">
                                        <MapPin className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Kantor Cabang</h3>
                                    <p className="text-emerald-700 dark:text-emerald-300">15 Provinsi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="visi-misi" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card className="border-none shadow-lg">
                            <CardContent className="pt-8">
                                <div className="flex items-center mb-6">
                                    <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-3 mr-4">
                                        <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Visi</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Menjadi lembaga filantropi Islam terdepan yang menginspirasi gerakan kemanusiaan dan pemberdayaan.
                                </p>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 pl-4">
                                    <li>Terdepan dalam layanan</li>
                                    <li>Terdepan dalam program inovatif</li>
                                    <li>Terdepan dalam sistem pengelolaan</li>
                                    <li>Terdepan dalam mobilisasi sumber daya</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="pt-8">
                                <div className="flex items-center mb-6">
                                    <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-3 mr-4">
                                        <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Misi</h2>
                                </div>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 pl-4">
                                    <li>Mengembangkan nilai kemanusiaan dan kemandirian</li>
                                    <li>Meningkatkan mobilisasi sumber daya untuk pemberdayaan</li>
                                    <li>Mendorong sinergi program dan jaringan filantropi global</li>
                                    <li>Mengembangkan zakat sebagai instrumen alternatif pengentasan kemiskinan</li>
                                    <li>Menjunjung tinggi nilai-nilai transparansi dan akuntabilitas</li>
                                    <li>Mengoptimalkan penggunaan teknologi untuk pelayanan dan pemberdayaan</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tim" className="mt-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Tim Manajemen SIPZ
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-1">{member.name}</h3>
                                    <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-3">{member.position}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            onClick={() => setLocation('/karir')}
                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                            Bergabung dengan Tim Kami
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="sejarah" className="mt-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Perjalanan SIPZ
                    </h2>
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 flex items-center justify-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                                    <Clock className="h-12 w-12 text-emerald-600 dark:text-emerald-300" />
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">2001 - Awal Pendirian</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    SIPZ didirikan sebagai respons terhadap kebutuhan akan lembaga pengelola zakat yang profesional dan terpercaya.
                                    Diawali dengan program-program sederhana namun berdampak, SIPZ mulai dikenal sebagai lembaga filantropi yang amanah.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 flex items-center justify-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                                    <Clock className="h-12 w-12 text-emerald-600 dark:text-emerald-300" />
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">2005 - Ekspansi Program</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Setelah berhasil menjalankan program-program awal, SIPZ mulai memperluas jangkauan dengan membuka kantor cabang
                                    di beberapa kota besar di Indonesia. Program-program pemberdayaan ekonomi dan pendidikan mulai dikembangkan.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 flex items-center justify-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                                    <Clock className="h-12 w-12 text-emerald-600 dark:text-emerald-300" />
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">2010 - Transformasi Digital</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Menyadari pentingnya teknologi, SIPZ melakukan transformasi digital dengan meluncurkan platform online untuk
                                    memudahkan donatur dalam menyalurkan zakat, infak, dan sedekah. Sistem informasi pengelolaan zakat yang terintegrasi
                                    mulai dikembangkan.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4 flex items-center justify-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-4">
                                    <Clock className="h-12 w-12 text-emerald-600 dark:text-emerald-300" />
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">2020 - Saat Ini</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    SIPZ terus berkembang dan berinovasi dalam program-program pemberdayaan. Dengan dukungan teknologi terkini dan
                                    jaringan yang luas, SIPZ berkomitmen untuk terus memberikan manfaat bagi masyarakat dan berkontribusi dalam
                                    pengentasan kemiskinan di Indonesia.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Bergabunglah dalam Misi Kemanusiaan Kami
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    Setiap kontribusi Anda, sekecil apapun, dapat membawa perubahan besar bagi mereka yang membutuhkan.
                    Mari bersama-sama mewujudkan masyarakat yang lebih baik melalui program-program pemberdayaan SIPZ.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={() => setLocation('/donasi')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                    >
                        Donasi Sekarang
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setLocation('/relawan')}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                        Jadi Relawan
                    </Button>
                </div>
            </div>
        </div>
    );
} 