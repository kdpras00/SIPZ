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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  Users, 
  BarChart3, 
  UserPlus, 
  Edit, 
  Trash2,
  Download,
  Shield,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/zakat-calculator";

const mustahikSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  category: z.string().min(1, "Kategori harus dipilih"), 
  phone: z.string().optional(),
  address: z.string().min(1, "Alamat harus diisi"),
  family_members: z.string().optional(),
  monthly_income: z.string().optional(),
  notes: z.string().optional(),
});


export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMustahik, setSelectedMustahik] = useState<any>(null);

  // Queries for admin data
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  const { data: mustahik, isLoading } = useQuery({
    queryKey: ["/api/admin/mustahik"],
  });

  const addMustahikMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/admin/mustahik", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Data mustahik telah ditambahkan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/mustahik"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan data mustahik",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(mustahikSchema),
    defaultValues: {
      name: "",
      category: "",
      phone: "",
      address: "",
      family_members: "",
      monthly_income: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof mustahikSchema>) => {
    addMustahikMutation.mutate({
      ...values,
      family_members: values.family_members ? parseInt(values.family_members) : null,
      monthly_income: values.monthly_income ? parseFloat(values.monthly_income.replace(/[^0-9.-]+/g, "")) : null,
      verified: false,
      last_received: null
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportReport = () => {
    toast({
      title: "Export Dimulai",
      description: "Laporan sedang diproses dan akan diunduh sebentar lagi",
    });
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Panel Admin</h1>
          <p className="text-gray-600 dark:text-gray-300">Kelola sistem zakat dan data mustahik</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Shield className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* Enhanced Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <DollarSign className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <p className="text-sm text-gray-600">Total Terkumpul</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(stats?.total_collections || 0)}
            </p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% bulan ini</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <p className="text-sm text-gray-600">Total Disalurkan</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(stats?.total_distributions || 0)}
            </p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8% bulan ini</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100 border-islamic-200">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
            <p className="text-sm text-gray-600">Total Muzakki</p>
            <p className="text-xl font-bold text-islamic-700">
              {stats?.total_muzakki || 0} orang
            </p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+15 baru</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-gold-200">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-gold-600" />
            <p className="text-sm text-gray-600">Total Mustahik</p>
            <p className="text-xl font-bold text-gold-700">
              {stats?.total_mustahik || 0} orang
            </p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5 terverifikasi</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mustahik">Kelola Mustahik</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Real-time Stats */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 text-islamic-600" />
                    Statistik Real-time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(stats?.today_collections || 0)}
                      </p>
                      <p className="text-sm text-gray-600">Hari Ini</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">
                        {stats?.pending_verifications || 0}
                      </p>
                      <p className="text-sm text-gray-600">Pending Verifikasi</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-700">
                        {stats?.active_distributions || 0}
                      </p>
                      <p className="text-sm text-gray-600">Sedang Disalurkan</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-700">
                        {stats?.new_registrations || 0}
                      </p>
                      <p className="text-sm text-gray-600">Pendaftar Baru</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-islamic-600 hover:bg-islamic-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah Mustahik Baru
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/verifikasi')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verifikasi Transaksi ({stats?.pending_verifications || 0})
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/analytics')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Lihat Statistik Lengkap
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={exportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan Bulanan
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan Sistem
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
                <p className="text-sm text-gray-600">Transaksi yang memerlukan perhatian</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.status === 'verified' ? 'bg-green-500' : 
                          transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.muzakki_name}</p>
                          <p className="text-sm text-gray-600">{transaction.type}</p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-islamic-600">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge 
                          variant={transaction.status === 'verified' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            transaction.status === 'verified' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status === 'verified' ? 'Terverifikasi' : 
                           transaction.status === 'pending' ? 'Pending' : 'Ditolak'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-islamic-600">
                  Lihat Semua Transaksi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mustahik" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Tambah Mustahik */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="mr-2" />
                      Tambah Mustahik
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input placeholder="Nama mustahik" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategori</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Fakir">Fakir</SelectItem>
                                  <SelectItem value="Miskin">Miskin</SelectItem>
                                  <SelectItem value="Amil">Amil Zakat</SelectItem>
                                  <SelectItem value="Muallaf">Muallaf</SelectItem>
                                  <SelectItem value="Riqab">Riqab</SelectItem>
                                  <SelectItem value="Gharim">Gharim</SelectItem>
                                  <SelectItem value="Fi Sabilillah">Fi Sabilillah</SelectItem>
                                  <SelectItem value="Ibn Sabil">Ibn Sabil</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>No. Telepon</FormLabel>
                              <FormControl>
                                <Input placeholder="081234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alamat</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Alamat lengkap"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="family_members"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Anggota Keluarga</FormLabel>
                                <FormControl>
                                  <Input placeholder="4" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="monthly_income"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Penghasilan/Bulan</FormLabel>
                                <FormControl>
                                  <Input placeholder="500000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Catatan</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Catatan tambahan"
                                  rows={2}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          disabled={addMustahikMutation.isPending}
                          className="w-full bg-islamic-600 hover:bg-islamic-700"
                        >
                          {addMustahikMutation.isPending ? "Menyimpan..." : "Tambah Mustahik"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Daftar Mustahik */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daftar Mustahik</CardTitle>
                    <p className="text-sm text-gray-600">
                      Total: {mustahik?.length || 0} mustahik terdaftar
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Nama</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Kontak</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Terakhir Terima</TableHead>
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
                          ) : mustahik && mustahik.length > 0 ? (
                            mustahik.map((person: any) => (
                              <TableRow key={person.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-gray-900">{person.name}</p>
                                    <p className="text-xs text-gray-500">ID: {person.id}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{person.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <p>{person.phone}</p>
                                    <p className="text-gray-500 truncate max-w-32">{person.address}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={person.verified ? "default" : "secondary"}
                                    className={person.verified ? "bg-green-100 text-green-800" : ""}
                                  >
                                    {person.verified ? "Terverifikasi" : "Belum Verifikasi"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {person.last_received ? formatDate(person.last_received) : "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                Belum ada data mustahik
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
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Semua Transaksi</CardTitle>
                <p className="text-sm text-gray-600">Kelola dan verifikasi transaksi zakat</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>ID Transaksi</TableHead>
                        <TableHead>Muzakki</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.map((transaction: any) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                          <TableCell className="font-medium">{transaction.muzakki_name}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.status === 'verified' ? 'default' : 'secondary'}
                              className={transaction.status === 'verified' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {transaction.status === 'verified' ? 'Terverifikasi' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.status === 'pending' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Verifikasi
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <VisualReports />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Laporan Keuangan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(stats?.this_month_collections || 0)}
                      </p>
                      <p className="text-sm text-gray-600">Terkumpul Bulan Ini</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(stats?.this_month_distributions || 0)}
                      </p>
                      <p className="text-sm text-gray-600">Disalurkan Bulan Ini</p>
                    </div>
                  </div>
                  <Button onClick={exportReport} className="w-full bg-islamic-600 hover:bg-islamic-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan Keuangan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Laporan Distribusi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Saldo Tersedia</span>
                      <span className="font-semibold text-islamic-600">
                        {formatCurrency(stats?.pending_distributions || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Program Aktif</span>
                      <span className="font-semibold">{stats?.active_programs || 0} program</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Efisiensi Distribusi</span>
                      <span className="font-semibold text-green-600">94.2%</span>
                    </div>
                  </div>
                  <Button onClick={exportReport} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan Distribusi
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}