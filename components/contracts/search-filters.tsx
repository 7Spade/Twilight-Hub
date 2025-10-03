/**
 * 合約搜索和過濾組件
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供搜索、過濾、排序功能
 */

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { ContractFilters, contractTypeOptions, contractStatusOptions } from '@/lib/types/contract.types';

interface SearchFiltersProps {
  filters: ContractFilters;
  onFiltersChange: (filters: ContractFilters) => void;
  onSearch: (searchTerm: string) => void;
  onClear: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  totalResults = 0,
  isLoading = false,
}: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key: keyof ContractFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onClear();
  };

  const hasActiveFilters = 
    filters.status && filters.status !== 'all' ||
    filters.type && filters.type !== 'all' ||
    filters.tags && filters.tags.length > 0 ||
    searchTerm.trim() !== '';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* 搜索欄 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索合約標題、描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={isLoading}
            >
              <Filter className="h-4 w-4 mr-2" />
              高級過濾
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                清除
              </Button>
            )}
          </div>

          {/* 高級過濾器 */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
              {/* 狀態過濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">狀態</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilterChange('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    {contractStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-${option.color}-500`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 類型過濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">類型</label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) => handleFilterChange('type', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類型</SelectItem>
                    {contractTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 日期範圍過濾 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">日期範圍</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.dateRange?.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      start: e.target.value ? new Date(e.target.value) : undefined,
                    })}
                    disabled={isLoading}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange?.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filters.dateRange,
                      end: e.target.value ? new Date(e.target.value) : undefined,
                    })}
                    disabled={isLoading}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 活動過濾器標籤 */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.status && filters.status !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  狀態: {contractStatusOptions.find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', 'all')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.type && filters.type !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  類型: {contractTypeOptions.find(opt => opt.value === filters.type)?.label}
                  <button
                    onClick={() => handleFilterChange('type', 'all')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  標籤: {filters.tags.length} 個
                  <button
                    onClick={() => handleFilterChange('tags', [])}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {searchTerm.trim() && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  搜索: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* 結果統計 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  搜索中...
                </div>
              ) : (
                <span>
                  {totalResults > 0 ? `找到 ${totalResults} 個合約` : '沒有找到合約'}
                </span>
              )}
            </div>
            
            {totalResults > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <SortAsc className="h-4 w-4 mr-1" />
                  排序
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
