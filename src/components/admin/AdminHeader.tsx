import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Bell, User, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  adminData: {
    name: string;
    stationName: string;
    role: string;
  } | null;
  notificationCount?: number; // Optional prop for notification count
}

export default function AdminHeader({ adminData, notificationCount = 0 }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  if (!adminData) {
    // Should ideally not happen if routes are protected, but good for safety
    return null;
  }

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Station Admin Panel</p>
              <p className="text-xs font-medium text-primary">{adminData.stationName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/admin/profile">
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
