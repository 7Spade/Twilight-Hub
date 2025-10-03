'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// TODO: [P2] REFACTOR src/components/features/spaces/components/quality/checklist.tsx:4 - 清理未使用的導入
// 問題：'Button' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface ChecklistProps {
  spaceId: string;
  checklistItems?: ChecklistItem[];
  canEdit?: boolean;
}

export function Checklist({ spaceId: _spaceId, checklistItems, canEdit = false }: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(
    checklistItems || [
      {
        id: '1',
        title: 'Code Review',
        description: 'Review all code changes for quality and standards',
        status: 'completed',
        assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
        dueDate: new Date('2024-01-20'),
        priority: 'high',
        category: 'Development',
      },
      {
        id: '2',
        title: 'Unit Tests',
        description: 'Ensure all new code has adequate test coverage',
        status: 'in_progress',
        assignee: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
        dueDate: new Date('2024-01-22'),
        priority: 'high',
        category: 'Testing',
      },
      {
        id: '3',
        title: 'Documentation Update',
        description: 'Update API documentation with new endpoints',
        status: 'pending',
        assignee: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
        dueDate: new Date('2024-01-25'),
        priority: 'medium',
        category: 'Documentation',
      },
      {
        id: '4',
        title: 'Security Audit',
        description: 'Perform security review of authentication flow',
        status: 'pending',
        dueDate: new Date('2024-01-28'),
        priority: 'high',
        category: 'Security',
      },
    ]
  );

  const handleItemStatusChange = (itemId: string, newStatus: ChecklistItem['status']) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
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

  const completedCount = items.filter(item => item.status === 'completed').length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Checklist Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{completedCount} Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{items.filter(i => i.status === 'in_progress').length} In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle className="h-4 w-4 text-gray-400" />
                <span>{items.filter(i => i.status === 'pending').length} Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      {canEdit ? (
                        <Checkbox
                          checked={item.status === 'completed'}
                          onCheckedChange={(checked) => 
                            handleItemStatusChange(item.id, checked ? 'completed' : 'pending')
                          }
                        />
                      ) : (
                        getStatusIcon(item.status)
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="secondary" className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {item.assignee && (
                          <span>Assigned to {item.assignee.name}</span>
                        )}
                        {item.dueDate && (
                          <span>Due {item.dueDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < categoryItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
