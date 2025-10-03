/**
 * @fileoverview A modern component that displays files in a responsive thumbnail grid layout.
 * Uses @tanstack/react-virtual for high-performance virtualization and adaptive sizing.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import { FileThumbnailCard } from './file-thumbnail-card';
import { type FileItem } from '../folder-tree';

export interface FileThumbnailGridProps {
  files: FileItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onItemClick: (item: FileItem) => void;
  onItemDoubleClick?: (item: FileItem) => void;
  className?: string;
  containerHeight?: number;
  containerWidth?: number;
}

interface GridRowProps {
  rowIndex: number;
  files: FileItem[];
  selectedItems: string[];
  onSelect: (fileId: string, selected: boolean) => void;
  onItemClick: (item: FileItem) => void;
  onItemDoubleClick?: (item: FileItem) => void;
  columnCount: number;
  itemWidth: number;
  itemHeight: number;
  style: React.CSSProperties;
}

// Responsive grid configuration
const GRID_CONFIG = {
  sm: { itemWidth: 80, itemHeight: 96, columns: 2 }, // Mobile
  md: { itemWidth: 112, itemHeight: 128, columns: 3 }, // Tablet
  lg: { itemWidth: 144, itemHeight: 160, columns: 4 }, // Desktop
  xl: { itemWidth: 144, itemHeight: 160, columns: 6 }, // Large desktop
};

const GRID_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

function GridRow({
  rowIndex,
  files,
  selectedItems,
  onSelect,
  onItemClick,
  onItemDoubleClick,
  columnCount,
  itemWidth,
  itemHeight,
  style,
}: GridRowProps) {
  const startIndex = rowIndex * columnCount;
  const endIndex = Math.min(startIndex + columnCount, files.length);
  const rowFiles = files.slice(startIndex, endIndex);

  return (
    <div
      style={style}
      className="flex gap-2 px-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    >
      {rowFiles.map((file, _columnIndex) => {
        const isSelected = selectedItems.includes(file.id);
        
        return (
          <div
            key={file.id}
            style={{ width: itemWidth, height: itemHeight }}
            className="transition-transform duration-100 hover:scale-105"
          >
            <FileThumbnailCard
              file={file}
              isSelected={isSelected}
              onSelect={onSelect}
              onClick={onItemClick}
              onDoubleClick={onItemDoubleClick}
              size="md"
              showMetadata={true}
              className="h-full w-full"
            />
          </div>
        );
      })}
      
      {/* Fill empty spaces in the last row */}
      {Array.from({ length: columnCount - rowFiles.length }).map((_, index) => (
        <div key={`empty-${index}`} style={{ width: itemWidth, height: itemHeight }} />
      ))}
    </div>
  );
}

export function FileThumbnailGrid({
  files,
  selectedItems,
  onSelectionChange,
  onItemClick,
  onItemDoubleClick,
  className,
  containerHeight = 600,
  containerWidth
}: FileThumbnailGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [gridDimensions, setGridDimensions] = useState({
    width: containerWidth || 800,
    height: containerHeight,
  });

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < GRID_BREAKPOINTS.sm) {
        setScreenSize('sm');
      } else if (width < GRID_BREAKPOINTS.md) {
        setScreenSize('md');
      } else if (width < GRID_BREAKPOINTS.lg) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Update grid dimensions when container width changes
  useEffect(() => {
    if (containerWidth) {
      setGridDimensions(prev => ({ ...prev, width: containerWidth }));
    }
  }, [containerWidth]);

  // Calculate grid configuration based on screen size
  const config = GRID_CONFIG[screenSize];
  const columnCount = Math.max(1, Math.floor(gridDimensions.width / config.itemWidth));
  const rowCount = Math.ceil(files.length / columnCount);

  // Create virtualizer for rows
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => config.itemHeight + 8, // itemHeight + gap
    overscan: 2,
  });

  // Handle selection
  const handleSelect = (fileId: string, selected: boolean) => {
    if (selected) {
      onSelectionChange([...selectedItems, fileId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== fileId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === files.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(files.map(file => file.id));
    }
  };

  // Show empty state
  if (files.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-64 animate-in fade-in-0 slide-in-from-bottom-2 duration-300', className)}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg font-medium">沒有檔案</p>
          <p className="text-sm">上傳檔案開始使用</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Selection controls */}
      <div className="flex items-center justify-between mb-4 px-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedItems.length === files.length && files.length > 0}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length > 0 
              ? `已選取 ${selectedItems.length} 個檔案`
              : `共 ${files.length} 個檔案`
            }
          </span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {screenSize === 'sm' && '2 欄'}
          {screenSize === 'md' && '3 欄'}
          {screenSize === 'lg' && '4 欄'}
          {screenSize === 'xl' && '6 欄'}
        </div>
      </div>

      {/* Modern virtualized grid */}
      <div
        ref={parentRef}
        className="overflow-auto border rounded-lg"
        style={{ height: `${gridDimensions.height}px` }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <GridRow
              key={virtualItem.index}
              rowIndex={virtualItem.index}
              files={files}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              onItemClick={onItemClick}
              onItemDoubleClick={onItemDoubleClick}
              columnCount={columnCount}
              itemWidth={config.itemWidth}
              itemHeight={config.itemHeight}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid info */}
      <div className="mt-2 text-xs text-muted-foreground text-center animate-in fade-in-0 duration-300 delay-200">
        顯示 {files.length} 個項目，{columnCount} 欄 × {rowCount} 列
      </div>
    </div>
  );
}

export default FileThumbnailGrid;