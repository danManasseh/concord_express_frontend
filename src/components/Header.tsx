import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Header Component - With Mobile Hamburger Menu
 * Desktop: Shows all navigation options
 * Mobile: Hamburger menu with dropdown for authenticated users
 */
export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // TODO: Get notification count from API
  const notificationCount = 0;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-3">
            {user ? (
              // Authenticated user - desktop view
              <>
                <Link to={getDashboardRoute()}>
                  <Button variant="ghost">
                    My Deliveries
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              // Guest user - desktop view
              <>
                <Link
                  to="/login"
                  className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            {user ? (
              // Authenticated user - mobile hamburger menu
              <>
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
                      <Link
                        to={getDashboardRoute()}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <Package className="h-5 w-5" />
                        <span className="font-medium">My Deliveries</span>
                      </Link>
                      
                      <Link
                        to="/notifications"
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
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <User className="h-5 w-5" />
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
              </>
            ) : (
              // Guest user - mobile view
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}