import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Info,
  X,
  Settings,
  Calendar,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/zakat-calculator";

export default function EnhancedNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      return apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", "/api/notifications/mark-all-read", {});
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Semua notifikasi telah ditandai sebagai dibaca",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'zakat_reminder':
        return { icon: Calendar, color: 'text-islamic-600' };
      case 'payment_overdue':
        return { icon: AlertTriangle, color: 'text-red-600' };
      case 'payment_success':
        return { icon: CheckCircle, color: 'text-green-600' };
      case 'infaq_reminder':
        return { icon: DollarSign, color: 'text-gold-600' };
      default:
        return { icon: Info, color: 'text-blue-600' };
    }
  };

  const getNotificationPriority = (type: string) => {
    switch (type) {
      case 'payment_overdue':
        return 'high';
      case 'zakat_reminder':
        return 'medium';
      default:
        return 'low';
    }
  };

  const filteredNotifications = notifications?.filter((notification: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'reminders') return notification.type.includes('reminder');
    if (activeTab === 'payments') return notification.type.includes('payment');
    return true;
  }) || [];

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 text-islamic-600" />
            Notifikasi
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending || !unreadCount}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Tandai Semua Dibaca
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-1" />
              Pengaturan
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="unread">
              Belum Dibaca
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reminders">Pengingat</TabsTrigger>
            <TabsTrigger value="payments">Pembayaran</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-3">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification: any) => {
                  const iconInfo = getNotificationIcon(notification.type);
                  const IconComponent = iconInfo.icon;
                  const priority = getNotificationPriority(notification.type);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      } ${
                        priority === 'high' ? 'border-l-4 border-l-red-500' :
                        priority === 'medium' ? 'border-l-4 border-l-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            !notification.isRead ? 'bg-islamic-100' : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${iconInfo.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-3">
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                              {priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">
                                  Penting
                                </Badge>
                              )}
                              {priority === 'medium' && (
                                <Badge variant="secondary" className="text-xs">
                                  Pengingat
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>
                    {activeTab === 'unread' ? 'Tidak ada notifikasi yang belum dibaca' :
                     activeTab === 'reminders' ? 'Tidak ada pengingat' :
                     activeTab === 'payments' ? 'Tidak ada notifikasi pembayaran' :
                     'Tidak ada notifikasi'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}