'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// TODO: [P2] REFACTOR src/components/features/spaces/components/report/report-viewer.tsx:3 - 清理未使用的導入
// 問題：'Avatar', 'AvatarFallback', 'AvatarImage' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, Calendar, User, FileText, BarChart3 } from 'lucide-react';

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

interface ReportViewerProps {
  report: Report;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportViewer({ report, open, onOpenChange }: ReportViewerProps) {
  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'summary':
        return <FileText className="h-5 w-5" />;
      case 'detailed':
        return <BarChart3 className="h-5 w-5" />;
      case 'analytics':
        return <BarChart3 className="h-5 w-5" />;
      case 'export':
        return <Download className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
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

  const handleDownload = () => {
    if (report.downloadUrl) {
      // TODO: [P2] FEAT src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
      console.log('Downloading report:', report.title);
      // @assignee dev
      window.open(report.downloadUrl, '_blank');
    }
  };

  // Mock report content based on type
  const getReportContent = () => {
    switch (report.type) {
      case 'summary':
        return {
          sections: [
            {
              title: 'Overview',
              content: 'This report provides a comprehensive overview of the space activities and metrics for the selected period.',
            },
            {
              title: 'Key Metrics',
              content: 'Total files: 156\nActive members: 12\nIssues resolved: 8\nQuality score: 85%',
            },
            {
              title: 'Recent Activity',
              content: 'The space has been very active with regular contributions from team members. Code reviews and quality checks are being performed consistently.',
            },
          ],
        };
      case 'analytics':
        return {
          sections: [
            {
              title: 'Data Analysis',
              content: 'Detailed analysis of space metrics and trends over time.',
            },
            {
              title: 'Performance Metrics',
              content: 'Response time: 245ms\nUptime: 99.8%\nError rate: 0.2%\nUser satisfaction: 4.2/5',
            },
            {
              title: 'Trends',
              content: 'Positive trends observed in code quality and team collaboration metrics.',
            },
          ],
        };
      case 'detailed':
        return {
          sections: [
            {
              title: 'Executive Summary',
              content: 'Comprehensive report covering all aspects of the space including development progress, quality metrics, and team performance.',
            },
            {
              title: 'Development Progress',
              content: 'All major milestones have been met on schedule. Code quality standards are being maintained.',
            },
            {
              title: 'Quality Assurance',
              content: 'Regular quality checks are in place. All critical issues have been resolved.',
            },
          ],
        };
      case 'export':
        return {
          sections: [
            {
              title: 'Export Information',
              content: 'This export contains all data from the space including files, metadata, and activity logs.',
            },
            {
              title: 'Contents',
              content: 'Files: 156 items\nMetadata: Complete\nActivity logs: Full history\nSize: 45.2 MB',
            },
            {
              title: 'Format',
              content: 'ZIP archive containing structured data files in JSON format.',
            },
          ],
        };
      default:
        return { sections: [] };
    }
  };

  const reportContent = getReportContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(report.type)}
            {report.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTypeColor(report.type)}>
                    {report.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {report.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>by {report.createdBy.name}</span>
                  </div>
                  {report.fileSize && (
                    <span>Size: {report.fileSize}</span>
                  )}
                </div>
              </div>
              {report.status === 'completed' && report.downloadUrl && (
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            <Separator />

            {/* Report Content */}
            {report.status === 'completed' ? (
              <div className="space-y-6">
                {reportContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium mb-3">{section.title}</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {section.content}
                      </p>
                    </div>
                    {index < reportContent.sections.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            ) : report.status === 'generating' ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating report...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This may take a few minutes depending on the data size.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">?��?</div>
                <p className="text-muted-foreground">Report generation failed</p>
                <p className="text-sm text-muted-foreground mt-2">
                  There was an error generating this report. Please try again.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
