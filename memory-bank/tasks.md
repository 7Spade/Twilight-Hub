# Memory Bank: Tasks

## Current Task
VAN 模式連續任務協作 - 全專案 TODO 分析和分類

## Status
- [x] 執行 03-analysis-commands.md 分析指令
- [x] 執行 09-compliance-commands.md 規範檢查指令
- [x] 執行 08-priority-commands.md 優先級指令
- [x] 執行 01-core-commands.md 核心指令
- [x] 執行 06-quick-commands.md 快速指令
- [ ] 寫入 Memory Bank
- [ ] 執行 05-project-specific-commands.md 專案特定指令

## Requirements
- 掃描全專案發現 35 個 TODO 項目
- 分析代碼質量問題和架構違規模式
- 按優先級分類 TODO (P0: 0, P1: 11, P2: 24, P3: 0)
- 生成規範檢查 TODO 和修復策略
- 更新 Memory Bank 記錄

## Components
- 認證權限模組: 8 個 TODO
- 空間管理模組: 15 個 TODO
- 合約管理模組: 4 個 TODO
- 組織管理模組: 3 個 TODO
- 其他功能模組: 5 個 TODO

## Notes
- 主要問題: API 調用未實現 (34 個)
- 緊急問題: 認證權限功能缺失 (8 個)
- 建議優先處理: 認證權限 → 核心 API → 錯誤處理 → 代碼清理

## Next.js TODO（零認知重構，遵循 docs/TODO/nextjs.todo-spec.md）

說明：以下任務僅做「認知負擔降低」的結構化調整，不更動現有功能與行為；完成後刪除對應 TODO 註解。

```typescript
// src/components/auth/role-manager.tsx
// TODO: [P1] REFACTOR 拆分角色計算與 UI
// 將角色/權限計算移至 lib/role-management.ts 並以 hooks 封裝（例如 useRoleMatrix），
// 保持元件只負責渲染；不改任何對外 API 與行為。

// src/components/auth/auth-provider.tsx
// TODO: [P1] REFACTOR 明確職責邊界
// 分離 Auth 狀態提供與授權檢查（PermissionContext）為兩層；避免跨責任混雜。
// 僅重排與抽取，確保功能/事件時序不變。

// src/firebase/provider.tsx
// TODO: [P1] REFACTOR 提取 auth 監聽為獨立 hook
// 抽出 useAuthSubscription(auth) 管理 onAuthStateChanged 與錯誤；
// Provider 僅整合 context 值，保持行為一致。

// src/components/features/spaces/components/file-explorer/folder-tree.tsx
// TODO: [P1] REFACTOR 拆分資料與展示
// 提取 useFolderTreeData 與純展示節點 FolderTreeNode；
// 移除內部混合邏輯，維持輸入/輸出介面與現狀一致。

// src/components/features/spaces/components/file-explorer/file-explorer.tsx
// TODO: [P2] REFACTOR 抽出狀態管理 hooks
// 將選取、排序、檢視模式等 state 抽至 useFileExplorerState；
// 元件專注佈局與事件綁定，不更動使用方式。

// src/components/layout/sidebar.tsx
// TODO: [P2] REFACTOR 導航資料純化
// 將動態菜單構建移至純函數 buildSidebarItems(user, org, space)；
// Sidebar 僅渲染傳入資料，避免隱式耦合。

// src/components/features/spaces/components/file-explorer/filter-panel.tsx
// TODO: [P2] PERF/REFACTOR 穩定化過濾器
// 以 useMemo/useCallback 穩定 costly selector；提取 filter schema 常數；
// 僅優化渲染，不改邏輯與輸出。

// src/components/features/spaces/components/issues/issue-list.tsx
// TODO: [P2] REFACTOR 抽取格式化工具
// 提取日期/狀態/優先級格式化至 utils/issues-format.ts；
// 列表元件不持有通用工具邏輯。

// src/components/features/spaces/components/issues/issue-details.tsx
// TODO: [P2] REFACTOR 拆分子區塊
// 將活動紀錄、屬性區塊拆為小型純展示子元件；
// 僅結構化，不改任何資料流。

// src/components/features/spaces/components/file-explorer/packages-tab.tsx
// TODO: [P3] REFACTOR 輕量化 props 與分層
// 精簡 props，若同時承載資料抓取與展示，則提取 usePackagesData；
// 保持現有 UI 與互動。

// src/hooks/use-permissions.ts
// TODO: [P1] REFACTOR 角色決策單一來源
// 以 lib/role-management.ts 為唯一決策來源；use-permissions 僅組合導出，
// 確保依賴方向不反向（features -> components -> shared）。
```

### 驗收標準
- 不變更任一對外 API、UI 輸出與使用流程。
- 僅新增/移動代碼以降低模組責任與檔案體積，通過類型檢查與 Lint。
- 遵循 Next.js App Router 共置與分層最佳實踐（layout/page/子組件）。
- 移除暫時性重構 TODO 註解，保留必要頂層說明。

### 追加（現代化對齊 App Router 分層）

```typescript
// app/layout.tsx
// TODO: [P1] REFACTOR 根佈局職責最小化
// 僅保留全域樣式與必要 Provider，其他腳本或度量類以子組件注入（如 WebVitals）；
// 不更動現有渲染結果。

// src/app/(app)/layout.tsx
// TODO: [P1] REFACTOR 拆分導航/內容為子佈局
// 以 Nested Layout 將 Sidebar/Header/Content 分離，檔案共置提升可維護性與路由清晰度；
// 保留當前 UI 結果。

// src/components/layout/header.tsx
// TODO: [P2] REFACTOR 客戶端邏輯與展示分離
// 將互動行為放至 'use client' 子組件；父層盡可能保持為 Server Component；
// 不改視覺與交互體驗。

// src/components/firebase-error-listener.tsx
// TODO: [P2] REFACTOR 全域錯誤監聽隔離
// 封裝為可掛載的小型 Client Component，於根/區域佈局以 slot 注入；
// 不改事件處理與行為。

// src/components/ui/toaster.tsx
// TODO: [P3] REFACTOR 通知插槽標準化
// 統一 toaster 掛載點來源（根或區域佈局），減少跨層耦合；
// 僅調整組合位置。
```