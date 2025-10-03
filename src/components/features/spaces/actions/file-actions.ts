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

// 重新導出新的 Server Actions
export {
  analyzeFileContent,
  sendFileNotification,
  generateFileReport,
  type FileAnalysisResult,
  type FileNotificationResult
} from './spaces-file-actions';

// 所有 Firebase 相關的接口和函數已移至 use-file-operations.ts
// 此文件現在只包含 Server Actions 的重新導出
