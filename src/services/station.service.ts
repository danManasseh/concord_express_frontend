import api, { handleApiError } from './api';
import { Station } from '@/types/user.types';

class StationService {
  /**
   * Get all active stations
   */
  async getStations(): Promise<Station[]> {
    try {
      const response = await api.get<Station[]>('/stations/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get station by ID
   */
  async getStation(id: string): Promise<Station> {
    try {
      const response = await api.get<Station>(`/stations/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new StationService();