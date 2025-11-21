export type PaymentMethod = 'cash' | 'mobile_money';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  parcel: string;
  parcel_tracking_code: string;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider_name: string | null;
  provider_phone: string | null;
  provider_tx_id: string | null;
  processed_by_name: string | null;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface CreatePaymentRequest {
  parcel: string;
  amount: number;
  method: PaymentMethod;
  provider_name?: string;
  provider_phone?: string;
  provider_tx_id?: string;
  notes?: string;
}