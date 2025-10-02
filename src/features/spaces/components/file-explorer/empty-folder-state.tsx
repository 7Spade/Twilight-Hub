'use client';

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
          沒有要檢視的檔案
        </h3>
        
        <p className="text-gray-500 mb-6">
          {folderName ? `在 ${folderName} 資料夾中沒有檔案。` : '此資料夾中沒有檔案。'}
          將檔案拖曳到此處或上載檔案。
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={onUpload}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            上載檔案
          </Button>
          
          <p className="text-xs text-gray-400">
            <a 
              href="https://help.autodesk.com/view/BUILD/CHT/?guid=Upload_files" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              瞭解更多
            </a>
            關於檔案。
          </p>
        </div>
      </div>
    </div>
  );
}
