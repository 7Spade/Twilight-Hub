/**
 * @fileoverview A context menu component for file and folder items in the explorer.
 * It provides a list of actions (e.g., rename, delete, share) relevant to the
 * selected item. A separate context menu for the toolbar is also defined here.
 */
'use client';
// TODO: [P2] FIX src/components/features/spaces/components/file-explorer/context-menu.tsx - 修復字符串字面量錯誤（第126行未終止）

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
  Plus,
  Folder,
  Edit,
  Share,
  Move,
  Trash2,
  ArrowUpDown,
  ChevronRight,
  Upload,
  Download,
  FileText,
  UserCheck,
  Package,
  Settings,
  Play,
  MoreVertical,
  Info
} from 'lucide-react';
import { type FileItem } from './folder-tree';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  hasArrow?: boolean;
  info?: boolean;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

interface ContextMenuProps {
  item: FileItem;
  onAction: (action: string) => void;
  children: React.ReactNode;
}

export function ContextMenu({ item, onAction, children }: ContextMenuProps) {
  const menuItems: MenuGroup[] = [
    // 第�?組�??�本?�件/資�?夾�?�?
    {
      group: 'basic',
      items: [
        {
          id: 'add-subfolder',
          label: '?�入子�??�夾',
          icon: <Plus className="h-4 w-4" />,
          secondaryIcon: <Folder className="h-4 w-4" />,
        },
        {
          id: 'rename',
          label: '?��?',
          icon: <Edit className="h-4 w-4" />,
        },
        {
          id: 'share',
          label: '?�用',
          icon: <Share className="h-4 w-4" />,
        },
        {
          id: 'move',
          label: '移�?',
          icon: <Move className="h-4 w-4" />,
        },
        {
          id: 'delete',
          label: '?�除',
          icon: <Trash2 className="h-4 w-4" />,
        },
        {
          id: 'sort-by',
          label: '?��?依�?',
          icon: <ArrowUpDown className="h-4 w-4" />,
          hasArrow: true,
        },
      ]
    },
    // 第�?組�?上傳?��?載�?�?
    {
      group: 'upload-download',
      items: [
        {
          id: 'upload',
          label: '上�?',
          icon: <Upload className="h-4 w-4" />,
          hasArrow: true,
        },
        {
          id: 'download-original',
          label: '下�??��?檔�?',
          icon: <Download className="h-4 w-4" />,
          info: true,
        },
        {
          id: 'export-history',
          label: '?�出檔�?記�?',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          id: 'submit-review',
          label: '?�交以�?審閱',
          icon: <UserCheck className="h-4 w-4" />,
        },
        {
          id: 'create-transfer',
          // TODO[P2][lint][parser-error]: 關閉字串引號，避免 ESLint Parsing error: Unterminated string literal（參考 ESLint parsing 與 TS 語法規則）
          label: '建�??��?',
          icon: <Package className="h-4 w-4" />,
          info: true,
        },
      ]
    },
    // 第�?組�?設�??�更多選??
    {
      group: 'settings',
      items: [
        {
          id: 'permission-settings',
          label: '權�?設�?',
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: 'review-auto-trigger',
          label: '審閱?��?觸發詳細資�?',
          icon: <Play className="h-4 w-4" />,
        },
        {
          id: 'more',
          label: '?��?',
          icon: <MoreVertical className="h-4 w-4" />,
          hasArrow: true,
        },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {menuItems.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            {group.items.map((menuItem) => (
              <DropdownMenuItem
                key={menuItem.id}
                onClick={() => onAction(menuItem.id)}
                className="flex items-center gap-3 py-2 px-3"
              >
                <div className="flex items-center gap-2">
                  {menuItem.icon}
                  {menuItem.secondaryIcon && (
                    <span className="ml-1">{menuItem.secondaryIcon}</span>
                  )}
                </div>
                <span className="flex-1 text-sm">{menuItem.label}</span>
                <div className="flex items-center gap-1">
                  {menuItem.info && (
                    <Info className="h-3 w-3 text-muted-foreground" />
                  )}
                  {menuItem.hasArrow && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
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
          // TODO[P2][lint][parser-error]: 修正未終止字串，確保 JSX/TSX 能正確解析
          label: '屬�?',
          hasArrow: true,
        },
        {
          id: 'compliance',
          // TODO[P2][lint][parser-error]: 修正未終止字串
          label: '?��???',
          hasArrow: true,
        },
        {
          id: 'review-auto-trigger',
          label: '審閱?��?觸發',
        },
        {
          id: 'packages',
          label: '套件',
        },
        {
          id: 'advanced',
          label: '?��?',
        },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4 mr-2" />
          設�?
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
                {/* TODO[P2][lint][parser-error][低認知]: 這段在 L254 報 ") expected"。建議：
                    - 確保 {menuItem.hasArrow && ( ... )} 的括號成對。
                    - JSX 註解勿置於運算式最前，先渲染元素再於上方保留註解。
                    - 若僅需圖示，保留 <span>{'>'}</span>，或以 <ChevronRight /> 取代。 */}
                {menuItem.hasArrow && (
                  <span className="text-muted-foreground">{'>'}</span>
                )}
              </DropdownMenuItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
