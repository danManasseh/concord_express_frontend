import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShieldCheck, Bell, User, LogOut } from 'lucide-react';

interface SuperAdminHeaderProps {
  superAdminData: {
    name: string;
    role: string;
  } | null;
  notificationCount?: number;
}

export default function SuperAdminHeader({ superAdminData, notificationCount = 0 }: SuperAdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('superadmin');
    navigate('/superadmin/login');
  };

  if (!superAdminData) {
    return null;
  }

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/superadmin/dashboard" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Super Admin Panel</p>
              <p className="text-xs font-medium text-primary">{superAdminData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/superadmin/notifications"> {/* Link to Super Admin Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/superadmin/profile"> {/* Link to Super Admin Profile */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
