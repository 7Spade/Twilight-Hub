/**
 * @fileoverview A placeholder component displayed when a folder is empty.
 * It provides a user-friendly message and a primary call-to-action button
 * to encourage users to upload their first file, improving the user experience
 * for new or empty directories.
 */
'use client';
// TODO: [P2] FIX src/components/features/spaces/components/file-explorer/empty-folder-state.tsx - 修復字符串字面量錯誤（第31行未終止）

import React from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, FolderOpen } from 'lucide-react';

interface EmptyFolderStateProps {
  onUpload: () => void;
  folderName?: string;
}

export function EmptyFolderState({ onUpload, folderName }: EmptyFolderStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          沒�?要檢視�?檔�?
        </h3>
        
        <p className="text-gray-500 mb-6">
          {/* TODO[P2][lint][parser-error]: 修正模板字串與單引號未關閉問題 */}
          {folderName ? `??${folderName} 資�?夾中沒�?檔�??�` : '此�??�夾中�??��?案�'}
          將�?案�??�到此�??��?載�?案�?
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={onUpload}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            上�?檔�?
          </Button>
          
          <p className="text-xs text-gray-400">
            <a 
              href="https://help.autodesk.com/view/BUILD/CHT/?guid=Upload_files" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              {/* TODO[P2][copy]: 補齊文案 */}
              ?�解?��?
            </a>
            {/* TODO[P2][copy]: 補齊文案 */}
            ?�於檔�???
          </p>
        </div>
      </div>
    </div>
  );
}
