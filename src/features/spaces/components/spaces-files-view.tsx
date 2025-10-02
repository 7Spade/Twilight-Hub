'use client';

import { FileExplorer } from './file-explorer';

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
