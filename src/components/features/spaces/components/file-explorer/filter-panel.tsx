// TODO: [P0] FIX src/components/features/spaces/components/file-explorer/filter-panel.tsx - 修復語法錯誤（第141行 Unexpected token）
// 說明：檢查 JSX 標籤與大於號轉義，修正不合法符號
/**
 * @fileoverview A slide-out panel for filtering files and folders in the explorer.
 * It provides a rich set of filtering options, including keyword search, scope
 * selection, file type, status, and date ranges. It allows users to apply these
 * filters or save them for later use.
 */
'use client';
// TODO[P2][lint][parser-error]: 第143行 Unexpected token，可能為 JSX 標籤未正確關閉或需要使用 {'>'}。
// - 檢查破損的 h4/Label/Select 標籤關閉，修正 `</...>`。
// - 檢查 SelectValue placeholder 字串是否缺少結尾引號。
// - 僅做語法修正，維持現有 UI/行為。

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Settings, 
  Save, 
  X,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export interface FilterOptions {
  searchQuery: string;
  searchScope: 'current' | 'all';
  includeSubfolders: boolean;
  includeContent: boolean;
  type?: string;
  fileType?: string;
  fileStatus?: string;
  currentVersion?: string;
  lastUpdated?: {
    startDate?: Date;
    endDate?: Date;
  };
  updater?: string;
  versionContributor?: string;
  reviewStatus?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  onSave: (filters: FilterOptions, name: string) => void;
  initialFilters?: FilterOptions;
}

export function FilterPanel({ 
  isOpen, 
  onClose, 
  onApply, 
  onSave, 
  initialFilters 
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {
    searchQuery: '',
    searchScope: 'current',
    includeSubfolders: true,
    includeContent: true,
  });

  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleSave = () => {
    if (saveSearchName.trim()) {
      onSave(filters, saveSearchName.trim());
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleClear = () => {
    setFilters({
      searchQuery: '',
      searchScope: 'current',
      includeSubfolders: true,
      includeContent: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-40">
      <div className="h-full flex flex-col">
        {/* 標�?�?- ?��? Autodesk 設�? */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">?��?</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 標籤??*/}
        <div className="flex border-b">
          <button className="flex-1 py-2 px-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
            ?��?
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
            ?��??��?�?
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* ?��?�?*/}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="?��?"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* ?��??�篩?�設�?- ?��? Autodesk 設�? */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* TODO[P2][lint][parser-error][低認知]: 修正關閉標籤，避免 Unexpected token */}
              <h4 className="text-sm font-medium">?��??�篩?�設�? </h4>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* ?��?範�? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?��?範�?</Label>
              <RadioGroup
                value={filters.searchScope}
                onValueChange={(value) => handleFilterChange('searchScope', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="text-sm">?��?資�?�?/Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm">?�?��??�夾</Label>
                </div>
              </RadioGroup>
            </div>

            {/* ?��??��? */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subfolders"
                  checked={filters.includeSubfolders}
                  onCheckedChange={(checked) => handleFilterChange('includeSubfolders', checked)}
                />
                <Label htmlFor="subfolders" className="text-sm">子�??�夾</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="content"
                  checked={filters.includeContent}
                  onCheckedChange={(checked) => handleFilterChange('includeContent', checked)}
                />
                <Label htmlFor="content" className="text-sm">?�容</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* 篩選條件 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">篩選</h4>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 類�? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">類�?</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  {/* TODO[P2][lint][parser-error]: 關閉 placeholder 字串與 JSX 標籤 */}
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">檔�?</SelectItem>
                  {/* TODO[P2][lint][parser-error]: 修正破損關閉標籤 */}
                  <SelectItem value="folder">資�?�?</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 檔�?類�? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">檔�?類�?</Label>
              <Select value={filters.fileType} onValueChange={(value) => handleFilterChange('fileType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="dwg">DWG</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="image">?��?</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 檔�??�??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">檔�??�??/Label>
              <Select value={filters.fileStatus} onValueChange={(value) => handleFilterChange('fileStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">?�用</SelectItem>
                  <SelectItem value="archived">已�?�?/SelectItem>
                  <SelectItem value="deleted">已刪??/SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ?��??�本 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?��??�本</Label>
              <Select value={filters.currentVersion} onValueChange={(value) => handleFilterChange('currentVersion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">?�?��??</SelectItem>
                  <SelectItem value="draft">?�稿</SelectItem>
                  <SelectItem value="review">審閱�?/SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 上次?�新 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">上次?�新</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastUpdated?.startDate ? 
                        format(filters.lastUpdated.startDate, 'yyyy/MM/dd', { locale: zhTW }) : 
                        '?��??��?'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.lastUpdated?.startDate}
                      onSelect={(date) => handleFilterChange('lastUpdated', { 
                        ...filters.lastUpdated, 
                        startDate: date 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastUpdated?.endDate ? 
                        format(filters.lastUpdated.endDate, 'yyyy/MM/dd', { locale: zhTW }) : 
                        '結�??��?'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.lastUpdated?.endDate}
                      onSelect={(date) => handleFilterChange('lastUpdated', { 
                        ...filters.lastUpdated, 
                        endDate: date 
                      })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* ?�新??*/}
            <div className="space-y-2">
              {/* TODO[P2][lint][parser-error]: 修正破損關閉標籤 */}
              <Label className="text-sm font-medium">?�新??</Label>
              <Select value={filters.updater} onValueChange={(value) => handleFilterChange('updater', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">A�?ACC 系統</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ?�本?�入??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?�本?�入??</Label>
              <Select value={filters.versionContributor} onValueChange={(value) => handleFilterChange('versionContributor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">A�?ACC 系統</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 審閱?�??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">審閱?�??</Label>
              <Select value={filters.reviewStatus} onValueChange={(value) => handleFilterChange('reviewStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?��?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待審??</SelectItem>
                  <SelectItem value="approved">已審??</SelectItem>
                  <SelectItem value="rejected">已�?�?</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 底部?��? */}
        <div className="p-4 border-t space-y-3">
          {showSaveDialog && (
            <div className="space-y-2">
              <Input
                placeholder="?��??�稱"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={!saveSearchName.trim()}>
                  ?��?
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(false)}>
                  ?��?
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              ?��?
            </Button>
            <Button variant="outline" onClick={handleClear}>
              清除
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
