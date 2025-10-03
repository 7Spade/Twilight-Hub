/**
 * 合約相關 Server Actions hooks
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供 Server Actions 的調用和狀態管理
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  analyzeContract, 
  generateContractPDF, 
  getContractStats 
} from '@/app/actions/contract-actions';
import { 
  sendContractCreatedNotification,
  sendContractUpdatedNotification,
  sendContractExpiryReminder,
  checkExpiredContracts 
} from '@/app/actions/notification-actions';
import { ContractAnalysisResult } from '@/lib/types/contract.types';

/**
 * AI 分析合約
 */
export function useAnalyzeContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      userId,
    }: {
      contractId: string;
      userId: string;
    }) => {
      return analyzeContract(contractId, userId);
    },
    onSuccess: (result, variables) => {
      if (result.success && result.analysis) {
        // 將分析結果存儲到緩存
        queryClient.setQueryData(
          ['contract-analysis', variables.contractId], 
          result.analysis
        );
      }
    },
    onError: (error) => {
      console.error('Error analyzing contract:', error);
    },
  });
}

/**
 * 生成合約 PDF
 */
export function useGenerateContractPDF() {
  return useMutation({
    mutationFn: async ({
      contractId,
      userId,
    }: {
      contractId: string;
      userId: string;
    }) => {
      return generateContractPDF(contractId, userId);
    },
    onError: (error) => {
      console.error('Error generating contract PDF:', error);
    },
  });
}

/**
 * 獲取合約統計
 */
export function useContractStatsAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      spaceId,
      userId,
    }: {
      spaceId: string;
      userId: string;
    }) => {
      return getContractStats(spaceId, userId);
    },
    onSuccess: (result, variables) => {
      if (result.success && result.stats) {
        // 更新統計緩存
        queryClient.setQueryData(
          ['contract-stats', variables.spaceId], 
          result.stats
        );
      }
    },
    onError: (error) => {
      console.error('Error getting contract stats:', error);
    },
  });
}

/**
 * 發送合約創建通知
 */
export function useSendContractCreatedNotification() {
  return useMutation({
    mutationFn: async ({
      contractId,
      spaceId,
      userId,
    }: {
      contractId: string;
      spaceId: string;
      userId: string;
    }) => {
      return sendContractCreatedNotification(contractId, spaceId, userId);
    },
    onError: (error) => {
      console.error('Error sending contract created notification:', error);
    },
  });
}

/**
 * 發送合約更新通知
 */
export function useSendContractUpdatedNotification() {
  return useMutation({
    mutationFn: async ({
      contractId,
      spaceId,
      userId,
    }: {
      contractId: string;
      spaceId: string;
      userId: string;
    }) => {
      return sendContractUpdatedNotification(contractId, spaceId, userId);
    },
    onError: (error) => {
      console.error('Error sending contract updated notification:', error);
    },
  });
}

/**
 * 發送合約過期提醒
 */
export function useSendContractExpiryReminder() {
  return useMutation({
    mutationFn: async ({
      contractId,
      spaceId,
    }: {
      contractId: string;
      spaceId: string;
    }) => {
      return sendContractExpiryReminder(contractId, spaceId);
    },
    onError: (error) => {
      console.error('Error sending contract expiry reminder:', error);
    },
  });
}

/**
 * 檢查過期合約
 */
export function useCheckExpiredContracts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      spaceId,
    }: {
      spaceId: string;
    }) => {
      return checkExpiredContracts(spaceId);
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        // 無效化合約列表查詢以刷新數據
        queryClient.invalidateQueries({
          queryKey: ['contracts', variables.spaceId],
        });
        
        // 無效化統計查詢
        queryClient.invalidateQueries({
          queryKey: ['contract-stats', variables.spaceId],
        });
      }
    },
    onError: (error) => {
      console.error('Error checking expired contracts:', error);
    },
  });
}

/**
 * 獲取合約分析結果
 */
export function useContractAnalysis(contractId: string) {
  const queryClient = useQueryClient();

  return {
    data: queryClient.getQueryData<ContractAnalysisResult>(['contract-analysis', contractId]),
    isLoading: false, // 分析結果是通過 mutation 存儲的
    refetch: () => {
      // 觸發重新分析
      const analyzeMutation = useAnalyzeContract();
      analyzeMutation.mutate({ contractId, userId: 'current-user' });
    },
  };
}
