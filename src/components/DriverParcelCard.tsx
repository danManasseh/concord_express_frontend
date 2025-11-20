import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare } from 'lucide-react';

interface DriverParcelCardProps {
  parcel: {
    id: string;
    recipient: {
      name: string;
      phone: string;
      email: string;
    };
    origin: string;
    destination: string;
    status: string;
    pickupDate: string;
    notes: string;
  };
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getNextStatus: (status: string) => string | null;
  onUpdateStatus: (id: string, status: string) => void;
  onOpenNotes: (parcel: any) => void;
}

export default function DriverParcelCard({
  parcel,
  getStatusColor,
  getStatusIcon,
  getNextStatus,
  onUpdateStatus,
  onOpenNotes,
}: DriverParcelCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Tracking ID</p>
          <p className="font-mono font-bold text-foreground">{parcel.id}</p>
        </div>
        <Badge variant="outline" className={`${getStatusColor(parcel.status)} flex items-center gap-1`}>
          {getStatusIcon(parcel.status)}
          {parcel.status}
        </Badge>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Recipient</p>
        <p className="font-medium text-foreground">{parcel.recipient.name}</p>
        {parcel.notes && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Has notes
          </p>
        )}
      </div>

      <div className="space-y-1">
        <a
          href={`tel:${parcel.recipient.phone}`}
          className="flex items-center gap-2 text-xs text-primary hover:underline"
        >
          <Phone className="h-3 w-3" />
          {parcel.recipient.phone}
        </a>
        <a
          href={`mailto:${parcel.recipient.email}`}
          className="flex items-center gap-2 text-xs text-primary hover:underline"
        >
          <Mail className="h-3 w-3" />
          {parcel.recipient.email}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Origin</p>
          <p className="text-foreground text-xs">{parcel.origin}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Destination</p>
          <p className="text-foreground text-xs">{parcel.destination}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Pickup Time</p>
        <p className="text-sm text-foreground">{parcel.pickupDate}</p>
      </div>

      <div className="flex gap-2 pt-2">
        {parcel.status !== 'Delivered' && getNextStatus(parcel.status) && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(parcel.id, getNextStatus(parcel.status)!)}
            className="flex-1 text-xs"
          >
            Mark as {getNextStatus(parcel.status)}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenNotes(parcel)}
          className="flex-1 text-xs"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Notes
        </Button>
      </div>
    </div>
  );
}
