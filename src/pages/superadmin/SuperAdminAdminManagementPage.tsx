import { useState, useEffect } from 'react';
import { Plus, Edit2, UserCheck, UserX, Shield, MapPin, Mail, Phone } from 'lucide-react';
import SuperAdminLayout from '@/components/superadmin/SuperAdminLayout';
import adminService from '@/services/admin.service';
import stationService from '@/services/station.service';
import { User, Station } from '@/types/user.types';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  station: string;
}

export default function SuperAdminAdminManagementPage() {
  const isMobile = useIsMobile();
  const [admins, setAdmins] = useState<User[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    station: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<AdminFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStation, setFilterStation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [adminsData, stationsData] = await Promise.all([
        adminService.getAdmins(),
        stationService.getStations(),
      ]);
      setAdmins(adminsData);
      setStations(stationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      station: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (admin: User) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email ?? '',
      phone: admin.phone,
      password: '', // Don't populate password
      station: admin.station?.id || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      station: '',
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<AdminFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number (10-15 digits)';
    }

    if (modalMode === 'create' && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.station) {
      errors.station = 'Please assign a station';
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
        await adminService.createAdmin(formData);
      } else if (selectedAdmin) {
        // For edit, only send changed fields (exclude password if empty)
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          station: formData.station,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await adminService.updateAdmin(selectedAdmin.id, updateData);
      }

      await loadData();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (admin: User) => {
    try {
      if (admin.is_active) {
        await adminService.deactivateAdmin(admin.id);
      } else {
        await adminService.activateAdmin(admin.id);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin status');
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm);

    const matchesStation =
      filterStation === 'all' || admin.station?.id === filterStation;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && admin.is_active) ||
      (filterStatus === 'inactive' && !admin.is_active);

    return matchesSearch && matchesStation && matchesStatus;
  });

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading administrators...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-1">Manage station administrators and their permissions</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Admin
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
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{admins.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Admins</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {admins.filter((a) => a.is_active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Admins</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {admins.filter((a) => !a.is_active).length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <UserX className="w-8 h-8 text-gray-600" />
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Station Filter */}
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="all">All Stations</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>

              {/* Status Filter - Mobile: Dropdown, Desktop: Buttons */}
              {isMobile ? (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <option value="all">All Status</option>
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
        </div>

        {/* Admins List - Mobile: Cards, Desktop: Table */}
        {isMobile ? (
          /* Mobile Card View */
          <div className="space-y-3">
            {filteredAdmins.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                No administrators found
              </div>
            ) : (
              filteredAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                        <span className="text-xs text-gray-500">{admin.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(admin)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        admin.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      {admin.phone}
                    </div>
                    {admin.station && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{admin.station.name}</span>
                          <span className="text-xs text-gray-400 ml-1">({admin.station.code})</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openEditModal(admin)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Administrator
                  </button>
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
                      Administrator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Station
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
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No administrators found
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                              <div className="text-sm text-gray-500">{admin.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {admin.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {admin.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {admin.station ? (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.station.name}
                                </div>
                                <div className="text-xs text-gray-500">{admin.station.code}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No station assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleActive(admin)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              admin.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {admin.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit admin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalMode === 'create' ? 'Add New Administrator' : 'Edit Administrator'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., 0241234567"
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Station *
                </label>
                <select
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.station ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a station</option>
                  {stations
                    .filter((s) => s.is_active)
                    .map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} ({station.code})
                      </option>
                    ))}
                </select>
                {formErrors.station && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.station}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modalMode === 'create' ? '*' : '(Leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={modalMode === 'create' ? 'Enter password' : 'Leave blank to keep current'}
                  className={`w-full px-4 ${isMobile ? 'py-3 text-base' : 'py-2'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
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
                  {isSubmitting
                    ? 'Saving...'
                    : modalMode === 'create'
                    ? 'Create Admin'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}