import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  DollarSign,
  Users,
  Target
} from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

const COLORS = {
  zakat: '#059669', // emerald-600
  infaq: '#d97706', // amber-600
  shadaqoh: '#2563eb', // blue-600
  wakaf: '#7c3aed', // violet-600
};

export default function VisualReports() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportType, setReportType] = useState("overview");

  const { data: chartData } = useQuery({
    queryKey: ["/api/reports/charts", selectedYear],
  });

  const { data: summaryData } = useQuery({
    queryKey: ["/api/reports/summary", selectedYear],
  });

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  const monthlyData = chartData?.monthly || [];
  const categoryData = chartData?.byCategory || [];
  const trendData = chartData?.trend || [];

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report for ${selectedYear} as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detail</SelectItem>
                  <SelectItem value="comparison">Perbandingan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('pdf')}
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('excel')}
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100">
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto mb-2 h-8 w-8 text-islamic-600" />
            <p className="text-sm text-gray-600">Total Donasi</p>
            <p className="text-xl font-bold text-islamic-700">
              {summaryData ? formatCurrency(summaryData.totalDonations) : formatCurrency(0)}
            </p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+15% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-blue-600" />
            <p className="text-sm text-gray-600">Frekuensi Donasi</p>
            <p className="text-xl font-bold text-blue-700">
              {summaryData ? `${summaryData.totalTransactions} kali` : "0 kali"}
            </p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold-50 to-gold-100">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-gold-600" />
            <p className="text-sm text-gray-600">Penerima Bantuan</p>
            <p className="text-xl font-bold text-gold-700">
              {summaryData ? `${summaryData.totalRecipients} orang` : "0 orang"}
            </p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+25% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2 h-8 w-8 text-purple-600" />
            <p className="text-sm text-gray-600">Rata-rata/Bulan</p>
            <p className="text-xl font-bold text-purple-700">
              {summaryData ? formatCurrency(summaryData.averageMonthly) : formatCurrency(0)}
            </p>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5% YoY</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Tren Bulanan</TabsTrigger>
          <TabsTrigger value="category">Per Kategori</TabsTrigger>
          <TabsTrigger value="comparison">Perbandingan</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tren Donasi Bulanan {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), "Jumlah"]}
                      labelFormatter={(label) => `Bulan ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="zakat" 
                      stackId="1"
                      stroke={COLORS.zakat} 
                      fill={COLORS.zakat}
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="infaq" 
                      stackId="1"
                      stroke={COLORS.infaq} 
                      fill={COLORS.infaq}
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="shadaqoh" 
                      stackId="1"
                      stroke={COLORS.shadaqoh} 
                      fill={COLORS.shadaqoh}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi per Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Bar dataKey="value" fill={COLORS.zakat} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Tahun ke Tahun</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={COLORS.zakat} 
                      strokeWidth={3}
                      dot={{ fill: COLORS.zakat, strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}