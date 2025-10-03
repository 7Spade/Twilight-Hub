/**
 * @fileoverview 文件管理相關的 Server Actions
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 
 * ⚠️ 已修復架構違規：
 * - Firebase Storage 操作已移至 use-file-operations.ts Hook
 * - 此文件現在只包含非 Firebase 的服務端邏輯
 * 
 * 使用方式：
 * - Firebase 操作：使用 useFileOperations Hook
 * - AI 分析、通知等：使用此文件中的 Server Actions
 */

'use server';

import { genkit } from '@/ai/genkit';
import type { 
  FileAnalysisResult, 
  FileNotificationResult, 
  FileReportResult,
  FileOperation 
} from './types';

/**
 * 使用 AI 分析文件內容
 * 這是一個 Server Action，可以安全地調用 AI 服務
 */
export async function analyzeFileContent(
  fileName: string,
  fileType: string,
  content?: string
): Promise<FileAnalysisResult> {
  try {
    if (!fileName || !fileType) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }

    // 構建 AI 分析提示
    const prompt = `
      請分析以下文件：
      文件名: ${fileName}
      文件類型: ${fileType}
      ${content ? `內容預覽: ${content.substring(0, 1000)}...` : ''}
      
      請提供：
      1. 文件類型識別
      2. 內容摘要
      3. 關鍵詞提取
      4. 情感分析（如果適用）
      5. 語言識別
      
      請以 JSON 格式返回結果。
    `;

    // 調用 AI 服務進行分析
    const analysis = await genkit.generate(prompt);

    // 解析 AI 返回的結果
    const analysisData = JSON.parse(analysis);

    return {
      success: true,
      analysis: {
        fileType: analysisData.fileType || fileType,
        contentSummary: analysisData.contentSummary || '無法生成摘要',
        keywords: analysisData.keywords || [],
        sentiment: analysisData.sentiment,
        language: analysisData.language,
      }
    };
  } catch (error) {
    console.error('File analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
    };
  }
}

/**
 * 發送文件操作通知
 * 這是一個 Server Action，可以安全地調用外部服務
 */
export async function sendFileNotification(
  action: 'upload' | 'download' | 'delete',
  fileName: string,
  spaceId: string,
  userId: string
): Promise<FileNotificationResult> {
  try {
    if (!action || !fileName || !spaceId || !userId) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }

    // 構建通知消息
    const actionText = {
      upload: '上傳',
      download: '下載',
      delete: '刪除'
    }[action];

    const message = `用戶 ${userId} 在空間 ${spaceId} 中${actionText}了文件 ${fileName}`;

    // 這裡可以整合實際的通知服務
    // 例如：發送郵件、Slack 通知、Discord 通知等
    console.log('File notification:', message);

    return {
      success: true,
      message: '通知發送成功'
    };
  } catch (error) {
    console.error('Notification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Notification failed'
    };
  }
}

/**
 * 生成文件操作報告
 * 這是一個 Server Action，可以安全地進行複雜計算
 */
export async function generateFileReport(
  spaceId: string,
  userId: string,
  fileOperations: FileOperation[]
): Promise<FileReportResult> {
  try {
    if (!spaceId || !userId || !fileOperations.length) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }

    // 計算統計數據
    const totalOperations = fileOperations.length;
    const totalSize = fileOperations.reduce((sum, op) => sum + (op.fileSize || 0), 0);
    
    // 找出最活躍的小時
    const hourCounts = fileOperations.reduce((counts, op) => {
      const hour = new Date(op.timestamp).getHours();
      counts[hour] = (counts[hour] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0;

    // 文件類型分布
    const fileTypeDistribution = fileOperations.reduce((dist, op) => {
      const extension = op.fileName.split('.').pop()?.toLowerCase() || 'unknown';
      dist[extension] = (dist[extension] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    // 生成摘要
    const summary = `用戶 ${userId} 在空間 ${spaceId} 中進行了 ${totalOperations} 次文件操作，總大小 ${(totalSize / 1024 / 1024).toFixed(2)} MB，最活躍時間為 ${mostActiveHour}:00。`;

    return {
      success: true,
      report: {
        totalOperations,
        totalSize,
        mostActiveHour: parseInt(mostActiveHour),
        fileTypeDistribution,
        summary
      }
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Report generation failed'
    };
  }
}
