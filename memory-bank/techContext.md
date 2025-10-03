# Memory Bank: 技術上下文

## 技術棧概述

### 前端技術
- **框架**: Next.js 15.3.3 (App Router)
- **語言**: TypeScript 5.9.3
- **UI 框架**: React 18.3.1
- **樣式系統**: Tailwind CSS 3.4.1 + shadcn/ui
- **狀態管理**: React Context/Hooks + TanStack Query 5.51.15
- **表單處理**: React Hook Form 7.63.0 + Zod 3.25.76
- **圖表**: Recharts 2.15.4

### 後端與雲服務
- **BaaS**: Firebase 11.9.1
  - Firestore (NoSQL 資料庫)
  - Authentication
  - Storage
  - Functions (Serverless)
- **AI 整合**: Google Genkit 1.20.0
  - 模型: Gemini 2.5 Flash
  - 用途: AI 輔助功能

### 開發工具
- **打包工具**: Next.js (內建 Webpack)
- **開發伺服器**: Next.js Dev Server (Turbopack)
- **程式碼品質**: ESLint + Prettier
- **類型檢查**: TypeScript (嚴格模式)
- **部署**: Firebase Hosting

## 專案架構模式

### 檔案結構
```
src/
├── app/                 # Next.js App Router
│   ├── (app)/          # 應用程式路由群組
│   ├── login/          # 認證頁面
│   └── signup/
├── components/         # 可重用元件
│   ├── ui/            # shadcn/ui 基礎元件
│   ├── layout/        # 佈局元件
│   ├── auth/          # 認證相關元件
│   └── features/      # 功能模組元件
├── firebase/          # Firebase 配置與 hooks
├── hooks/             # 自定義 React hooks
├── lib/               # 工具函數與類型定義
└── ai/                # AI 功能模組
```

### 設計原則
1. **極簡主義**: 避免過度工程化，只包含必要功能
2. **模組化**: 清晰的邊界與職責分離
3. **依賴方向**: features → components → shared (單向依賴)
4. **前後端分離**: 客戶端專注 UI，伺服器端處理業務邏輯
5. **類型安全**: 全面使用 TypeScript 嚴格模式

### 狀態管理策略
- **全域狀態**: React Context (AppState, AuthState)
- **伺服器狀態**: TanStack Query (資料獲取與快取)
- **表單狀態**: React Hook Form
- **本地狀態**: useState/useReducer

### 認證與權限
- **認證**: Firebase Authentication
- **權限系統**: 基於角色的存取控制 (RBAC)
- **角色類型**: 
  - 組織角色: super_admin, organization_admin, organization_member, organization_viewer
  - 空間角色: space_owner, space_admin, space_member, space_viewer

### 資料模型
- **帳戶系統**: 統一 Account 類型 (user/organization)
- **空間管理**: Space 實體，支援個人與組織擁有
- **權限管理**: 複雜的權限繼承與覆蓋機制
- **檔案管理**: 基於空間的檔案組織結構

## Firebase 配置

### 專案設定
- **專案 ID**: studio-347648346-b57e9
- **認證域名**: studio-347648346-b57e9.firebaseapp.com
- **儲存桶**: studio-347648346-b57e9.firebasestorage.app

### 安全規則
- **Firestore**: 基於用戶身份與角色權限的存取控制
- **Storage**: 基於空間成員身份的檔案存取控制
- **認證**: Firebase Authentication 整合

### 資料結構
```
/accounts/{accountId}          # 用戶與組織帳戶
/spaces/{spaceId}             # 空間實體
/organizations/{orgId}        # 組織相關資料
/conversations/{convId}       # 對話與訊息
/modules/{moduleId}           # 模組定義
/achievements/{achievementId} # 成就系統
```

## 開發環境

### 本地開發
- **開發伺服器**: `npm run dev` (Port 9002)
- **AI 開發**: `npm run genkit:dev`
- **類型檢查**: `npm run typecheck`
- **程式碼格式化**: `npm run format`

### 建置與部署
- **生產建置**: `npm run build`
- **部署**: Firebase Hosting
- **環境變數**: 透過 Firebase 配置管理

## 效能優化

### 前端優化
- **程式碼分割**: Next.js App Router 自動分割
- **圖片優化**: Next.js Image 元件
- **快取策略**: TanStack Query 智慧快取
- **載入狀態**: Skeleton 與 Loading 元件

### 後端優化
- **資料庫索引**: Firestore 複合索引
- **查詢優化**: 避免 N+1 查詢問題
- **快取機制**: 客戶端資料快取
- **分頁載入**: 大量資料分頁處理

## 安全性考量

### 資料保護
- **輸入驗證**: Zod schema 驗證
- **XSS 防護**: React 內建防護 + Content Security Policy
- **CSRF 防護**: SameSite cookies
- **資料加密**: Firebase 端到端加密

### 存取控制
- **認證**: Firebase Authentication
- **授權**: Firestore Security Rules
- **權限管理**: 細粒度權限控制
- **審計日誌**: 操作記錄與追蹤