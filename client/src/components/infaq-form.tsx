import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heart, Save, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/zakat-calculator";

const infaqSchema = z.object({
  type: z.string().min(1, "Jenis amal harus dipilih"),
  amount: z.string().min(1, "Jumlah harus diisi"),
  recipient: z.string().min(1, "Tujuan/penerima harus diisi"),
  date: z.string().min(1, "Tanggal harus diisi"),
  notes: z.string().optional(),
});

export default function InfaqForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentInfaq, isLoading } = useQuery({
    queryKey: ["/api/infaq/recent"],
  });

  const createInfaqMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/infaq", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Catatan amal telah disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/infaq"] });
      queryClient.invalidateQueries({ queryKey: ["/api/infaq/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan catatan amal",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(infaqSchema),
    defaultValues: {
      type: "",
      amount: "",
      recipient: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof infaqSchema>) => {
    const amount = parseFloat(values.amount.replace(/[^0-9.-]+/g, "")) || 0;
    
    createInfaqMutation.mutate({
      type: values.type,
      amount: amount.toString(),
      recipient: values.recipient,
      date: new Date(values.date).toISOString(),
      notes: values.notes || null,
    });
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return `${Math.floor(diffInDays / 30)} bulan lalu`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "infaq":
        return "💚";
      case "shadaqoh":
        return "🤲";
      case "wakaf":
        return "🕌";
      case "fidyah":
        return "🌙";
      default:
        return "❤️";
    }
  };

  return (
    <section id="infaq" className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
              <CardTitle className="flex items-center">
                <Heart className="mr-3" />
                Catat Infaq & Shadaqoh
              </CardTitle>
              <p className="text-gold-100 text-sm">Rekam amal jariyah Anda</p>
            </CardHeader>

            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Amal</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis amal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="infaq">Infaq</SelectItem>
                              <SelectItem value="shadaqoh">Shadaqoh</SelectItem>
                              <SelectItem value="wakaf">Wakaf</SelectItem>
                              <SelectItem value="fidyah">Fidyah</SelectItem>
                              <SelectItem value="other">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah (Rp)</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 100.000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tujuan/Penerima</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Masjid Al-Ikhlas, Panti Asuhan, dll" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tambahkan catatan atau keterangan"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={createInfaqMutation.isPending}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createInfaqMutation.isPending ? "Menyimpan..." : "Simpan Catatan Amal"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Infaq List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <History className="mr-2 text-gold-600" />
                Amal Terbaru
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentInfaq && recentInfaq.length > 0 ? (
                <div className="space-y-4">
                  {recentInfaq.map((item: any) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{getTypeIcon(item.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 capitalize">{item.type}</p>
                        <p className="text-sm text-gray-600 truncate">{item.recipient}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(item.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gold-600">
                          {formatCurrency(Number(item.amount))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Belum ada catatan amal</p>
                </div>
              )}

              {recentInfaq && recentInfaq.length > 0 && (
                <Button variant="ghost" className="w-full mt-4 text-gold-600 hover:text-gold-700">
                  Lihat Semua Riwayat
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
