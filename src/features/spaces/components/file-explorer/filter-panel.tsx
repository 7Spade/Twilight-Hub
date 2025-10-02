/**
 * @fileoverview A slide-out panel for filtering files and folders in the explorer.
 * It provides a rich set of filtering options, including keyword search, scope
 * selection, file type, status, and date ranges. It allows users to apply these
 * filters or save them for later use.
 */
'use client';

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
        {/* 標題欄 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">搜尋</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSaveDialog(true)}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 標籤頁 */}
        <div className="flex border-b">
          <button className="flex-1 py-2 px-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
            搜尋
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
            儲存的搜尋
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 搜尋框 */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜尋"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 搜尋和篩選設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">搜尋和篩選設定</h4>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* 搜尋範圍 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">搜尋範圍</Label>
              <RadioGroup
                value={filters.searchScope}
                onValueChange={(value) => handleFilterChange('searchScope', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="text-sm">目前資料夾</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm">所有資料夾</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 搜尋選項 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subfolders"
                  checked={filters.includeSubfolders}
                  onCheckedChange={(checked) => handleFilterChange('includeSubfolders', checked)}
                />
                <Label htmlFor="subfolders" className="text-sm">子資料夾</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="content"
                  checked={filters.includeContent}
                  onCheckedChange={(checked) => handleFilterChange('includeContent', checked)}
                />
                <Label htmlFor="content" className="text-sm">內容</Label>
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

            {/* 類型 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">類型</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">檔案</SelectItem>
                  <SelectItem value="folder">資料夾</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 檔案類型 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">檔案類型</Label>
              <Select value={filters.fileType} onValueChange={(value) => handleFilterChange('fileType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="dwg">DWG</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="image">圖片</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 檔案狀態 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">檔案狀態</Label>
              <Select value={filters.fileStatus} onValueChange={(value) => handleFilterChange('fileStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">啟用</SelectItem>
                  <SelectItem value="archived">已封存</SelectItem>
                  <SelectItem value="deleted">已刪除</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 目前版本 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">目前版本</Label>
              <Select value={filters.currentVersion} onValueChange={(value) => handleFilterChange('currentVersion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">最新版本</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="review">審閱中</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 上次更新 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">上次更新</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastUpdated?.startDate ? 
                        format(filters.lastUpdated.startDate, 'yyyy/MM/dd', { locale: zhTW }) : 
                        '開始日期'
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
                        '結束日期'
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

            {/* 更新者 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">更新者</Label>
              <Select value={filters.updater} onValueChange={(value) => handleFilterChange('updater', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">A系 ACC 系統</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 版本加入者 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">版本加入者</Label>
              <Select value={filters.versionContributor} onValueChange={(value) => handleFilterChange('versionContributor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">A系 ACC 系統</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 審閱狀態 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">審閱狀態</Label>
              <Select value={filters.reviewStatus} onValueChange={(value) => handleFilterChange('reviewStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選取…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待審閱</SelectItem>
                  <SelectItem value="approved">已審閱</SelectItem>
                  <SelectItem value="rejected">已拒絕</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-4 border-t space-y-3">
          {showSaveDialog && (
            <div className="space-y-2">
              <Input
                placeholder="搜尋名稱"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={!saveSearchName.trim()}>
                  儲存
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              搜尋
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
