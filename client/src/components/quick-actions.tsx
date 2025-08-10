import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  CreditCard, 
  Heart, 
  Bell, 
  BarChart3, 
  Users,
  ArrowRight,
  Plus
} from "lucide-react";
import { useLocation } from "wouter";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const quickActions = [
    {
      title: "Hitung Zakat",
      description: "Kalkulator zakat lengkap",
      icon: Calculator,
      color: "bg-islamic-600 hover:bg-islamic-700",
      action: () => setLocation("/kalkulator")
    },
    {
      title: "Bayar Zakat",
      description: "Pembayaran online mudah",
      icon: CreditCard,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => setLocation("/pembayaran")
    },
    {
      title: "Catat Infaq",
      description: "Rekam amal jariyah",
      icon: Heart,
      color: "bg-gold-600 hover:bg-gold-700",
      action: () => setLocation("/infaq")
    },
    {
      title: "Lihat Laporan",
      description: "Riwayat & statistik",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => setLocation("/laporan")
    }
  ];

  const upcomingReminders = [
    {
      title: "Zakat Penghasilan",
      dueDate: "15 Feb 2024",
      amount: "Rp 2.500.000",
      type: "monthly"
    },
    {
      title: "Infaq Rutin",
      dueDate: "1 Mar 2024", 
      amount: "Rp 500.000",
      type: "monthly"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Actions */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 text-islamic-600" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform`}
                >
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reminders */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 text-yellow-600" />
              Pengingat Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                      <p className="text-xs text-gray-600">Jatuh tempo: {reminder.dueDate}</p>
                      <p className="text-sm font-semibold text-islamic-600 mt-1">
                        {reminder.amount}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reminder.type === 'monthly' ? 'Bulanan' : 'Tahunan'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full text-islamic-600 hover:text-islamic-700"
                onClick={() => setLocation("/notifikasi")}
              >
                Lihat Semua Pengingat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}