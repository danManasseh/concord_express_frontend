import { PaginatedResponse } from '@/types/api.types';
import api, { handleApiError } from './api';
import { Station } from '@/types/user.types';

export interface CreateStationRequest {
  code: string;
  name: string;
  address: string;
  contact_phone?: string;
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  contact_phone?: string;
}

class StationService {
  /**
   * Get all active stations
   */
  async getStations(): Promise<Station[]> {
    try {
      const response = await api.get<PaginatedResponse<Station>>('/stations/');
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get station by ID
   */
  async getStation(id: number): Promise<Station> {
    try {
      const response = await api.get<Station>(`/stations/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new station (superadmin only)
   */
  async createStation(data: CreateStationRequest): Promise<Station> {
    try {
      const response = await api.post<Station>('/stations/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update station details (superadmin only)
   */
  async updateStation(id: number, data: UpdateStationRequest): Promise<Station> {
    try {
      const response = await api.put<Station>(`/stations/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Deactivate station (superadmin only)
   */
  async deactivateStation(id: number): Promise<Station> {
    try {
      const response = await api.patch<Station>(`/stations/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Activate station (superadmin only)
   */
  async activateStation(id: number): Promise<Station> {
    try {
      const response = await api.patch<Station>(`/stations/${id}/activate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete station (superadmin only)
   */
  async deleteStation(id: number): Promise<void> {
    try {
      await api.delete(`/stations/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get station admins (superadmin only)
   */
  async getStationAdmins(stationId: number): Promise<any[]> {
    try {
      const response = await api.get(`/stations/${stationId}/admins/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new StationService();