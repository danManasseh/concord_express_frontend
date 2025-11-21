import { Link, useLocation } from 'react-router-dom';
import SuperAdminHeader from './SuperAdminHeader';
import MobileNav from '@/components/MobileNav';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Package,
  DollarSign,
  UserCircle,
  BarChart3,
  Bell,
} from 'lucide-react';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const location = useLocation();
  const { user } = useAuthStore();

  const navLinks = [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/superadmin/stations', label: 'Stations', icon: MapPin },
    { to: '/superadmin/admins', label: 'Admins', icon: Users },
    { to: '/superadmin/parcels', label: 'All Parcels', icon: Package },
    { to: '/superadmin/payments', label: 'Payments', icon: DollarSign },
    { to: '/superadmin/users', label: 'Users', icon: UserCircle },
    { to: '/superadmin/reports', label: 'Reports', icon: BarChart3 },
  ];

  const mobileNavLinks = navLinks.map((link) => ({
    to: link.to,
    label: link.label,
    active: location.pathname === link.to,
  }));

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader adminData={user} notificationCount={0} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex justify-around p-2">
            <MobileNav links={mobileNavLinks} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}