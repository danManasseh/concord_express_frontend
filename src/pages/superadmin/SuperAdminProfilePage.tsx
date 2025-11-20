import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';

export default function SuperAdminProfilePage() {
  const navigate = useNavigate();
  const [superAdminData, setSuperAdminData] = useState<any>(null);

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    const parsedSuperAdmin = JSON.parse(superadmin);
    setSuperAdminData(parsedSuperAdmin);

    // Initialize editable fields from superAdminData
    setName(parsedSuperAdmin.name || '');
    setEmail(parsedSuperAdmin.email || '');
    setPhone(parsedSuperAdmin.phone || ''); // Assuming phone might be part of super admin data
  }, [navigate]);

  // Personal Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences (mock for super admin)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  const [notificationCount] = useState(5); // Mock count for header

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSuperAdmin = { ...superAdminData, name, email, phone };
    localStorage.setItem('superadmin', JSON.stringify(updatedSuperAdmin));
    setSuperAdminData(updatedSuperAdmin); // Update local superAdminData state
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // TODO: Implement actual password change logic
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('superadmin');
    navigate('/superadmin/login');
  };

  if (!superAdminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader superAdminData={superAdminData} notificationCount={notificationCount} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/superadmin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Super Admin Profile & Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and system preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Settings (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Global system configurations and advanced settings will be managed here.
              </p>
              <Button variant="outline" onClick={() => alert('System Settings coming soon!')}>
                Configure Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences (Super Admin specific) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="superadmin-email-notifications" className="text-base">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive critical system alerts and reports via email
                  </p>
                </div>
                <Switch
                  id="superadmin-email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="superadmin-sms-notifications" className="text-base">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent system notifications via SMS
                  </p>
                </div>
                <Switch
                  id="superadmin-sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
