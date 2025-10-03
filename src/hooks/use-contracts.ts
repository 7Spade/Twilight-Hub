/**
 * 合約相關 React Query hooks
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供合約數據的查詢、緩存和實時同步
 * 位置: src/hooks/use-contracts.ts
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Contract, ContractFilters, CreateContractData, UpdateContractData } from '@/lib/types/contract.types';
import { createContract, updateContract, deleteContract } from '@/app/actions/contract-actions';

/**
 * 獲取合約列表
 */
export function useContracts(spaceId: string, filters: ContractFilters = {}) {
  return useQuery({
    queryKey: ['contracts', spaceId, filters],
    queryFn: async () => {
      // 這裡應該調用 Firebase 客戶端操作
      // 暫時返回空數組
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5分鐘緩存
    refetchOnWindowFocus: false,
  });
}

/**
 * 獲取單個合約
 */
export function useContract(contractId: string) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: async () => {
      // 這裡應該調用 Firebase 客戶端操作
      // 暫時返回 null
      return null;
    },
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 實時合約列表
 */
export function useContractsRealtime(spaceId: string, filters: ContractFilters = {}) {
  return useQuery({
    queryKey: ['contracts-realtime', spaceId, filters],
    queryFn: async () => {
      return new Promise<Contract[]>((resolve, reject) => {
        let contracts: Contract[] = [];
        
        const q = query(
          collection(db, 'contracts'),
          where('spaceId', '==', spaceId),
          orderBy('lastModified', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          contracts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            lastModified: doc.data().lastModified?.toDate(),
            startDate: doc.data().startDate?.toDate(),
            endDate: doc.data().endDate?.toDate(),
          })) as Contract[];

          // 應用過濾器
          let filteredContracts = contracts;
          if (filters.status && filters.status !== 'all') {
            filteredContracts = filteredContracts.filter(c => c.status === filters.status);
          }
          if (filters.type && filters.type !== 'all') {
            filteredContracts = filteredContracts.filter(c => c.type === filters.type);
          }
          if (filters.search) {
            filteredContracts = filteredContracts.filter(c => 
              c.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
              c.description.toLowerCase().includes(filters.search!.toLowerCase())
            );
          }

          resolve(filteredContracts);
        }, reject);

        // 清理函數
        return () => unsubscribe();
      });
    },
    staleTime: 0, // 實時數據不使用緩存
  });
}

/**
 * 創建合約
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      spaceId,
      data,
      userId,
      userEmail,
      userName,
    }: {
      spaceId: string;
      data: CreateContractData;
      userId: string;
      userEmail: string;
      userName: string;
    }) => {
      return createContract(spaceId, data, userId, userEmail, userName);
    },
    onSuccess: (result, variables) => {
      if (result.success && result.contract) {
        // 樂觀更新：添加到緩存
        queryClient.setQueryData(['contracts', variables.spaceId], (old: Contract[] = []) => [
          result.contract!,
          ...old,
        ]);
        
        // 無效化相關查詢
        queryClient.invalidateQueries({
          queryKey: ['contracts', variables.spaceId],
        });
      }
    },
    onError: (error) => {
      console.error('Error creating contract:', error);
    },
  });
}

/**
 * 更新合約
 */
export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      data,
      userId,
      userEmail,
      userName,
    }: {
      contractId: string;
      data: UpdateContractData;
      userId: string;
      userEmail: string;
      userName: string;
    }) => {
      return updateContract(contractId, data, userId, userEmail, userName);
    },
    onSuccess: (result, variables) => {
      if (result.success && result.contract) {
        // 樂觀更新：更新緩存中的合約
        queryClient.setQueryData(['contract', variables.contractId], result.contract);
        
        // 更新列表中的合約
        queryClient.setQueryData(['contracts'], (old: Contract[] = []) =>
          old.map(contract => 
            contract.id === variables.contractId ? result.contract! : contract
          )
        );
        
        // 無效化相關查詢
        queryClient.invalidateQueries({
          queryKey: ['contracts'],
        });
      }
    },
    onError: (error) => {
      console.error('Error updating contract:', error);
    },
  });
}

/**
 * 刪除合約
 */
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      userId,
    }: {
      contractId: string;
      userId: string;
    }) => {
      return deleteContract(contractId, userId);
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        // 樂觀更新：從緩存中移除
        queryClient.setQueryData(['contracts'], (old: Contract[] = []) =>
          old.filter(contract => contract.id !== variables.contractId)
        );
        
        // 移除單個合約緩存
        queryClient.removeQueries({
          queryKey: ['contract', variables.contractId],
        });
        
        // 無效化相關查詢
        queryClient.invalidateQueries({
          queryKey: ['contracts'],
        });
      }
    },
    onError: (error) => {
      console.error('Error deleting contract:', error);
    },
  });
}

/**
 * 搜索合約
 */
export function useSearchContracts(spaceId: string, searchTerm: string) {
  return useQuery({
    queryKey: ['contracts-search', spaceId, searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      // 這裡應該調用 Firebase 客戶端搜索操作
      // 暫時返回空數組
      return [];
    },
    enabled: !!searchTerm.trim(),
    staleTime: 2 * 60 * 1000, // 2分鐘緩存
  });
}

/**
 * 獲取合約統計
 */
export function useContractStats(spaceId: string) {
  return useQuery({
    queryKey: ['contract-stats', spaceId],
    queryFn: async () => {
      // 這裡應該調用 Server Action 獲取統計
      return {
        total: 0,
        byStatus: {},
        byType: {},
        totalValue: 0,
        expiringSoon: 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10分鐘緩存
  });
}
