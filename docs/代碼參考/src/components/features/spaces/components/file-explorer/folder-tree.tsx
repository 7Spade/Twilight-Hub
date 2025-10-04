// 已處理：移除此檔 P0 語法錯誤 TODO（JSX 結構與字元檢查無誤）
/**
 * @fileoverview A component that displays a hierarchical folder structure.
 * It allows users to expand and collapse folders, select items, and access
 * context-menu actions. It's the primary navigation element on the left side
 * of the file explorer.
 */
'use client';
// TODO: [P1] REFACTOR src/components/features/spaces/components/file-explorer/folder-tree.tsx - 抽離 mock 與分層
// 說明：將 mockFolders 與 organizeFilesIntoFolders 移到純函數模組（shared/utils 或 features 層 utils），
// 並以 props 注入結果；本元件專注渲染與互動，降低檔案長度與複雜度。
// @assignee ai

import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen,
  MoreVertical,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContextMenu } from './context-menu';
import { PackagesTab } from './packages-tab';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
  description?: string;
  version?: string;
  indicator?: string;
  tag?: string;
  issue?: string;
  updater?: string;
  versionContributor?: string;
  reviewStatus?: string;
  children?: FileItem[];
}

interface FolderTreeProps {
  files: FileItem[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onItemClick: (item: FileItem) => void;
  onItemAction?: (item: FileItem, action: string) => void;
}

export function FolderTree({ files, selectedItems, onSelectionChange: _onSelectionChange, onItemClick, onItemAction }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['project-files', 'supported']));

  // Organize real file list into folders
  const organizeFilesIntoFolders = (fileList: FileItem[]) => {
    const folders: { [key: string]: FileItem[] } = {};
    
    // Infer folder by file name prefix/suffix
    fileList.forEach(file => {
      let folderName = 'Project Files';
      
      // Derive by name prefix
      if (file.name.startsWith('A000') || file.name.startsWith('A100')) {
        folderName = 'Architecture';
      } else if (file.name.includes('PDF') || file.name.endsWith('.pdf')) {
        folderName = 'PDFs';
      } else if (file.name.includes('CAD') || file.name.endsWith('.dwg')) {
        folderName = 'CAD Files';
      } else if (file.name.includes('Contract')) {
        folderName = 'Contracts';
      } else if (file.name.includes('Report')) {
        folderName = 'Reports';
      }
      
      if (!folders[folderName]) {
        folders[folderName] = [];
      }
      folders[folderName].push(file);
    });

    // Convert to FileItem structure
    return Object.entries(folders).map(([folderName, folderFiles]) => ({
      id: folderName.toLowerCase().replace(/\s+/g, '-'),
      name: folderName,
      type: 'folder' as const,
      timeCreated: '',
      updated: '',
      children: folderFiles.map(file => ({
        ...file,
        id: `file-${file.id}`,
        type: 'file' as const
      }))
    }));
  };

  // Use real files to build folder structure
  const organizedFolders = organizeFilesIntoFolders(files);

  // Mock folders for testing with rich nested structure
  const mockFolders: FileItem[] = [
    { 
      id: 'bids', 
      name: 'Bids', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'bid-documents', name: 'Bid Documents', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'technical-bids', name: 'Technical Bids', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'structural-bids', name: 'Structural Bids', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'bid-001', name: 'Bid-001.pdf', type: 'file', timeCreated: '2024-01-01T00:00:00Z', updated: '2024-01-15T10:30:00Z', size: 1024000, contentType: 'application/pdf' },
              { id: 'bid-002', name: 'Bid-002.pdf', type: 'file', timeCreated: '2024-01-02T00:00:00Z', updated: '2024-01-16T14:20:00Z', size: 512000, contentType: 'application/pdf' }
            ]},
            { id: 'mechanical-bids', name: 'Mechanical Bids', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'hvac-bids', name: 'HVAC Bids', type: 'folder', timeCreated: '', updated: '', children: [
                { id: 'hvac-proposal', name: 'HVAC Proposal.pdf', type: 'file', timeCreated: '2024-01-03T00:00:00Z', updated: '2024-01-17T09:15:00Z', size: 768000, contentType: 'application/pdf' }
              ]}
            ]}
          ]},
          { id: 'financial-bids', name: 'Financial Bids', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'cost-breakdown', name: 'Cost Breakdown', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'material-costs', name: 'Material Costs.xlsx', type: 'file', timeCreated: '2024-01-04T00:00:00Z', updated: '2024-01-18T11:20:00Z', size: 256000, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
              { id: 'labor-costs', name: 'Labor Costs.xlsx', type: 'file', timeCreated: '2024-01-05T00:00:00Z', updated: '2024-01-19T14:30:00Z', size: 192000, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            ]}
          ]}
        ]},
        { id: 'subcontractor-bids', name: 'Subcontractor Bids', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'electrical-bids', name: 'Electrical Bids', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'electrical-contractors', name: 'Electrical Contractors', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'contractor-a', name: 'Contractor A', type: 'folder', timeCreated: '', updated: '', children: [
                { id: 'electrical-quote-a', name: 'Electrical Quote A.pdf', type: 'file', timeCreated: '2024-01-06T00:00:00Z', updated: '2024-01-20T16:45:00Z', size: 384000, contentType: 'application/pdf' }
              ]},
              { id: 'contractor-b', name: 'Contractor B', type: 'folder', timeCreated: '', updated: '', children: [
                { id: 'electrical-quote-b', name: 'Electrical Quote B.pdf', type: 'file', timeCreated: '2024-01-07T00:00:00Z', updated: '2024-01-21T10:15:00Z', size: 320000, contentType: 'application/pdf' }
              ]}
            ]}
          ]},
          { id: 'plumbing-bids', name: 'Plumbing Bids', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'plumbing-contractors', name: 'Plumbing Contractors', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'plumbing-quote-1', name: 'Plumbing Quote 1.pdf', type: 'file', timeCreated: '2024-01-08T00:00:00Z', updated: '2024-01-22T13:20:00Z', size: 448000, contentType: 'application/pdf' }
            ]}
          ]}
        ]}
      ]
    },
    { 
      id: 'contractors', 
      name: 'Contractors', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'main-contractors', name: 'Main Contractors', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'contractor-a', name: 'Contractor A', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'contract-a', name: 'Contract A.pdf', type: 'file', timeCreated: '2024-01-04T00:00:00Z', updated: '2024-01-18T16:45:00Z', size: 128000, contentType: 'application/pdf' }
          ]},
          { id: 'contractor-b', name: 'Contractor B', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]},
        { id: 'subcontractors', name: 'Subcontractors', type: 'folder', timeCreated: '', updated: '', children: [] }
      ]
    },
    { 
      id: 'coordination', 
      name: 'Coordination', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'meetings', name: 'Meetings', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'weekly-meetings', name: 'Weekly Meetings', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'meeting-notes-1', name: 'Meeting Notes 1.pdf', type: 'file', timeCreated: '2024-01-05T00:00:00Z', updated: '2024-01-19T11:30:00Z', size: 64000, contentType: 'application/pdf' },
            { id: 'meeting-notes-2', name: 'Meeting Notes 2.pdf', type: 'file', timeCreated: '2024-01-06T00:00:00Z', updated: '2024-01-20T15:45:00Z', size: 32000, contentType: 'application/pdf' }
          ]}
        ]},
        { id: 'schedules', name: 'Schedules', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'project-schedule', name: 'Project Schedule.pdf', type: 'file', timeCreated: '2024-01-07T00:00:00Z', updated: '2024-01-21T09:20:00Z', size: 192000, contentType: 'application/pdf' }
        ]}
      ]
    },
    { 
      id: 'correspondence', 
      name: 'Correspondence', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'emails', name: 'Emails', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'client-emails', name: 'Client Emails', type: 'folder', timeCreated: '', updated: '', children: [] },
          { id: 'internal-emails', name: 'Internal Emails', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]},
        { id: 'letters', name: 'Letters', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'official-letters', name: 'Official Letters', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]}
      ]
    },
    { 
      id: 'crystal-clear', 
      name: 'Crystal-Clear-Glazing', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'design-docs', name: 'Design Documents', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'specifications', name: 'Specifications', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'glass-specs', name: 'Glass Specifications.pdf', type: 'file', timeCreated: '2024-01-08T00:00:00Z', updated: '2024-01-22T14:10:00Z', size: 384000, contentType: 'application/pdf' }
          ]},
          { id: 'drawings', name: 'Drawings', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'detail-drawings', name: 'Detail Drawings', type: 'folder', timeCreated: '', updated: '', children: [] },
            { id: 'assembly-drawings', name: 'Assembly Drawings', type: 'folder', timeCreated: '', updated: '', children: [] }
          ]}
        ]},
        { id: 'installation', name: 'Installation', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'installation-guide', name: 'Installation Guide.pdf', type: 'file', timeCreated: '2024-01-09T00:00:00Z', updated: '2024-01-23T10:15:00Z', size: 768000, contentType: 'application/pdf' }
        ]}
      ]
    },
    { 
      id: 'delta-engineering', 
      name: 'Delta-Engineers', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'structural-design', name: 'Structural Design', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'calculations', name: 'Calculations', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'load-calculations', name: 'Load Calculations.xlsx', type: 'file', timeCreated: '2024-01-10T00:00:00Z', updated: '2024-01-24T13:30:00Z', size: 512000, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          ]}
        ]},
        { id: 'reports', name: 'Reports', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'engineering-report', name: 'Engineering Report.pdf', type: 'file', timeCreated: '2024-01-11T00:00:00Z', updated: '2024-01-25T16:20:00Z', size: 896000, contentType: 'application/pdf' }
        ]}
      ]
    },
    { 
      id: 'drawings', 
      name: 'Drawings', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'architectural', name: 'Architectural', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'floor-plans', name: 'Floor Plans', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'ground-level', name: 'Ground Level', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'ground-floor', name: 'Ground Floor.dwg', type: 'file', timeCreated: '2024-01-12T00:00:00Z', updated: '2024-01-26T11:45:00Z', size: 2048000, contentType: 'application/dwg' },
              { id: 'basement', name: 'Basement.dwg', type: 'file', timeCreated: '2024-01-13T00:00:00Z', updated: '2024-01-27T14:30:00Z', size: 1536000, contentType: 'application/dwg' }
            ]},
            { id: 'upper-levels', name: 'Upper Levels', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'first-floor', name: 'First Floor.dwg', type: 'file', timeCreated: '2024-01-14T00:00:00Z', updated: '2024-01-28T09:15:00Z', size: 1024000, contentType: 'application/dwg' },
              { id: 'second-floor', name: 'Second Floor.dwg', type: 'file', timeCreated: '2024-01-15T00:00:00Z', updated: '2024-01-29T12:30:00Z', size: 896000, contentType: 'application/dwg' }
            ]}
          ]},
          { id: 'elevations', name: 'Elevations', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'exterior-elevations', name: 'Exterior Elevations', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'north-elevation', name: 'North Elevation.dwg', type: 'file', timeCreated: '2024-01-16T00:00:00Z', updated: '2024-01-30T15:20:00Z', size: 1280000, contentType: 'application/dwg' },
              { id: 'south-elevation', name: 'South Elevation.dwg', type: 'file', timeCreated: '2024-01-17T00:00:00Z', updated: '2024-01-31T10:45:00Z', size: 1152000, contentType: 'application/dwg' }
            ]},
            { id: 'interior-elevations', name: 'Interior Elevations', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'lobby-elevation', name: 'Lobby Elevation.dwg', type: 'file', timeCreated: '2024-01-18T00:00:00Z', updated: '2024-02-01T14:10:00Z', size: 640000, contentType: 'application/dwg' }
            ]}
          ]}
        ]},
        { id: 'structural', name: 'Structural', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'foundation-plans', name: 'Foundation Plans', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'foundation-details', name: 'Foundation Details', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'footing-plans', name: 'Footing Plans.dwg', type: 'file', timeCreated: '2024-01-19T00:00:00Z', updated: '2024-02-02T09:30:00Z', size: 768000, contentType: 'application/dwg' }
            ]}
          ]},
          { id: 'beam-details', name: 'Beam Details', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'steel-beams', name: 'Steel Beams', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'beam-schedule', name: 'Beam Schedule.dwg', type: 'file', timeCreated: '2024-01-20T00:00:00Z', updated: '2024-02-03T11:15:00Z', size: 512000, contentType: 'application/dwg' }
            ]}
          ]}
        ]},
        { id: 'mep', name: 'MEP (Mechanical, Electrical, Plumbing)', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'electrical-plans', name: 'Electrical Plans', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'power-distribution', name: 'Power Distribution', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'electrical-riser', name: 'Electrical Riser.dwg', type: 'file', timeCreated: '2024-01-21T00:00:00Z', updated: '2024-02-04T16:40:00Z', size: 384000, contentType: 'application/dwg' }
            ]}
          ]},
          { id: 'plumbing-plans', name: 'Plumbing Plans', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'water-supply', name: 'Water Supply', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'plumbing-riser', name: 'Plumbing Riser.dwg', type: 'file', timeCreated: '2024-01-22T00:00:00Z', updated: '2024-02-05T13:25:00Z', size: 320000, contentType: 'application/dwg' }
            ]}
          ]},
          { id: 'hvac-plans', name: 'HVAC Plans', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'ductwork', name: 'Ductwork', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'hvac-riser', name: 'HVAC Riser.dwg', type: 'file', timeCreated: '2024-01-23T00:00:00Z', updated: '2024-02-06T10:50:00Z', size: 448000, contentType: 'application/dwg' }
            ]}
          ]}
        ]}
      ]
    },
    { 
      id: 'for-the-field', 
      name: 'For the Field', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'safety-docs', name: 'Safety Documents', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'safety-manual', name: 'Safety Manual.pdf', type: 'file', timeCreated: '2024-01-15T00:00:00Z', updated: '2024-01-29T12:00:00Z', size: 1280000, contentType: 'application/pdf' }
        ]},
        { id: 'checklists', name: 'Checklists', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'daily-checklist', name: 'Daily Checklist.pdf', type: 'file', timeCreated: '2024-01-16T00:00:00Z', updated: '2024-01-30T08:30:00Z', size: 64000, contentType: 'application/pdf' }
        ]}
      ]
    },
    { 
      id: 'handover', 
      name: 'Handover documents', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: 'as-built-drawings', name: 'As-Built Drawings', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'final-drawings', name: 'Final Drawings', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]},
        { id: 'warranties', name: 'Warranties', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'equipment-warranties', name: 'Equipment Warranties', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]}
      ]
    },
    { 
      id: 'quantify', 
      name: 'Quantify models', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { id: '3d-models', name: '3D Models', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'revit-models', name: 'Revit Models', type: 'folder', timeCreated: '', updated: '', children: [
            { id: 'building-model', name: 'Building Model.rvt', type: 'file', timeCreated: '2024-01-17T00:00:00Z', updated: '2024-01-31T15:20:00Z', size: 51200000, contentType: 'application/octet-stream' }
          ]}
        ]},
        { id: 'bim-data', name: 'BIM Data', type: 'folder', timeCreated: '', updated: '', children: [
          { id: 'ifc-files', name: 'IFC Files', type: 'folder', timeCreated: '', updated: '', children: [] }
        ]}
      ]
    },
    { 
      id: 'supported', 
      name: 'Supported files formats - Examples', 
      type: 'folder', 
      timeCreated: '', 
      updated: '', 
      children: [
        { 
          id: 'pdfs', 
          name: 'PDFs', 
          type: 'folder', 
          timeCreated: '', 
          updated: '', 
          children: [
            { id: 'sample-pdf-1', name: 'Sample Document 1.pdf', type: 'file', timeCreated: '2024-01-18T00:00:00Z', updated: '2024-02-01T10:45:00Z', size: 512000, contentType: 'application/pdf' },
            { id: 'sample-pdf-2', name: 'Sample Document 2.pdf', type: 'file', timeCreated: '2024-01-19T00:00:00Z', updated: '2024-02-02T14:20:00Z', size: 768000, contentType: 'application/pdf' }
          ]
        },
        { 
          id: 'cad-files', 
          name: 'CAD Files', 
          type: 'folder', 
          timeCreated: '', 
          updated: '', 
          children: [
            { id: 'autocad-files', name: 'AutoCAD Files', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'sample-dwg', name: 'Sample Drawing.dwg', type: 'file', timeCreated: '2024-01-20T00:00:00Z', updated: '2024-02-03T09:30:00Z', size: 2048000, contentType: 'application/dwg' }
            ]}
          ]
        },
        { 
          id: 'office-docs', 
          name: 'Office Documents', 
          type: 'folder', 
          timeCreated: '', 
          updated: '', 
          children: [
            { id: 'word-docs', name: 'Word Documents', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'sample-docx', name: 'Sample Document.docx', type: 'file', timeCreated: '2024-01-21T00:00:00Z', updated: '2024-02-04T11:15:00Z', size: 128000, contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
            ]},
            { id: 'excel-files', name: 'Excel Files', type: 'folder', timeCreated: '', updated: '', children: [
              { id: 'sample-xlsx', name: 'Sample Spreadsheet.xlsx', type: 'file', timeCreated: '2024-01-22T00:00:00Z', updated: '2024-02-05T16:40:00Z', size: 256000, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            ]}
          ]
        }
      ]
    }
  ];

  // Merge mock folder data with real file data
  const allFolders = [...mockFolders, ...organizedFolders];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (item: FileItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 cursor-pointer group rounded-sm",
            isSelected && "bg-blue-50"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Expand/Collapse arrow */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              <button
                className="h-4 w-4 p-0 hover:bg-gray-200 rounded-sm flex items-center justify-center"
                onClick={() => toggleFolder(item.id)}
              >
                {isExpanded ? <ChevronDown className="h-3 w-3 text-gray-600" /> : <ChevronRight className="h-3 w-3 text-gray-600" />}
              </button>
            ) : (
              <div className="h-3 w-3" />
            )}
          </div>
          
          {/* Item icon */}
          <div className="w-4 h-4 flex items-center justify-center">
            {item.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-gray-500" />
              )
            ) : (
              <File className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          {/* Item name */}
          <span 
            className="text-sm text-gray-700 truncate flex-1"
            onClick={() => onItemClick(item)}
          >
            {item.name}
          </span>
          
          {/* Context menu */}
          <ContextMenu
            item={item}
            onAction={(action) => onItemAction?.(item, action)}
          >
            <button
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded-sm flex items-center justify-center ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3 text-gray-400" />
            </button>
          </ContextMenu>
        </div>
        
        {/* Children folders */}
        {item.type === 'folder' && isExpanded && hasChildren && (
          <div>
            {(item.children ?? []).map(child => renderFolderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="folders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {/* Ensure valid JSX closing tags */}
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="folders" className="mt-2">
          <div className="space-y-1">
            {/* Section - Project files */}
            <div className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 cursor-pointer group rounded-sm bg-gray-50">
              <div className="w-4 h-4 flex items-center justify-center">
                <button
                  className="h-4 w-4 p-0 hover:bg-gray-200 rounded-sm flex items-center justify-center"
                  onClick={() => toggleFolder('project-files')}
                >
                  {expandedFolders.has('project-files') ? 
                    <ChevronDown className="h-3 w-3 text-gray-600" /> : 
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                  }
                </button>
              </div>
              <div className="w-4 h-4 flex items-center justify-center">
                <Folder className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">Project Files</span>
              <ContextMenu
                item={{ id: 'project-files', name: 'Project Files', type: 'folder', timeCreated: '', updated: '' }}
                onAction={(action) => onItemAction?.({ id: 'project-files', name: 'Project Files', type: 'folder', timeCreated: '', updated: '' }, action)}
              >
                <button
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded-sm flex items-center justify-center ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </button>
              </ContextMenu>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {allFolders.map(item => renderFolderItem(item))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
              <TabsContent value="packages" className="mt-2">
                <PackagesTab />
              </TabsContent>
      </Tabs>
    </div>
  );
}
