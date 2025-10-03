'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Search, Filter, Calendar, DollarSign } from 'lucide-react';
import { CreateContractDialog } from './create-contract-dialog';
import { ContractDetails } from './contract-details';
import { useState } from 'react';

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

interface ContractListProps {
  spaceId: string;
  contracts?: Contract[];
  canCreate?: boolean;
}

export function ContractList({ spaceId, contracts, canCreate = false }: ContractListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const defaultContracts: Contract[] = [
    {
      id: '1',
      title: 'Software Development Agreement',
      description: 'Agreement for custom software development services',
      type: 'service',
      status: 'active',
      value: 50000,
      currency: 'USD',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      counterparty: {
        name: 'TechCorp Inc.',
        contact: 'John Smith',
        email: 'john@techcorp.com',
      },
      createdBy: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      createdAt: new Date('2023-12-15'),
      lastModified: new Date('2024-01-10'),
      documents: 3,
    },
    {
      id: '2',
      title: 'Software License Agreement',
      description: 'License agreement for proprietary software',
      type: 'license',
      status: 'pending',
      value: 25000,
      currency: 'USD',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-01-31'),
      counterparty: {
        name: 'Software Solutions Ltd.',
        contact: 'Jane Wilson',
        email: 'jane@software-solutions.com',
      },
      createdBy: { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      createdAt: new Date('2024-01-20'),
      lastModified: new Date('2024-01-25'),
      documents: 2,
    },
    {
      id: '3',
      title: 'Non-Disclosure Agreement',
      description: 'Confidentiality agreement for sensitive information',
      type: 'nda',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-14'),
      counterparty: {
        name: 'Innovation Partners',
        contact: 'Mike Johnson',
        email: 'mike@innovation-partners.com',
      },
      createdBy: { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-15'),
      documents: 1,
    },
  ];

  const displayContracts = contracts || defaultContracts;

  const filteredContracts = displayContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.counterparty.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: Contract['type']) => {
    switch (type) {
      case 'service':
        return '?”§';
      case 'license':
        return '??';
      case 'nda':
        return '??';
      case 'partnership':
        return '??';
      case 'employment':
        return '?‘¤';
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

  const stats = {
    total: displayContracts.length,
    active: displayContracts.filter(c => c.status === 'active').length,
    pending: displayContracts.filter(c => c.status === 'pending').length,
    totalValue: displayContracts.reduce((sum, c) => sum + (c.value || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Contracts</h3>
        {canCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All contracts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="nda">NDA</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id} className="cursor-pointer" onClick={() => setSelectedContract(contract)}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(contract.type)}</span>
                        <span className="font-medium">{contract.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {contract.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{contract.documents} documents</span>
                        <span>??/span>
                        <span>Modified {contract.lastModified.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(contract.type)}>
                      {contract.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{contract.counterparty.name}</p>
                      <p className="text-xs text-muted-foreground">{contract.counterparty.contact}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contract.value ? (
                      <div className="text-sm">
                        <span className="font-medium">${contract.value.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1">{contract.currency}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{contract.endDate ? contract.endDate.toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateContractDialog
        spaceId={spaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedContract && (
        <ContractDetails
          contract={selectedContract}
          open={!!selectedContract}
          onOpenChange={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}
