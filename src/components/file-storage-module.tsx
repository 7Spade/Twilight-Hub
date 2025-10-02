/**
 * @fileoverview A functional module for uploading, listing, and downloading files.
 * It integrates with Firebase Storage to manage files associated with a specific `spaceId`.
 * The component handles file selection, upload with progress simulation, and fetching
 * the list of existing files for display.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';

import { useFirebaseApp } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { File, UploadCloud, Download } from 'lucide-react';

interface FileItem {
  name: string;
  url: string;
}

export function FileStorageModule({ spaceId }: { spaceId: string }) {
  const firebaseApp = useFirebaseApp();
  const storage = useMemo(() => firebaseApp ? getStorage(firebaseApp) : null, [firebaseApp]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const spaceFilesRef = useMemo(() => storage ? ref(storage, `spaces/${spaceId}`) : null, [storage, spaceId]);

  const fetchFiles = useCallback(async () => {
    if (!spaceFilesRef) return;
    try {
      const res = await listAll(spaceFilesRef);
      const fileItems = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        })
      );
      setFiles(fileItems);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        variant: "destructive",
        title: "Failed to load files",
        description: "Could not retrieve the list of files for this space.",
      });
    }
  }, [spaceFilesRef, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !storage) return;

    setUploading(true);
    setUploadProgress(0);

    const fileRef = ref(storage, `spaces/${spaceId}/${selectedFile.name}`);
    
    try {
      // Simulate progress as uploadBytes doesn't provide it directly
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      await uploadBytes(fileRef, selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Upload successful!",
        description: `${selectedFile.name} has been uploaded.`,
      });

      await fetchFiles(); // Refresh file list
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file.",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null);
       setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-6 w-6" />
          File Storage
        </CardTitle>
        <CardDescription>
          Upload and manage files for this space. All files are stored securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <h3 className="font-medium">Upload a new file</h3>
            <div className="flex gap-2">
                <Input type="file" onChange={handleFileSelect} disabled={uploading} />
                <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </div>
            {uploading && <Progress value={uploadProgress} className="w-full mt-2" />}
        </div>
        
        <div className="space-y-2">
            <h3 className="font-medium">Uploaded Files</h3>
            <div className="border rounded-md">
                {files.length > 0 ? (
                    <ul className="divide-y">
                        {files.map((file) => (
                        <li key={file.name} className="flex items-center justify-between p-3">
                            <span className="text-sm font-medium">{file.name}</span>
                            <Button asChild variant="outline" size="sm">
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground p-4 text-center">No files uploaded yet.</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
