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
  Move,
  MoreVertical,
  Search,
  Grid3X3,
  List,
  Download,
  ChevronDown
} from 'lucide-react';

interface ToolbarProps {
  onUpload: () => void;
  onMove: () => void;
  onMoreOptions: () => void;
  onExport: () => void;
  onSearch: (query: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  selectedCount: number;
}

export function Toolbar({ 
  onUpload, 
  onMove, 
  onMoreOptions, 
  onExport, 
  onSearch, 
  onViewChange, 
  currentView,
  selectedCount 
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        {/* 上傳按鈕 - 圖1：主按鈕 + 下拉箭頭 */}
        <div className="flex">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 rounded-r-none"
            onClick={handleFileSelect}
          >
            <Upload className="h-4 w-4 mr-2" />
            上載檔案
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 rounded-l-none border-l border-blue-500"
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

        {/* 移動按鈕 */}
        <Button 
          variant="outline" 
          onClick={onMove}
          disabled={selectedCount === 0}
        >
          <Move className="h-4 w-4 mr-2" />
          移動
        </Button>

        {/* 更多選項按鈕 */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={onMoreOptions}
        >
          <MoreVertical className="h-4 w-4" />
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

      <div className="flex items-center gap-2">
        {/* 匯出按鈕 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              匯出
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋和篩選"
            className="pl-10 w-64"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

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
