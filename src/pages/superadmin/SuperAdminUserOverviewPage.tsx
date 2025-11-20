import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for users (customers)
const mockUsers = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', phone: '111-222-3333', status: 'Active', registeredAt: '2023-01-10T08:00:00Z' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', phone: '444-555-6666', status: 'Active', registeredAt: '2023-02-15T09:30:00Z' },
  { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', phone: '777-888-9999', status: 'Inactive', registeredAt: '2023-03-01T14:00:00Z' },
  { id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', phone: '123-456-7890', status: 'Active', registeredAt: '2023-04-20T10:15:00Z' },
  { id: 'user-5', name: 'Charlie Green', email: 'charlie@example.com', phone: '987-654-3210', status: 'Active', registeredAt: '2023-05-05T11:45:00Z' },
];

export default function SuperAdminUserOverviewPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to mark user "${name}" as "${newStatus}"?`)) {
      setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      alert(`User "${name}" status changed to "${newStatus}".`);
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

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            User Overview
          </h1>
          <p className="text-muted-foreground">
            View and manage all registered customers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users List/Table */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No users found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">User ID</p>
                        <p className="font-mono font-bold text-foreground">{user.id}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-foreground">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Registered</p>
                      <p className="text-foreground">{new Date(user.registeredAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant={user.status === 'Active' ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                      >
                        {user.status === 'Active' ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
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
                      <TableHead className="font-semibold">User ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Registered</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={user.status === 'Active' ? 'destructive' : 'default'}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleToggleStatus(user.id, user.name, user.status)}
                          >
                            {user.status === 'Active' ? (
                              <XCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
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
    </div>
  );
}
