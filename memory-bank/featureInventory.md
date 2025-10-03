# 功能清單文檔

## 核心功能模組

### 1. 認證與用戶管理
- **登入/註冊系統**
  - 登入頁面 (`src copy/app/(auth)/login/page.tsx`)
  - 註冊頁面 (`src copy/app/(auth)/signup/page.tsx`)
  - AuthProvider (`src copy/components/auth/auth-provider.tsx`)
  - 權限守衛 (`src copy/components/auth/permission-guard.tsx`)
  - 角色管理 (`src copy/components/auth/role-manager.tsx`)

- **用戶資料管理**
  - 用戶資料頁面 (`src copy/app/(app)/settings/profile/page.tsx`)
  - 用戶設定 (`src copy/app/(app)/settings/account/page.tsx`)
  - 通知設定 (`src copy/app/(app)/settings/notifications/page.tsx`)
  - 用戶 Profile 頁面 (`src copy/components/features/users/pages/user-profile-page.tsx`)

### 2. 組織管理
- **組織核心功能**
  - 組織列表 (`src copy/app/(app)/organizations/page.tsx`)
  - 組織詳情 (`src copy/app/(app)/organizations/[organizationslug]/page.tsx`)
  - 組織設定 (`src copy/app/(app)/organizations/[organizationslug]/settings/page.tsx`)
  - 創建組織對話框 (`src copy/components/create-organization-dialog.tsx`)

- **組織成員管理**
  - 成員列表 (`src copy/app/(app)/organizations/[organizationslug]/members/page.tsx`)
  - 邀請成員 (`src copy/components/invite-member-dialog.tsx`)
  - 角色管理 (`src copy/app/(app)/organizations/[organizationslug]/roles/page.tsx`)
  - 群組管理 (`src copy/app/(app)/organizations/[organizationslug]/groups/page.tsx`)

- **組織資源管理**
  - 庫存管理 (`src copy/app/(app)/organizations/[organizationslug]/inventory/page.tsx`)
  - 庫存詳情 (`src copy/app/(app)/organizations/[organizationslug]/inventory/[itemId]/page.tsx`)
  - 調整庫存對話框 (`src copy/components/adjust-stock-dialog.tsx`)
  - 創建項目對話框 (`src copy/components/create-item-dialog.tsx`)
  - 創建倉庫對話框 (`src copy/components/create-warehouse-dialog.tsx`)
  - 創建群組對話框 (`src copy/components/create-group-dialog.tsx`)

- **組織審計**
  - 審計日誌 (`src copy/app/(app)/organizations/[organizationslug]/audit-log/page.tsx`)
  - 審計日誌列表 (`src copy/components/audit-log-list.tsx`)

### 3. 空間管理
- **空間核心功能**
  - 空間列表 (`src copy/app/(app)/spaces/page.tsx`)
  - 空間詳情 (`src copy/app/(app)/spaces/[spaceslug]/page.tsx`)
  - 用戶空間 (`src copy/app/(app)/[userslug]/[spaceslug]/page.tsx`)
  - 組織空間 (`src copy/app/(app)/organizations/[organizationslug]/[spaceslug]/page.tsx`)
  - 創建空間對話框 (`src copy/components/features/spaces/components/spaces-create-dialog.tsx`)

- **空間文件管理**
  - 文件瀏覽器 (`src copy/components/features/spaces/components/file-explorer/file-explorer.tsx`)
  - 文件表格 (`src copy/components/features/spaces/components/file-explorer/file-table.tsx`)
  - 文件樹 (`src copy/components/features/spaces/components/file-explorer/folder-tree.tsx`)
  - 文件縮圖網格 (`src copy/components/features/spaces/components/file-explorer/thumbnail/file-thumbnail-grid.tsx`)
  - 文件詳情 (`src copy/components/features/spaces/components/file-explorer/detail/file-detail-view.tsx`)
  - 上傳對話框 (`src copy/components/features/spaces/components/file-explorer/upload-dialog.tsx`)
  - 版本歷史 (`src copy/components/features/spaces/components/file-explorer/version-history-drawer.tsx`)
  - 已刪除項目 (`src copy/components/features/spaces/components/file-explorer/deleted-items.tsx`)

- **空間參與者管理**
  - 參與者列表 (`src copy/components/features/spaces/components/participants/participant-list.tsx`)
  - 參與者表格 (`src copy/components/features/spaces/components/participants/participant-table.tsx`)
  - 參與者卡片網格 (`src copy/components/features/spaces/components/participants/card-grid.tsx`)
  - 虛擬化表格 (`src copy/components/features/spaces/components/participants/virtualized-table.tsx`)
  - 邀請參與者 (`src copy/components/features/spaces/components/participants/invite-participant-dialog.tsx`)
  - 角色編輯器 (`src copy/components/features/spaces/components/participants/participant-role-editor.tsx`)

- **空間問題管理**
  - 問題列表 (`src copy/components/features/spaces/components/issues/issue-list.tsx`)
  - 問題詳情 (`src copy/components/features/spaces/components/issues/issue-details.tsx`)
  - 創建問題 (`src copy/components/features/spaces/components/issues/create-issue-form.tsx`)

- **空間合約管理**
  - 合約列表 (`src copy/components/features/spaces/components/contracts/contract-list.tsx`)
  - 合約詳情 (`src copy/components/features/spaces/components/contracts/contract-details.tsx`)
  - 創建合約 (`src copy/components/features/spaces/components/contracts/create-contract-dialog.tsx`)

- **空間品質管理**
  - 品質儀表板 (`src copy/components/features/spaces/components/quality/quality-dashboard.tsx`)
  - 檢查清單 (`src copy/components/features/spaces/components/quality/checklist.tsx`)
  - 創建檢查清單模板 (`src copy/components/features/spaces/components/quality/create-checklist-template.tsx`)

- **空間報告系統**
  - 報告儀表板 (`src copy/components/features/spaces/components/report/report-dashboard.tsx`)
  - 報告查看器 (`src copy/components/features/spaces/components/report/report-viewer.tsx`)
  - 創建報告 (`src copy/components/features/spaces/components/report/create-report-dialog.tsx`)

- **空間驗收管理**
  - 驗收列表 (`src copy/components/features/spaces/components/acceptance/acceptance-list.tsx`)
  - 驗收項目 (`src copy/components/features/spaces/components/acceptance/acceptance-item.tsx`)
  - 啟動驗收流程 (`src copy/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx`)

### 4. 儀表板與概覽
- **主儀表板**
  - 儀表板頁面 (`src copy/app/(app)/dashboard/page.tsx`)
  - 概覽儀表板 (`src copy/components/features/spaces/components/overview/overview-dashboard.tsx`)
  - 統計卡片 (`src copy/components/features/spaces/components/overview/stat-card.tsx`)
  - 最近活動 (`src copy/components/features/spaces/components/overview/recent-activity.tsx`)
  - 載入骨架 (`src copy/components/features/spaces/components/overview/loading-skeleton.tsx`)

- **發現頁面**
  - 發現頁面 (`src copy/app/(app)/discover/page.tsx`)

### 5. 佈局與導航
- **主佈局**
  - 應用佈局 (`src copy/app/(app)/layout.tsx`)
  - 根佈局 (`src copy/app/layout.tsx`)
  - 設定佈局 (`src copy/app/(app)/settings/layout.tsx`)

- **導航組件**
  - 側邊欄 (`src copy/components/layout/sidebar.tsx`)
  - 導航 (`src copy/components/layout/navigation.tsx`)
  - 導航項目 (`src copy/components/layout/nav.tsx`)
  - 頁首 (`src copy/components/layout/header.tsx`)
  - 團隊切換器 (`src copy/components/layout/team-switcher.tsx`)
  - 用戶導航 (`src copy/components/layout/user-nav.tsx`)
  - 頁面容器 (`src copy/components/layout/page-container.tsx`)

### 6. AI 功能
- **AI 核心**
  - Genkit 配置 (`src copy/ai/genkit.ts`)
  - 參與數據提取 (`src copy/ai/flows/extract-engagement-data.ts`)
  - 參與類型定義 (`src copy/ai/types/engagement.types.ts`)

### 7. Firebase 集成
- **Firebase 核心**
  - Firebase 配置 (`src copy/firebase/config.ts`)
  - Firebase Provider (`src copy/firebase/provider.tsx`)
  - 客戶端 Provider (`src copy/firebase/client-provider.tsx`)
  - Firebase 索引 (`src copy/firebase/index.ts`)

- **Firestore 集成**
  - 集合 Hook (`src copy/firebase/firestore/use-collection.tsx`)
  - 文檔 Hook (`src copy/firebase/firestore/use-doc.tsx`)

- **錯誤處理**
  - 錯誤發射器 (`src copy/firebase/error-emitter.ts`)
  - 錯誤定義 (`src copy/firebase/errors.ts`)
  - Firebase 錯誤監聽器 (`src copy/components/firebase-error-listener.tsx`)

### 8. 自定義 Hooks
- **應用狀態**
  - 應用狀態 (`src copy/hooks/use-app-state.ts`)
  - 移動端檢測 (`src copy/hooks/use-mobile.tsx`)
  - 權限管理 (`src copy/hooks/use-permissions.ts`)
  - Toast 通知 (`src copy/hooks/use-toast.ts`)

- **文件操作**
  - 文件操作 (`src copy/hooks/use-file-operations.ts`)
  - 合約管理 (`src copy/hooks/use-contracts.ts`)

- **空間操作**
  - 文件操作 (`src copy/components/features/spaces/hooks/use-file-actions.ts`)
  - 文件操作 (`src copy/components/features/spaces/hooks/use-file-operations.ts`)
  - 空間操作 (`src copy/components/features/spaces/hooks/use-space-actions.ts`)
  - 星標操作 (`src copy/components/features/spaces/hooks/use-star-actions.ts`)
  - 可見性操作 (`src copy/components/features/spaces/hooks/use-visibility-actions.ts`)

### 9. 表單與 UI 組件
- **表單組件**
  - 表單卡片 (`src copy/components/forms/form-card.tsx`)
  - 表單欄位 (`src copy/components/forms/form-field.tsx`)
  - 表單輸入 (`src copy/components/forms/form-input.tsx`)
  - 表單文字區域 (`src copy/components/forms/form-textarea.tsx`)
  - 表單開關 (`src copy/components/forms/form-switch.tsx`)

- **特殊組件**
  - 搜尋命令 (`src copy/components/search-command.tsx`)
  - 聊天對話框 (`src copy/components/chat-dialog.tsx`)
  - 通知彈出 (`src copy/components/notification-popover.tsx`)
  - GitHub 熱圖 (`src copy/components/github-heat-map.tsx`)
  - 活動概覽圖表 (`src copy/components/activity-overview-chart.tsx`)
  - 貢獻分解圖表 (`src copy/components/contribution-breakdown-chart.tsx`)
  - 最近活動時間線 (`src copy/components/recent-activity-timeline.tsx`)

- **用戶相關組件**
  - 用戶資料卡片 (`src copy/components/user-profile-card.tsx`)
  - 追蹤者列表 (`src copy/components/follower-list.tsx`)
  - 追蹤列表 (`src copy/components/following-list.tsx`)
  - 會員列表 (`src copy/components/membership-list.tsx`)
  - 成就列表 (`src copy/components/achievements-list.tsx`)

### 10. 工具與類型
- **類型定義**
  - 統一類型 (`src copy/lib/types-unified.ts`)
  - 合約類型 (`src copy/lib/types/contract.types.ts`)

- **工具函數**
  - 工具函數 (`src copy/lib/utils.ts`)
  - 角色管理 (`src copy/lib/role-management.ts`)
  - 佔位圖片 (`src copy/lib/placeholder-images.ts`)

- **服務**
  - 合約服務 (`src copy/lib/services/contracts/`)

### 11. 公開頁面
- **歡迎頁面**
  - 公開首頁 (`src copy/app/(public)/page.tsx`)

## 功能統計

### 總計功能模組
- **認證與用戶管理**: 8 個功能
- **組織管理**: 15 個功能
- **空間管理**: 25 個功能
- **儀表板與概覽**: 5 個功能
- **佈局與導航**: 8 個功能
- **AI 功能**: 3 個功能
- **Firebase 集成**: 8 個功能
- **自定義 Hooks**: 10 個功能
- **表單與 UI 組件**: 15 個功能
- **工具與類型**: 5 個功能
- **公開頁面**: 1 個功能

### 總計
- **核心功能**: 103 個功能模組
- **頁面**: 25 個頁面
- **組件**: 78 個組件
- **Hooks**: 15 個自定義 Hooks
- **工具**: 5 個工具模組

## 重構優先級

### P0 (最高優先級)
1. Firebase 配置和認證系統
2. 基礎佈局和導航
3. 用戶管理核心功能

### P1 (高優先級)
1. 組織管理功能
2. 空間管理核心功能
3. 文件管理系統

### P2 (中優先級)
1. 合約管理
2. 品質管理
3. 報告系統

### P3 (低優先級)
1. AI 功能集成
2. 高級分析功能
3. 第三方集成
