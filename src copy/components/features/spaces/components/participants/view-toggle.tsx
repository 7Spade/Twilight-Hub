/**
 * @fileoverview 視圖切換組件
 * 支援表格、卡片、列表三種視圖模式
 */

'use client';

import React from 'react';

// TODO: 清理未使用的導入
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
            // TODO: [P2] VAN - 現代化類型斷言，使用更安全的類型守衛
            // 問題：value as ViewMode['type'] 使用類型斷言，可能存在類型不安全
            // 解決方案：使用類型守衛函數驗證 value 是否為有效的 ViewMode['type']
            // 現代化建議：const isValidViewMode = (val: string): val is ViewMode['type'] => VIEW_MODES.some(m => m.type === val)
            // 效能影響：無，但提升類型安全性和運行時安全性
            // 相關受影響檔案：無（內部重構，不影響外部接口）
            onViewModeChange(value as ViewMode['type']);
          }
        }}
        className="border rounded-lg p-1"
      >
        {VIEW_MODES.map((mode) => {
          // TODO: [P2] VAN - 現代化類型斷言，使用更安全的鍵值訪問
          // 問題：mode.icon as keyof typeof ICON_MAP 使用類型斷言，可能存在鍵值不存在的情況
          // 解決方案：使用 Object.hasOwn() 或 in 運算符驗證鍵值存在
          // 現代化建議：const IconComponent = Object.hasOwn(ICON_MAP, mode.icon) ? ICON_MAP[mode.icon] : DefaultIcon
          // 效能影響：無，但提升類型安全性和運行時安全性
          // 相關受影響檔案：無（內部重構，不影響外部接口）
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
