'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { InitiateAcceptanceFlow } from './initiate-acceptance-flow';
import { AcceptanceItem } from './acceptance-item';
import { useState } from 'react';

interface AcceptanceItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  requester: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  progress: number;
  comments: number;
}

interface AcceptanceListProps {
  spaceId: string;
  acceptanceItems?: AcceptanceItem[];
  canCreate?: boolean;
}

export function AcceptanceList({ spaceId, acceptanceItems, canCreate = false }: AcceptanceListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AcceptanceItem | null>(null);

  const defaultItems: AcceptanceItem[] = [
    {
      id: '1',
      title: 'Feature: User Authentication',
      description: 'Complete user authentication system with OAuth integration',
      status: 'approved',
      priority: 'high',
      assignee: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      requester: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      createdAt: new Date('2024-01-10'),
      dueDate: new Date('2024-01-25'),
      completedAt: new Date('2024-01-20'),
      progress: 100,
      comments: 3,
    },
    {
      id: '2',
      title: 'Bug Fix: Payment Processing',
      description: 'Fix payment processing issue in checkout flow',
      status: 'in_review',
      priority: 'high',
      assignee: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      requester: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-30'),
      progress: 75,
      comments: 5,
    },
    {
      id: '3',
      title: 'Enhancement: Dashboard UI',
      description: 'Improve dashboard user interface and user experience',
      status: 'pending',
      priority: 'medium',
      assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      requester: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      createdAt: new Date('2024-01-18'),
      dueDate: new Date('2024-02-05'),
      progress: 25,
      comments: 2,
    },
  ];

  const displayItems = acceptanceItems || defaultItems;

  const getStatusIcon = (status: AcceptanceItem['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_review':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AcceptanceItem['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: AcceptanceItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: displayItems.length,
    completed: displayItems.filter(item => item.status === 'completed' || item.status === 'approved').length,
    inReview: displayItems.filter(item => item.status === 'in_review').length,
    pending: displayItems.filter(item => item.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Acceptance Items</h3>
        {canCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Acceptance Item
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All acceptance items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Approved & completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>
      </div>

      {/* Acceptance Items List */}
      <div className="space-y-4">
        {displayItems.map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6" onClick={() => setSelectedItem(item)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant="secondary" className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Requested by {item.requester.name}</span>
                    {item.assignee && (
                      <span>Assigned to {item.assignee.name}</span>
                    )}
                    <span>{item.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Created {item.createdAt.toLocaleDateString()}</span>
                    {item.dueDate && (
                      <span>Due {item.dueDate.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InitiateAcceptanceFlow
        spaceId={spaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedItem && (
        <AcceptanceItem
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
