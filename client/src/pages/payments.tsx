import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/zakat-calculator";

const paymentSchema = z.object({
  type: z.string().min(1, "Jenis zakat harus dipilih"),
  amount: z.string().min(1, "Jumlah harus diisi"),
  dueDate: z.string().min(1, "Tanggal jatuh tempo harus diisi"),
  recipient: z.string().optional(),
  notes: z.string().optional(),
});

export default function Payments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/zakat/payments"],
  });

  const { data: upcomingData } = useQuery({
    queryKey: ["/api/zakat/upcoming"],
  });

  const schedulePaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/zakat/schedule", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Pembayaran zakat telah dijadwalkan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/upcoming"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menjadwalkan pembayaran",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      return apiRequest("PATCH", `/api/zakat/payments/${paymentId}`, {
        status: "paid",
        paidDate: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Pembayaran telah ditandai sebagai selesai",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui status pembayaran",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: "",
      amount: "",
      dueDate: "",
      recipient: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    const amount = parseFloat(values.amount.replace(/[^0-9.-]+/g, "")) || 0;
    
    schedulePaymentMutation.mutate({
      type: values.type,
      amount: amount.toString(),
      dueDate: new Date(values.dueDate).toISOString(),
      recipient: values.recipient || null,
      notes: values.notes || null,
      status: "scheduled",
    });
  };

  const getPaymentStatus = (payment: any) => {
    if (payment.status === 'paid') {
      return { 
        variant: "default" as const, 
        text: "Selesai", 
        icon: CheckCircle, 
        className: "bg-green-100 text-green-800" 
      };
    }
    
    const dueDate = new Date(payment.dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return { 
        variant: "destructive" as const, 
        text: `Terlambat ${Math.abs(diffInDays)} hari`, 
        icon: AlertTriangle, 
        className: "bg-red-100 text-red-800" 
      };
    }
    
    return { 
      variant: "secondary" as const, 
      text: `${diffInDays} hari lagi`, 
      icon: Clock, 
      className: "bg-yellow-100 text-yellow-800" 
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Zakat</h1>
          <p className="text-gray-600">Jadwalkan dan kelola pembayaran zakat Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Jadwal Pembayaran */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="bg-gradient-to-r from-islamic-600 to-islamic-700 text-white">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-3" />
                  Jadwalkan Pembayaran
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Zakat</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis zakat" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="penghasilan">Zakat Penghasilan</SelectItem>
                              <SelectItem value="emas">Zakat Emas</SelectItem>
                              <SelectItem value="perdagangan">Zakat Perdagangan</SelectItem>
                              <SelectItem value="pertanian">Zakat Pertanian</SelectItem>
                              <SelectItem value="fitrah">Zakat Fitrah</SelectItem>
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
                            <Input placeholder="Contoh: 2.500.000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Penerima (Opsional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama lembaga atau mustahik" {...field} />
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
                              placeholder="Catatan tambahan"
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
                      disabled={schedulePaymentMutation.isPending}
                      className="w-full bg-islamic-600 hover:bg-islamic-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {schedulePaymentMutation.isPending ? "Menjadwalkan..." : "Jadwalkan Pembayaran"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Daftar Pembayaran */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pembayaran Zakat</CardTitle>
                <p className="text-sm text-gray-600">Kelola dan pantau status pembayaran zakat Anda</p>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Jenis</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead>Penerima</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        [...Array(3)].map((_, i) => (
                          <TableRow key={i}>
                            {[...Array(6)].map((_, j) => (
                              <TableCell key={j}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : payments && payments.length > 0 ? (
                        payments.map((payment: any) => {
                          const status = getPaymentStatus(payment);
                          const StatusIcon = status.icon;
                          
                          return (
                            <TableRow key={payment.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium capitalize">
                                {payment.type}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatCurrency(Number(payment.amount))}
                              </TableCell>
                              <TableCell>
                                {payment.dueDate ? formatDate(payment.dueDate) : '-'}
                              </TableCell>
                              <TableCell>{payment.recipient || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={status.variant} className={status.className}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status.text}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {payment.status !== 'paid' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => markAsPaidMutation.mutate(payment.id)}
                                    disabled={markAsPaidMutation.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {markAsPaidMutation.isPending ? "..." : "Bayar"}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <CreditCard className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <p>Belum ada pembayaran terjadwal</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}