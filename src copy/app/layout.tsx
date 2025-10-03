import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Twilight Hub',
  description:
    'A multi-functional application designed for modern needs, combining user management, organizational collaboration, and social features with a futuristic twilight purple design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* TODO: [P2] PERF src/app/layout.tsx - 實現 Next.js 15 字體優化最佳實踐
// 問題：自定義字體未在 pages/_document.js 中添加，僅載入單頁面
// 影響：字體載入性能差，可能導致 FOUT（Flash of Unstyled Text）
// 建議：使用 next/font 模組優化字體載入，自動主機字體文件
// @assignee frontend-team
// @deadline 2025-01-20 */}
        {/* 注意：已使用 next/font 的 Inter 字體，以下手動載入可移除 */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}
      </head>
      <body className={cn('font-body antialiased', inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
