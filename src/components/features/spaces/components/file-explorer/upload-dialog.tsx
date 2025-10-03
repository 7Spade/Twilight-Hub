/**
 * @fileoverview A dialog component for uploading files.
 * It supports both drag-and-drop and traditional file selection. The dialog
 * displays the upload progress and provides options, such as syncing to mobile,
 * before completing the upload process.
 */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  Maximize2, 
  Minimize2,
  Monitor,
  FileText,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  uploadProgress?: number;
  isUploading?: boolean;
}

export function UploadDialog({ 
  isOpen, 
  onClose, 
  onUpload, 
  uploadProgress = 0,
  isUploading = false 
}: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [syncToMobile, setSyncToMobile] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-md",
          isMaximized && "sm:max-w-4xl"
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">上�?檔�?</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 上傳來�??��? */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">?��?上傳來�?</Label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleFileSelect}
            >
              <Monitor className="h-4 w-4 mr-2" />
              從您?�電??
            </Button>
          </div>

          {/* ?�放?�??*/}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400",
              isUploading && "pointer-events-none opacity-50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <FileText className="h-16 w-16 text-gray-400" />
                <div className="absolute -bottom-2 -right-2">
                  <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  將�?案�??�至此�??�選?��?述選??
                </p>
                <p className="text-xs text-gray-500">
                  ?�援多個�?案�??��???
                </p>
              </div>
            </div>
          </div>

          {/* 上傳?�度 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上傳�?..</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* ?�步?��? */}
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <Label htmlFor="sync-mobile" className="text-sm text-blue-600">
              ?��?檔�??�否?�步?��??��?置�?
            </Label>
            <Switch
              id="sync-mobile"
              checked={syncToMobile}
              onCheckedChange={setSyncToMobile}
            />
          </div>

          {/* ?��??��?件輸??*/}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* 底部?��? */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            ?��?
          </Button>
          <Button 
            onClick={handleFileSelect}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            完�?
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
