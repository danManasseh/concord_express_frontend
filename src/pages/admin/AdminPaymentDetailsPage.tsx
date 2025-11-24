import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, DollarSign, Package, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import paymentService from '@/services/payment.service';
import { Payment } from '@/types/payment.types';
import { useToast } from '@/hooks/use-toast';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { DataState } from '@/components/common/DataState';
import { getPaymentStatusColor, formatStatusText } from '@/lib/statusColors';

export default function AdminPaymentDetailsPage() {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const user = useRoleGuard(['admin']);
  const { toast } = useToast();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch payment details
  useEffect(() => {
    const fetchPayment = async () => {
      if (!paymentId) return;

      try {
        const data = await paymentService.getPayment(paymentId);
        setPayment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'refunded':
        return <RefreshCw className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleCompletePayment = async () => {
    if (!payment || !paymentId) return;

    try {
      setIsProcessing(true);
      await paymentService.completePayment(paymentId, 'Payment verified by admin');
      
      // Refresh payment data
      const updatedPayment = await paymentService.getPayment(paymentId);
      setPayment(updatedPayment);

      toast({
        title: 'Success',
        description: 'Payment marked as completed',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to complete payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefundPayment = async () => {
    if (!payment || !paymentId) return;

    const reason = prompt('Please enter refund reason:');
    if (!reason) return;

    try {
      setIsProcessing(true);
      await paymentService.refundPayment(paymentId, reason);
      
      // Refresh payment data
      const updatedPayment = await paymentService.getPayment(paymentId);
      setPayment(updatedPayment);

      toast({
        title: 'Success',
        description: 'Payment refunded successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to refund payment',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/payments')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payment Records
        </Button>

        <DataState
          isLoading={isLoading}
          error={error}
          data={payment}
          loadingText="Loading payment details..."
        >
          {payment && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Payment Details
                  </h1>
                  <p className="text-muted-foreground">
                    Payment ID: {payment.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {payment.status === 'pending' && (
                    <Button onClick={handleCompletePayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Mark as Paid
                    </Button>
                  )}
                  {payment.status === 'completed' && (
                    <Button variant="destructive" onClick={handleRefundPayment} disabled={isProcessing}>
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refund Payment
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Payment Information */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Payment Information
                      </CardTitle>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {formatStatusText(payment.status)}
                        </span>
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
                          <p className="font-semibold font-mono text-sm">{payment.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Amount</p>
                          <p className="text-2xl font-bold text-green-600">GHS {payment.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                          <p className="font-semibold capitalize">{payment.method.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Created At</p>
                          <p className="font-semibold">
                            {new Date(payment.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {payment.completed_at && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Completed At</p>
                            <p className="font-semibold">
                              {new Date(payment.completed_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        )}
                        {payment.processed_by_name && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Processed By</p>
                            <p className="font-semibold">{payment.processed_by_name}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Parcel Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Associated Parcel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tracking Code</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold font-mono">{payment.parcel_tracking_code}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/parcels/${payment.parcel}`)}
                            >
                              View Parcel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Provider Information (if mobile money) */}
                  {payment.method === 'mobile_money' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Mobile Money Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {payment.provider_name && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Provider</p>
                              <p className="font-semibold">{payment.provider_name}</p>
                            </div>
                          )}
                          {payment.provider_phone && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                              <p className="font-semibold">{payment.provider_phone}</p>
                            </div>
                          )}
                          {payment.provider_tx_id && (
                            <div className="sm:col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                              <p className="font-semibold font-mono text-sm">{payment.provider_tx_id}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Notes */}
                  {payment.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{payment.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Status Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {formatStatusText(payment.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Method</span>
                        <span className="font-semibold capitalize text-sm">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-bold text-green-600">GHS {payment.amount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate(`/admin/parcels/${payment.parcel}`)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        View Parcel Details
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const receiptText = `
PAYMENT RECEIPT
================
Payment ID: ${payment.id}
Tracking Code: ${payment.parcel_tracking_code}
Amount: GHS ${payment.amount}
Method: ${payment.method.replace('_', ' ')}
Status: ${payment.status.toUpperCase()}
Date: ${new Date(payment.created_at).toLocaleString()}
================
                          `.trim();
                          navigator.clipboard.writeText(receiptText);
                          toast({
                            title: 'Copied!',
                            description: 'Receipt copied to clipboard',
                          });
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Copy Receipt
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Payment Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <div className="w-0.5 h-full bg-border" />
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-semibold text-sm">Payment Created</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        {payment.completed_at && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">Payment Completed</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.completed_at).toLocaleString()}
                              </p>
                              {payment.processed_by_name && (
                                <p className="text-xs text-muted-foreground">
                                  By: {payment.processed_by_name}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DataState>
      </div>
    </div>
  );
}