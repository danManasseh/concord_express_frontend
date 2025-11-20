import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  UserCog,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Save,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';


// Mock data for stations (same as in AdminLoginPage for consistency)
const allStations = [
  { id: 'station-a', name: 'Station A - Downtown' },
  { id: 'station-b', name: 'Station B - Uptown' },
  { id: 'station-c', name: 'Station C - East Side' },
  { id: 'station-d', name: 'Station D - West Side' },
  { id: 'station-e', name: 'Station E - North End' },
  { id: 'station-f', name: 'Station F - South District' },
];

// Mock data for station admins
const mockStationAdmins = [
  { id: 'admin-1', name: 'John Doe', email: 'john@stationa.com', stationId: 'station-a', stationName: 'Station A - Downtown', status: 'Active' },
  { id: 'admin-2', name: 'Jane Smith', email: 'jane@stationb.com', stationId: 'station-b', stationName: 'Station B - Uptown', status: 'Active' },
  { id: 'admin-3', name: 'Peter Jones', email: 'peter@stationc.com', stationId: 'station-c', stationName: 'Station C - East Side', status: 'Inactive' },
  { id: 'admin-4', name: 'Alice Brown', email: 'alice@stationd.com', stationId: 'station-d', stationName: 'Station D - West Side', status: 'Active' },
];

export default function SuperAdminAdminManagementPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [admins, setAdmins] = useState(mockStationAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any | null>(null); // For edit/add

  // Form states
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminStationId, setAdminStationId] = useState('');
  const [adminStatus, setAdminStatus] = useState('Active');

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('superadmin');
    navigate('/superadmin/login');
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.stationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setCurrentAdmin(null);
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
    setAdminStationId('');
    setAdminStatus('Active');
    setIsDialogOpen(true);
  };

  const openEditDialog = (admin: any) => {
    setCurrentAdmin(admin);
    setAdminName(admin.name);
    setAdminEmail(admin.email);
    setAdminPassword(''); // Password not pre-filled for security
    setAdminStationId(admin.stationId);
    setAdminStatus(admin.status);
    setIsDialogOpen(true);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStation = allStations.find(s => s.id === adminStationId);
    if (!selectedStation) {
      alert('Please select a valid station.');
      return;
    }

    if (currentAdmin) {
      // Edit existing admin
      setAdmins(
        admins.map((a) =>
          a.id === currentAdmin.id
            ? {
                ...a,
                name: adminName,
                email: adminEmail,
                stationId: adminStationId,
                stationName: selectedStation.name,
                status: adminStatus,
                // Password is not updated here, would be a separate action in real app
              }
            : a
        )
      );
      alert(`Admin ${adminName} updated successfully!`);
    } else {
      // Add new admin
      const newId = `admin-${(Math.random() * 1000).toFixed(0)}`;
      setAdmins([
        ...admins,
        {
          id: newId,
          name: adminName,
          email: adminEmail,
          password: adminPassword, // In real app, this would be hashed
          stationId: adminStationId,
          stationName: selectedStation.name,
          status: adminStatus,
        },
      ]);
      alert(`Admin ${adminName} added successfully!`);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete admin "${name}"? This action cannot be undone.`)) {
      setAdmins(admins.filter((a) => a.id !== id));
      alert(`Admin "${name}" deleted.`);
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to mark admin "${name}" as "${newStatus}"?`)) {
      setAdmins(
        admins.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      alert(`Admin "${name}" status changed to "${newStatus}".`);
    }
  };

  if (!superAdminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader superAdminData={superAdminData} notificationCount={5} />

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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Admin Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage station admin accounts
            </p>
          </div>
          <Button onClick={openAddDialog} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Admin
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Station Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Admins List/Table */}
            {filteredAdmins.length === 0 ? (
              <div className="text-center py-12">
                <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No station admins found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or add a new admin.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Admin ID</p>
                        <p className="font-mono font-bold text-foreground">{admin.id}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          admin.status === 'Active'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }
                      >
                        {admin.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-foreground">{admin.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-foreground">{admin.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Station</p>
                      <p className="text-foreground">{admin.stationName}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(admin)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={admin.status === 'Active' ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleStatus(admin.id, admin.name, admin.status)}
                      >
                        {admin.status === 'Active' ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Admin ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Station</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin) => (
                      <TableRow key={admin.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{admin.id}</TableCell>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.stationName}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              admin.status === 'Active'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }
                          >
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(admin)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={admin.status === 'Active' ? 'destructive' : 'default'}
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleToggleStatus(admin.id, admin.name, admin.status)}
                            >
                              {admin.status === 'Active' ? (
                                <XCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              {admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Admin Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentAdmin ? 'Edit Station Admin' : 'Add New Station Admin'}</DialogTitle>
            <DialogDescription>
              {currentAdmin
                ? `Make changes to ${currentAdmin.name}'s account.`
                : 'Add a new administrator and assign them to a station.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAdmin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Full Name</Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g., Jane Doe"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="e.g., jane@stationx.com"
                required
                className="h-11"
              />
            </div>
            {!currentAdmin && ( // Only show password field for new admin
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Set initial password"
                  required
                  className="h-11"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="adminStation">Assign Station</Label>
              <Select value={adminStationId} onValueChange={setAdminStationId} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  {allStations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminStatus">Status</Label>
              <Select value={adminStatus} onValueChange={setAdminStatus}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {currentAdmin ? 'Save Changes' : 'Add Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
