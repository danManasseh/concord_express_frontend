import api, { handleApiError } from './api';
import { Parcel, ParcelDetail, CreateParcelRequest } from '@/types/parcel.types';
import { PaginatedResponse } from '@/types/api.types';

class ParcelService {
  // updateParcel(trackingId: string, updateData: any) {
  //   throw new Error('Method not implemented.');
  // }
  /**
   * Create a new parcel
   */
  async createParcel(data: CreateParcelRequest): Promise<Parcel> {
    try {
      const response = await api.post<Parcel>('/parcels/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get parcel by tracking code (public)
   */
  async trackParcel(trackingCode: string): Promise<ParcelDetail> {
    try {
      const response = await api.get<ParcelDetail>(`/track/${trackingCode}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's parcels
   */
  async getUserParcels(): Promise<Parcel[]> {
    try {
      const response = await api.get<PaginatedResponse<Parcel>>('/parcels/'); 
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all parcels (admin/superadmin)
   */
  async getParcels(params?: {
    status?: string;
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<Parcel>> {
    try {
      const response = await api.get<PaginatedResponse<Parcel>>('/parcels/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get parcel details
   */
  async getParcelDetail(id: string): Promise<ParcelDetail> {
    try {
      const response = await api.get<ParcelDetail>(`/parcels/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload package photo
   */
  async uploadPhoto(parcelId: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      await api.post(`/parcels/${parcelId}/upload-photo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  /**
 * Update parcel details (admin only)
 * PUT /api/parcels/:id/
 */
  async updateParcel(trackingId: string, data: Partial<{
    sender_name: string;
    sender_phone: string;
    sender_address: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    destination_station: string;
    description: string;
    item_count: number;
    weight: number | null;
    declared_value: number;
    delivery_type: string;
    payment_status: string;
    payment_responsibility: string;
  }>): Promise<ParcelDetail> {
    try {
      const response = await api.put<ParcelDetail>(`/parcels/${trackingId}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  }


export default new ParcelService();