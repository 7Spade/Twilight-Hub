# 技術上下文文檔

## 技術棧分析

### Next.js 15 App Router
- **路由系統**: 使用 App Router 的檔案系統路由
- **伺服器組件**: 預設使用 Server Components
- **客戶端組件**: 使用 `'use client'` 指令
- **API 路由**: 使用 Route Handlers

### Firebase 集成
- **認證**: Firebase Auth 用於用戶認證
- **資料庫**: Firestore 用於資料存儲
- **存儲**: Firebase Storage 用於檔案存儲
- **配置**: 環境變數管理 API 金鑰

### TypeScript 配置
- **嚴格模式**: 啟用所有嚴格檢查
- **路徑別名**: 使用 `@/` 別名
- **類型安全**: 完整的類型定義

### 樣式系統
- **Tailwind CSS**: 原子化 CSS 框架
- **shadcn/ui**: 高質量組件庫
- **響應式設計**: 移動優先設計

## 架構模式

### 組件架構
```
components/
├── ui/           # 基礎 UI 組件 (shadcn/ui)
├── auth/         # 認證相關組件
├── layout/       # 佈局組件
└── features/     # 功能特定組件
    ├── auth/
    ├── spaces/
    ├── contracts/
    └── organizations/
```

### 狀態管理
- **React Context**: 全域狀態管理
- **Custom Hooks**: 業務邏輯封裝
- **Server State**: 使用 Firebase 即時更新

### 資料流
```
Server Components → Client Components → Hooks → Firebase
```

## 核心技術決策

### 1. 認證系統
- 使用 Firebase Auth
- 實現 AuthProvider Context
- 支援多種登入方式

### 2. 資料管理
- Firestore 即時資料庫
- 自定義 Hooks 封裝資料操作
- 樂觀更新策略

### 3. 檔案管理
- Firebase Storage
- 支援多種檔案類型
- 即時上傳進度

### 4. AI 功能
- Google Genkit 集成
- 文件分析功能
- 結構化資料提取

## 性能優化

### 代碼分割
- 動態導入大型組件
- 路由級別代碼分割
- 按需載入功能模組

### 快取策略
- Next.js 內建快取
- Firebase 離線支援
- 瀏覽器快取優化

### 載入優化
- 圖片優化
- 字體優化
- 資源預載入

## 安全考量

### 認證安全
- JWT Token 管理
- 會話管理
- 權限控制

### 資料安全
- Firestore 安全規則
- 輸入驗證
- XSS 防護

### API 安全
- 環境變數保護
- API 金鑰管理
- 請求驗證

## 開發工具

### 代碼品質
- ESLint 代碼檢查
- Prettier 代碼格式化
- TypeScript 類型檢查

### 測試策略
- 單元測試
- 整合測試
- E2E 測試

### 部署流程
- Vercel 部署
- 環境變數管理
- CI/CD 流程
