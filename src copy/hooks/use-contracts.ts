import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContracts, createContract, updateContract, deleteContract, analyzeContract, generateContractPDF } from '@/app/actions/contracts';
import { Contract, ContractFilters } from '@/lib/types/contract.types';

// Query Keys
export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: (spaceId: string, filters?: ContractFilters) => [...contractKeys.lists(), spaceId, filters] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (spaceId: string, contractId: string) => [...contractKeys.details(), spaceId, contractId] as const,
};

// 獲取合約列表
export function useContracts(spaceId: string, filters?: ContractFilters) {
  return useQuery({
    queryKey: contractKeys.list(spaceId, filters),
    queryFn: () => getContracts(spaceId, filters),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000, // 5 分鐘
    gcTime: 10 * 60 * 1000, // 10 分鐘
  });
}

// 創建合約
export function useCreateContract(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) =>
      createContract(spaceId, contractData),
    onSuccess: () => {
      // 無效化相關查詢
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
}

// 更新合約
export function useUpdateContract(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, contractData }: { contractId: string; contractData: Partial<Contract> }) =>
      updateContract(spaceId, contractId, contractData),
    onSuccess: (_, { contractId }) => {
      // 無效化相關查詢
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(spaceId, contractId) });
    },
  });
}

// 刪除合約
export function useDeleteContract(spaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) => deleteContract(spaceId, contractId),
    onSuccess: () => {
      // 無效化相關查詢
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },
  });
}

// 分析合約
export function useAnalyzeContract(spaceId: string) {
  return useMutation({
    mutationFn: (contractId: string) => analyzeContract(spaceId, contractId),
  });
}

// 生成合約 PDF
export function useGenerateContractPDF(spaceId: string) {
  return useMutation({
    mutationFn: (contractId: string) => generateContractPDF(spaceId, contractId),
  });
}
