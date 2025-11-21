import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '@/types/user.types';
import { useAuthStore } from '@/stores/authStore';

interface AdminHeaderProps {
  adminData: User | null;
  notificationCount?: number;
}

export default function AdminHeader({ adminData, notificationCount = 0 }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!adminData) return null;

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Station Info */}
          <div>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Concord Express
                </h1>
                <p className="text-xs text-muted-foreground">
                  {adminData.station?.name || 'Station Admin Panel'}
                </p>
              </div>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/notifications')}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/profile')}
            >
              <UserIcon className="h-5 w-5" />
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
