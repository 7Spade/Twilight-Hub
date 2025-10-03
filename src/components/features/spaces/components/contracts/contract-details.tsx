'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, FileText, Mail, Phone, User } from 'lucide-react';
// TODO: [P2] REFACTOR src/components/features/spaces/components/contracts/contract-details.tsx - 清理未使用的導入（Avatar, AvatarFallback, AvatarImage, Phone 未使用）
import { formatDistanceToNow } from 'date-fns';

interface Contract {
  id: string;
  title: string;
  description: string;
  type: 'service' | 'license' | 'nda' | 'partnership' | 'employment';
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  value?: number;
  currency?: string;
  startDate: Date;
  endDate?: Date;
  counterparty: {
    name: string;
    contact: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  lastModified: Date;
  documents: number;
}

interface ContractDetailsProps {
  contract: Contract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractDetails({ contract, open, onOpenChange }: ContractDetailsProps) {
  const getTypeIcon = (type: Contract['type']) => {
    switch (type) {
      case 'service':
        return '?��';
      case 'license':
        return '??';
      case 'nda':
        return '??';
      case 'partnership':
        return '??';
      case 'employment':
        return '?��';
      default:
        return '??';
    }
  };

  const getTypeColor = (type: Contract['type']) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'license':
        return 'bg-green-100 text-green-800';
      case 'nda':
        return 'bg-purple-100 text-purple-800';
      case 'partnership':
        return 'bg-orange-100 text-orange-800';
      case 'employment':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    // TODO: [P2] FEAT src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
    console.log('Downloading contract:', contract.title);
    // @assignee dev
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getTypeIcon(contract.type)}</span>
            {contract.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Contract Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTypeColor(contract.type)}>
                    {contract.type}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Created by {contract.createdBy.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(contract.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleDownload}>
                <FileText className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <Separator />

            {/* Contract Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="text-sm">{contract.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Contract Value</h4>
                    {contract.value ? (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">${contract.value.toLocaleString()}</span>
                        <span className="text-muted-foreground">{contract.currency}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not specified</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>Start: {contract.startDate.toLocaleDateString()}</span>
                      </div>
                      {contract.endDate && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>End: {contract.endDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Documents</h4>
                    <span className="text-sm">{contract.documents} attached documents</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Counterparty Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                    <p className="text-sm font-medium">{contract.counterparty.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Contact Person</h4>
                    <p className="text-sm">{contract.counterparty.contact}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-sm">{contract.counterparty.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contract Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Contract Created</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.createdAt.toLocaleDateString()} by {contract.createdBy.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last Modified</p>
                      <p className="text-xs text-muted-foreground">
                        {contract.lastModified.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {contract.status === 'active' && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contract Active</p>
                        <p className="text-xs text-muted-foreground">
                          Started {contract.startDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {contract.endDate && (
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contract End</p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for {contract.endDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
