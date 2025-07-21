import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCircle, TriangleAlert, Clock, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/zakat-calculator";

const notificationSettingsSchema = z.object({
  yearlyReminderEnabled: z.boolean(),
  yearlyReminderDays: z.number(),
  yearlyReminderMonth: z.string(),
  monthlyReminderEnabled: z.boolean(),
  monthlyReminderDate: z.number(),
  monthlyReminderAmount: z.string().optional(),
  emailNotificationEnabled: z.boolean(),
  email: z.string().email().optional(),
});

export default function PaymentNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: upcomingData } = useQuery({
    queryKey: ["/api/zakat/upcoming"],
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ["/api/notifications/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/notifications/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Pengaturan notifikasi telah disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/settings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
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
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/payments"] });
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
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      yearlyReminderEnabled: notificationSettings?.yearlyReminderEnabled ?? true,
      yearlyReminderDays: notificationSettings?.yearlyReminderDays ?? 30,
      yearlyReminderMonth: notificationSettings?.yearlyReminderMonth ?? "ramadhan",
      monthlyReminderEnabled: notificationSettings?.monthlyReminderEnabled ?? false,
      monthlyReminderDate: notificationSettings?.monthlyReminderDate ?? 1,
      monthlyReminderAmount: notificationSettings?.monthlyReminderAmount?.toString() ?? "",
      emailNotificationEnabled: notificationSettings?.emailNotificationEnabled ?? true,
      email: notificationSettings?.email ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof notificationSettingsSchema>) => {
    const amount = values.monthlyReminderAmount ? 
      parseFloat(values.monthlyReminderAmount.replace(/[^0-9.-]+/g, "")) : null;
    
    updateSettingsMutation.mutate({
      ...values,
      monthlyReminderAmount: amount?.toString() || null,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPaymentStatus = (payment: any) => {
    const dueDate = new Date(payment.dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (payment.status === 'paid') {
      return { 
        variant: "default" as const, 
        text: "Selesai", 
        icon: CheckCircle, 
        bgClass: "bg-green-50 border-green-200" 
      };
    }
    
    if (diffInDays < 0) {
      return { 
        variant: "destructive" as const, 
        text: `Terlambat ${Math.abs(diffInDays)} hari`, 
        icon: TriangleAlert, 
        bgClass: "bg-red-50 border-red-200" 
      };
    }
    
    if (diffInDays <= 3) {
      return { 
        variant: "default" as const, 
        text: `${diffInDays} hari lagi`, 
        icon: Clock, 
        bgClass: "bg-yellow-50 border-yellow-200" 
      };
    }
    
    return { 
      variant: "secondary" as const, 
      text: `${diffInDays} hari lagi`, 
      icon: Calendar, 
      bgClass: "bg-blue-50 border-blue-200" 
    };
  };

  const upcomingPayments = upcomingData?.upcoming || [];
  const overduePayments = upcomingData?.overdue || [];
  const allPayments = [...overduePayments, ...upcomingPayments];

  return (
    <section className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-3 text-blue-600" />
            Notifikasi & Reminder Pembayaran
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Payments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pembayaran Mendatang</h3>
              
              {allPayments.length > 0 ? (
                <div className="space-y-4">
                  {allPayments.map((payment: any) => {
                    const status = getPaymentStatus(payment);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={payment.id} className={`${status.bgClass} border rounded-lg p-4`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                              <StatusIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                Zakat {payment.type}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Jatuh tempo: {formatDate(payment.dueDate)}
                              </p>
                              <Badge variant={status.variant} className="mt-1">
                                {status.text}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(Number(payment.amount))}
                            </p>
                            {payment.status !== 'paid' && (
                              <Button 
                                size="sm" 
                                onClick={() => markAsPaidMutation.mutate(payment.id)}
                                disabled={markAsPaidMutation.isPending}
                                className="mt-2 text-xs"
                              >
                                {markAsPaidMutation.isPending ? "Memproses..." : "Bayar Sekarang"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Tidak ada pembayaran mendatang</p>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Notifikasi</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Reminder Zakat Tahunan</h4>
                        <FormField
                          control={form.control}
                          name="yearlyReminderEnabled"
                          render={({ field }) => (
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Pengingat otomatis setiap tahun pada bulan yang sama
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="yearlyReminderDays"
                          render={({ field }) => (
                            <FormItem>
                              <Select 
                                value={field.value.toString()} 
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="30">30 hari sebelum</SelectItem>
                                  <SelectItem value="15">15 hari sebelum</SelectItem>
                                  <SelectItem value="7">7 hari sebelum</SelectItem>
                                  <SelectItem value="1">1 hari sebelum</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="yearlyReminderMonth"
                          render={({ field }) => (
                            <FormItem>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ramadhan">Ramadhan</SelectItem>
                                  <SelectItem value="muharram">Muharram</SelectItem>
                                  <SelectItem value="rajab">Rajab</SelectItem>
                                  <SelectItem value="syawal">Syawal</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Reminder Infaq Rutin</h4>
                        <FormField
                          control={form.control}
                          name="monthlyReminderEnabled"
                          render={({ field }) => (
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Pengingat untuk infaq rutin setiap bulan
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="monthlyReminderDate"
                          render={({ field }) => (
                            <FormItem>
                              <Select 
                                value={field.value.toString()} 
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                disabled={!form.watch("monthlyReminderEnabled")}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">Setiap tanggal 1</SelectItem>
                                  <SelectItem value="15">Setiap tanggal 15</SelectItem>
                                  <SelectItem value="0">Setiap Jumat</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="monthlyReminderAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Jumlah rutin" 
                                  disabled={!form.watch("monthlyReminderEnabled")}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Notifikasi Email</h4>
                        <FormField
                          control={form.control}
                          name="emailNotificationEnabled"
                          render={({ field }) => (
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Terima pengingat melalui email
                      </p>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="ahmad.rahman@email.com"
                                disabled={!form.watch("emailNotificationEnabled")}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit" 
                    disabled={updateSettingsMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {updateSettingsMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
