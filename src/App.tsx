import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateDeliveryPage from './pages/CreateDeliveryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyDeliveriesPage from './pages/MyDeliveriesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import TrackingPage from './pages/TrackingPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminParcelManagementPage from './pages/admin/AdminParcelManagementPage';
import AdminCreateParcelPage from './pages/admin/AdminCreateParcelPage';
import AdminParcelDetailsPage from './pages/admin/AdminParcelDetailsPage';
import AdminBusArrivalPage from './pages/admin/AdminBusArrivalPage';
import AdminPaymentRecordsPage from './pages/admin/AdminPaymentRecordsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import SuperAdminLoginPage from './pages/superadmin/SuperAdminLoginPage';
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage';
import SuperAdminStationManagementPage from './pages/superadmin/SuperAdminStationManagementPage';
import SuperAdminAdminManagementPage from './pages/superadmin/SuperAdminAdminManagementPage';
import SuperAdminGlobalParcelOverviewPage from './pages/superadmin/SuperAdminGlobalParcelOverviewPage';
import SuperAdminGlobalPaymentRecordsPage from './pages/superadmin/SuperAdminGlobalPaymentRecordsPage';
import SuperAdminNotificationsPage from './pages/superadmin/SuperAdminNotificationsPage';
import SuperAdminProfilePage from './pages/superadmin/SuperAdminProfilePage';
import SuperAdminAnalyticsReportsPage from './pages/superadmin/SuperAdminAnalyticsReportsPage';
import SuperAdminUserOverviewPage from './pages/superadmin/SuperAdminUserOverviewPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/track" element={<TrackingPage />} />

        {/* Customer Portal */}

          <Route
          path="/create-delivery"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateDeliveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:trackingId"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
          />
        <Route
          path="/my-deliveries"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyDeliveriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <NotificationsPage />
            </ProtectedRoute>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
        
        {/* Station Admin Panel */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }/>

        <Route
          path="/admin/parcels"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminParcelManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/parcels/:trackingId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminParcelDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-parcel"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCreateParcelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bus-arrival"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBusArrivalPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPaymentRecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Panel */}
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/stations"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminStationManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/admins"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminAdminManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/parcels"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminGlobalParcelOverviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/payments"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminGlobalPaymentRecordsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/notifications"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminNotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/profile"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/reports"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminAnalyticsReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/superadmin/users"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminUserOverviewPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
