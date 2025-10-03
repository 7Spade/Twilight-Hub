/**
 * @fileoverview ?¿æ?å¼å¡?‡ç¶²?¼è??–ç?ä»?
 * ä½¿ç”¨?›æ“¬?–æ?è¡“æ”¯?å¤§?æ•¸?šç?é«˜æ€§èƒ½æ¸²æ?
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

  // è¨ˆç?ç¶²æ ¼ä½ˆå?
  const containerWidth = 800; // ?‡è¨­å®¹å™¨å¯¬åº¦
  const cardWidth = 320; // ?¡ç?å¯¬åº¦
  const cardHeight = 200; // ?¡ç?é«˜åº¦
  const gap = 16; // ?“è?
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
        console.log('ç·¨è¼¯?å“¡:', participantId);
        break;
      case 'role':
        console.log('è®Šæ›´è§’è‰²:', participantId);
        break;
      case 'permissions':
        console.log('ç®¡ç?æ¬Šé?:', participantId);
        break;
      case 'remove':
        if (confirm('ç¢ºå?è¦ç§»?¤æ­¤?å“¡?ï?')) {
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
        <h3 className="text-lg font-medium text-muted-foreground mb-2">æ²’æ??¾åˆ°?å“¡</h3>
        <p className="text-sm text-muted-foreground">
          ?—è©¦èª¿æ•´?œç´¢æ¢ä»¶?–é?è«‹æ–°?å“¡
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ?¸æ??§åˆ¶ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onCheckedChange={handleSelectAll}
            aria-label="?¸æ??€?‰æ???
          />
          <span className="text-sm font-medium">
            ?å“¡ ({participants.length})
          </span>
        </div>

        {selectedParticipants.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              å·²é¸??{selectedParticipants.length} ??
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedParticipants([])}
            >
              ?–æ??¸æ?
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`ç¢ºå?è¦ç§»?¤é¸ä¸­ç? ${selectedParticipants.length} ?‹æ??¡å?ï¼Ÿ`)) {
                  actions.onBulkRemove(selectedParticipants);
                  setSelectedParticipants([]);
                }
              }}
            >
              <UserX className="h-4 w-4 mr-1" />
              ?¹é?ç§»é™¤
            </Button>
          </div>
        )}
      </div>

      {/* ?›æ“¬?–ç¶²??*/}
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
