'use client';
// TODO: [P0] FIX Parsing (L58) [低認知][現代化]
// - 問題：Unterminated string literal
// - 指引：補上引號或以 '--' 站位，避免混雜未轉義符號。

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { ParticipantFiltersProps } from './types';

export const ParticipantFilters = memo(function ParticipantFilters({
  filters,
  onFiltersChange,
}: ParticipantFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleCompanyChange = (value: string) => {
    onFiltersChange({ ...filters, company: value });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({ ...filters, role: value as any });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value as any });
  };

  const handleProductAccessChange = (value: string) => {
    onFiltersChange({ ...filters, productAccess: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      company: '',
      role: '',
      status: '',
      productAccess: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              // 搜尋：依名稱、Email 或公司
              placeholder="依名稱、Email 或公司搜尋成員"
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              清除篩選
            </Button>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          ?��??�能�?
        </Button>
      </div>

      {/* Filter Panel */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">篩選?�員</h3>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">?�司</label>
            <Select value={filters.company} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="?��??�司" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?�部</SelectItem>
                <SelectItem value="Trial account">Trial account</SelectItem>
                <SelectItem value="ACME Construction">ACME Construction</SelectItem>
                <SelectItem value="Design Studio Inc">Design Studio Inc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">角色</label>
            <Select value={filters.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="?��?角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?�部</SelectItem>
                <SelectItem value="owner">?��???/SelectItem>
                <SelectItem value="admin">管�???/SelectItem>
                <SelectItem value="member">?�員</SelectItem>
                <SelectItem value="viewer">檢�???/SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">?��?存�?�?/label>
            <Select value={filters.productAccess} onValueChange={handleProductAccessChange}>
              <SelectTrigger>
                <SelectValue placeholder="?��??��?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?�部</SelectItem>
                <SelectItem value="docs">Docs</SelectItem>
                <SelectItem value="designCollaboration">Design Collaboration</SelectItem>
                <SelectItem value="modelCoordination">Model Coordination</SelectItem>
                <SelectItem value="takeoff">Takeoff</SelectItem>
                <SelectItem value="autoSpecs">AutoSpecs</SelectItem>
                <SelectItem value="build">Build</SelectItem>
                <SelectItem value="costManagement">Cost Management</SelectItem>
                <SelectItem value="insight">Insight</SelectItem>
                <SelectItem value="forma">Forma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">?�??/label>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="?��??�?? />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?�部</SelectItem>
                <SelectItem value="active">使用�?/SelectItem>
                <SelectItem value="inactive">?�使?�中</SelectItem>
                <SelectItem value="pending">待�???/SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
});
