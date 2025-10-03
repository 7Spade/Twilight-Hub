/**
 * @fileoverview This component serves as a simple wrapper for the FileExplorer.
 * Its primary purpose is to provide a container with a fixed height, ensuring
 * the FileExplorer component displays correctly within the space's tabbed layout.
 */
'use client';

import { FileExplorer } from './file-explorer/file-explorer';

interface FileManagerProps {
  spaceId: string;
  userId: string;
}

export function FileManager({ spaceId, userId }: FileManagerProps) {
  return (
    <div className="h-[600px]">
      <FileExplorer spaceId={spaceId} userId={userId} />
    </div>
  );
}
