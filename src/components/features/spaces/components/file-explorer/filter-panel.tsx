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
        {/* Ê®ôÈ?Ê¨?- ?πÈ? Autodesk Ë®≠Ë? */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">?úÂ?</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Ê®ôÁ±§??*/}
        <div className="flex border-b">
          <button className="flex-1 py-2 px-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
            ?úÂ?
          </button>
          <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-500">
            ?≤Â??ÑÊ?Â∞?
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* ?úÂ?Ê°?*/}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="?úÂ?"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* ?úÂ??åÁØ©?∏Ë®≠ÂÆ?- ?πÈ? Autodesk Ë®≠Ë? */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">?úÂ??åÁØ©?∏Ë®≠ÂÆ?/h4>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* ?úÂ?ÁØÑÂ? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?úÂ?ÁØÑÂ?</Label>
              <RadioGroup
                value={filters.searchScope}
                onValueChange={(value) => handleFilterChange('searchScope', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="current" />
                  <Label htmlFor="current" className="text-sm">?ÆÂ?Ë≥áÊ?Â§?/Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm">?Ä?âË??ôÂ§æ</Label>
                </div>
              </RadioGroup>
            </div>

            {/* ?úÂ??∏È? */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subfolders"
                  checked={filters.includeSubfolders}
                  onCheckedChange={(checked) => handleFilterChange('includeSubfolders', checked)}
                />
                <Label htmlFor="subfolders" className="text-sm">Â≠êË??ôÂ§æ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="content"
                  checked={filters.includeContent}
                  onCheckedChange={(checked) => handleFilterChange('includeContent', checked)}
                />
                <Label htmlFor="content" className="text-sm">?ßÂÆπ</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* ÁØ©ÈÅ∏Ê¢ù‰ª∂ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">ÁØ©ÈÅ∏</h4>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* È°ûÂ? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">È°ûÂ?</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">Ê™îÊ?</SelectItem>
                  <SelectItem value="folder">Ë≥áÊ?Â§?/SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ê™îÊ?È°ûÂ? */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ê™îÊ?È°ûÂ?</Label>
              <Select value={filters.fileType} onValueChange={(value) => handleFilterChange('fileType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="dwg">DWG</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="image">?ñÁ?</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ê™îÊ??Ä??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ê™îÊ??Ä??/Label>
              <Select value={filters.fileStatus} onValueChange={(value) => handleFilterChange('fileStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">?üÁî®</SelectItem>
                  <SelectItem value="archived">Â∑≤Â?Â≠?/SelectItem>
                  <SelectItem value="deleted">Â∑≤Âà™??/SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ?ÆÂ??àÊú¨ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?ÆÂ??àÊú¨</Label>
              <Select value={filters.currentVersion} onValueChange={(value) => handleFilterChange('currentVersion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">?Ä?∞Á???/SelectItem>
                  <SelectItem value="draft">?âÁ®ø</SelectItem>
                  <SelectItem value="review">ÂØ©Èñ±‰∏?/SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ‰∏äÊ¨°?¥Êñ∞ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">‰∏äÊ¨°?¥Êñ∞</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastUpdated?.startDate ? 
                        format(filters.lastUpdated.startDate, 'yyyy/MM/dd', { locale: zhTW }) : 
                        '?ãÂ??•Ê?'
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
                        'ÁµêÊ??•Ê?'
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

            {/* ?¥Êñ∞??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?¥Êñ∞??/Label>
              <Select value={filters.updater} onValueChange={(value) => handleFilterChange('updater', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">AÁ≥?ACC Á≥ªÁµ±</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ?àÊú¨?†ÂÖ•??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">?àÊú¨?†ÂÖ•??/Label>
              <Select value={filters.versionContributor} onValueChange={(value) => handleFilterChange('versionContributor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">ACC Sample Project</SelectItem>
                  <SelectItem value="user2">AÁ≥?ACC Á≥ªÁµ±</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ÂØ©Èñ±?Ä??*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">ÂØ©Èñ±?Ä??/Label>
              <Select value={filters.reviewStatus} onValueChange={(value) => handleFilterChange('reviewStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="?∏Â??? />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">ÂæÖÂØ©??/SelectItem>
                  <SelectItem value="approved">Â∑≤ÂØ©??/SelectItem>
                  <SelectItem value="rejected">Â∑≤Ê?Áµ?/SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Â∫ïÈÉ®?âÈ? */}
        <div className="p-4 border-t space-y-3">
          {showSaveDialog && (
            <div className="space-y-2">
              <Input
                placeholder="?úÂ??çÁ®±"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={!saveSearchName.trim()}>
                  ?≤Â?
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(false)}>
                  ?ñÊ?
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              ?úÂ?
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Ê∏ÖÈô§
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
