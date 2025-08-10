import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Package,
  Heart,
  Banknote,
  Eye,
  Download,
  Share,
  MessageCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";


const getStatusInfo = (status: string) => {
  switch (status) {
    case 'distributed':
      return {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'Telah Disalurkan',
        progress: 100
      };
    case 'in_transit':
      return {
        color: 'bg-blue-100 text-blue-800',
        icon: Truck,
        text: 'Dalam Perjalanan',
        progress: 75
      };
    case 'in_process':
      return {
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        text: 'Sedang Diproses',
        progress: 50
      };
    case 'pending':
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: Package,
        text: 'Menunggu',
        progress: 25
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800',
        icon: Package, 
        text: 'Unknown',
        progress: 0
      };
  }
};

export default function Status() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("semua");

  const { data: myDistributions, isLoading } = useQuery({
    queryKey: ["/api/distributions/my"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/distributions/stats"],
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
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Status Penyaluran</h1>
        <p className="text-gray-600 dark:text-gray-300">Pantau status penyaluran zakat, infaq, dan shadaqoh Anda secara real-time</p>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100 border-islamic-200">
          <CardContent className="p-6 text-center">
            <Banknote className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
            <p className="text-sm text-gray-600">Total Disalurkan</p>
            <p className="text-xl font-bold text-islamic-700">
              {stats ? formatCurrency(stats.total_distributed) : formatCurrency(0)}
            </p>
            <div className="mt-2">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">85% dari target tahunan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <p className="text-sm text-gray-600">Penerima Bantuan</p>
            <p className="text-xl font-bold text-blue-700">
              {stats ? `${stats.total_recipients} orang` : "0 orang"}
            </p>
            <p className="text-xs text-blue-600 mt-1">+5 keluarga baru</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
            <p className="text-sm text-gray-600">Bulan Ini</p>
            <p className="text-xl font-bold text-green-700">
              {stats ? `${stats.this_month} kali` : "0 kali"}
            </p>
            <p className="text-xs text-green-600 mt-1">100% tersalurkan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
            <p className="text-sm text-gray-600">Sedang Diproses</p>
            <p className="text-xl font-bold text-yellow-700">
              {stats ? `${stats.pending_process} item` : "0 item"}
            </p>
            <p className="text-xs text-yellow-600 mt-1">Estimasi 2-3 hari</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracking">Tracking Penyaluran</TabsTrigger>
          <TabsTrigger value="recipients">Data Penerima</TabsTrigger>
          <TabsTrigger value="impact">Dampak Sosial</TabsTrigger>
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
                    <div key={item.id} className="border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
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
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress Penyaluran</span>
                          <span className="text-sm font-medium">{statusInfo.progress}%</span>
                        </div>
                        <Progress value={statusInfo.progress} className="h-2" />
                      </div>

                          <Heart className="h-5 w-5 text-red-500" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-3">Timeline Penyaluran</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-2 h-2 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Donasi Diterima</p>
                              <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                            </div>
                          </div>
                          {item.recipient.familyMembers && (
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Clock className="w-2 h-2 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Mulai Diproses</p>
                                <p className="text-xs text-gray-500">{formatDate(item.processDate)}</p>
                              <span>{item.recipient.familyMembers} anggota keluarga</span>
                            </div>
                          )}
                          <p className="font-medium text-islamic-600 mt-2">
                            {formatCurrency(item.amount)}
                              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <Truck className="w-2 h-2 text-white" />
                        <h4 className="font-medium text-gray-900 mb-2">Aksi</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.proofImage && (
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Lihat Bukti
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Unduh Laporan
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="w-3 h-3 mr-1" />
                            Bagikan
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Feedback
                          </Button>
                        </div>
                        {item.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Catatan:</strong> {item.notes}
                            </p>
                          </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dampak Sosial Donasi Anda</CardTitle>
                <p className="text-sm text-gray-600">Lihat bagaimana kontribusi Anda membawa perubahan</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-700 mb-2">28</div>
                    <p className="text-sm text-gray-600">Keluarga Terbantu</p>
                    <p className="text-xs text-green-600 mt-1">Kebutuhan sehari-hari terpenuhi</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700 mb-2">15</div>
                    <p className="text-sm text-gray-600">Anak Bersekolah</p>
                    <p className="text-xs text-blue-600 mt-1">Mendapat beasiswa pendidikan</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700 mb-2">5</div>
                    <p className="text-sm text-gray-600">Usaha Mikro</p>
                    <p className="text-xs text-purple-600 mt-1">Modal usaha untuk kemandirian</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-islamic-50 rounded-lg">
                  <h4 className="font-medium text-islamic-800 mb-2">Testimoni Penerima</h4>
                  <blockquote className="text-sm text-gray-700 italic">
                    "Alhamdulillah, bantuan zakat dari SIPZ sangat membantu keluarga kami. 
                    Anak-anak bisa melanjutkan sekolah dan kebutuhan sehari-hari tercukupi. 
                    Jazakallahu khairan untuk para donatur yang telah membantu."
                  </blockquote>
                  <p className="text-xs text-gray-500 mt-2">- Ibu Siti, Penerima Bantuan Jakarta Timur</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}