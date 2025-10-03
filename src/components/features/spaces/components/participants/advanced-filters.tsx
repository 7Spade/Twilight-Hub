// TODO: [P0] FIX src/components/features/spaces/components/participants/advanced-filters.tsx - 修復語法錯誤（第34行 ',' 缺失）
// 說明：檢查物件/參數列表逗號缺失與 JSX 分隔
/**
 * @fileoverview ?�代?��?級�?濾器組件
 * ?��?多種?�濾條件?�實?��?�?
 */

'use client';
// TODO: [P0] FIX Parsing (L36) [低認知][現代化]
// - 問題："," expected（可能缺少逗號/括號）
// - 指引：補齊分隔符或簡化 props，先確保可解析再優化。

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Users, 
  Building, 
  Tag, 
  Clock,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { AdvancedFiltersProps, ParticipantRole, ParticipantStatus } from './types';

// 模擬?�部?�?��?籤數??
// TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 陣列字串引號與逗號缺失，請補齊分隔與引號
const DEPARTMENTS = [
  '工程部', '設計部', '市場部', '銷售部', '人力資源部', '財務部', '行政部'
];

// TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 陣列字串未終止，請補齊引號
const TAGS = [
  '高優先', '需回覆', '管理', '技術', '設計', '專案經理', '實習'
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [debouncedSearch] = useDebounce(searchInput, 300);

  // ?�新?�索條件
  React.useEffect(() => {
    if (debouncedSearch !== filters.searchTerm) {
      onFiltersChange({
        ...filters,
        searchTerm: debouncedSearch,
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof typeof filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }, [filters, onFiltersChange]);

  const handleTagToggle = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    handleFilterChange('tags', newTags);
  }, [filters.tags, handleFilterChange]);

  const handleRemoveTag = useCallback((tag: string) => {
    const newTags = (filters.tags || []).filter(t => t !== tag);
    handleFilterChange('tags', newTags);
  }, [filters.tags, handleFilterChange]);

  const handleSortChange = useCallback((sortBy: string) => {
    const [field, order] = sortBy.split('-');
    handleFilterChange('sortBy', field as any);
    handleFilterChange('sortOrder', order as any);
  }, [handleFilterChange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.company) count++;
    if (filters.role) count++;
    if (filters.status) count++;
    if (filters.department) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.isOnline !== undefined) count++;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    onReset();
    setSearchInput('');
  }, [onReset]);

  return (
    <div className="space-y-4">
      {/* ?�索�?*/}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="?�索?�員姓�??�電子郵件�??�司..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* 快速�?濾器 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              ?�濾??
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">?�濾條件</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    清除?�部
                  </Button>
                )}
              </div>

              <Separator />

              {/* 角色?�濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">角色</label>
                <Select
                  value={filters.role || ''}
                  onValueChange={(value) => handleFilterChange('role', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="?��?角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">?�部角色</SelectItem>
                    <SelectItem value="owner">?��???/SelectItem>
                    <SelectItem value="admin">管�???/SelectItem>
                    <SelectItem value="member">?�員</SelectItem>
                    <SelectItem value="viewer">檢�???/SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ?�?��?�?*/}
              <div className="space-y-2">
                <label className="text-sm font-medium">?�??/label>
                {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 破損的關閉標籤，請改為 </label> */}
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || '')}
                >
                  <SelectTrigger>
                    {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: placeholder 未終止字串，請補齊引號 */}
                    <SelectValue placeholder="????? />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 多處關閉標籤缺失，請補齊 */}
                    <SelectItem value="">?部???/SelectItem>
                    <SelectItem value="active">使用?/SelectItem>
                    <SelectItem value="inactive">?活?/SelectItem>
                    <SelectItem value="pending">待審??/SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ?�司?�濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">?�司</label>
                <Input
                  placeholder="輸入?�司?�稱"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                />
              </div>

              {/* ?��??�濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">?��?</label>
                <Select
                  value={filters.department || ''}
                  onValueChange={(value) => handleFilterChange('department', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="?��??��?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">?�部?��?</SelectItem>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ?��??�??*/}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-only"
                  checked={filters.isOnline === true}
                  onCheckedChange={(checked) => 
                    handleFilterChange('isOnline', checked ? true : undefined)
                  }
                />
                <label htmlFor="online-only" className="text-sm font-medium">
                  ?�顯示在線�???
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 標籤?�濾 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              標籤
              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <Command>
              <CommandInput placeholder="?�索標籤..." />
              <CommandList>
                <CommandEmpty>沒�??�到標籤</CommandEmpty>
                <CommandGroup>
                  {TAGS.map((tag) => (
                    <CommandItem
                      key={tag}
                      onSelect={() => handleTagToggle(tag)}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={filters.tags?.includes(tag) || false}
                        onChange={() => {}}
                      />
                      <span>{tag}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ?��? */}
        <Select
          value={`${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                姓�? A-Z
              </div>
            </SelectItem>
            <SelectItem value="name-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                姓�? Z-A
              </div>
            </SelectItem>
            <SelectItem value="role-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                角色?��?
              </div>
            </SelectItem>
            <SelectItem value="role-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                角色?��?
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                ?�?��???
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                ?�?��???
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 活�??�濾?��?�?*/}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                ?�索: {filters.searchTerm}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => {
                    setSearchInput('');
                    handleFilterChange('searchTerm', '');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.company && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                ?�司: {filters.company}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange('company', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.role && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                角色: {filters.role}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange('role', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.tags && filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
