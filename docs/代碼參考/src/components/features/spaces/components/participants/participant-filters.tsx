'use client';

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
    onFiltersChange({ ...filters, role: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
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
          進階篩選
        </Button>
      </div>

      {/* Filter Panel */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">篩選成員</h3>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">公司</label>
            <Select value={filters.company} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="選擇公司" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
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
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                <SelectItem value="owner">擁有者</SelectItem>
                <SelectItem value="admin">管理員</SelectItem>
                <SelectItem value="member">成員</SelectItem>
                <SelectItem value="viewer">檢視者</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">產品存取權限</label>
            <Select value={filters.productAccess} onValueChange={handleProductAccessChange}>
              <SelectTrigger>
                <SelectValue placeholder="選擇權限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
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
            <label className="text-sm font-medium mb-2 block">狀態</label>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                <SelectItem value="active">使用中</SelectItem>
                <SelectItem value="inactive">未使用中</SelectItem>
                <SelectItem value="pending">待審核</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
});