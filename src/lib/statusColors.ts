/**
 * Utility functions for consistent status badge colors across the application
 * Centralizes color logic to maintain consistency and reduce code duplication
 */

/**
 * Get color classes for parcel status badges
 * @param status - The parcel status
 * @returns Tailwind CSS classes for background, text, and border
 */
export const getParcelStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    created: 'bg-blue-100 text-blue-700 border-blue-300',
    in_transit: 'bg-purple-100 text-purple-700 border-purple-300',
    arrived: 'bg-orange-100 text-orange-700 border-orange-300',
    delivered: 'bg-green-100 text-green-700 border-green-300',
    failed: 'bg-red-100 text-red-700 border-red-300',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
};

/**
 * Get color classes for payment status badges
 * @param status - The payment status
 * @returns Tailwind CSS classes for background, text, and border
 */
export const getPaymentStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700 border-green-300',
    completed: 'bg-green-100 text-green-700 border-green-300',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    unpaid: 'bg-red-100 text-red-700 border-red-300',
    refunded: 'bg-orange-100 text-orange-700 border-orange-300',
    failed: 'bg-red-100 text-red-700 border-red-300',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
};

/**
 * Get color classes for user/admin active status
 * @param isActive - Whether the user/admin is active
 * @returns Tailwind CSS classes for background, text, and border
 */
export const getUserStatusColor = (isActive: boolean): string => {
  return isActive
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Get color classes for station active status
 * @param isActive - Whether the station is active
 * @returns Tailwind CSS classes for background, text, and border
 */
export const getStationStatusColor = (isActive: boolean): string => {
  return isActive
    ? 'bg-green-100 text-green-700 border-green-300'
    : 'bg-red-100 text-red-700 border-red-300';
};

/**
 * Format status text for display (capitalize and replace underscores)
 * @param status - The status string
 * @returns Formatted status text
 */
export const formatStatusText = (status: string): string => {
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};