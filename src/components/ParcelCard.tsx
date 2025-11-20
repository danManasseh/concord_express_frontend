import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus } from 'lucide-react';

interface ParcelCardProps {
  parcel: {
    id: string;
    sender: string;
    recipient: string;
    status: string;
    driver: string;
    paymentStatus: string;
    date: string;
  };
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
}

export default function ParcelCard({
  parcel,
  getStatusColor,
  getPaymentStatusColor,
}: ParcelCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Tracking ID</p>
          <p className="font-mono font-bold text-foreground">{parcel.id}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(parcel.status)}>
          {parcel.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Sender</p>
          <p className="text-foreground">{parcel.sender}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Recipient</p>
          <p className="text-foreground">{parcel.recipient}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Driver</p>
          <p className={parcel.driver === 'Unassigned' ? 'text-muted-foreground italic' : 'text-foreground'}>
            {parcel.driver}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Payment</p>
          <Badge variant="outline" className={`${getPaymentStatusColor(parcel.paymentStatus)} text-xs`}>
            {parcel.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="text-sm">
        <p className="text-xs text-muted-foreground">Date</p>
        <p className="text-foreground">{parcel.date}</p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        {parcel.driver === 'Unassigned' && (
          <Button variant="outline" size="sm" className="flex-1">
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        )}
      </div>
    </div>
  );
}
