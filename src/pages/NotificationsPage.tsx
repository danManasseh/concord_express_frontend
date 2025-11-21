import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Bell, 
  Package, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Clock,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import notificationService, { Notification } from '@/services/notification.service';
import { useAuthStore } from '@/stores/authStore';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'parcel_update':
        return <Package className="h-5 w-5" />;
      case 'payment_update':
        return <DollarSign className="h-5 w-5" />;
      case 'admin_alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'system':
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'parcel_update':
        return 'bg-blue-100 text-blue-600';
      case 'payment_update':
        return 'bg-green-100 text-green-600';
      case 'admin_alert':
        return 'bg-orange-100 text-orange-600';
      case 'system':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadCount = notifications.filter(n => n.status === 'queued').length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.status === 'queued')
    : notifications;

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'superadmin':
        return '/superadmin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/my-deliveries';
    }
  };

  const getBackLinkText = () => {
    if (!user) return 'Back';
    switch (user.role) {
      case 'superadmin':
        return 'Back to Dashboard';
      case 'admin':
        return 'Back to Dashboard';
      default:
        return 'Back to My Deliveries';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardLink()}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
                {getBackLinkText()}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'unread' 
                ? "You're all caught up! Check back later for updates."
                : "You'll receive notifications about your parcels here."}
            </p>
            <Link to={getDashboardLink()}>
              <Button>
                {user?.role === 'user' ? 'View My Deliveries' : 'Back to Dashboard'}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 hover:shadow-md transition-shadow ${
                  notification.status === 'queued' ? 'border-blue-200 bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.message}
                        </p>
                        {notification.parcel_tracking_code && (
                          <Link
                            to={`/track?code=${notification.parcel_tracking_code}`}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Track: {notification.parcel_tracking_code}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                      {notification.channel && (
                        <span className="text-xs text-gray-500 capitalize">
                          via {notification.channel}
                        </span>
                      )}
                      {notification.status === 'failed' && notification.error_message && (
                        <span className="text-xs text-red-600">
                          Failed: {notification.error_message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => {
                // Future: Implement clear all functionality
                toast({
                  title: 'Coming Soon',
                  description: 'Clear all functionality will be available soon.',
                });
              }}
            >
              Clear All Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}