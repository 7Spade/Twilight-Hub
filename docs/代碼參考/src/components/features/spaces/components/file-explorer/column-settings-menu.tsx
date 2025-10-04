/**
 * @fileoverview A dropdown menu for managing table column visibility in the file explorer.
 * It allows users to show or hide specific columns in the file table, search for
 * specific properties, and reset the column configuration to its default state.
 */
'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  Search,
  RotateCcw
} from 'lucide-react';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface ColumnSettingsMenuProps {
  columns: ColumnConfig[];
  onColumnToggle: (columnId: string, visible: boolean) => void;
  onReset: () => void;
  onPropertySettings: () => void;
}

export function ColumnSettingsMenu({ 
  columns, 
  onColumnToggle, 
  onReset, 
  onPropertySettings 
}: ColumnSettingsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColumns = columns.filter(column =>
    column.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/50"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* 搜索欄 */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索屬性"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8"
            />
          </div>
        </div>

        {/* 列設定選項 */}
        <div className="max-h-64 overflow-y-auto">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer"
              onClick={() => onColumnToggle(column.id, !column.visible)}
            >
              <Checkbox
                checked={column.visible}
                onChange={() => onColumnToggle(column.id, !column.visible)}
              />
              <span className="text-sm">{column.label}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* 操作按鈕 */}
        <div className="p-2 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPropertySettings}
            className="w-full justify-start text-sm"
          >
            <Settings className="mr-2 h-4 w-4" />
            屬性設定
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-full justify-start text-sm"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            重置為預設
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}