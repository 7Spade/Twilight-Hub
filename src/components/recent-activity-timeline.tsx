/**
 * @fileoverview A component that displays a vertical timeline of recent user activities.
 * Each activity has an associated icon, a descriptive text, and a relative timestamp.
 * Currently, it uses static placeholder data for demonstration purposes.
 */

'use client';

import { formatDistanceToNow } from 'date-fns';
import { PlusCircle, Star, UserPlus, GitCommit, GitFork, GitPullRequest, MessageSquare, Code } from 'lucide-react';
import React from 'react';

const iconMap: { [key: string]: React.ElementType } = {
  'create_space': PlusCircle,
  'star_space': Star,
  'follow_user': UserPlus,
  'commit': GitCommit,
  'fork': GitFork,
  'pull_request': GitPullRequest,
  'comment': MessageSquare,
  'default': Code
};

// Placeholder data - in a real app, this would come from a Firestore query
const activities = [
  { id: '1', type: 'create_space', text: 'created a new space', target: 'Project Phoenix', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: '2', type: 'commit', text: 'pushed a commit to', target: 'main', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { id: '3', type: 'star_space', text: 'starred a space', target: 'Community Hub', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
  { id: '4', type: 'follow_user', text: 'started following', target: 'Alice', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: '5', type: 'pull_request', text: 'opened a pull request in', target: 'frontend-docs', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
];


export function RecentActivityTimeline() {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-border" />
      
      <div className="space-y-8">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type] || iconMap.default;
          return (
            <div key={activity.id} className="relative flex items-start gap-4">
              {/* Dot on the timeline */}
              <div className="absolute left-[-25px] top-1 flex h-2 w-2 items-center justify-center">
                <span className="h-full w-full rounded-full bg-primary" />
              </div>
              
              <div className="flex-shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <p className="text-sm text-foreground">
                  You {activity.text}{' '}
                  <span className="font-semibold text-primary">{activity.target}</span>.
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
