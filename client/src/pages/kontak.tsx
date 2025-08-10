import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Kontak() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Pesan Terkirim",
                description: "Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.",
            });

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Hubungi Kami</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Ada pertanyaan tentang zakat atau butuh bantuan? Jangan ragu untuk menghubungi tim kami.
                    Kami siap membantu Anda.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                        <Phone className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                        <CardTitle className="text-emerald-800 dark:text-emerald-200">
                            Telepon
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 dark:text-gray-300">+62 812 3456 7890</p>
                        <p className="text-gray-600 dark:text-gray-300">Senin - Jumat: 08.00 - 17.00</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                        <Mail className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                        <CardTitle className="text-emerald-800 dark:text-emerald-200">
                            Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 dark:text-gray-300">info@sipz.org</p>
                        <p className="text-gray-600 dark:text-gray-300">support@sipz.org</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                        <MapPin className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                        <CardTitle className="text-emerald-800 dark:text-emerald-200">
                            Alamat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 dark:text-gray-300">Jl. Zakat Nasional No. 123</p>
                        <p className="text-gray-600 dark:text-gray-300">Jakarta Pusat, 10110</p>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card className="border-emerald-200">
                    <CardHeader>
                        <CardTitle className="text-emerald-800 dark:text-emerald-200">
                            Kirim Pesan
                        </CardTitle>
                        <CardDescription>
                            Isi formulir di bawah ini dan kami akan merespons secepatnya
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nama Lengkap
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Masukkan alamat email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Subjek
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Masukkan subjek pesan"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pesan
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tulis pesan Anda di sini..."
                                    rows={6}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Send className="mr-2 h-4 w-4" />
                                        Kirim Pesan
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 