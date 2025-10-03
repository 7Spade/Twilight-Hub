'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Mail, Shield, UserMinus } from 'lucide-react';
import { InviteParticipantDialog } from './invite-participant-dialog';
import { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  lastActive?: Date;
  status: 'active' | 'inactive' | 'pending';
}

interface ParticipantListProps {
  spaceId: string;
  participants?: Participant[];
  currentUserId?: string;
  canManage?: boolean;
}

export function ParticipantList({ spaceId, participants, currentUserId, canManage = false }: ParticipantListProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const defaultParticipants: Participant[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatars/john.jpg',
      role: 'owner',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/avatars/jane.jpg',
      role: 'admin',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'member',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'active',
    },
  ];

  const displayParticipants = participants || defaultParticipants;

  const getRoleColor = (role: Participant['role']) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Participants</h3>
        {canManage && (
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayParticipants.map((participant) => (
          <Card key={participant.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{participant.name}</p>
                      <Badge variant="secondary" className={getRoleColor(participant.role)}>
                        {participant.role}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(participant.status)}>
                        {participant.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {participant.joinedAt.toLocaleDateString()}
                      {participant.lastActive && (
                        <span> • Last active {participant.lastActive.toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
                {canManage && participant.id !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InviteParticipantDialog
        spaceId={spaceId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}
