import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Package,
  Eye,
  Download
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

export default function DistributionTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: distributions, isLoading } = useQuery({
    queryKey: ["/api/distributions/tracking"],
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'distributed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Telah Disalurkan',
          description: 'Bantuan telah sampai ke penerima'
        };
      case 'in_transit':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Truck,
          text: 'Dalam Perjalanan',
          description: 'Sedang dalam proses penyaluran'
        };
      case 'processing':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          text: 'Sedang Diproses',
          description: 'Verifikasi dan persiapan penyaluran'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Package,
          text: 'Menunggu',
          description: 'Menunggu proses selanjutnya'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredDistributions = distributions?.filter((item: any) => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 text-islamic-600" />
          Tracking Penyaluran Zakat
        </CardTitle>
        <p className="text-sm text-gray-600">
          Pantau status penyaluran zakat Anda secara real-time
        </p>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
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

        {/* Distribution List */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))
          ) : filteredDistributions.length > 0 ? (
            filteredDistributions.map((item: any) => {
              const statusInfo = getStatusInfo(item.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Donasi: {formatDate(item.donationDate)}</span>
                      </div>
                      {item.processDate && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span>Diproses: {formatDate(item.processDate)}</span>
                        </div>
                      )}
                      {item.distributionDate && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          <span>Disalurkan: {formatDate(item.distributionDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Penerima</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Nama:</strong> {item.recipient.name}</p>
                          <p><strong>Kategori:</strong> {item.recipient.category}</p>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{item.recipient.location}</span>
                          </div>
                          {item.recipient.familyMembers && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{item.recipient.familyMembers} anggota keluarga</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Status Detail</h4>
                        <p className="text-sm text-gray-600 mb-3">{statusInfo.description}</p>
                        <div className="flex gap-2">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>
                {searchQuery ? "Tidak ditemukan hasil pencarian" : "Belum ada data penyaluran"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}