import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Loader2, Eye, DollarSign, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import paymentService from '@/services/payment.service';
import { Payment } from '@/types/payment.types';

export default function AdminPaymentRecordsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentService.getPayments();
        setPayments(data);
        setFilteredPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payments');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  // Filter payments
  useEffect(() => {
    let filtered = [...payments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.parcel_tracking_code.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(filtered);
  }, [searchQuery, statusFilter, payments]);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCompletePayment = async (paymentId: string) => {
    try {
      await paymentService.completePayment(paymentId, 'Payment verified by admin');
      // Refresh payments
      const data = await paymentService.getPayments();
      setPayments(data);
      setFilteredPayments(data);
    } catch (err) {
      console.error('Failed to complete payment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Payment Records
            </h1>
            <p className="text-muted-foreground">
              Manage payment transactions for {user.station?.name}
            </p>
          </div>
          <Button onClick={() => navigate('/admin/payments/log')}>
            <Plus className="h-4 w-4 mr-2" />
            Log Offline Payment
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Station Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by Tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payments List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No payments found matching your filters'
                    : 'No payment records yet'}
                </p>
              </div>
            ) : isMobile ? (
              /* MOBILE VIEW - Cards */
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Payment ID</p>
                        <p className="font-mono text-sm font-bold">{payment.id.slice(0, 8)}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(payment.status)}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking ID</p>
                        <p className="font-semibold">{payment.parcel_tracking_code}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-semibold">GHS {payment.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Method</p>
                          <p className="capitalize">{payment.method.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p>{new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/payments/${payment.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCompletePayment(payment.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* DESKTOP VIEW - Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Payment ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Tracking ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Option</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="text-sm font-mono">{payment.id.slice(0, 8)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-semibold">{payment.parcel_tracking_code}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-semibold">GHS {payment.amount}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm capitalize">{payment.method.replace('_', ' ')}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getStatusColor(payment.status)}>
                            {payment.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{new Date(payment.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/admin/payments/${payment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === 'pending' && (
                              <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleCompletePayment(payment.id)}
                              >
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
