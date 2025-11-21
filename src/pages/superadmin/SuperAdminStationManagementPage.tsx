import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import SuperAdminLayout from '@/components/superadmin/SuperAdminLayout';
import stationService from '@/services/station.service';
import { Station } from '@/types/user.types';
import { useIsMobile } from '@/hooks/use-mobile';

interface StationFormData {
  code: string;
  name: string;
  address: string;
  contact_phone: string;
}

export default function SuperAdminStationManagementPage() {
  const isMobile = useIsMobile();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<StationFormData>({
    code: '',
    name: '',
    address: '',
    contact_phone: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<StationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setIsLoading(true);
      const data = await stationService.getStations();
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stations');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedStation(null);
    setFormData({
      code: '',
      name: '',
      address: '',
      contact_phone: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (station: Station) => {
    setModalMode('edit');
    setSelectedStation(station);
    setFormData({
      code: station.code,
      name: station.name,
      address: station.address,
      contact_phone: station.contact_phone || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
    setFormData({
      code: '',
      name: '',
      address: '',
      contact_phone: '',
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<StationFormData> = {};

    if (!formData.code.trim()) {
      errors.code = 'Station code is required';
    } else if (!/^[A-Z]{2,5}$/.test(formData.code.trim())) {
      errors.code = 'Code must be 2-5 uppercase letters (e.g., ACC, KSI)';
    }

    if (!formData.name.trim()) {
      errors.name = 'Station name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (formData.contact_phone && !/^[0-9]{10,15}$/.test(formData.contact_phone.replace(/\s/g, ''))) {
      errors.contact_phone = 'Invalid phone number (10-15 digits)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      if (modalMode === 'create') {
        await stationService.createStation(formData);
      } else if (selectedStation) {
        await stationService.updateStation(selectedStation.id, formData);
      }

      await loadStations();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save station');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (station: Station) => {
    try {
      if (station.is_active) {
        await stationService.deactivateStation(station.id);
      } else {
        await stationService.activateStation(station.id);
      }
      await loadStations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update station status');
    }
  };

  const handleDeleteStation = async (station: Station) => {
    if (!confirm(`Are you sure you want to delete ${station.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await stationService.deleteStation(station.id);
      await loadStations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete station');
    }
  };

  // Filter stations
  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && station.is_active) ||
      (filterStatus === 'inactive' && !station.is_active);

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stations...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Station Management</h1>
            <p className="text-gray-600 mt-1">Manage all delivery stations across the network</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Station
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stations.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Stations</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stations.filter((s) => s.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Stations</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {stations.filter((s) => !s.is_active).length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <XCircle className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-3">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            
            {/* Status Filter - Mobile: Dropdown, Desktop: Buttons */}
            {isMobile ? (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="all">All Stations</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === 'inactive'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stations List - Mobile: Cards, Desktop: Table */}
        {isMobile ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {filteredStations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                No stations found
              </div>
            ) : (
              filteredStations.map((station) => (
                <div
                  key={station.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{station.name}</h3>
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded mt-1">
                          {station.code}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(station)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        station.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {station.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
                      {station.address}
                    </div>
                    {station.contact_phone && (
                      <div className="text-sm text-gray-600">
                        <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                        {station.contact_phone}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(station)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStation(station)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Station
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No stations found
                      </td>
                    </tr>
                  ) : (
                    filteredStations.map((station) => (
                      <tr key={station.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{station.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                            {station.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{station.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {station.contact_phone ? (
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone className="w-4 h-4 mr-1 text-gray-400" />
                              {station.contact_phone}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(station)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              station.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {station.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(station)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit station"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStation(station)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete station"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalMode === 'create' ? 'Add New Station' : 'Edit Station'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., ACC, KSI"
                  disabled={modalMode === 'edit'}
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.code ? 'border-red-500' : 'border-gray-300'
                  } ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Accra Central Station"
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., Ring Road Central, Accra"
                  rows={3}
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="e.g., 0241234567"
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.contact_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.contact_phone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.contact_phone}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Station' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}