/**
 * 合約列表組件 - 整合新架構
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 使用 React Query hooks 和 Server Actions
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { CreateContractDialog } from './create-contract-dialog';
import { ContractDetails } from './contract-details';
import { SearchFilters } from '@/components/contracts/search-filters';
import { useContracts, useContractsRealtime, useDeleteContract } from '@/hooks/use-contracts';
import { useAnalyzeContract, useGenerateContractPDF } from '@/hooks/use-contract-actions';
import { Contract, ContractFilters } from '@/lib/types/contract.types';
import { useState } from 'react';

interface ContractListProps {
  spaceId: string;
  canCreate?: boolean;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export function ContractList({ 
  spaceId, 
  canCreate = false, 
  userId = 'current-user', 
  userEmail = 'user@example.com', 
  userName = 'Current User' 
}: ContractListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filters, setFilters] = useState<ContractFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 使用新的 hooks
  const { data: contracts = [], isLoading, error } = useContractsRealtime(spaceId, filters);
  const deleteContract = useDeleteContract();
  const analyzeContract = useAnalyzeContract();
  const generatePDF = useGenerateContractPDF();

  // 處理搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, search: term }));
  };

  // 處理過濾器變化
  const handleFiltersChange = (newFilters: ContractFilters) => {
    setFilters(newFilters);
  };

  // 清除過濾器
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  // 處理合約操作
  const handleDeleteContract = (contractId: string) => {
    if (confirm('確定要刪除這個合約嗎？')) {
      deleteContract.mutate({ contractId, userId });
    }
  };

  const handleAnalyzeContract = (contractId: string) => {
    analyzeContract.mutate({ contractId, userId });
  };

  const handleGeneratePDF = (contractId: string) => {
    generatePDF.mutate({ contractId, userId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'license':
        return 'bg-purple-100 text-purple-800';
      case 'nda':
        return 'bg-orange-100 text-orange-800';
      case 'partnership':
        return 'bg-green-100 text-green-800';
      case 'employment':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">載入合約時發生錯誤</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索和過濾器 */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClear={handleClearFilters}
        totalResults={contracts.length}
        isLoading={isLoading}
      />

      {/* 合約列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            合約列表 ({contracts.length})
          </CardTitle>
          {canCreate && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新建合約
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">載入合約中...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">沒有找到合約</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || Object.keys(filters).length > 0
                  ? '嘗試調整搜索條件或過濾器'
                  : '開始創建您的第一個合約'}
              </p>
              {canCreate && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  新建合約
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>合約標題</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>對方</TableHead>
                  <TableHead>價值</TableHead>
                  <TableHead>開始日期</TableHead>
                  <TableHead>結束日期</TableHead>
                  <TableHead>文檔</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium" onClick={() => setSelectedContract(contract)}>
                      <div>
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {contract.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(contract.type)}>
                        {contract.type === 'service' && '服務合約'}
                        {contract.type === 'license' && '授權合約'}
                        {contract.type === 'nda' && '保密協議'}
                        {contract.type === 'partnership' && '合作協議'}
                        {contract.type === 'employment' && '僱傭合約'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status === 'draft' && '草稿'}
                        {contract.status === 'pending' && '待審核'}
                        {contract.status === 'active' && '生效中'}
                        {contract.status === 'expired' && '已過期'}
                        {contract.status === 'terminated' && '已終止'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.counterparty.name}</div>
                        <div className="text-sm text-muted-foreground">{contract.counterparty.contact}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.value ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{contract.value.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">{contract.currency}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">未指定</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{contract.startDate.toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.endDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{contract.endDate.toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">無期限</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{contract.documents?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedContract(contract)}
                          title="查看詳情"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAnalyzeContract(contract.id)}
                          title="AI 分析"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGeneratePDF(contract.id)}
                          title="生成 PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        {canCreate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContract(contract.id)}
                            title="刪除合約"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 創建合約對話框 */}
      <CreateContractDialog
        spaceId={spaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onContractCreated={(contract) => {
          setCreateDialogOpen(false);
        }}
      />

      {/* 合約詳情對話框 */}
      {selectedContract && (
        <ContractDetails
          contract={selectedContract}
          open={!!selectedContract}
          onOpenChange={(open) => !open && setSelectedContract(null)}
        />
      )}
    </div>
  );
}
