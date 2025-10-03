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
        {/* ä¸Šå‚³?‰é? - ?¹é? Autodesk è¨­è? */}
        <div className="flex">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-none px-4 py-2 h-9"
            onClick={handleFileSelect}
          >
            <Upload className="h-4 w-4 mr-2" />
            ä¸Šè?æª”æ?
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
                ä¸Šè?æª”æ?
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFileSelect}>
                ä¸Šå‚³????„æ?æ¡?
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* ?´å??¸é??‰é? */}
        <Button 
          variant="outline" 
          size="icon"
          onClick={onMoreOptions}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {/* ç¯©é¸?‰é? - ?¹é? Autodesk è¨­è? */}
        <Button 
          variant={isFilterActive ? "default" : "outline"}
          onClick={onFilter}
        >
          <Filter className="h-4 w-4 mr-2" />
          ?œå??Œç¯©??
        </Button>


        {/* ?±è??„æ?ä»¶è¼¸??*/}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            // ?•ç??‡ä»¶ä¸Šå‚³?è¼¯
            console.log('Files selected:', e.target.files);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* ?¯å‡º?‰é? - ?¹é? Autodesk è¨­è? */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ?¯å‡º
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('æª”æ?è¨˜é?')}>
              æª”æ?è¨˜é?
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('è³‡æ?å¤¾æ???)}>
              è³‡æ?å¤¾æ???
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              ?¯å‡º??Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              ?¯å‡º??CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              ?¯å‡º??PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* è¦–å??‡æ??‰é? */}
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
