/**
 * @fileoverview A placeholder component displayed when a folder is empty.
 * It provides a user-friendly message and a primary call-to-action button
 * to encourage users to upload their first file, improving the user experience
 * for new or empty directories.
 */
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
          æ²’æ?è¦æª¢è¦–ç?æª”æ?
        </h3>
        
        <p className="text-gray-500 mb-6">
          {folderName ? `??${folderName} è³‡æ?å¤¾ä¸­æ²’æ?æª”æ??‚` : 'æ­¤è??™å¤¾ä¸­æ??‰æ?æ¡ˆã€?}
          å°‡æ?æ¡ˆæ??³åˆ°æ­¤è??–ä?è¼‰æ?æ¡ˆã€?
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={onUpload}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            ä¸Šè?æª”æ?
          </Button>
          
          <p className="text-xs text-gray-400">
            <a 
              href="https://help.autodesk.com/view/BUILD/CHT/?guid=Upload_files" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              ?­è§£?´å?
            </a>
            ?œæ–¼æª”æ???
          </p>
        </div>
      </div>
    </div>
  );
}
