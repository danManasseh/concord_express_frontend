import api, { handleApiError } from './api';

export interface Batch {
  id: string;
  batch_id: string;
  origin_station: string;
  origin_station_name: string;
  origin_station_code: string;
  destination_station: string;
  destination_station_name: string;
  destination_station_code: string;
  trip_date: string;
  departure_time: string | null;
  arrival_time: string | null;
  status: 'pending' | 'in_transit' | 'arrived' | 'cancelled';
  notes: string | null;
  created_by_name: string | null;
  confirmed_by_name: string | null;
  created_at: string;
  updated_at: string;
  parcel_count: number;
  parcels: Array<{
    id: string;
    tracking_code: string;
    sender_name: string;
    recipient_name: string;
    status: string;
  }>;
}

export interface CreateBatchRequest {
  origin_station: string;
  destination_station: string;
  trip_date: string;
  parcel_ids: string[];
  notes?: string;
}

class BatchService {
  /**
   * Get all batches
   */
  async getBatches(params?: {
    status?: string;
    origin_station?: string;
    destination_station?: string;
    page?: number;
  }): Promise<Batch[]> {
    try {
      const response = await api.get<Batch[]>('/batches/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get batch by ID
   */
  async getBatch(id: string): Promise<Batch> {
    try {
      const response = await api.get<Batch>(`/batches/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search batch by batch_id string (for Bus Arrival feature)
   */
  async searchBatch(batchId: string): Promise<Batch> {
    try {
      const response = await api.get<{ batch: Batch }>('/batches/search/', {
        params: { batch_id: batchId },
      });
      return response.data.batch;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new batch
   */
  async createBatch(data: CreateBatchRequest): Promise<Batch> {
    try {
      const response = await api.post<{ batch: Batch }>('/batches/', data);
      return response.data.batch;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update batch status
   */
  async updateBatchStatus(
    batchId: string,
    status: 'in_transit' | 'arrived' | 'cancelled',
    notes?: string
  ): Promise<Batch> {
    try {
      const response = await api.put<{ batch: Batch }>(
        `/batches/${batchId}/status/`,
        { status, notes }
      );
      return response.data.batch;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark batch as departed (in_transit)
   */
  async departBatch(batchId: string, notes?: string): Promise<Batch> {
    return this.updateBatchStatus(batchId, 'in_transit', notes);
  }

  /**
   * Mark batch as arrived
   */
  async arriveBatch(batchId: string, notes?: string): Promise<Batch> {
    return this.updateBatchStatus(batchId, 'arrived', notes);
  }

  /**
   * Cancel batch
   */
  async cancelBatch(batchId: string, notes?: string): Promise<Batch> {
    return this.updateBatchStatus(batchId, 'cancelled', notes);
  }

  /**
   * Assign parcels to batch
   */
  async assignParcels(batchId: string, parcelIds: string[]): Promise<Batch> {
    try {
      const response = await api.post<{ batch: Batch }>(
        `/batches/${batchId}/assign-parcels/`,
        { parcel_ids: parcelIds }
      );
      return response.data.batch;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove parcels from batch
   */
  async removeParcels(batchId: string, parcelIds: string[]): Promise<Batch> {
    try {
      const response = await api.post<{ batch: Batch }>(
        `/batches/${batchId}/remove-parcels/`,
        { parcel_ids: parcelIds }
      );
      return response.data.batch;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new BatchService();