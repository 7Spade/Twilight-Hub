'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { FirestoreService } from '@/firebase/firestore';

interface Contract {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  type: 'service' | 'employment' | 'partnership' | 'other';
  parties: string[];
  startDate: Date;
  endDate?: Date;
  value?: number;
  currency?: string;
  spaceId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function ContractList({ spaceId }: { spaceId: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadContracts = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const constraints = [{ field: 'spaceId', operator: '==', value: spaceId }];
        const contractsData = await FirestoreService.query<Contract>(
          'contracts',
          constraints,
          'createdAt',
          'desc'
        );
        
        setContracts(contractsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入合約失敗');
      } finally {
        setIsLoading(false);
      }
    };

    loadContracts();
  }, [spaceId, user]);

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'outline';
      case 'terminated': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: Contract['status']) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'active': return '進行中';
      case 'completed': return '已完成';
      case 'terminated': return '已終止';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-TW');
  };

  const formatCurrency = (value: number, currency: string = 'TWD') => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>載入合約時發生錯誤：{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <p>此空間尚未有任何合約</p>
            <Button className="mt-4" variant="outline">
              創建第一個合約
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <Card key={contract.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{contract.title}</CardTitle>
                {contract.description && (
                  <CardDescription>{contract.description}</CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(contract.status)}>
                  {getStatusText(contract.status)}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>開始：{formatDate(contract.startDate)}</span>
              </div>
              {contract.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>結束：{formatDate(contract.endDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{contract.parties.length} 方</span>
              </div>
              {contract.value && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{formatCurrency(contract.value, contract.currency)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
