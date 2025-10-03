'use client';
// TODO: [P0] FIX Parsing (L82) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：補上結尾引號；若文案未定以 '--' 站位。

import { memo, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ParticipantTableProps, ParticipantPermissions } from './types';

// Memoized table row component for performance
const ParticipantRow = memo(function ParticipantRow({
  participant,
  currentUserId,
  canManage,
  onUpdatePermissions,
  onUpdateRole,
  onRemove,
}: {
  participant: ParticipantTableProps['participants'][0];
  currentUserId?: string;
  canManage: boolean;
  onUpdatePermissions: (participantId: string, permission: keyof ParticipantPermissions, value: boolean) => void;
  onUpdateRole: (participantId: string) => void;
  onRemove: (participantId: string) => void;
}) {
  const handlePermissionChange = useCallback((permission: keyof ParticipantPermissions, value: boolean) => {
    onUpdatePermissions(participant.id, permission, value);
  }, [participant.id, onUpdatePermissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRoleColor = (role: string) => {
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

  const isCurrentUser = participant.id === currentUserId;

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="text-xs">
              {participant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{participant.name}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{participant.email}</TableCell>
      <TableCell>{participant.phone || '-'}</TableCell>
      <TableCell>
        <span className={getStatusColor(participant.status)}>
          {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 補齊未終止字串 */}
          {participant.status === 'active' ? '使用中' : participant.status}
        </span>
      </TableCell>
      <TableCell>{participant.company || '-'}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={getRoleColor(participant.role)}>
          {participant.role === 'member' ? '專案成員' : participant.role}
        </Badge>
      </TableCell>
      <TableCell>{participant.accessLevel}</TableCell>
      <TableCell>{participant.joinedAt.toLocaleDateString('zh-TW')}</TableCell>
      
      {/* Permission switches */}
      {Object.entries(participant.permissions).map(([permission, enabled]) => (
        <TableCell key={permission}>
          <Switch
            checked={enabled}
            onCheckedChange={(value) => handlePermissionChange(permission as keyof ParticipantPermissions, value)}
            disabled={isCurrentUser}
            aria-label={`Toggle ${permission} permission`}
          />
        </TableCell>
      ))}
      
      <TableCell>
        {canManage && !isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Participant actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdateRole(participant.id)}>
                編輯成員
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateRole(participant.id)}>
                變更角色
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onRemove(participant.id)}
              >
                移除成員
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
});

export function ParticipantTable({ participants, currentUserId, canManage, actions }: ParticipantTableProps) {
  const handleUpdatePermissions = useCallback((participantId: string, permission: keyof ParticipantPermissions, value: boolean) => {
    actions.onUpdatePermissions(participantId, { [permission]: value });
  }, [actions]);

  const handleUpdateRole = useCallback((participantId: string) => {
    // TODO: [P2] FEAT src/components/features/spaces/components/participants/participant-table.tsx - 打開角色更新對話框
    console.log('Update role for participant:', participantId);
    // @assignee dev
  }, []);

  const handleRemove = useCallback((participantId: string) => {
    if (confirm('確定要移除此成員嗎？')) {
      actions.onRemove(participantId);
    }
  }, [actions]);

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        沒有找到成員
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer">名稱</TableHead>
            <TableHead className="cursor-pointer">電子郵件</TableHead>
            <TableHead className="cursor-pointer">電話</TableHead>
            {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 修正破損標籤，補齊 </TableHead> */}
            <TableHead className="cursor-pointer">狀態</TableHead>
            <TableHead className="cursor-pointer">公司</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>存取層級</TableHead>
            <TableHead className="cursor-pointer">加入日期</TableHead>
            <TableHead>Docs</TableHead>
            <TableHead>Design Collaboration</TableHead>
            <TableHead>Model Coordination</TableHead>
            <TableHead>Takeoff</TableHead>
            <TableHead>AutoSpecs</TableHead>
            <TableHead>Build</TableHead>
            <TableHead>Cost Management</TableHead>
            <TableHead>Insight</TableHead>
            <TableHead>Forma</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              currentUserId={currentUserId}
              canManage={canManage}
              onUpdatePermissions={handleUpdatePermissions}
              onUpdateRole={handleUpdateRole}
              onRemove={handleRemove}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
