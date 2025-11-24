import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Custom hook to protect routes based on user role
 * Automatically redirects unauthorized users
 * 
 * @param allowedRoles - Array of roles that can access this route
 * @param redirectPath - Optional custom redirect path
 * @returns The authenticated user object or null
 * 
 * @example
 * // Protect admin-only route
 * const user = useRoleGuard(['admin']);
 * 
 * @example
 * // Protect route for admin or superadmin
 * const user = useRoleGuard(['admin', 'superadmin']);
 * 
 * @example
 * // Protect with custom redirect
 * const user = useRoleGuard(['user'], '/custom-login');
 */
export function useRoleGuard(
  allowedRoles: ('user' | 'admin' | 'superadmin')[],
  redirectPath?: string
) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Not logged in at all
    if (!user) {
      navigate(redirectPath || '/login');
      return;
    }

    // Logged in but wrong role
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on their actual role
      const defaultRedirect = 
        user.role === 'superadmin' ? '/superadmin/dashboard' :
        user.role === 'admin' ? '/admin/dashboard' :
        '/my-deliveries';
      
      navigate(redirectPath || defaultRedirect);
    }
  }, [user, navigate, allowedRoles, redirectPath]);

  return user;
}