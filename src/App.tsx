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

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Portal */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create-delivery" element={<CreateDeliveryPage />} />
        <Route path="/order-confirmation/:trackingId" element={<OrderConfirmationPage />} />
        <Route path="/my-deliveries" element={<MyDeliveriesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/track" element={<TrackingPage />} />
        
        {/* Station Admin Panel */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/parcels" element={<AdminParcelManagementPage />} />
        <Route path="/admin/parcels/:trackingId" element={<AdminParcelDetailsPage />} />
        <Route path="/admin/create-parcel" element={<AdminCreateParcelPage />} />
        <Route path="/admin/bus-arrival" element={<AdminBusArrivalPage />} />
        <Route path="/admin/payments" element={<AdminPaymentRecordsPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />

        {/* Super Admin Panel */}
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboardPage />} />
        <Route path="/superadmin/stations" element={<SuperAdminStationManagementPage />} />
        <Route path="/superadmin/admins" element={<SuperAdminAdminManagementPage />} />
        <Route path="/superadmin/parcels" element={<SuperAdminGlobalParcelOverviewPage />} />
        <Route path="/superadmin/payments" element={<SuperAdminGlobalPaymentRecordsPage />} />
        <Route path="/superadmin/notifications" element={<SuperAdminNotificationsPage />} /> {/* New route */}
        <Route path="/superadmin/profile" element={<SuperAdminProfilePage />} /> {/* New route */}
        <Route path="/superadmin/reports" element={<SuperAdminAnalyticsReportsPage />} /> {/* New route */}
				<Route path="/superadmin/users" element={<SuperAdminUserOverviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
