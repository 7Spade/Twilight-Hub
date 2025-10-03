# Twilight-Hub 重構設計文檔

## 項目概述
基於奧卡姆剃刀原則重構 Next.js 15 項目，將 `src copy/` 的完整實現重構到 `src/` 中，保持極簡主義和清晰的架構邊界。

## 核心原則

### 奧卡姆剃刀原則
- **簡化優先**: 選擇最簡單的解決方案
- **必要性**: 只包含必要的代碼和功能
- **清晰性**: 避免不必要的抽象和複雜性
- **直接性**: 使用最直接的方式實現功能

### 架構原則
- **單一職責**: 每個組件只負責一個功能
- **依賴方向**: `app/` → `components/features/` → `components/` → `hooks/` → `lib/` → `firebase/`
- **清晰邊界**: 模組間通過公共 API 互動
- **現代化**: 優先使用 Next.js 15 App Router 特性

## 技術棧
- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **組件**: shadcn/ui
- **後端**: Firebase (Auth + Firestore)
- **狀態管理**: React Context + Hooks

## 項目結構

### 核心模組
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認證相關頁面
│   ├── (app)/             # 應用主頁面
│   └── (public)/          # 公開頁面
├── components/             # React 組件
│   ├── ui/                # shadcn/ui 基礎組件
│   ├── auth/              # 認證組件
│   ├── layout/            # 佈局組件
│   └── features/          # 功能組件
├── hooks/                 # 自定義 Hooks
├── lib/                   # 工具函數和類型
└── firebase/              # Firebase 配置
```

### 功能模組
- **認證系統**: 登入/註冊/權限管理
- **用戶管理**: 用戶資料/組織管理
- **空間管理**: 工作空間/文件管理
- **合約管理**: 合約創建/分析/管理
- **AI 功能**: 文件分析/智能提取

## 重構策略

### 階段 1: 基礎架構
1. Firebase 配置和 Provider
2. 認證系統 (AuthProvider)
3. 基礎佈局組件
4. 路由結構

### 階段 2: 核心功能
1. 用戶管理
2. 組織管理
3. 空間管理
4. 文件管理

### 階段 3: 高級功能
1. 合約管理
2. AI 功能
3. 報告系統
4. 權限管理

## 約束條件
- 使用現有的 `src/components/ui` 組件
- 不修改 `src/components/ui` 內檔案
- 使用真實數據，不使用測試頁面
- 嚴禁直接複製檔案，必須基於理解重構
- URL 與 `src copy` 保持一致

## 成功標準
- 功能完整性: 100% 實現 `src copy` 功能
- 代碼質量: 符合奧卡姆剃刀原則
- 架構清晰: 模組邊界明確
- 性能優化: 載入速度快，用戶體驗佳
