// TODO: [P0] FIX src/components/features/spaces/components/participants/card-grid.tsx - 修復語法錯誤（第123行未終止的字串）
// 說明：補齊字串/模板字面量，避免解析錯誤
/**
 * @fileoverview ?��?式卡?�網?��??��?�?
 * 使用?�擬?��?術支?�大?�數?��?高性能渲�?
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ParticipantCard } from './participant-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserX } from 'lucide-react';
import { Participant, ParticipantActions } from './types';

interface CardGridProps {
  participants: readonly Participant[];
  currentUserId?: string;
  canManage: boolean;
  actions: ParticipantActions;
  height?: number;
}

export function CardGrid({
  participants,
  currentUserId,
  canManage,
  actions,
  height = 600,
}: CardGridProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  // 計�?網格佈�?
  const containerWidth = 800; // ?�設容器寬度
  const cardWidth = 320; // ?��?寬度
  const cardHeight = 200; // ?��?高度
  const gap = 16; // ?��?
  const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));

  const virtualizer = useVirtualizer({
    count: Math.ceil(participants.length / cardsPerRow),
    getScrollElement: () => parentRef.current,
    estimateSize: () => cardHeight + gap,
    overscan: 2,
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
        console.log('編輯?�員:', participantId);
        break;
      case 'role':
        console.log('變更角色:', participantId);
        break;
      case 'permissions':
        console.log('管�?權�?:', participantId);
        break;
      case 'remove':
        if (confirm('確�?要移?�此?�員?��?')) {
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
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">沒�??�到?�員</h3>
        <p className="text-sm text-muted-foreground">
          ?�試調整?�索條件?��?請新?�員
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ?��??�制 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onCheckedChange={handleSelectAll}
            aria-label="?��??�?��???
          />
          <span className="text-sm font-medium">
            ?�員 ({participants.length})
          </span>
        </div>

        {selectedParticipants.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              已選??{selectedParticipants.length} ??
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedParticipants([])}
            >
              ?��??��?
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
              <UserX className="h-4 w-4 mr-1" />
              ?��?移除
            </Button>
          </div>
        )}
      </div>

      {/* ?�擬?�網??*/}
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
            const rowIndex = virtualItem.index;
            const startIndex = rowIndex * cardsPerRow;
            const endIndex = Math.min(startIndex + cardsPerRow, participants.length);
            const rowParticipants = participants.slice(startIndex, endIndex);

            return (
              <div
                key={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
              >
                  <div className="flex gap-4 px-4">
                    {rowParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        style={{ width: `${cardWidth}px` }}
                      >
                        <ParticipantCard
                          participant={participant}
                          currentUserId={currentUserId}
                          canManage={canManage}
                          isSelected={selectedParticipants.includes(participant.id)}
                          onSelect={handleSelect}
                          onAction={handleAction}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
