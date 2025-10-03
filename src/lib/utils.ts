/**
 * 通用工具函數
 * 
 * 功能：
 * - 通用工具函數集合
 * - 字符串處理函數
 * - 日期格式化函數
 * - 數據轉換函數
 * - CSS 類名處理函數
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
