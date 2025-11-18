import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  MapPin,
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
import {
	Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '@/components/ui/select';

// Mock data for stations
const mockStations = [
  { id: 'station-a', name: 'Station A - Downtown', location: '123 Main St, City A', status: 'Active' },
  { id: 'station-b', name: 'Station B - Uptown', location: '456 Oak Ave, City B', status: 'Active' },
  { id: 'station-c', name: 'Station C - East Side', location: '789 Pine Ln, City C', status: 'Active' },
  { id: 'station-d', name: 'Station D - West Side', location: '101 Elm Rd, City D', status: 'Active' },
  { id: 'station-e', name: 'Station E - North End', location: '202 Birch Blvd, City E', status: 'Active' },
  { id: 'station-f', name: 'Station F - South District', location: '303 Cedar Ct, City F', status: 'Inactive' },
];

export default function SuperAdminStationManagementPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [stations, setStations] = useState(mockStations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStation, setCurrentStation] = useState<any | null>(null); // For edit/add
  const [stationName, setStationName] = useState('');
  const [stationLocation, setStationLocation] = useState('');
  const [stationStatus, setStationStatus] = useState('Active');

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

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setCurrentStation(null);
    setStationName('');
    setStationLocation('');
    setStationStatus('Active');
    setIsDialogOpen(true);
  };

  const openEditDialog = (station: any) => {
    setCurrentStation(station);
    setStationName(station.name);
    setStationLocation(station.location);
    setStationStatus(station.status);
    setIsDialogOpen(true);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStation) {
      // Edit existing station
      setStations(
        stations.map((s) =>
          s.id === currentStation.id
            ? { ...s, name: stationName, location: stationLocation, status: stationStatus }
            : s
        )
      );
      alert(`Station ${stationName} updated successfully!`);
    } else {
      // Add new station
      const newId = `station-${(Math.random() * 1000).toFixed(0)}`;
      setStations([
        ...stations,
        { id: newId, name: stationName, location: stationLocation, status: stationStatus },
      ]);
      alert(`Station ${stationName} added successfully!`);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteStation = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete station "${name}"? This action cannot be undone.`)) {
      setStations(stations.filter((s) => s.id !== id));
      alert(`Station "${name}" deleted.`);
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to mark station "${name}" as "${newStatus}"?`)) {
      setStations(
        stations.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      alert(`Station "${name}" status changed to "${newStatus}".`);
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
              Station Management
            </h1>
            <p className="text-muted-foreground">
              Manage all delivery stations in the Concord Express network
            </p>
          </div>
          <Button onClick={openAddDialog} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Station
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              All Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by station name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stations List/Table */}
            {filteredStations.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No stations found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or add a new station.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <div
                    key={station.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Station ID</p>
                        <p className="font-mono font-bold text-foreground">{station.id}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          station.status === 'Active'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }
                      >
                        {station.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-foreground">{station.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-foreground">{station.location}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(station)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant={station.status === 'Active' ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleStatus(station.id, station.name, station.status)}
                      >
                        {station.status === 'Active' ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {station.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStation(station.id, station.name)}
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
                      <TableHead className="font-semibold">Station ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStations.map((station) => (
                      <TableRow key={station.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{station.id}</TableCell>
                        <TableCell>{station.name}</TableCell>
                        <TableCell>{station.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              station.status === 'Active'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }
                          >
                            {station.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(station)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={station.status === 'Active' ? 'destructive' : 'default'}
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleToggleStatus(station.id, station.name, station.status)}
                            >
                              {station.status === 'Active' ? (
                                <XCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              {station.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteStation(station.id, station.name)}
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

      {/* Add/Edit Station Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentStation ? 'Edit Station' : 'Add New Station'}</DialogTitle>
            <DialogDescription>
              {currentStation
                ? `Make changes to ${currentStation.name} here.`
                : 'Add a new delivery station to the network.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveStation} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stationName">Station Name</Label>
              <Input
                id="stationName"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g., Station G - North East"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationLocation">Location</Label>
              <Input
                id="stationLocation"
                value={stationLocation}
                onChange={(e) => setStationLocation(e.target.value)}
                placeholder="e.g., 404 Not Found Rd, City G"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationStatus">Status</Label>
              <Select value={stationStatus} onValueChange={setStationStatus}>
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
                {currentStation ? 'Save Changes' : 'Add Station'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
