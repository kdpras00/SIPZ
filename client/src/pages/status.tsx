import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Package,
  Heart,
  Banknote
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

// Mock data untuk status penyaluran
const distributionData = [
  {
    id: "ZKT-2024-001",
    type: "Zakat Penghasilan",
    amount: 2500000,
    date: "2024-01-15",
    status: "distributed",
    recipient: {
      name: "Ahmad Suharto",
      category: "Fakir",
      location: "Jakarta Timur",
      family_members: 4
    },
    distribution_date: "2024-01-20",
    proof_image: "/api/placeholder/400/300",
    notes: "Telah diserahkan langsung kepada yang bersangkutan untuk kebutuhan sehari-hari keluarga"
  },
  {
    id: "ZKT-2024-002", 
    type: "Zakat Fitrah",
    amount: 350000,
    date: "2024-04-08",
    status: "in_process",
    recipient: {
      name: "Fatimah Zahra",
      category: "Miskin",
      location: "Jakarta Selatan", 
      family_members: 2
    },
    distribution_date: null,
    proof_image: null,
    notes: "Sedang dalam proses verifikasi data mustahik"
  },
  {
    id: "INF-2024-003",
    type: "Infaq",
    amount: 1000000,
    date: "2024-03-10", 
    status: "distributed",
    recipient: {
      name: "Masjid Al-Ikhlas",
      category: "Fi Sabilillah",
      location: "Jakarta Pusat",
      family_members: null
    },
    distribution_date: "2024-03-12",
    proof_image: "/api/placeholder/400/300",
    notes: "Bantuan untuk renovasi masjid dan kegiatan dakwah"
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'distributed':
      return {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Telah Disalurkan'
      };
    case 'in_process':
      return {
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        text: 'Sedang Diproses'
      };
    case 'pending':
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: Package,
        text: 'Menunggu'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: Package, 
        text: 'Unknown'
      };
  }
};

export default function Status() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("semua");

  // Mock query - dalam implementasi nyata akan mengambil dari API
  const { data: myDistributions, isLoading } = useQuery({
    queryKey: ["/api/distributions/my"],
    queryFn: () => Promise.resolve(distributionData),
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/distributions/stats"],
    queryFn: () => Promise.resolve({
      total_distributed: 15750000,
      total_recipients: 28,
      this_month: 5,
      pending_process: 3
    }),
  });

  const filteredDistributions = myDistributions?.filter((item: any) => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "semua" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Status Penyaluran</h1>
          <p className="text-gray-600">Pantau status penyaluran zakat, infaq, dan shadaqoh Anda</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Banknote className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
              <p className="text-sm text-gray-600">Total Disalurkan</p>
              <p className="text-xl font-bold text-islamic-700">
                {stats ? formatCurrency(stats.total_distributed) : formatCurrency(0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <p className="text-sm text-gray-600">Penerima Bantuan</p>
              <p className="text-xl font-bold text-blue-700">
                {stats ? `${stats.total_recipients} orang` : "0 orang"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-sm text-gray-600">Bulan Ini</p>
              <p className="text-xl font-bold text-green-700">
                {stats ? `${stats.this_month} kali` : "0 kali"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
              <p className="text-sm text-gray-600">Sedang Diproses</p>
              <p className="text-xl font-bold text-yellow-700">
                {stats ? `${stats.pending_process} item` : "0 item"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracking">Tracking Penyaluran</TabsTrigger>
            <TabsTrigger value="recipients">Data Penerima</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-4">
            {/* Filter dan Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cari berdasarkan ID atau nama penerima..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['semua', 'distributed', 'in_process', 'pending'].map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(status)}
                        className={selectedStatus === status ? "bg-islamic-600 hover:bg-islamic-700" : ""}
                      >
                        {status === 'semua' ? 'Semua' : 
                         status === 'distributed' ? 'Tersalurkan' :
                         status === 'in_process' ? 'Diproses' : 'Pending'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribution List */}
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredDistributions.length > 0 ? (
                filteredDistributions.map((item: any) => {
                  const statusInfo = getStatusInfo(item.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">ID: {item.id}</h3>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.text}
                              </Badge>
                            </div>
                            <p className="text-lg font-medium text-islamic-600 mb-1">{item.type}</p>
                            <p className="text-2xl font-bold text-gray-900 mb-2">
                              {formatCurrency(item.amount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Tanggal donasi: {formatDate(item.date)}
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Penerima Info */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Penerima</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Nama:</strong> {item.recipient.name}</p>
                                <p><strong>Kategori:</strong> {item.recipient.category}</p>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                  <span>{item.recipient.location}</span>
                                </div>
                                {item.recipient.family_members && (
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                                    <span>{item.recipient.family_members} anggota keluarga</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Info */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Status Penyaluran</h4>
                              <div className="space-y-2">
                                {item.distribution_date && (
                                  <div className="flex items-center text-sm">
                                    <Truck className="w-4 h-4 mr-2 text-green-600" />
                                    <span>Disalurkan: {formatDate(item.distribution_date)}</span>
                                  </div>
                                )}
                                {item.notes && (
                                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    <strong>Catatan:</strong> {item.notes}
                                  </p>
                                )}
                                {item.proof_image && (
                                  <Button variant="outline" size="sm">
                                    Lihat Bukti Penyaluran
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50 text-gray-400" />
                    <p className="text-gray-500">
                      {searchQuery ? "Tidak ditemukan hasil pencarian" : "Belum ada data penyaluran"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Penerima Bantuan</CardTitle>
                <p className="text-sm text-gray-600">Daftar mustahik yang telah menerima bantuan dari Anda</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myDistributions
                    ?.filter((item: any) => item.status === 'distributed')
                    .map((item: any) => (
                    <Card key={`recipient-${item.id}`} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.recipient.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {item.recipient.category}
                            </Badge>
                          </div>
                          <Heart className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{item.recipient.location}</span>
                          </div>
                          {item.recipient.family_members && (
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{item.recipient.family_members} anggota keluarga</span>
                            </div>
                          )}
                          <p className="font-medium text-islamic-600 mt-2">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}