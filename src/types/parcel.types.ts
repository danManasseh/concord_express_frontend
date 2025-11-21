export type ParcelStatus = 'created' | 'in_transit' | 'arrived' | 'delivered' | 'failed';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded';
export type DeliveryType = 'standard' | 'express' | 'same_day';
export type PaymentResponsibility = 'sender' | 'recipient';

export interface Parcel {
  id: string;
  tracking_code: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  origin_station: string;
  origin_station_name: string;
  origin_station_code: string;
  destination_station: string;
  destination_station_name: string;
  destination_station_code: string;
  batch_id: string | null;
  description: string;
  item_count: number;
  weight: string | null;
  declared_value: string;
  delivery_type: DeliveryType;
  status: ParcelStatus;
  payment_status: PaymentStatus;
  payment_responsibility: PaymentResponsibility;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateParcelRequest {
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  origin_station: string;
  destination_station: string;
  description: string;
  item_count?: number;
  weight?: number;
  declared_value: number;
  delivery_type: DeliveryType;
  payment_status: PaymentStatus;
  payment_responsibility: PaymentResponsibility;
}

export interface ParcelDetail extends Parcel {
  delivery_updates: DeliveryUpdate[];
  photos: PackagePhoto[];
}

export interface DeliveryUpdate {
  id: string;
  prev_status: ParcelStatus | null;
  new_status: ParcelStatus;
  actor_name: string | null;
  notes: string | null;
  timestamp: string;
}

export interface PackagePhoto {
  id: string;
  photo_url: string;
  created_at: string;
}