import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  FileText,
  Download,
  Filter,
  Calendar,
  MapPin,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for stations (for filters)
const allStations = [
  { id: 'all', name: 'All Stations' },
  { id: 'station-a', name: 'Station A - Downtown' },
  { id: 'station-b', name: 'Station B - Uptown' },
  { id: 'station-c', name: 'Station C - East Side' },
  { id: 'station-d', name: 'Station D - West Side' },
];

export default function SuperAdminAnalyticsReportsPage() {
  const navigate = useNavigate();
  const [superAdminData, setSuperAdminData] = useState<any>(null);

  // Filter states for reports
  const [reportType, setReportType] = useState('delivery_performance');
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [selectedStation, setSelectedStation] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  const handleGenerateReport = () => {
    alert(`Generating "${reportType}" report for ${selectedStation} from ${startDate || 'start'} to ${endDate || 'end'} over ${timeRange}. (Mock Action)`);
    console.log('Report Parameters:', { reportType, timeRange, selectedStation, startDate, endDate });
    // In a real application, this would trigger an API call to generate and fetch report data
  };

  const handleExportReport = () => {
    alert('Exporting report as CSV. (Mock Action)');
    // In a real application, this would trigger an API call to export the current report view
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
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and view system-wide performance and activity reports
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Filter className="h-6 w-6" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery_performance">Delivery Performance</SelectItem>
                    <SelectItem value="revenue_summary">Revenue Summary</SelectItem>
                    <SelectItem value="parcel_status_breakdown">Parcel Status Breakdown</SelectItem>
                    <SelectItem value="user_activity">User Activity Logs</SelectItem>
                    <SelectItem value="admin_actions">Admin Actions Logs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeRange">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {timeRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="selectedStation">Filter by Station</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select station" />
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

            <Button onClick={handleGenerateReport} className="w-full h-11">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Report Display Area (Placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Report Results
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Generated report data will appear here.
            </p>
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="mt-6"
              disabled={true} // Disable until a report is "generated"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
