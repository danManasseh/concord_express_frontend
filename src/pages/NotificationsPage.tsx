import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Bell,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Truck,
  X,
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'status',
    title: 'Parcel Delivered',
    message: 'Your parcel TRK1234567890 has been delivered successfully',
    timestamp: '2024-01-15 03:30 PM',
    read: false,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'Payment of $25.00 received for parcel TRK1234567891',
    timestamp: '2024-01-15 02:15 PM',
    read: false,
    icon: DollarSign,
    color: 'text-blue-600',
  },
  {
    id: 3,
    type: 'status',
    title: 'Parcel In Transit',
    message: 'Your parcel TRK1234567892 is on the way to destination',
    timestamp: '2024-01-15 10:00 AM',
    read: false,
    icon: Truck,
    color: 'text-orange-600',
  },
  {
    id: 4,
    type: 'status',
    title: 'Parcel Created',
    message: 'New delivery order TRK1234567893 has been created',
    timestamp: '2024-01-14 05:45 PM',
    read: true,
    icon: Package,
    color: 'text-purple-600',
  },
  {
    id: 5,
    type: 'alert',
    title: 'Delivery Delayed',
    message: 'Parcel TRK1234567894 delivery delayed due to weather conditions',
    timestamp: '2024-01-14 02:30 PM',
    read: true,
    icon: AlertCircle,
    color: 'text-yellow-600',
  },
  {
    id: 6,
    type: 'payment',
    title: 'Payment Pending',
    message: 'Payment required for parcel TRK1234567895 to proceed',
    timestamp: '2024-01-14 11:00 AM',
    read: true,
    icon: DollarSign,
    color: 'text-red-600',
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Check if user is logged in
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login');
    return null;
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-deliveries')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Deliveries
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
    </div>
  );
}
