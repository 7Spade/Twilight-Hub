/**
 * @fileoverview A context menu component for file and folder items in the explorer.
 * It provides a list of actions (e.g., rename, delete, share) relevant to the
 * selected item. A separate context menu for the toolbar is also defined here.
 */
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
    // Á¨¨‰?ÁµÑÔ??∫Êú¨?á‰ª∂/Ë≥áÊ?Â§æÊ?‰Ω?
    {
      group: 'basic',
      items: [
        {
          id: 'add-subfolder',
          label: '?†ÂÖ•Â≠êË??ôÂ§æ',
          icon: <Plus className="h-4 w-4" />,
          secondaryIcon: <Folder className="h-4 w-4" />,
        },
        {
          id: 'rename',
          label: '?¥Â?',
          icon: <Edit className="h-4 w-4" />,
        },
        {
          id: 'share',
          label: '?±Áî®',
          icon: <Share className="h-4 w-4" />,
        },
        {
          id: 'move',
          label: 'ÁßªÂ?',
          icon: <Move className="h-4 w-4" />,
        },
        {
          id: 'delete',
          label: '?™Èô§',
          icon: <Trash2 className="h-4 w-4" />,
        },
        {
          id: 'sort-by',
          label: '?íÂ?‰æùÊ?',
          icon: <ArrowUpDown className="h-4 w-4" />,
          hasArrow: true,
        },
      ]
    },
    // Á¨¨‰?ÁµÑÔ?‰∏äÂÇ≥?å‰?ËºâÊ?‰Ω?
    {
      group: 'upload-download',
      items: [
        {
          id: 'upload',
          label: '‰∏äË?',
          icon: <Upload className="h-4 w-4" />,
          hasArrow: true,
        },
        {
          id: 'download-original',
          label: '‰∏ãË??üÂ?Ê™îÊ?',
          icon: <Download className="h-4 w-4" />,
          info: true,
        },
        {
          id: 'export-history',
          label: '?ØÂá∫Ê™îÊ?Ë®òÈ?',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          id: 'submit-review',
          label: '?ê‰∫§‰ª•‰?ÂØ©Èñ±',
          icon: <UserCheck className="h-4 w-4" />,
        },
        {
          id: 'create-transfer',
          label: 'Âª∫Á??≥ÈÄ?,
          icon: <Package className="h-4 w-4" />,
          info: true,
        },
      ]
    },
    // Á¨¨‰?ÁµÑÔ?Ë®≠Â??åÊõ¥Â§öÈÅ∏??
    {
      group: 'settings',
      items: [
        {
          id: 'permission-settings',
          label: 'Ê¨äÈ?Ë®≠Â?',
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: 'review-auto-trigger',
          label: 'ÂØ©Èñ±?™Â?Ëß∏ÁôºË©≥Á¥∞Ë≥áÊ?',
          icon: <Play className="h-4 w-4" />,
        },
        {
          id: 'more',
          label: '?¥Â?',
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
          label: 'Â±¨ÊÄ?,
          hasArrow: true,
        },
        {
          id: 'compliance',
          label: '?àË???,
          hasArrow: true,
        },
        {
          id: 'review-auto-trigger',
          label: 'ÂØ©Èñ±?™Â?Ëß∏Áôº',
        },
        {
          id: 'packages',
          label: 'Â•ó‰ª∂',
        },
        {
          id: 'advanced',
          label: '?≤È?',
        },
      ]
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4 mr-2" />
          Ë®≠Â?
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
                  <span className="text-muted-foreground">??/span>
                )}
              </DropdownMenuItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
