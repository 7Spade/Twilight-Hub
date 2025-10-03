/**
 * @fileoverview Spaces 文件管理類型定義
 * 分離類型定義以避免 "use server" 文件限制
 */

export interface FileAnalysisResult {
  success: boolean;
  analysis?: {
    fileType: string;
    contentSummary: string;
    keywords: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    language?: string;
  };
  error?: string;
}

export interface FileNotificationResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface FileReportResult {
  success: boolean;
  report?: {
    totalOperations: number;
    totalSize: number;
    mostActiveHour: number;
    fileTypeDistribution: Record<string, number>;
    summary: string;
  };
  error?: string;
}

export interface FileOperation {
  action: string;
  fileName: string;
  timestamp: string;
  fileSize?: number;
}
