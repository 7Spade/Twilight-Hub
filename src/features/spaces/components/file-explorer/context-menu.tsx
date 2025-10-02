'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Move,
  Edit,
  Share,
  Trash2,
  Download,
  FileText,
  UserCheck,
  Package,
  Play,
  Link,
  MoreVertical
} from 'lucide-react';
import { type FileItem } from './folder-tree';

interface ContextMenuProps {
  item: FileItem;
  onAction: (action: string) => void;
  children: React.ReactNode;
}

export function ContextMenu({ item, onAction, children }: ContextMenuProps) {
  const menuItems = [
    // 基本操作
    {
      group: 'basic',
      items: [
        {
          id: 'move',
          label: '移動',
          icon: <Move className="h-4 w-4" />,
        },
        {
          id: 'rename',
          label: '更名',
          icon: <Edit className="h-4 w-4" />,
        },
        {
          id: 'share',
          label: '共用',
          icon: <Share className="h-4 w-4" />,
        },
        {
          id: 'delete',
          label: '刪除',
          icon: <Trash2 className="h-4 w-4" />,
        },
      ]
    },
    // 下載/匯出/審閱
    {
      group: 'download',
      items: [
        {
          id: 'download',
          label: '下載原始檔案',
          icon: <Download className="h-4 w-4" />,
          info: 'i',
        },
        {
          id: 'export',
          label: '匯出檔案記錄',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          id: 'submit-review',
          label: '提交以供審閱',
          icon: <UserCheck className="h-4 w-4" />,
        },
      ]
    },
    // 進階操作
    {
      group: 'advanced',
      items: [
        {
          id: 'create-transfer',
          label: '建立傳送',
          icon: <Package className="h-4 w-4" />,
          info: '1',
        },
        {
          id: 'review-trigger',
          label: '審閱自動觸發詳細資料',
          icon: <Play className="h-4 w-4" />,
        },
        {
          id: 'auto-hyperlink',
          label: '自動超連結設定',
          icon: <Link className="h-4 w-4" />,
        },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {group.items.map((menuItem) => (
              <DropdownMenuItem
                key={menuItem.id}
                onClick={() => onAction(menuItem.id)}
                className="flex items-center gap-3"
              >
                {menuItem.icon}
                <span className="flex-1">{menuItem.label}</span>
                {menuItem.info && (
                  <span className="text-xs text-muted-foreground bg-muted rounded-full h-4 w-4 flex items-center justify-center">
                    {menuItem.info}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
            {groupIndex < menuItems.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ToolbarContextMenuProps {
  onAction: (action: string) => void;
}

export function ToolbarContextMenu({ onAction }: ToolbarContextMenuProps) {
  const menuItems = [
    {
      group: 'settings',
      items: [
        {
          id: 'properties',
          label: '屬性',
          hasArrow: true,
        },
        {
          id: 'compliance',
          label: '合規性',
          hasArrow: true,
        },
        {
          id: 'review-auto-trigger',
          label: '審閱自動觸發',
        },
        {
          id: 'packages',
          label: '套件',
        },
        {
          id: 'advanced',
          label: '進階',
        },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4 mr-2" />
          設定
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {menuItems.map((group) => (
          <React.Fragment key={group.group}>
            {group.items.map((menuItem) => (
              <DropdownMenuItem
                key={menuItem.id}
                onClick={() => onAction(menuItem.id)}
                className="flex items-center justify-between"
              >
                <span>{menuItem.label}</span>
                {menuItem.hasArrow && (
                  <span className="text-muted-foreground">›</span>
                )}
              </DropdownMenuItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
