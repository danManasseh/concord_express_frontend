import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Link is no longer needed here as AdminHeader handles it
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
import AdminHeader from '@/components/admin/AdminHeader';

// Mock notifications data for admin
const mockAdminNotifications = [
  {
    id: 1,
    type: 'new_parcel',
    title: 'New Parcel Created',
    message: 'Parcel TRK001007 created at Station A - Downtown.',
    timestamp: '2024-01-21 09:00 AM',
    read: false,
    icon: Plus,
    color: 'text-blue-600',
    station: 'Station A - Downtown',
  },
  {
    id: 2,
    type: 'payment_pending',
    title: 'Payment Pending',
    message:
      'Payment for TRK001001 is pending (Receiver Pays) at Station B - Uptown.',
    timestamp: '2024-01-20 10:05 AM',
    read: false,
    icon: DollarSign,
    color: 'text-yellow-600',
    station: 'Station B - Uptown',
  },
  {
    id: 3,
    type: 'parcel_arrived',
    title: 'Parcel Arrived',
    message: 'Parcel TRK001003 has arrived at Station A - Downtown.',
    timestamp: '2024-01-19 02:30 PM',
    read: false,
    icon: MapPin,
    color: 'text-orange-600',
    station: 'Station A - Downtown',
  },
  {
    id: 4,
    type: 'bulk_update',
    title: 'Truck TRK-BATCH-002 Arrived',
    message: '2 parcels updated to "Arrived" at Station A - Downtown.',
    timestamp: '2024-01-19 02:35 PM',
    read: true,
    icon: Truck,
    color: 'text-purple-600',
    station: 'Station A - Downtown',
  },
  {
    id: 5,
    type: 'payment_confirmed',
    title: 'Payment Confirmed',
    message: 'Payment for TRK001002 confirmed at Station A - Downtown.',
    timestamp: '2024-01-20 11:10 AM',
    read: true,
    icon: CheckCircle,
    color: 'text-green-600',
    station: 'Station A - Downtown',
  },
  {
    id: 6,
    type: 'system_alert',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance tonight from 2 AM to 4 AM.',
    timestamp: '2024-01-20 04:00 PM',
    read: true,
    icon: AlertCircle,
    color: 'text-red-600',
    station: 'All', // Example of a global notification
  },
];

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);

    // Filter notifications relevant to the admin's station
    const stationNotifications = mockAdminNotifications.filter(
      (n) => n.station === parsedAdmin.stationName || n.station === 'All'
    );
    setNotifications(stationNotifications);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

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

  if (!adminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={adminData} notificationCount={unreadCount} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/dashboard')}
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
                  Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${
                        unreadCount > 1 ? 's' : ''
                      } for ${adminData.stationName}`
                    : `All caught up for ${adminData.stationName}!`}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilter(filter === 'all' ? 'unread' : 'all')
                  }
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
