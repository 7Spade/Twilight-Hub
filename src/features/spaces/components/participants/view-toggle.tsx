/**
 * @fileoverview 視圖切換組件
 * 支持表格、卡片、列表三種視圖模式
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, Grid3X3, List } from 'lucide-react';
import { ViewMode } from './types';

interface ViewToggleProps {
  viewMode: ViewMode['type'];
  onViewModeChange: (mode: ViewMode['type']) => void;
  className?: string;
}

const VIEW_MODES: ViewMode[] = [
  {
    type: 'table',
    label: '表格視圖',
    icon: 'Table',
  },
  {
    type: 'card',
    label: '卡片視圖',
    icon: 'Grid3X3',
  },
  {
    type: 'list',
    label: '列表視圖',
    icon: 'List',
  },
];

const ICON_MAP = {
  Table,
  Grid3X3,
  List,
} as const;

export function ViewToggle({ viewMode, onViewModeChange, className }: ViewToggleProps) {
  return (
    <div className={className}>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => {
          if (value) {
            onViewModeChange(value as ViewMode['type']);
          }
        }}
        className="border rounded-lg p-1"
      >
        {VIEW_MODES.map((mode) => {
          const IconComponent = ICON_MAP[mode.icon as keyof typeof ICON_MAP];
          
          return (
            <ToggleGroupItem
              key={mode.type}
              value={mode.type}
              className="relative"
              aria-label={mode.label}
            >
              <IconComponent className="h-4 w-4" />
              {viewMode === mode.type && (
                <div className="absolute inset-0 bg-primary/10 rounded-md transition-all duration-200" />
              )}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
