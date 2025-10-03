'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'file_upload' | 'file_update' | 'member_join' | 'issue_created' | 'comment_added';
  user: {
    name: string;
    avatar?: string;
  };
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>; /* TODO: [P2] [BUG] [UI] [TODO] 修復 TypeScript any 類型警告 */
}

interface RecentActivityProps {
  spaceId: string;
  activities?: ActivityItem[];
}

export function RecentActivity({ spaceId, activities }: RecentActivityProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'file_upload',
      user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
      description: 'uploaded a new file',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      metadata: { fileName: 'project-spec.pdf' },
    },
    {
      id: '2',
      type: 'member_join',
      user: { name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      description: 'joined the space',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      type: 'issue_created',
      user: { name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      description: 'created a new issue',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      metadata: { issueTitle: 'Bug in authentication flow' },
    },
  ];

  const displayActivities = activities || defaultActivities;

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'file_upload':
      case 'file_update':
        return '??';
      case 'member_join':
        return '?��';
      case 'issue_created':
        return '??';
      case 'comment_added':
        return '?��';
      default:
        return '??';
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'file_upload':
      case 'file_update':
        return 'bg-blue-100 text-blue-800';
      case 'member_join':
        return 'bg-green-100 text-green-800';
      case 'issue_created':
        return 'bg-red-100 text-red-800';
      case 'comment_added':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{activity.user.name}</span>
                <Badge variant="secondary" className={`text-xs ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)} {activity.type.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.description}
                {activity.metadata?.fileName && (
                  <span className="font-medium ml-1">"{activity.metadata.fileName}"</span>
                )}
                {activity.metadata?.issueTitle && (
                  <span className="font-medium ml-1">"{activity.metadata.issueTitle}"</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
