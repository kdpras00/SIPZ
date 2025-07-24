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

// Mock data untuk admin
const adminStats = {
  total_collections: 125000000,
  total_distributions: 118000000,
  pending_distributions: 7000000,
  total_muzakki: 145,
  total_mustahik: 89,
  this_month_collections: 15000000,
  this_month_distributions: 14200000,
  active_programs: 8
};

const recentTransactions = [
  {
    id: "TRX-2024-001",
    muzakki_name: "Ahmad Rahman",
    type: "Zakat Penghasilan",
    amount: 2500000,
    date: "2024-01-15",
    status: "verified"
  },
  {
    id: "TRX-2024-002", 
    muzakki_name: "Siti Aminah",
    type: "Zakat Fitrah",
    amount: 350000,
    date: "2024-01-14",
    status: "pending"
  },
  {
    id: "TRX-2024-003",
    muzakki_name: "Budi Santoso", 
    type: "Infaq",
    amount: 1000000,
    date: "2024-01-13",
    status: "verified"
  }
];

const mustahikData = [
  {
    id: 1,
    name: "Ahmad Suharto",
    category: "Fakir",
    phone: "081234567890",
    address: "Jl. Kebon Jeruk No. 15, Jakarta Timur",
    family_members: 4,
    monthly_income: 0,
    verified: true,
    last_received: "2024-01-15"
  },
  {
    id: 2,
    name: "Fatimah Zahra",
    category: "Miskin", 
    phone: "081987654321",
    address: "Jl. Mangga Dua No. 8, Jakarta Selatan",
    family_members: 2,
    monthly_income: 800000,
    verified: true,
    last_received: "2024-01-10"
  },
  {
    id: 3,
    name: "Yayasan Yatim Piatu Al-Ikhlas",
    category: "Fi Sabilillah",
    phone: "021-12345678",
    address: "Jl. Sudirman No. 100, Jakarta Pusat", 
    family_members: null,
    monthly_income: null,
    verified: true,
    last_received: "2024-01-08"
  }
];

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMustahik, setSelectedMustahik] = useState<any>(null);

  // Mock queries - in real app would fetch from API
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => Promise.resolve(adminStats),
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
    queryFn: () => Promise.resolve(recentTransactions),
  });

  const { data: mustahik, isLoading } = useQuery({
    queryKey: ["/api/admin/mustahik"],
    queryFn: () => Promise.resolve(mustahikData),
  });

  const addMustahikMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      return Promise.resolve({ ...data, id: Date.now() });
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Admin</h1>
              <p className="text-gray-600">Kelola sistem zakat dan data mustahik</p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-sm text-gray-600">Total Terkumpul</p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(stats?.total_collections || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <p className="text-sm text-gray-600">Total Disalurkan</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(stats?.total_distributions || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
              <p className="text-sm text-gray-600">Total Muzakki</p>
              <p className="text-xl font-bold text-islamic-700">
                {stats?.total_muzakki || 0} orang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-gold-600" />
              <p className="text-sm text-gray-600">Total Mustahik</p>
              <p className="text-xl font-bold text-gold-700">
                {stats?.total_mustahik || 0} orang
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mustahik">Kelola Mustahik</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaksi Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions?.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.muzakki_name}</p>
                          <p className="text-sm text-gray-600">{transaction.type}</p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-islamic-600">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <Badge 
                            variant={transaction.status === 'verified' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {transaction.status === 'verified' ? 'Terverifikasi' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-islamic-600 hover:bg-islamic-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah Mustahik Baru
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Lihat Statistik Lengkap
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={exportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Laporan Bulanan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan Sistem
                  </Button>
                </CardContent>
              </Card>
            </div>
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
      </main>

      <Footer />
    </div>
  );
}