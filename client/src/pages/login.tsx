import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { refetch } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log("Attempting login with:", { email: formData.email });

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: 'include', // Penting: mengirim dan menerima cookies
            });

            console.log("Login response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal login');
            }

            const data = await response.json();
            console.log("Login success data:", data);

            toast({
                title: "Login Berhasil!",
                description: "Selamat datang kembali.",
            });

            // Refresh auth state
            await refetch();

            // Redirect ke dashboard
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (err: any) {
            console.error("Login error:", err);
            toast({
                title: "Login Gagal",
                description: err.message || "Terjadi kesalahan saat login.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 flex items-center">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center">
                        <Building2 className="h-6 w-6 text-emerald-600 mr-2" />
                        <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">SIPZ</h1>
                    </div>
                </div>

                <Card className="border-emerald-200">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Masuk ke Akun Anda</CardTitle>
                        <CardDescription className="text-center">
                            Masukkan email dan password untuk melanjutkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/lupa-password" className="text-sm text-emerald-600 hover:underline">
                                        Lupa password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Memproses..." : "Masuk"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-emerald-600 hover:underline font-medium">
                                Daftar di sini
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 