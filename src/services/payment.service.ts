import { PaginatedResponse } from '@/types/api.types';
import api, { handleApiError } from './api';
import { Payment, CreatePaymentRequest } from '@/types/payment.types';

class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    try {
      const response = await api.post<{ payment: Payment }>('/payments/create/', data);
      return response.data.payment;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all payments (admin/superadmin)
   */
  async getPayments(params?: {
    status?: string;
    method?: string;
    parcel?: string;
    page?: number;
  }): Promise<Payment[]> {
    try {
      const response = await api.get<PaginatedResponse<Payment>>('/payments/', { params });
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<Payment> {
    try {
      const response = await api.get<Payment>(`/payments/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get payments for a specific parcel
   */
  async getParcelPayments(parcelId: string): Promise<Payment[]> {
    try {
      const response = await api.get<PaginatedResponse<Payment>>(
      `/parcels/${parcelId}/payment/`
    );
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Complete a payment (mark as paid)
   */
  async completePayment(paymentId: string, notes?: string): Promise<Payment> {
    try {
      const response = await api.post<{ payment: Payment }>(
        `/payments/${paymentId}/complete/`,
        { notes }
      );
      return response.data.payment;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark payment as failed
   */
  async failPayment(paymentId: string, notes: string): Promise<Payment> {
    try {
      const response = await api.post<{ payment: Payment }>(
        `/payments/${paymentId}/fail/`,
        { notes }
      );
      return response.data.payment;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refund a payment (superadmin only)
   */
  async refundPayment(paymentId: string, refundReason: string): Promise<Payment> {
    try {
      const response = await api.post<{ payment: Payment }>(
        `/payments/${paymentId}/refund/`,
        { refund_reason: refundReason }
      );
      return response.data.payment;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics(): Promise<{
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
  }> {
    try {
      const response = await api.get('/payments/statistics/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new PaymentService();