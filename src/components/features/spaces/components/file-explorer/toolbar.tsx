/**
 * @fileoverview The main toolbar for the file explorer.
 * It contains primary actions like upload, move, and export, as well as controls
 * for searching, changing the view layout (grid/list), and accessing filters and
 * deleted items.
 */
'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  onUpload, 
  onMoreOptions, 
  onExport, 
  onSearch, 
  onViewChange,
  onFilter,
  onDeletedItems,
  currentView, 
  selectedCount,
  isFilterActive = false
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {/* 上傳按鈕 - 匹配 Autodesk 設計 */}
        <div className="flex">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-none px-4 py-2 h-9"
            onClick={handleFileSelect}
          >
            <Upload className="h-4 w-4 mr-2" />
            上載檔案
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
              <DropdownMenuItem onClick={handleFileSelect}>
                上載檔案
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFileSelect}>
                上傳連結的檔案
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* 更多選項按鈕 */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={onMoreOptions}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {/* 篩選按鈕 - 匹配 Autodesk 設計 */}
        <Button 
          variant={isFilterActive ? "default" : "outline"}
          onClick={onFilter}
        >
          <Filter className="h-4 w-4 mr-2" />
          搜尋和篩選
        </Button>


        {/* 隱藏的文件輸入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            // 處理文件上傳邏輯
            console.log('Files selected:', e.target.files);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* 匯出按鈕 - 匹配 Autodesk 設計 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              匯出
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('檔案記錄')}>
              檔案記錄
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('資料夾權限')}>
              資料夾權限
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


        {/* 視圖切換按鈕 */}
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
