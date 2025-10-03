#!/usr/bin/env node

const fs = require('fs');

// 讀取記憶文件
const content = fs.readFileSync('memory-bank/memory.json', 'utf-8');
const lines = content.trim().split('\n');
const optimizedLines = [];

// 優化映射表
const optimizations = {
  // 過短的詞條優化
  '偏好中文回應': '偏好中文回應與互動',
  '極簡主義設計': '遵循極簡主義設計原則',
  'shadcn/ui 優先': '優先使用 shadcn/ui 組件',
  '模組化架構原則': '基於模組化架構設計原則',
  '自動記憶功能': '希望 Agent 自動記憶功能',
  '中英雙語支持': '需要中英文雙語記憶系統支持',
  'MCP 記憶服務器': '使用 MCP 記憶服務器架構',
  '現代化用戶體驗': '專注於現代化用戶體驗設計',
  '企業級權限系統': '實現企業級權限管理系統',
  
  // 過長的詞條優化
  'Next.js 15 + TypeScript + App Router': 'Next.js 15 + TypeScript + App Router',
  'React 19 + App Router': 'React 19 + App Router',
  'Server Components 默認': 'Server Components 默認渲染',
  'Client Components 需聲明': 'Client Components 需要聲明',
  'Request Memoization 請求記憶化': 'Request Memoization 記憶化',
  'generateStaticParams 靜態參數': 'generateStaticParams 參數生成',
  'Template Literal Types': 'Template Literal 類型',
  'Composition Pattern 組合': 'Composition 組合模式',
  'Compound Components 複合': 'Compound 複合組件',
  'Controlled Components 受控': 'Controlled 受控組件',
  'Uncontrolled Components 非受控': 'Uncontrolled 非受控組件',
  'Composite Queries 組合查詢': 'Composite 組合查詢',
  'Server Components 用 Admin': 'Server Components 使用 Admin SDK',
  'Client Components 用 Client': 'Client Components 使用 Client SDK',
  'Optimistic Updates 樂觀': 'Optimistic 樂觀更新',
  'Cache Invalidation 緩存': 'Cache 緩存失效',
  'Real-time Subscriptions 訂閱': 'Real-time 實時訂閱',
  'Environment Variables 環境變量': 'Environment 環境變量配置',
  'Intercepting Routes 攔截路由': 'Intercepting 攔截路由',
  'Error Boundaries 錯誤邊界': 'Error Boundaries 錯誤邊界',
  'Dynamic Rendering 動態渲染': 'Dynamic 動態渲染',
  'Request Memoization 層': 'Request Memoization 層',
  'Image Optimization 圖片優化': 'Image 圖片優化策略',
  'Font Optimization 字體優化': 'Font 字體優化策略',
  'Bundle Analysis 打包分析': 'Bundle 打包分析工具',
  'Debounce Throttle 防抖節流': 'Debounce Throttle 防抖節流',
  'Virtual Scrolling 虛擬滾動': 'Virtual 虛擬滾動',
  'React Testing Library': 'React Testing Library 測試',
  'Component Testing 組件測試': 'Component 組件測試',
  'Integration Testing 集成測試': 'Integration 集成測試',
  'Snapshot Testing 快照測試': 'Snapshot 快照測試',
  'Environment Variables 環境變量': 'Environment 環境變量',
  'Preview Deployments 預覽': 'Preview 預覽部署',
  'Production Builds 生產構建': 'Production 生產構建',
  'Domain Configuration 域名': 'Domain 域名配置',
  'Validation Errors 驗證錯誤': 'Validation 驗證錯誤',
  '避免 Client 用 Admin SDK': '避免 Client 使用 Admin SDK',
  '避免過度 Client Components': '避免過度使用 Client Components',
  '避免阻塞 Server Components': '避免阻塞 Server Components',
  'Server Components 無 useState': 'Server Components 無法使用 useState',
  'Client Components 需聲明': 'Client Components 需要聲明',
  'Metadata 僅 Server Components': 'Metadata 僅限 Server Components',
  'generateMetadata 異步函數': 'generateMetadata 異步函數',
  'Server Actions \'use server\'': 'Server Actions use server 指令',
  'Hydration Errors 水合錯誤': 'Hydration 水合錯誤'
};

// 處理每一行
lines.forEach(line => {
  if (line.trim()) {
    try {
      const entity = JSON.parse(line);
      
      // 如果是實體且有 observations
      if (entity.type === 'entity' && entity.observations) {
        entity.observations = entity.observations.map(obs => {
          // 檢查是否需要優化
          if (optimizations[obs]) {
            return optimizations[obs];
          }
          return obs;
        });
      }
      
      optimizedLines.push(JSON.stringify(entity));
    } catch (e) {
      // 保持原樣
      optimizedLines.push(line);
    }
  }
});

// 寫入優化後的文件
const optimizedContent = optimizedLines.join('\n') + '\n';
fs.writeFileSync('memory-bank/memory.json', optimizedContent, 'utf-8');

console.log('✅ 詞數優化完成！');
console.log('📊 優化統計:');
console.log(`- 優化的詞條數量: ${Object.keys(optimizations).length}`);
console.log('- 已更新 memory.json 文件');
