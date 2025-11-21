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
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import userService, { User } from '@/services/userService';

export default function SuperAdminUserOverviewPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  useEffect(() => {
    if (!superAdminData) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await userService.getAllUsers();
        setUsers(response.results);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch users',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [superAdminData, toast]);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  const filteredUsers = users.filter((user) => {
    const emailMatch = user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailMatch ||
      user.phone.includes(searchQuery);
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id: string, name: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    const newStatus = !currentStatus;

    if (!window.confirm(`Are you sure you want to ${action} user "${name}"?`)) {
      return;
    }

    setIsActionLoading(id);
    try {
      if (currentStatus) {
        await userService.deactivateUser(id);
      } else {
        await userService.activateUser(id);
      }

      // Update local state
      setUsers(users.map((u) => (u.id === id ? { ...u, is_active: newStatus } : u)));

      toast({
        title: 'Success',
        description: `User "${name}" has been ${action}d successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to ${action} user`,
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  if (!superAdminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader adminData={superAdminData} notificationCount={5} />

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
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No users found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {users.length === 0
                    ? 'No users have registered yet.'
                    : 'Try adjusting your search or filters.'}
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
                      <Badge variant="outline" className={getStatusColor(user.is_active)}>
                        {user.is_active ? 'Active' : 'Inactive'}
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
                      <p className="text-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant={user.is_active ? 'destructive' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleStatus(user.id, user.name, user.is_active)}
                        disabled={isActionLoading === user.id}
                      >
                        {isActionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : user.is_active ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {user.is_active ? 'Deactivate' : 'Activate'}
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
                          <Badge variant="outline" className={getStatusColor(user.is_active)}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={user.is_active ? 'destructive' : 'default'}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleToggleStatus(user.id, user.name, user.is_active)}
                            disabled={isActionLoading === user.id}
                          >
                            {isActionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : user.is_active ? (
                              <XCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {user.is_active ? 'Deactivate' : 'Activate'}
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