'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
/* TODO: [P2] [CLEANUP] [UI] [TODO] 清理未使用的導入 - Button 未使用 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  type: 'comment' | 'approval' | 'rejection';
}

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

interface AcceptanceItemProps {
  item: AcceptanceItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments?: Comment[];
}

export function AcceptanceItem({ item, open, onOpenChange, comments }: AcceptanceItemProps) {
  const defaultComments: Comment[] = [
    {
      id: '1',
      content: 'The implementation looks good overall. I have a few minor suggestions for improvement.',
      author: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'comment',
    },
    {
      id: '2',
      content: 'I\'ve addressed the feedback and made the requested changes.',
      author: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      type: 'comment',
    },
    {
      id: '3',
      content: 'Approved! Great work on this feature.',
      author: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      type: 'approval',
    },
  ];

  const displayComments = comments || defaultComments;

  const getStatusIcon = (status: AcceptanceItem['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_review':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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

  const getCommentTypeIcon = (type: Comment['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejection':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(item.status)}
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Item Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Requested by {item.requester.name}</span>
                  {item.assignee && (
                    <span>Assigned to {item.assignee.name}</span>
                  )}
                  <span>Created {formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{item.description}</p>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-3" />
                  {item.dueDate && (
                    <p className="text-sm text-muted-foreground">
                      Due date: {item.dueDate.toLocaleDateString()}
                    </p>
                  )}
                  {item.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      Completed: {item.completedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({displayComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayComments.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            {getCommentTypeIcon(comment.type)}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                      {index < displayComments.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
