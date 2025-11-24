import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Package, MapPin, User, DollarSign, Save, X } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import stationService from '@/services/station.service';
import { ParcelDetail } from '@/types/parcel.types';
import { Station } from '@/types/user.types';
import { useToast } from '@/hooks/use-toast';

interface EditableFields {
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  destination_station: string;
  description: string;
  item_count: number;
  weight: string;
  declared_value: string;
  delivery_type: string;
  payment_status: string;
  payment_responsibility: string;
}

export default function AdminParcelDetailsPage() {
  const navigate = useNavigate();
  const { parcelId } = useParams<{ parcelId: string }>();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableFields | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Fetch parcel details and stations
  useEffect(() => {
    const fetchData = async () => {
      if (!parcelId) return;

      try {
        const [parcelData, stationsData] = await Promise.all([
          parcelService.getParcelDetail(parcelId),
          stationService.getStations(),
        ]);
        setParcel(parcelData);
        setStations(stationsData);
        
        // Initialize editable fields
        setEditedFields({
          sender_name: parcelData.sender_name,
          sender_phone: parcelData.sender_phone,
          sender_address: parcelData.sender_address,
          recipient_name: parcelData.recipient_name,
          recipient_phone: parcelData.recipient_phone,
          recipient_address: parcelData.recipient_address,
          destination_station: parcelData.destination_station,
          description: parcelData.description,
          item_count: parcelData.item_count,
          weight: parcelData.weight || '',
          declared_value: parcelData.declared_value,
          delivery_type: parcelData.delivery_type,
          payment_status: parcelData.payment_status || 'unpaid',
          payment_responsibility: parcelData.payment_responsibility,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load parcel details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [parcelId]);

  if (!user) return null;

  // Check if current user can edit this parcel
  const canEdit = (): boolean => {
    if (!parcel || !user.station) return false;

    // Parcel must not be delivered or failed
    if (parcel.status === 'delivered' || parcel.status === 'failed') return false;

    // Origin admin can edit if status is 'created'
    if (parcel.status === 'created' && String(user.station.id) === parcel.origin_station) {
      return true;
    }

    // Destination admin can edit if status is 'arrived'
    if (parcel.status === 'arrived' && String(user.station.id) === parcel.destination_station) {
      return true;
    }

    return false;
  };

  // Check which fields can be edited based on status and user
  const canEditField = (field: keyof EditableFields): boolean => {
    if (!parcel || !user.station) return false;

    // If status is 'created' and user is origin admin
    if (parcel.status === 'created' && String(user.station.id) === parcel.origin_station) {
      return true;
    }

    // If status is 'arrived' and user is destination admin
    if (parcel.status === 'arrived' && String(user.station.id) === parcel.destination_station) {
      // Can only edit recipient information
      return ['recipient_name', 'recipient_phone', 'recipient_address'].includes(field);
    }

    return false;
  };

  // Get next status action based on permissions
  const getNextStatusAction = (): { label: string; newStatus: 'created' | 'in_transit' | 'arrived' | 'delivered' | 'failed' } | null => {
    if (!parcel || !user.station) return null;

    const currentStation = user.station.id;
    const isOriginStation = parcel.origin_station === String(currentStation);
    const isDestinationStation = parcel.destination_station === String(currentStation);

    // Only allow status updates if payment is paid
    if (parcel.payment_status !== 'paid') {
      return null;
    }

    switch (parcel.status) {
      case 'created':
        if (isOriginStation) return { label: 'Mark In Transit', newStatus: 'in_transit' };
        break;
      case 'in_transit':
        if (isDestinationStation) return { label: 'Mark as Arrived', newStatus: 'arrived' };
        break;
      case 'arrived':
        if (isDestinationStation) return { label: 'Mark as Delivered', newStatus: 'delivered' };
        break;
      default:
        return null;
    }
    return null;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset edited fields to original values
    if (parcel) {
      setEditedFields({
        sender_name: parcel.sender_name,
        sender_phone: parcel.sender_phone,
        sender_address: parcel.sender_address,
        recipient_name: parcel.recipient_name,
        recipient_phone: parcel.recipient_phone,
        recipient_address: parcel.recipient_address,
        destination_station: parcel.destination_station,
        description: parcel.description,
        item_count: parcel.item_count,
        weight: parcel.weight || '',
        declared_value: parcel.declared_value,
        delivery_type: parcel.delivery_type,
        payment_status: parcel.payment_status || 'unpaid',
        payment_responsibility: parcel.payment_responsibility,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!parcel || !editedFields) return;

    try {
      setIsSaving(true);
      
      // Prepare update data (only send fields that were actually edited)
      const updateData: any = {};
      
      if (editedFields.sender_name !== parcel.sender_name) updateData.sender_name = editedFields.sender_name;
      if (editedFields.sender_phone !== parcel.sender_phone) updateData.sender_phone = editedFields.sender_phone;
      if (editedFields.sender_address !== parcel.sender_address) updateData.sender_address = editedFields.sender_address;
      if (editedFields.recipient_name !== parcel.recipient_name) updateData.recipient_name = editedFields.recipient_name;
      if (editedFields.recipient_phone !== parcel.recipient_phone) updateData.recipient_phone = editedFields.recipient_phone;
      if (editedFields.recipient_address !== parcel.recipient_address) updateData.recipient_address = editedFields.recipient_address;
      if (editedFields.destination_station !== parcel.destination_station) updateData.destination_station = editedFields.destination_station;
      if (editedFields.description !== parcel.description) updateData.description = editedFields.description;
      if (editedFields.item_count !== parcel.item_count) updateData.item_count = editedFields.item_count;
      if (editedFields.weight !== (parcel.weight || '')) updateData.weight = editedFields.weight ? parseFloat(editedFields.weight) : null;
      if (editedFields.declared_value !== parcel.declared_value) updateData.declared_value = parseFloat(editedFields.declared_value);
      if (editedFields.delivery_type !== parcel.delivery_type) updateData.delivery_type = editedFields.delivery_type;
      if (editedFields.payment_status !== (parcel.payment_status || 'unpaid')) updateData.payment_status = editedFields.payment_status;
      if (editedFields.payment_responsibility !== parcel.payment_responsibility) updateData.payment_responsibility = editedFields.payment_responsibility;

      // Update parcel
      const updatedParcel = await parcelService.updateParcel(parcel.id, updateData);
      setParcel(updatedParcel);
      
      // Update editedFields with new values
      setEditedFields({
        sender_name: updatedParcel.sender_name,
        sender_phone: updatedParcel.sender_phone,
        sender_address: updatedParcel.sender_address,
        recipient_name: updatedParcel.recipient_name,
        recipient_phone: updatedParcel.recipient_phone,
        recipient_address: updatedParcel.recipient_address,
        destination_station: updatedParcel.destination_station,
        description: updatedParcel.description,
        item_count: updatedParcel.item_count,
        weight: updatedParcel.weight || '',
        declared_value: updatedParcel.declared_value,
        delivery_type: updatedParcel.delivery_type,
        payment_status: updatedParcel.payment_status || 'unpaid',
        payment_responsibility: updatedParcel.payment_responsibility,
      });
      
      setIsEditing(false);

      toast({
        title: 'Success',
        description: 'Parcel updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update parcel',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!parcel) return;

    const statusAction = getNextStatusAction();
    if (!statusAction) return;

    try {
      setIsUpdatingStatus(true);
      
      await parcelService.updateParcelStatus(parcel.id, {
        new_status: statusAction.newStatus,
        notes: `Status updated by ${user.name}`
      });
      
      // Refresh parcel data
      const updatedParcel = await parcelService.getParcelDetail(parcel.id);
      setParcel(updatedParcel);
      
      // Update editedFields
      if (editedFields) {
        setEditedFields({
          ...editedFields,
          payment_status: updatedParcel.payment_status || 'unpaid',
        });
      }
      
      toast({
        title: 'Success',
        description: 'Parcel status updated successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-700';
      case 'in_transit':
        return 'bg-purple-100 text-purple-700';
      case 'arrived':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'unpaid':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/parcels')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Parcel Management
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : parcel && editedFields ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Parcel Details: {parcel.tracking_code}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing ? 'Editing parcel details' : 'View and update details for this parcel'}
                </p>
              </div>
              {canEdit() && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEdit}>
                      <Package className="h-4 w-4 mr-2" />
                      Edit Parcel
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Summary</CardTitle>
                    <Badge className={getStatusColor(parcel.status)}>
                      {parcel.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                        <p className="font-semibold font-mono">{parcel.tracking_code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Created At</p>
                        <p className="font-semibold">
                          {new Date(parcel.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Sender Name</p>
                        {isEditing && canEditField('sender_name') ? (
                          <input
                            type="text"
                            value={editedFields.sender_name}
                            onChange={(e) => setEditedFields({ ...editedFields, sender_name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <p className="font-semibold">{parcel.sender_name}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Recipient Name</p>
                        {isEditing && canEditField('recipient_name') ? (
                          <input
                            type="text"
                            value={editedFields.recipient_name}
                            onChange={(e) => setEditedFields({ ...editedFields, recipient_name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <p className="font-semibold">{parcel.recipient_name}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Origin Station</p>
                        <p className="font-semibold">
                          {parcel.origin_station_name} ({parcel.origin_station_code})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Destination Station</p>
                        {isEditing && canEditField('destination_station') ? (
                          <select
                            value={editedFields.destination_station}
                            onChange={(e) => setEditedFields({ ...editedFields, destination_station: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            {stations.filter(s => s.is_active).map((station) => (
                              <option key={station.id} value={station.id}>
                                {station.name} ({station.code})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="font-semibold">
                            {parcel.destination_station_name} ({parcel.destination_station_code})
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Package Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        {isEditing && canEditField('description') ? (
                          <textarea
                            value={editedFields.description}
                            onChange={(e) => setEditedFields({ ...editedFields, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            rows={3}
                          />
                        ) : (
                          <p className="text-sm">{parcel.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Item Count</p>
                          {isEditing && canEditField('item_count') ? (
                            <input
                              type="number"
                              value={editedFields.item_count}
                              onChange={(e) => setEditedFields({ ...editedFields, item_count: parseInt(e.target.value) || 1 })}
                              className="w-full px-3 py-2 border rounded-md"
                              min="1"
                            />
                          ) : (
                            <p className="font-semibold">{parcel.item_count}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Weight (kg)</p>
                          {isEditing && canEditField('weight') ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editedFields.weight}
                              onChange={(e) => setEditedFields({ ...editedFields, weight: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="Optional"
                            />
                          ) : (
                            <p className="font-semibold">{parcel.weight ? `${parcel.weight} kg` : 'N/A'}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Delivery Type</p>
                          {isEditing && canEditField('delivery_type') ? (
                            <select
                              value={editedFields.delivery_type}
                              onChange={(e) => setEditedFields({ ...editedFields, delivery_type: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="standard">Standard</option>
                              <option value="express">Express</option>
                              <option value="same_day">Same Day</option>
                            </select>
                          ) : (
                            <p className="font-semibold capitalize">
                              {parcel.delivery_type.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold mb-2">Sender</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            {isEditing && canEditField('sender_phone') ? (
                              <input
                                type="tel"
                                value={editedFields.sender_phone}
                                onChange={(e) => setEditedFields({ ...editedFields, sender_phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            ) : (
                              <p className="text-sm">{parcel.sender_phone}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            {isEditing && canEditField('sender_address') ? (
                              <textarea
                                value={editedFields.sender_address}
                                onChange={(e) => setEditedFields({ ...editedFields, sender_address: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                                rows={2}
                              />
                            ) : (
                              <p className="text-sm">{parcel.sender_address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Recipient</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            {isEditing && canEditField('recipient_phone') ? (
                              <input
                                type="tel"
                                value={editedFields.recipient_phone}
                                onChange={(e) => setEditedFields({ ...editedFields, recipient_phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                              />
                            ) : (
                              <p className="text-sm">{parcel.recipient_phone}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Address</p>
                            {isEditing && canEditField('recipient_address') ? (
                              <textarea
                                value={editedFields.recipient_address}
                                onChange={(e) => setEditedFields({ ...editedFields, recipient_address: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                                rows={2}
                              />
                            ) : (
                              <p className="text-sm">{parcel.recipient_address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {parcel.delivery_updates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No updates yet</p>
                    ) : (
                      <div className="space-y-4">
                        {parcel.delivery_updates.map((update, index) => (
                          <div key={update.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-primary" />
                              {index < parcel.delivery_updates.length - 1 && (
                                <div className="w-0.5 h-full bg-border" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-semibold text-sm">
                                {update.new_status.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground mb-1">
                                {new Date(update.timestamp).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              {update.notes && (
                                <p className="text-sm text-muted-foreground">{update.notes}</p>
                              )}
                              {update.actor_name && (
                                <p className="text-xs text-muted-foreground">
                                  By: {update.actor_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Package Photos */}
                {parcel.photos && parcel.photos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Package Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {parcel.photos.map((photo) => (
                          <div key={photo.id} className="relative aspect-square">
                            <img
                              src={photo.photo_url}
                              alt="Package"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Update Action */}
                {getNextStatusAction() && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={handleUpdateStatus}
                        disabled={isUpdatingStatus}
                      >
                        {isUpdatingStatus ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        {getNextStatusAction()!.label}
                      </Button>
                      {parcel.payment_status !== 'paid' && (
                        <p className="text-xs text-muted-foreground">
                          Payment must be completed before updating status
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Status & Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                      <Badge className={`${getStatusColor(parcel.status)} px-3 py-1`}>
                        {parcel.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                      {isEditing && canEditField('payment_status') ? (
                        <select
                          value={editedFields.payment_status}
                          onChange={(e) => setEditedFields({ ...editedFields, payment_status: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-auto"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                      ) : (
                        <Badge className={`${getPaymentStatusColor(parcel.payment_status || 'unpaid')} px-3 py-1`}>
                          {(parcel.payment_status || 'unpaid').toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Responsibility</p>
                      {isEditing && canEditField('payment_responsibility') ? (
                        <select
                          value={editedFields.payment_responsibility}
                          onChange={(e) => setEditedFields({ ...editedFields, payment_responsibility: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input appearance-auto"
                        >
                          <option value="sender">Sender Pays</option>
                          <option value="recipient">Recipient Pays</option>
                        </select>
                      ) : (
                        <p className="text-sm capitalize">{parcel.payment_responsibility} pays</p>
                      )}
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
                      onClick={() => navigate(`/admin/payments?parcel=${parcel.tracking_code}`)}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Payments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/track?code=${parcel.tracking_code}`
                        );
                        toast({
                          title: 'Copied!',
                          description: 'Tracking link copied to clipboard',
                        });
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Copy Tracking Link
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}