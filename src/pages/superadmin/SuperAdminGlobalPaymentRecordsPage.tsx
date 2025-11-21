import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Download, Eye, RefreshCw } from 'lucide-react';
import SuperAdminLayout from '@/components/superadmin/SuperAdminLayout';
import paymentService from '@/services/payment.service';
import stationService from '@/services/station.service';
import { Payment } from '@/types/payment.types';
import { Station } from '@/types/user.types';
import { useIsMobile } from '@/hooks/use-mobile';

export default function SuperAdminGlobalPaymentRecordsPage() {
  const isMobile = useIsMobile();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics
  const [statistics, setStatistics] = useState<{
    revenue: {
      total: number;
      today: number;
      this_week: number;
      this_month: number;
    };
    status_breakdown: Record<string, number>;
    method_breakdown: Array<{
      method: string;
      count: number;
      total: number;
    }>;
  } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterStation, setFilterStation] = useState<string>('all');

  // Refund modal
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [paymentsData, stationsData, statsData] = await Promise.all([
        paymentService.getPayments(),
        stationService.getStations(),
        paymentService.getPaymentStatistics(),
      ]);
      setPayments(paymentsData);
      setStations(stationsData);
      setStatistics(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.parcel_tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.provider_tx_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || payment.status === filterStatus;

    const matchesMethod =
      filterMethod === 'all' || payment.method === filterMethod;

    // Note: For station filtering, you'd need parcel info which may require joining data
    // For now, we'll skip station filtering or you can add it if parcel data is included

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodColor = (method: string) => {
    const colors = {
      cash: 'bg-blue-100 text-blue-800',
      mobile_money: 'bg-purple-100 text-purple-800',
      online: 'bg-indigo-100 text-indigo-800',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    const headers = ['Payment ID', 'Tracking Code', 'Amount', 'Method', 'Status', 'Provider', 'Date'];
    const rows = filteredPayments.map((p) => [
      p.id,
      p.parcel_tracking_code,
      `GHS ${p.amount}`,
      p.method,
      p.status,
      p.provider_name || 'N/A',
      new Date(p.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const openRefundModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  const closeRefundModal = () => {
    setIsRefundModalOpen(false);
    setSelectedPayment(null);
    setRefundReason('');
  };

  const handleRefund = async () => {
    if (!selectedPayment || !refundReason.trim()) {
      setError('Please provide a refund reason');
      return;
    }

    try {
      setIsRefunding(true);
      setError(null);
      await paymentService.refundPayment(selectedPayment.id, refundReason);
      await loadData();
      closeRefundModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Records</h1>
            <p className="text-gray-600 mt-1">Monitor all payments across the network</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              ×
            </button>
          </div>
        )}

        {/* Revenue Stats Cards */}
        {statistics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    GHS {statistics.revenue.total.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                    GHS {statistics.revenue.today.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                    GHS {statistics.revenue.this_week.toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1">
                    GHS {statistics.revenue.this_month.toFixed(2)}
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Breakdown */}
        {statistics && statistics.method_breakdown.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statistics.method_breakdown.map((method) => (
                <div key={method.method} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{method.method.replace('_', ' ')}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">GHS {method.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">{method.count} transactions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by tracking code or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              {/* Method Filter */}
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="online">Online</option>
              </select>

              {/* Placeholder for date range or other filters */}
              <div className="text-sm text-gray-500 flex items-center px-4">
                Showing {filteredPayments.length} of {payments.length} payments
              </div>
            </div>
          </div>
        </div>

        {/* Payments List - Mobile: Cards, Desktop: Table */}
        {isMobile ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {filteredPayments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                No payments found
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Tracking Code</p>
                      <p className="font-mono text-sm font-bold text-gray-900">
                        {payment.parcel_tracking_code}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMethodColor(payment.method)}`}>
                        {payment.method.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-xl font-bold text-gray-900">GHS {payment.amount}</p>
                    </div>
                    {payment.provider_name && (
                      <div>
                        <p className="text-xs text-gray-500">Provider</p>
                        <p className="text-sm text-gray-900">{payment.provider_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {payment.status === 'completed' && (
                    <button
                      onClick={() => openRefundModal(payment)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Process Refund
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-gray-900">
                            {payment.parcel_tracking_code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            GHS {payment.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getMethodColor(payment.method)}`}>
                            {payment.method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.provider_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => openRefundModal(payment)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Process refund"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {isRefundModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Process Refund</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tracking Code</p>
                <p className="font-mono font-semibold text-gray-900">
                  {selectedPayment.parcel_tracking_code}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-xl font-bold text-gray-900">GHS {selectedPayment.amount}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Reason *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please provide a reason for this refund..."
                  rows={4}
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300`}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ This action cannot be undone. The payment will be marked as refunded and the parcel payment status will be updated.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeRefundModal}
                  className={`flex-1 px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50`}
                  disabled={isRefunding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  className={`flex-1 px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400`}
                  disabled={isRefunding || !refundReason.trim()}
                >
                  {isRefunding ? 'Processing...' : 'Process Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}