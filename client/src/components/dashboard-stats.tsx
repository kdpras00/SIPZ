import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  Heart,
  Banknote,
  CheckCircle,
  Clock
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: monthlyProgress } = useQuery({
    queryKey: ["/api/dashboard/monthly-progress"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long' });

  return (
    <div className="space-y-8">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100 border-islamic-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-islamic-600">Total Zakat {currentYear}</p>
                <p className="text-2xl font-bold text-islamic-700">
                  {stats ? formatCurrency(stats.totalZakat) : formatCurrency(0)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12% dari tahun lalu</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-islamic-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-gold-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gold-600">Total Infaq & Shadaqoh</p>
                <p className="text-2xl font-bold text-gold-700">
                  {stats ? formatCurrency(stats.totalInfaq) : formatCurrency(0)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+8% dari bulan lalu</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-gold-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Pembayaran Mendatang</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats ? stats.upcomingPayments : 0}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">3 dalam 30 hari</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Penerima Bantuan</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats ? stats.totalRecipients : 0}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-xs text-purple-600">Keluarga terbantu</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 text-islamic-600" />
              Target Zakat Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress {currentMonth}</span>
                <span className="text-sm font-medium">
                  {monthlyProgress ? `${Math.round(monthlyProgress.percentage)}%` : "0%"}
                </span>
              </div>
              <Progress 
                value={monthlyProgress?.percentage || 0} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Terkumpul: {monthlyProgress ? formatCurrency(monthlyProgress.collected) : formatCurrency(0)}
                </span>
                <span className="text-gray-600">
                  Target: {monthlyProgress ? formatCurrency(monthlyProgress.target) : formatCurrency(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 text-green-600" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentActivities?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-islamic-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}