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
              placeholder="‰æùÂ?Á®±Ê??ªÂ??µ‰ª∂?úÂ??êÂì°??
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Ê∏ÖÈô§ÁØ©ÈÅ∏
            </Button>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          ?áÊ??üËÉΩË°?
        </Button>
      </div>

      {/* Filter Panel */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">ÁØ©ÈÅ∏?êÂì°</h3>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">?¨Âè∏</label>
            <Select value={filters.company} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="?∏Â??¨Âè∏" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?®ÈÉ®</SelectItem>
                <SelectItem value="Trial account">Trial account</SelectItem>
                <SelectItem value="ACME Construction">ACME Construction</SelectItem>
                <SelectItem value="Design Studio Inc">Design Studio Inc</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">ËßíËâ≤</label>
            <Select value={filters.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="?∏Â?ËßíËâ≤" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?®ÈÉ®</SelectItem>
                <SelectItem value="owner">?ÅÊ???/SelectItem>
                <SelectItem value="admin">ÁÆ°Á???/SelectItem>
                <SelectItem value="member">?êÂì°</SelectItem>
                <SelectItem value="viewer">Ê™¢Ë???/SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">?¢Â?Â≠òÂ?Ê¨?/label>
            <Select value={filters.productAccess} onValueChange={handleProductAccessChange}>
              <SelectTrigger>
                <SelectValue placeholder="?∏Â??¢Â?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?®ÈÉ®</SelectItem>
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
            <label className="text-sm font-medium mb-2 block">?Ä??/label>
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="?∏Â??Ä?? />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">?®ÈÉ®</SelectItem>
                <SelectItem value="active">‰ΩøÁî®‰∏?/SelectItem>
                <SelectItem value="inactive">?û‰Ωø?®‰∏≠</SelectItem>
                <SelectItem value="pending">ÂæÖË???/SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
});
