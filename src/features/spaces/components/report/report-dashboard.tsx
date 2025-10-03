'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { CreateReportDialog } from './create-report-dialog';
import { ReportViewer } from './report-viewer';
import { useState } from 'react';

interface Report {
  id: string;
  title: string;
  type: 'summary' | 'detailed' | 'analytics' | 'export';
  status: 'generating' | 'completed' | 'failed';
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  fileSize?: string;
  downloadUrl?: string;
}

interface ReportDashboardProps {
  spaceId: string;
  reports?: Report[];
  canCreate?: boolean;
}

export function ReportDashboard({ spaceId, reports, canCreate = false }: ReportDashboardProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const defaultReports: Report[] = [
    {
      id: '1',
      title: 'Monthly Activity Summary',
      type: 'summary',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      createdBy: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      fileSize: '2.3 MB',
      downloadUrl: '/reports/monthly-summary.pdf',
    },
    {
      id: '2',
      title: 'Quality Metrics Report',
      type: 'analytics',
      status: 'completed',
      createdAt: new Date('2024-01-10'),
      createdBy: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      fileSize: '1.8 MB',
      downloadUrl: '/reports/quality-metrics.pdf',
    },
    {
      id: '3',
      title: 'Project Progress Report',
      type: 'detailed',
      status: 'generating',
      createdAt: new Date('2024-01-20'),
      createdBy: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    },
    {
      id: '4',
      title: 'Data Export - All Files',
      type: 'export',
      status: 'completed',
      createdAt: new Date('2024-01-18'),
      createdBy: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      fileSize: '45.2 MB',
      downloadUrl: '/reports/data-export.zip',
    },
  ];

  const displayReports = reports || defaultReports;

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'detailed':
        return <BarChart3 className="h-4 w-4" />;
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'summary':
        return 'bg-blue-100 text-blue-800';
      case 'detailed':
        return 'bg-green-100 text-green-800';
      case 'analytics':
        return 'bg-purple-100 text-purple-800';
      case 'export':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (report: Report) => {
    if (report.downloadUrl) {
      // TODO: Implement actual download logic
      console.log('Downloading report:', report.title);
      window.open(report.downloadUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Reports</h3>
        {canCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        )}
      </div>

      {/* Report Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Summary Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayReports.filter(r => r.type === 'summary').length}
            </div>
            <p className="text-xs text-muted-foreground">Quick overview reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Analytics Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayReports.filter(r => r.type === 'analytics').length}
            </div>
            <p className="text-xs text-muted-foreground">Data analysis reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detailed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayReports.filter(r => r.type === 'detailed').length}
            </div>
            <p className="text-xs text-muted-foreground">Comprehensive reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayReports.filter(r => r.type === 'export').length}
            </div>
            <p className="text-xs text-muted-foreground">Raw data exports</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{report.title}</h4>
                      <Badge variant="secondary" className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.createdAt.toLocaleDateString()}</span>
                      </div>
                      <span>by {report.createdBy.name}</span>
                      {report.fileSize && (
                        <span>{report.fileSize}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateReportDialog
        spaceId={spaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedReport && (
        <ReportViewer
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
