// 已處理：移除此檔 P0 語法錯誤 TODO（模板字面量已正確）
/**
 * @fileoverview A component for the "Packages" tab in the file explorer's sidebar.
 * It displays a list of file packages, which are collections of related documents.
 * This component handles the creation and management of these packages.
 */
'use client';
// 註記：原 L156 附近語法檢查正常，保留現代化結構與簡潔文案

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table as _Table, TableBody as _TableBody, TableCell as _TableCell, TableHead as _TableHead, TableHeader as _TableHeader, TableRow as _TableRow } from '@/components/ui/table';
import { 
  Package, 
  Plus, 
  Download, 
  Share, 
  MoreVertical,
  Calendar,
  User as _User,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  createdBy: string;
  fileCount: number;
  size: number;
}

interface PackagesTabProps {
  className?: string;
}

export function PackagesTab({ className }: PackagesTabProps) {
  const [packages] = useState<PackageItem[]>([
    {
      id: 'pkg-1',
      name: 'Architecture Package V1.0',
      description: 'Includes architectural drawings and related documents',
      version: '1.0',
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'ACC Sample P...',
      fileCount: 25,
      size: 52428800 // 50MB
    },
    {
      id: 'pkg-2',
      name: 'Structural Package V2.1',
      // Close string literal to avoid Unterminated string literal
      description: 'Structural design and calculation documents',
      version: '2.1',
      status: 'draft',
      createdAt: '2024-01-20T14:20:00Z',
      createdBy: 'ACC Sample System',
      fileCount: 18,
      size: 31457280 // 30MB
    },
    {
      id: 'pkg-3',
      name: 'MEP Package V1.5',
      // Close string literal
      description: 'MEP system design and installation documents',
      version: '1.5',
      status: 'published',
      createdAt: '2024-01-18T09:15:00Z',
      createdBy: 'ACC Sample P...',
      fileCount: 32,
      size: 73400320 // 70MB
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    version: '1.0'
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'archived': return 'Archived';
      default: return status;
    }
  };

  const handleCreatePackage = () => {
    console.log('Creating package:', newPackage);
    setIsCreateDialogOpen(false);
    setNewPackage({ name: '', description: '', version: '1.0' });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Packages</h3>
          <p className="text-sm text-muted-foreground">
            Manage organization related file packages
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package-name">Package Name</Label>
                <Input
                  id="package-name"
                  placeholder="Enter package name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-description">Description</Label>
                <Textarea
                  id="package-description"
                  placeholder="Enter package description"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-version">Version</Label>
                <Input
                  id="package-version"
                  placeholder="1.0"
                  value={newPackage.version}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, version: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePackage}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages list */}
      {packages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No packages</h3>
          <p className="text-gray-500 mb-6">Create a package to organize and manage related files</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first package
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {pkg.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(pkg.status)}>
                      {getStatusText(pkg.status)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Version</span>
                    <p className="font-medium">V{pkg.version}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Files</span>
                    <p className="font-medium">{pkg.fileCount} files</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size</span>
                    <p className="font-medium">{formatFileSize(pkg.size)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created By</span>
                    <p className="font-medium">{pkg.createdBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(pkg.createdAt)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
