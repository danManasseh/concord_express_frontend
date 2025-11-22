import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Bell, User as UserIcon, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { User } from '@/types/user.types';
import { useAuthStore } from '@/stores/authStore';

interface AdminHeaderProps {
  adminData: User | null;
  notificationCount?: number;
}

export default function AdminHeader({ adminData, notificationCount = 0 }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/admin/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (!adminData) return null;

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Station Info */}
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

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            {/* Dashboard Link */}
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
            >
              Dashboard
            </Button>

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

          {/* Mobile Hamburger Menu */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg">
                <nav className="container mx-auto px-4 py-2 flex flex-col">
                  {/* Admin Info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{adminData.name}</p>
                    <p className="text-xs text-muted-foreground">{adminData.email || adminData.phone}</p>
                    {adminData.station && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Station: {adminData.station.name}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>

                  <Link
                    to="/admin/notifications"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">Notifications</span>
                    {notificationCount > 0 && (
                      <span className="ml-auto h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/admin/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}