import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bell,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Truck,
  X,
  Plus,
  MapPin,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';

// Mock notifications data for Super Admin
const mockSuperAdminNotifications = [
  {
    id: 1,
    type: 'new_station',
    title: 'New Station Added',
    message: 'Station G - North East has been added to the network.',
    timestamp: '2024-01-22 10:00 AM',
    read: false,
    icon: MapPin,
    color: 'text-blue-600',
  },
  {
    id: 2,
    type: 'admin_created',
    title: 'New Station Admin',
    message: 'New admin "Jane Doe" created for Station F - South District.',
    timestamp: '2024-01-22 10:15 AM',
    read: false,
    icon: Plus,
    color: 'text-purple-600',
  },
  {
    id: 3,
    type: 'system_alert',
    title: 'Critical System Alert',
    message: 'High volume of failed payments detected across multiple stations.',
    timestamp: '2024-01-22 11:30 AM',
    read: false,
    icon: AlertCircle,
    color: 'text-red-600',
  },
  {
    id: 4,
    type: 'revenue_report',
    title: 'Monthly Revenue Report Ready',
    message: 'January 2024 revenue report is available for review.',
    timestamp: '2024-02-01 09:00 AM',
    read: true,
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    id: 5,
    type: 'station_inactive',
    title: 'Station Deactivated',
    message: 'Station F - South District has been marked as Inactive.',
    timestamp: '2024-01-21 03:00 PM',
    read: true,
    icon: X,
    color: 'text-gray-600',
  },
];

export default function SuperAdminNotificationsPage() {
  const navigate = useNavigate();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
    setNotifications(mockSuperAdminNotifications); // Super Admin sees all global notifications
  }, [navigate]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  if (!superAdminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader superAdminData={superAdminData} notificationCount={unreadCount} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/superadmin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    System Notifications
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {unreadCount > 0
                      ? `You have ${unreadCount} unread system notification${
                          unreadCount > 1 ? 's' : ''
                        }`
                      : 'All caught up!'}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                    className="flex-1 sm:flex-none"
                  >
                    {filter === 'all' ? 'Show Unread' : 'Show All'}
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="flex-1 sm:flex-none"
                    >
                      Mark All Read
                    </Button>
                  )}
                </div>
              </div>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No notifications
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'unread'
                    ? "You don't have any unread notifications"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all ${
                      notification.read
                        ? 'bg-background border-border'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex-shrink-0 p-2 rounded-full bg-background ${notification.color}`}
                      >
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-7 text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="w-full"
                >
                  Clear All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
