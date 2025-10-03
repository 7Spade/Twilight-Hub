/**
 * @fileoverview 現代化虛擬清單表格組件
 * 使用 @tanstack/react-virtual 實現高性能大量資料渲染
 */

'use client';
// TODO: [P0] FIX Parsing (L106) [低認知][現代化]
// - 問題：Unexpected token（考慮 {'>'} 或 &gt;）
// - 指引：檢查 JSX 中的 '>' 與屬性，必要時以 {'>'} 顯示文字箭頭。

import React, { useMemo, useCallback, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, UserCheck, UserX, Crown, Shield, Users, Eye } from 'lucide-react';
import { VirtualizedTableProps, Participant } from './types';

// 角色?��??��?
const ROLE_ICONS = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
} as const;

// 角色顏色?��?
const ROLE_COLORS = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  member: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

// ?�?��??��?�?
const STATUS_COLORS = {
  active: 'text-green-600',
  inactive: 'text-red-600',
  pending: 'text-yellow-600',
} as const;

interface VirtualizedRowProps {
  participant: Participant;
  currentUserId?: string;
  canManage: boolean;
  isSelected: boolean;
  onSelect: (participantId: string, selected: boolean) => void;
  onAction: (action: string, participantId: string) => void;
  style: React.CSSProperties;
}

const VirtualizedRow = React.memo(function VirtualizedRow({
  participant,
  currentUserId,
  canManage,
  isSelected,
  onSelect,
  onAction,
  style,
}: VirtualizedRowProps) {
  const RoleIcon = ROLE_ICONS[participant.role];
  const isCurrentUser = participant.id === currentUserId;

  const handleSelect = useCallback((checked: boolean) => {
    onSelect(participant.id, checked);
  }, [participant.id, onSelect]);

  const handleAction = useCallback((action: string) => {
    onAction(action, participant.id);
  }, [participant.id, onAction]);

  return (
    <div
      style={style}
      className="flex items-center border-b border-border/50 hover:bg-muted/30 transition-colors animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center w-full px-4 py-3">
        {/* 勾選 */}
        <div className="w-8 mr-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelect}
            disabled={isCurrentUser}
            aria-label={`選取 ${participant.name}`}
          />
        </div>

        {/* 參與者基礎資訊 */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative mr-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="text-sm font-medium">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {participant.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm truncate">{participant.name}</h3>
              {isCurrentUser && (
                // TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 修正破損的關閉標籤 </Badge>
                <Badge variant="outline" className="text-xs">我</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
            {participant.company && (
              <p className="text-xs text-muted-foreground truncate">{participant.company}</p>
            )}
          </div>
        </div>

        {/* 角色與狀態 */}
        <div className="flex items-center gap-3 mr-4">
          <Badge 
            variant="outline" 
            className={`${ROLE_COLORS[participant.role]} text-xs flex items-center gap-1`}
          >
            <RoleIcon className="h-3 w-3" />
            {participant.role === 'member' ? '成員' : participant.role}
          </Badge>
          
          <span className={`text-xs ${STATUS_COLORS[participant.status]}`}>
            {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 補齊未終止字串 */}
            {participant.status === 'active' ? '使用中' : participant.status}
          </span>
        </div>

        {/* 加入日期 */}
        <div className="text-xs text-muted-foreground mr-4">
          {participant.joinedAt.toLocaleDateString('zh-TW')}
        </div>

        {/* 操作 */}
        <div className="w-8">
          {canManage && !isCurrentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction('edit')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  編輯成員
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('role')}>
                  <Shield className="h-4 w-4 mr-2" />
                  變更角色
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleAction('remove')}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  移除成員
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
});

export function VirtualizedTable({
  participants,
  currentUserId,
  canManage,
  actions,
  height = 600,
  itemHeight = 80,
}: VirtualizedTableProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: participants.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  const handleSelect = useCallback((participantId: string, selected: boolean) => {
    setSelectedParticipants(prev => 
      selected 
        ? [...prev, participantId]
        : prev.filter(id => id !== participantId)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const selectableIds = participants
        .filter(p => p.id !== currentUserId)
        .map(p => p.id);
      setSelectedParticipants(selectableIds);
    } else {
      setSelectedParticipants([]);
    }
  }, [participants, currentUserId]);

  const handleAction = useCallback((action: string, participantId: string) => {
    switch (action) {
      case 'edit':
        // TODO: [P2] FEAT src/components/features/spaces/components/participants/virtualized-table.tsx - 實現編輯對話框
        console.log('編輯?�員:', participantId);
        break;
      case 'role':
        // TODO: [P2] FEAT src/components/features/spaces/components/participants/virtualized-table.tsx - 實現角色變更對話框
        console.log('變更角色:', participantId);
        break;
      case 'remove':
        if (confirm('確定要移除此成員嗎？')) {
          actions.onRemove(participantId);
        }
        break;
    }
  }, [actions]);

  const isAllSelected = useMemo(() => {
    const selectableParticipants = participants.filter(p => p.id !== currentUserId);
    return selectableParticipants.length > 0 && 
           selectedParticipants.length === selectableParticipants.length;
  }, [participants, selectedParticipants, currentUserId]);

  const isIndeterminate = useMemo(() => {
    return selectedParticipants.length > 0 && !isAllSelected;
  }, [selectedParticipants.length, isAllSelected]);

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">沒有找到成員</h3>
        <p className="text-sm text-muted-foreground">
          試著調整搜尋條件，或邀請新成員
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 表頭 */}
      <div className="flex items-center border-b border-border pb-3">
        <div className="flex items-center w-full px-4">
          <div className="w-8 mr-3">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onCheckedChange={handleSelectAll}
              {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: aria-label 字串未終止 */}
              aria-label="全選參與者"
            />
          </div>
          
          <div className="flex-1 text-sm font-medium text-muted-foreground">
            ?�員 ({participants.length})
          </div>
          
          <div className="text-sm font-medium text-muted-foreground mr-4">
            角色
          </div>
          
          <div className="text-sm font-medium text-muted-foreground mr-4">
            ?�??
          </div>
          
          <div className="text-sm font-medium text-muted-foreground mr-4">
            ?�入?��?
          </div>
          
          <div className="w-8" />
        </div>
      </div>

      {/* 虛擬清單 */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: `${height}px` }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const participant = participants[virtualItem.index];
            return (
              <VirtualizedRow
                key={participant.id}
                participant={participant}
                currentUserId={currentUserId}
                canManage={canManage}
                isSelected={selectedParticipants.includes(participant.id)}
                onSelect={handleSelect}
                onAction={handleAction}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 批次操作浮層 */}
      {selectedParticipants.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              已選取 {selectedParticipants.length} 位
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedParticipants([])}
            >
              取消全選
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`確�?要移?�選中�? ${selectedParticipants.length} ?��??��?？`)) {
                  actions.onBulkRemove(selectedParticipants);
                  setSelectedParticipants([]);
                }
              }}
            >
              批次移除
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
