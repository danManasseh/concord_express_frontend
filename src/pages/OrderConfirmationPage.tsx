import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Printer, Home } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find((o: any) => o.trackingId === trackingId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      navigate('/my-deliveries');
    }
  }, [trackingId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden when printing */}
      <header className="w-full bg-card border-b border-border print:hidden">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <Link to="/my-deliveries">
              <Button variant="ghost" size="sm">
                My Deliveries
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message - Hidden when printing */}
          <div className="text-center mb-8 print:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Order Created Successfully!
            </h1>
            <p className="text-muted-foreground">
              Your tracking ID is: <span className="font-mono font-bold text-foreground">{trackingId}</span>
            </p>
          </div>

          {/* Printable Label */}
          <div ref={printRef} className="print:p-8">
            <Card className="mb-6">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Delivery Label</CardTitle>
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Tracking ID - Large and prominent */}
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                  <p className="text-3xl font-mono font-bold text-foreground">{order.trackingId}</p>
                </div>

                {/* Sender & Recipient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground border-b pb-2">FROM (Sender)</h3>
                    <div>
                      <p className="font-medium text-foreground">{order.sender.name}</p>
                      <p className="text-sm text-muted-foreground">{order.sender.phone}</p>
                      {order.sender.email && (
                        <p className="text-sm text-muted-foreground">{order.sender.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Origin Station</p>
                      <p className="text-sm font-medium text-foreground">{order.originStation}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground border-b pb-2">TO (Recipient)</h3>
                    <div>
                      <p className="font-medium text-foreground">{order.recipient.name}</p>
                      <p className="text-sm text-muted-foreground">{order.recipient.phone}</p>
                      {order.recipient.email && (
                        <p className="text-sm text-muted-foreground">{order.recipient.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Destination Station</p>
                      <p className="text-sm font-medium text-foreground">{order.destinationStation}</p>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-semibold text-foreground">Package Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Delivery Type</p>
                      <p className="font-medium text-foreground capitalize">{order.package.deliveryType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weight</p>
                      <p className="font-medium text-foreground">{order.package.weight}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium text-foreground">${order.package.amount.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium text-foreground">{order.package.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Payment Responsibility</p>
                      <p className="font-medium text-foreground capitalize">{order.paymentResponsibility}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold text-orange-600">{order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:bg-gray-50 print:border-gray-300">
                  <p className="text-sm text-blue-800 print:text-gray-800">
                    <strong>Instructions:</strong> Please print this label and attach it to your parcel. 
                    Bring the parcel to <strong>{order.originStation}</strong> for processing. 
                    Your order will be activated once payment is confirmed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons - Hidden when printing */}
          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <Button
              onClick={handlePrint}
              className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Label
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/my-deliveries')}
              className="h-11 flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to My Deliveries
            </Button>
          </div>

          {/* Additional Info - Hidden when printing */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg print:hidden">
            <p className="text-sm text-muted-foreground text-center">
              You can track your parcel anytime using the tracking ID: <strong>{trackingId}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
