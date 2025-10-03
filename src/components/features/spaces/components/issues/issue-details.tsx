// TODO: [P0] FIX src/components/features/spaces/components/issues/issue-details.tsx - 修復語法錯誤（第106行未終止的字串）
// 說明：修正字串或模板字面量，避免 Lint 解析錯誤
'use client';
// TODO: [P0] FIX Parsing (L109) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：補齊字串引號或替換為 '--' 站位，避免註解與程式碼同一行。

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock, User } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

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

interface IssueDetailsProps {
  issue: Issue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments?: Comment[];
}

export function IssueDetails({ issue, open, onOpenChange, comments }: IssueDetailsProps) {
  const defaultComments: Comment[] = [
    {
      id: '1',
      content: 'I can reproduce this issue. It happens when users try to log in with Google OAuth.',
      author: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '2',
      content: 'I\'ve identified the issue in the OAuth callback handler. Working on a fix.',
      author: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  const displayComments = comments || defaultComments;

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
        // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 未終止字串；請補齊引號
        return '??;
      case 'task':
        return '??';
      case 'question':
        // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 未終止字串；請補齊引號
        return '??;
      default:
        return '??';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getTypeIcon(issue.type)}</span>
            {issue.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Issue Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                    {issue.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Reported by {issue.reporter.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Labels */}
            {issue.labels.length > 0 && (
              <div className="flex gap-2">
                {issue.labels.map((label) => (
                  <Badge key={label} variant="outline">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{issue.description}</p>
              </CardContent>
            </Card>

            {/* Assignee */}
            {issue.assignee && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={issue.assignee.avatar} />
                      <AvatarFallback>
                        {issue.assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{issue.assignee.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}

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
