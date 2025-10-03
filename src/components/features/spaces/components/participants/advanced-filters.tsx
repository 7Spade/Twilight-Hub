/**
 * @fileoverview ?æ‰ª£?ñÈ?Á¥öÈ?ÊøæÂô®ÁµÑ‰ª∂
 * ?ØÊ?Â§öÁ®Æ?éÊøæÊ¢ù‰ª∂?åÂØ¶?ÇÊ?Á¥?
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

// Ê®°Êì¨?ÑÈÉ®?Ä?åÊ?Á±§Êï∏??
const DEPARTMENTS = [
  'Â∑•Á???, 'Ë®≠Ë???, 'Â∏ÇÂ†¥??, '?∑ÂîÆ??, '‰∫∫Â?Ë≥áÊ???, 'Ë≤°Â???, '?ãÁ???
];

const TAGS = [
  '?∏Â??òÈ?', '?∞Ê???, 'ÁÆ°Á?Â±?, '?ÄË°ìÂ?ÂÆ?, 'Ë®≠Ë?Â∏?, '?¢Â?Á∂ìÁ?', 'ÂØ¶Á???
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [debouncedSearch] = useDebounce(searchInput, 300);

  // ?¥Êñ∞?úÁ¥¢Ê¢ù‰ª∂
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
      {/* ?úÁ¥¢Ê¨?*/}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="?úÁ¥¢?êÂì°ÂßìÂ??ÅÈõªÂ≠êÈÉµ‰ª∂Ê??¨Âè∏..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Âø´ÈÄüÈ?ÊøæÂô® */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              ?éÊøæ??
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
                <h4 className="font-medium">?éÊøæÊ¢ù‰ª∂</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Ê∏ÖÈô§?®ÈÉ®
                  </Button>
                )}
              </div>

              <Separator />

              {/* ËßíËâ≤?éÊøæ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">ËßíËâ≤</label>
                <Select
                  value={filters.role || ''}
                  onValueChange={(value) => handleFilterChange('role', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="?∏Ê?ËßíËâ≤" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">?®ÈÉ®ËßíËâ≤</SelectItem>
                    <SelectItem value="owner">?ÅÊ???/SelectItem>
                    <SelectItem value="admin">ÁÆ°Á???/SelectItem>
                    <SelectItem value="member">?êÂì°</SelectItem>
                    <SelectItem value="viewer">Ê™¢Ë???/SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ?Ä?ãÈ?Êø?*/}
              <div className="space-y-2">
                <label className="text-sm font-medium">?Ä??/label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="?∏Ê??Ä?? />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">?®ÈÉ®?Ä??/SelectItem>
                    <SelectItem value="active">‰ΩøÁî®‰∏?/SelectItem>
                    <SelectItem value="inactive">?ûÊ¥ªË∫?/SelectItem>
                    <SelectItem value="pending">ÂæÖÂØ©??/SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ?¨Âè∏?éÊøæ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">?¨Âè∏</label>
                <Input
                  placeholder="Ëº∏ÂÖ•?¨Âè∏?çÁ®±"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                />
              </div>

              {/* ?®È??éÊøæ */}
              <div className="space-y-2">
                <label className="text-sm font-medium">?®È?</label>
                <Select
                  value={filters.department || ''}
                  onValueChange={(value) => handleFilterChange('department', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="?∏Ê??®È?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">?®ÈÉ®?®È?</SelectItem>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ?®Á??Ä??*/}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-only"
                  checked={filters.isOnline === true}
                  onCheckedChange={(checked) => 
                    handleFilterChange('isOnline', checked ? true : undefined)
                  }
                />
                <label htmlFor="online-only" className="text-sm font-medium">
                  ?ÖÈ°ØÁ§∫Âú®Á∑öÊ???
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Ê®ôÁ±§?éÊøæ */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Ê®ôÁ±§
              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <Command>
              <CommandInput placeholder="?úÁ¥¢Ê®ôÁ±§..." />
              <CommandList>
                <CommandEmpty>Ê≤íÊ??æÂà∞Ê®ôÁ±§</CommandEmpty>
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

        {/* ?íÂ? */}
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
                ÂßìÂ? A-Z
              </div>
            </SelectItem>
            <SelectItem value="name-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                ÂßìÂ? Z-A
              </div>
            </SelectItem>
            <SelectItem value="role-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                ËßíËâ≤?áÂ?
              </div>
            </SelectItem>
            <SelectItem value="role-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                ËßíËâ≤?çÂ?
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                ?Ä?∞Â???
              </div>
            </SelectItem>
            <SelectItem value="joinedAt-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                ?Ä?©Â???
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ê¥ªÂ??éÊøæ?®Ê?Á±?*/}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                ?úÁ¥¢: {filters.searchTerm}
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
                ?¨Âè∏: {filters.company}
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
                ËßíËâ≤: {filters.role}
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
