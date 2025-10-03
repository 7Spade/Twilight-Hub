/**
 * 合約相關 Server Actions
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 處理合約的複雜業務邏輯和 AI 分析
 */

'use server';

import { contractAdminService } from '@/lib/firebase/admin';
import { Contract, CreateContractData, UpdateContractData, ContractAnalysisResult } from '@/lib/types/contract.types';
import { genkit } from '@/ai/genkit';

/**
 * 創建合約
 */
export async function createContract(
  spaceId: string,
  data: CreateContractData,
  userId: string,
  userEmail: string,
  userName: string
): Promise<{ success: boolean; contract?: Contract; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 準備合約數據
    const contractData = {
      ...data,
      spaceId,
      createdBy: {
        id: userId,
        name: userName,
        email: userEmail,
      },
      status: data.status || 'draft',
      documents: [],
      tags: data.tags || [],
      permissions: {
        [userId]: 'admin' as const,
      },
    };

    // 創建合約
    const contract = await contractAdminService.createContract(contractData);
    
    return { success: true, contract };
  } catch (error) {
    console.error('Error creating contract:', error);
    return { success: false, error: '創建合約失敗' };
  }
}

/**
 * 更新合約
 */
export async function updateContract(
  contractId: string,
  data: UpdateContractData,
  userId: string,
  userEmail: string,
  userName: string
): Promise<{ success: boolean; contract?: Contract; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 檢查合約是否存在
    const existingContract = await contractAdminService.getContract(contractId);
    if (!existingContract) {
      return { success: false, error: '合約不存在' };
    }

    // 檢查用戶權限
    const userPermission = existingContract.permissions[userId];
    if (!userPermission || userPermission === 'read') {
      return { success: false, error: '權限不足' };
    }

    // 更新合約
    const updatedContract = await contractAdminService.updateContract(
      contractId,
      data,
      {
        id: userId,
        name: userName,
        email: userEmail,
      }
    );

    return { success: true, contract: updatedContract };
  } catch (error) {
    console.error('Error updating contract:', error);
    return { success: false, error: '更新合約失敗' };
  }
}

/**
 * 刪除合約
 */
export async function deleteContract(
  contractId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 檢查合約是否存在
    const existingContract = await contractAdminService.getContract(contractId);
    if (!existingContract) {
      return { success: false, error: '合約不存在' };
    }

    // 檢查用戶權限（只有 admin 可以刪除）
    const userPermission = existingContract.permissions[userId];
    if (userPermission !== 'admin') {
      return { success: false, error: '權限不足' };
    }

    // 刪除合約
    const success = await contractAdminService.deleteContract(contractId);
    return { success, error: success ? undefined : '刪除合約失敗' };
  } catch (error) {
    console.error('Error deleting contract:', error);
    return { success: false, error: '刪除合約失敗' };
  }
}

/**
 * AI 分析合約
 */
export async function analyzeContract(
  contractId: string,
  userId: string
): Promise<{ success: boolean; analysis?: ContractAnalysisResult; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract) {
      return { success: false, error: '合約不存在' };
    }

    // 檢查用戶權限
    const userPermission = contract.permissions[userId];
    if (!userPermission) {
      return { success: false, error: '權限不足' };
    }

    // 使用 Genkit 進行 AI 分析
    const analysisPrompt = `
請分析以下合約內容：

標題：${contract.title}
描述：${contract.description}
類型：${contract.type}
狀態：${contract.status}
價值：${contract.value ? `${contract.value} ${contract.currency}` : '未指定'}
開始日期：${contract.startDate.toISOString().split('T')[0]}
結束日期：${contract.endDate ? contract.endDate.toISOString().split('T')[0] : '未指定'}
對方：${contract.counterparty.name}

請提供：
1. 合約摘要
2. 關鍵條款
3. 潛在風險
4. 建議事項
5. 分析信心度（0-100）
    `;

    const aiResponse = await genkit.generateText({
      model: 'gemini-2.0-flash-exp',
      prompt: analysisPrompt,
    });

    // 解析 AI 回應（這裡需要根據實際的 AI 回應格式進行調整）
    const analysis: ContractAnalysisResult = {
      contractId,
      summary: aiResponse.text || '無法生成摘要',
      keyTerms: ['關鍵條款1', '關鍵條款2'], // 需要從 AI 回應中解析
      risks: ['風險1', '風險2'], // 需要從 AI 回應中解析
      recommendations: ['建議1', '建議2'], // 需要從 AI 回應中解析
      confidence: 85, // 需要從 AI 回應中解析
      analyzedAt: new Date(),
    };

    return { success: true, analysis };
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return { success: false, error: '分析合約失敗' };
  }
}

/**
 * 生成合約 PDF
 */
export async function generateContractPDF(
  contractId: string,
  userId: string
): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract) {
      return { success: false, error: '合約不存在' };
    }

    // 檢查用戶權限
    const userPermission = contract.permissions[userId];
    if (!userPermission) {
      return { success: false, error: '權限不足' };
    }

    // 這裡應該使用 PDF 生成庫（如 puppeteer, jsPDF 等）
    // 暫時返回模擬的 PDF URL
    const pdfUrl = `/api/contracts/${contractId}/pdf?token=${Date.now()}`;

    return { success: true, pdfUrl };
  } catch (error) {
    console.error('Error generating contract PDF:', error);
    return { success: false, error: '生成 PDF 失敗' };
  }
}

/**
 * 獲取合約統計
 */
export async function getContractStats(
  spaceId: string,
  userId: string
): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    // 驗證用戶權限
    if (!userId) {
      return { success: false, error: '未授權' };
    }

    // 獲取合約列表
    const contracts = await contractAdminService.getContracts(spaceId, {}, 1000);
    
    // 計算統計數據
    const stats = {
      total: contracts.contracts.length,
      byStatus: contracts.contracts.reduce((acc, contract) => {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byType: contracts.contracts.reduce((acc, contract) => {
        acc[contract.type] = (acc[contract.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalValue: contracts.contracts.reduce((sum, contract) => sum + (contract.value || 0), 0),
      expiringSoon: contracts.contracts.filter(contract => {
        if (!contract.endDate) return false;
        const daysUntilExpiry = Math.ceil((contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Error getting contract stats:', error);
    return { success: false, error: '獲取統計數據失敗' };
  }
}
