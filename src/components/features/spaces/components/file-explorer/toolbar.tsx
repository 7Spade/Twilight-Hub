// TODO: [P0] FIX src/components/features/spaces/components/file-explorer/toolbar.tsx - 修復語法錯誤（第138行未終止的字串）
// 說明：修正字串與 JSX 構造，確保可編譯
/**
 * @fileoverview The main toolbar for the file explorer.
 * It contains primary actions like upload, move, and export, as well as controls
 * for searching, changing the view layout (grid/list), and accessing filters and
 * deleted items.
 */
'use client';
// TODO: [P0] FIX Parsing (L141) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：補上引號或改為模板字串；避免在字串中混入未轉義的特殊符號。

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TODO: [P2] REFACTOR src/components/features/spaces/components/file-explorer/toolbar.tsx:13 - 清理未使用的導入
// 問題：'Input' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Upload,
  MoreVertical,
  Grid3X3,
  List,
  Download,
  ChevronDown,
  Filter
} from 'lucide-react';

interface ToolbarProps {
  onUpload: () => void;
  onMoreOptions: () => void;
  onExport: () => void;
  onSearch: (query: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onFilter: () => void;
  onDeletedItems: () => void;
  currentView: 'grid' | 'list';
  selectedCount: number;
  isFilterActive?: boolean;
}

export function Toolbar({ 
  onUpload: _onUpload, 
  onMoreOptions, 
  onExport, 
  onSearch: _onSearch, 
  onViewChange, 
  onFilter, 
  onDeletedItems: _onDeletedItems, 
  currentView, 
  selectedCount: _selectedCount, 
  isFilterActive = false 
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {/* 上傳?��? - ?��? Autodesk 設�? */}
        <div className="flex">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-none px-4 py-2 h-9"
            onClick={handleFileSelect}
          >
            <Upload className="h-4 w-4 mr-2" />
            上傳檔案
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-l-none border-l border-blue-500 px-2 py-2 h-9"
                size="icon"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleFileSelect}>上傳檔案</DropdownMenuItem>
              <DropdownMenuItem onClick={handleFileSelect}>上傳資料夾</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* ?��??��??��? */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={onMoreOptions}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {/* 篩選按鈕 */}
        <Button 
          variant={isFilterActive ? "default" : "outline"}
          onClick={onFilter}
        >
          <Filter className="h-4 w-4 mr-2" />
          進階篩選
        </Button>


        {/* ?��??��?件輸??*/}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            // ?��??�件上傳?�輯
            console.log('Files selected:', e.target.files);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* ?�出?��? - ?��? Autodesk 設�? */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              匯出
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('檔案紀錄')}>
              檔案紀錄
            </DropdownMenuItem>
            {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 此行存在未終止字串，請補齊引號或拆分字串，僅修正字面量 */}
            {/* TODO[P2][lint][parser-error]: 關閉 onClick 內的字串引號，避免 Unterminated string literal */}
            <DropdownMenuItem onClick={() => console.log('資料夾匯出')}>
              資料夾匯出
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              匯出為 Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              匯出為 CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              匯出為 PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* 視�??��??��? */}
        <div className="flex items-center border rounded-md">
          <Button
            variant={currentView === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
