/**
 * @fileoverview A component that displays a single file as a thumbnail card
 * in the grid view. Includes file icon, name, metadata, and selection state.
 */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileTypeIcon } from '@/components/ui/file-type-icon';
import { type FileItem } from '../folder-tree';

export interface FileThumbnailCardProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: (fileId: string, selected: boolean) => void;
  onClick: (file: FileItem) => void;
  onDoubleClick?: (file: FileItem) => void;
  size?: 'sm' | 'md' | 'lg';
  showMetadata?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    card: 'h-24 w-20',
    icon: 'sm' as const,
    text: 'text-xs',
    metadata: 'text-[10px]',
  },
  md: {
    card: 'h-32 w-28',
    icon: 'md' as const,
    text: 'text-sm',
    metadata: 'text-xs',
  },
  lg: {
    card: 'h-40 w-36',
    icon: 'lg' as const,
    text: 'text-base',
    metadata: 'text-sm',
  },
};

export function FileThumbnailCard({
  file,
  isSelected,
  onSelect,
  onClick,
  onDoubleClick,
  size = 'md',
  showMetadata = true,
  className
}: FileThumbnailCardProps) {
  const sizeConfig = SIZE_CONFIG[size];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays} 天前`;
    
    return date.toLocaleDateString('zh-TW', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (file.reviewStatus === '已審閱') {
      return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">已審閱</Badge>;
    }
    if (file.reviewStatus === '待審閱') {
      return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">待審閱</Badge>;
    }
    if (file.tag === '重要') {
      return <Badge variant="destructive" className="text-xs">重要</Badge>;
    }
    return null;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(file);
  };

  const handleCardDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDoubleClick) {
      onDoubleClick(file);
    }
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(file.id, !isSelected);
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200 hover:shadow-md',
        'border-2 border-transparent',
        isSelected && 'border-blue-500 bg-blue-50',
        !isSelected && 'hover:border-gray-300 hover:bg-gray-50',
        sizeConfig.card,
        className
      )}
      onClick={handleCardClick}
      onDoubleClick={handleCardDoubleClick}
    >
      <CardContent className="p-2 h-full flex flex-col">
        {/* Selection checkbox */}
        <div className="absolute top-1 left-1 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectClick}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={handleSelectClick}
          />
        </div>

        {/* File icon */}
        <div className="flex-1 flex items-center justify-center mb-2">
          <FileTypeIcon
            fileName={file.name}
            contentType={file.contentType}
            size={sizeConfig.icon}
            showThumbnail={true}
            // thumbnailUrl will be provided by parent component
          />
        </div>

        {/* File name */}
        <div className="text-center mb-1">
          <p 
            className={cn(
              'font-medium text-gray-900 truncate',
              sizeConfig.text
            )}
            title={file.name}
          >
            {file.name}
          </p>
        </div>

        {/* Metadata */}
        {showMetadata && (
          <div className="space-y-1">
            {/* Status badge */}
            {getStatusBadge() && (
              <div className="flex justify-center">
                {getStatusBadge()}
              </div>
            )}

            {/* File size and date */}
            <div className={cn('text-gray-500 text-center', sizeConfig.metadata)}>
              <div>{formatFileSize(file.size)}</div>
              <div>{formatDate(file.updated)}</div>
            </div>

            {/* Version */}
            {file.version && (
              <div className={cn('text-center text-gray-400', sizeConfig.metadata)}>
                {file.version}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FileThumbnailCard;
