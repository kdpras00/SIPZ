import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  Heart,
  BarChart3,
  CreditCard,
  Bell,
  BookOpen,
  Hand,
  CheckCircle,
  MessageSquare,
  Shield,
  Wallet,
  Building,
  FileText,
  ArrowRight,
  Users,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/dashboard-stats";
import QuickActions from "@/components/quick-actions";
import DistributionTracker from "@/components/distribution-tracker";
import EnhancedNotifications from "@/components/enhanced-notifications";
import VisualReports from "@/components/visual-reports";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-islamic-600 to-islamic-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Assalamu'alaikum, {user?.firstName || 'Sahabat'}! 👋
        </h1>
        <p className="text-islamic-100">
          Selamat datang kembali di dashboard SIPZ. Mari lanjutkan amal jariyah Anda hari ini.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 text-islamic-600" />
                  Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Zakat Penghasilan Dibayar</p>
                      <p className="text-sm text-gray-600">Rp 2.500.000 • 2 hari lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Pengingat Zakat Dijadwalkan</p>
                      <p className="text-sm text-gray-600">Untuk 15 Februari 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gold-50 rounded-lg">
                    <Heart className="h-5 w-5 text-gold-600" />
                    <div>
                      <p className="font-medium text-gray-900">Infaq Dicatat</p>
                      <p className="text-sm text-gray-600">Rp 500.000 • 1 minggu lalu</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 text-purple-600" />
                  Pencapaian Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Zakat Bulanan</span>
                    <span className="font-semibold text-islamic-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-islamic-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-islamic-600">3</p>
                      <p className="text-xs text-gray-600">Pembayaran Selesai</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gold-600">8</p>
                      <p className="text-xs text-gray-600">Keluarga Terbantu</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <DistributionTracker />
        </TabsContent>

        <TabsContent value="notifications">
          <EnhancedNotifications />
        </TabsContent>

        <TabsContent value="reports">
          <VisualReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}