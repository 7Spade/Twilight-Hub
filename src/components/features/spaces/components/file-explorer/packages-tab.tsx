// TODO: [P0] FIX src/components/features/spaces/components/file-explorer/packages-tab.tsx - 修復語法錯誤（第61行未終止的字串）
// 說明：修正字串/模板字面量，避免編譯失敗
/**
 * @fileoverview A component for the "Packages" tab in the file explorer's sidebar.
 * It displays a list of file packages, which are collections of related documents.
 * This component handles the creation and management of these packages.
 */
'use client';
// TODO: [P0] FIX Parsing (L156) [低認知][現代化]
// - 問題：Unexpected token（可能缺少 {'>'} 或需使用 &gt;）
// - 指引：檢查 JSX 標籤關閉與大於號轉義，先以簡化標籤/文字替代。

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Plus, 
  Download, 
  Share, 
  MoreVertical,
  Calendar,
  User,
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
      name: '建�??��?套件 V1.0',
      description: '?�含?�?�建築相?��?紙�?完整套件',
      version: '1.0',
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'ACC Sample P...',
      fileCount: 25,
      size: 52428800 // 50MB
    },
    {
      id: 'pkg-2',
      name: '結�?工�?套件 V2.1',
      // TODO[P2][lint][parser-error][低認知]: 關閉字串引號，避免 Unterminated string literal
      description: '結�?設�??��?算�?件�?�?',
      version: '2.1',
      status: 'draft',
      createdAt: '2024-01-20T14:20:00Z',
      createdBy: 'A�?ACC 系統',
      fileCount: 18,
      size: 31457280 // 30MB
    },
    {
      id: 'pkg-3',
      name: '機電設�?套件 V1.5',
      // TODO[P2][lint][parser-error][低認知]: 關閉字串引號
      description: '機電系統設�??��?裝�?�?',
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
      // TODO[P2][lint][parser-error][低認知]: 關閉字串引號
      case 'published': return '已發�?';
      case 'draft': return '?�稿';
      // TODO[P2][lint][parser-error][低認知]: 關閉字串引號
      case 'archived': return '已�?�?';
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
      {/* 標�??��?作�???*/}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">套件</h3>
          <p className="text-sm text-muted-foreground">
            管�??��?織相?��?件�?套件
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              建�?套件
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 行 159 DialogTitle 關閉標籤破損；請改為 </DialogTitle> */}
              <DialogTitle>建????/DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package-name">套件?�稱</Label>
                <Input
                  id="package-name"
                  placeholder="輸入套件?�稱"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-description">?�述</Label>
                <Textarea
                  id="package-description"
                  placeholder="輸入套件?�述"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-version">?�本</Label>
                <Input
                  id="package-version"
                  placeholder="1.0"
                  value={newPackage.version}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, version: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  ?��?
                </Button>
                <Button onClick={handleCreatePackage}>
                  建�?
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 套件?�表 */}
      {packages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">沒�?套件</h3>
          <p className="text-gray-500 mb-6">
            建�?套件來�?織�?管�??��??�件
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            建�?第�??��?�?
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
                    <span className="text-muted-foreground">?�本</span>
                    <p className="font-medium">V{pkg.version}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">檔�??��?</span>
                    {/* TODO[足夠現代化][低認知][不造成 ai agent 認知困難提升]: 行 249 文字/標籤破損（</p>），請修正 */}
                    <p className="font-medium">{pkg.fileCount} ?��?�?/p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">大�?</span>
                    <p className="font-medium">{formatFileSize(pkg.size)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">建�???/span>
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
                      下�?
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-3 w-3 mr-1" />
                      ?�用
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      檢�?
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
