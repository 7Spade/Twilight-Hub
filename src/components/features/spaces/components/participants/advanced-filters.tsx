/**
 * @fileoverview 現代化高級篩選器組件
 * 支援多種篩選條件實現精確搜索
 */

'use client';

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
  Users, 
  Building, 
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
// TODO: [P0] VAN - 移除未使用的類型導入
// 問題：ParticipantRole, ParticipantStatus 導入後從未使用
// 解決方案：直接移除未使用的類型導入
// 現代化建議：使用 import type 語法和 ESLint no-unused-vars 規則
// 效能影響：減少 bundle 大小，降低認知負擔
import { AdvancedFiltersProps } from './types';

// 模擬內部部門標籤數據
const DEPARTMENTS = [
  '工程部', '設計部', '市場部', '銷售部', '人力資源部', '財務部', '行政部'
];

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

  // 更新搜索條件
  React.useEffect(() => {
    if (debouncedSearch !== filters.searchTerm) {
      onFiltersChange({
        ...filters,
        searchTerm: debouncedSearch,
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = useCallback((key: keyof typeof filters, value: string | string[] | boolean) => {
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

  // TODO: 為 sortBy 定義受控字面量型別
  const handleSortChange = useCallback((sortBy: string) => {
    const [field, order] = sortBy.split('-');
    handleFilterChange('sortBy', field);
    handleFilterChange('sortOrder', order as 'asc' | 'desc');
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
      {/* 搜索欄 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索成員姓名、電子郵件或公司..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* 快速篩選器 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              篩選器
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
                <h4 className="font-medium">篩選條件</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    清除全部
                  </Button>
                )}
              </div>

              <Separator />

              {/* 角色篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">角色</label>
                <Select
                  value={filters.role || ''}
                  onValueChange={(value) => handleFilterChange('role', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部角色</SelectItem>
                    <SelectItem value="owner">擁有者</SelectItem>
                    <SelectItem value="admin">管理員</SelectItem>
                    <SelectItem value="member">成員</SelectItem>
                    <SelectItem value="viewer">檢視者</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 狀態篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">狀態</label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部狀態</SelectItem>
                    <SelectItem value="active">使用中</SelectItem>
                    <SelectItem value="inactive">未活躍</SelectItem>
                    <SelectItem value="pending">待審核</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 公司篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">公司</label>
                <Input
                  placeholder="輸入公司名稱"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                />
              </div>

              {/* 部門篩選 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">部門</label>
                <Select
                  value={filters.department || ''}
                  onValueChange={(value) => handleFilterChange('department', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇部門" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部部門</SelectItem>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 在線狀態 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-only"
                  checked={filters.isOnline === true}
                  onCheckedChange={(checked) => 
                    handleFilterChange('isOnline', checked ? true : undefined)
                  }
                />
                <label htmlFor="online-only" className="text-sm font-medium">
                  只顯示在線成員
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 標籤篩選 */}
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
              <CommandInput placeholder="搜索標籤..." />
              <CommandList>
                <CommandEmpty>沒有找到標籤</CommandEmpty>
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

        {/* 排序 */}
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
                姓名 A-Z
              </div>
            </SelectItem>
            <SelectItem value="name-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                姓名 Z-A
              </div>
            </SelectItem>
            <SelectItem value="role-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                角色升序
              </div>
            </SelectItem>
            <SelectItem value="role-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                角色降序
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                最新加入
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                最早加入
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 活動篩選標籤 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                搜索: {filters.searchTerm}
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
                公司: {filters.company}
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