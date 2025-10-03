// TODO: [P0] FIX src/components/features/spaces/components/issues/issue-list.tsx - 修復語法錯誤（第137行未終止的字串）
// 說明：補齊引號或修正 JSX 文字，確保通過 Lint
'use client';
// TODO: [P0] FIX Parsing (L139) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：關閉引號；若文案不明先以 '--' 站位，稍後再補。

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter } from 'lucide-react';
import { CreateIssueForm } from './create-issue-form';
import { IssueDetails } from './issue-details';
import { useState } from 'react';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'bug' | 'feature' | 'task' | 'question';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  reporter: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
}

interface IssueListProps {
  spaceId: string;
  issues?: Issue[];
  canCreate?: boolean;
}

export function IssueList({ spaceId, issues, canCreate = false }: IssueListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const defaultIssues: Issue[] = [
    {
      id: '1',
      title: 'Authentication flow bug',
      description: 'Users are unable to log in with Google OAuth',
      status: 'open',
      priority: 'high',
      type: 'bug',
      assignee: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      reporter: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      labels: ['authentication', 'oauth'],
    },
    {
      id: '2',
      title: 'Add dark mode support',
      description: 'Implement dark mode theme for better user experience',
      status: 'in_progress',
      priority: 'medium',
      type: 'feature',
      assignee: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      reporter: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      labels: ['ui', 'theme'],
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      status: 'resolved',
      priority: 'low',
      type: 'task',
      assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      reporter: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12'),
      labels: ['documentation'],
    },
  ];

  const displayIssues = issues || defaultIssues;

  const filteredIssues = displayIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Issue['type']) => {
    switch (type) {
      case 'bug':
        return '??';
      case 'feature':
        // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 補齊未終止字串
        return '??';
      case 'task':
        return '??';
      case 'question':
        // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 補齊未終止字串
        return '??';
      default:
        return '??';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Issues</h3>
        {canCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow key={issue.id} className="cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(issue.type)}</span>
                        <span className="font-medium">{issue.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {issue.description}
                      </p>
                      {issue.labels.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {issue.labels.map((label) => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(issue.status)}>
                      {issue.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {(issue.assignee.name || 'U').split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm">{issue.assignee.name || 'Unknown User'}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {issue.createdAt.toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateIssueForm
        spaceId={spaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedIssue && (
        <IssueDetails
          issue={selectedIssue}
          open={!!selectedIssue}
          onOpenChange={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
