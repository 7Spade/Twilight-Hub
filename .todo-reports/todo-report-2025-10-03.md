# 📝 TODO 報告
## 📊 統計摘要
- 總計: 59 個項目
- 🔴 緊急: 2 個項目
### 依優先級
- P3: 3 個
- P2: 54 個
- P0: 2 個
### 依類型
- REFACTOR: 19 個
- FEAT: 20 個
- FIX: 20 個
---
## 🔴 P0 (2 個)
### 1. [FIX] 多處檔案存在 Parsing error（Unterminated string/Unexpected token/';' expected）需立即修復
**位置:**
> src\components\features\spaces\components\file-explorer\context-menu.tsx
> src\components\features\spaces\components\file-explorer\deleted-items.tsx
> src\components\features\spaces\components\file-explorer\detail\file-detail-view.tsx
> src\components\features\spaces\components\file-explorer\empty-folder-state.tsx
> src\components\features\spaces\components\file-explorer\file-explorer.tsx
> src\components\features\spaces\components\file-explorer\file-table.tsx（第52行）
> src\components\features\spaces\components\file-explorer\filter-panel.tsx（第141行）
> src\components\features\spaces\components\file-explorer\folder-tree.tsx
> src\components\features\spaces\components\file-explorer\packages-tab.tsx
> src\components\features\spaces\components\file-explorer\services\file-preview-service.ts
> src\components\features\spaces\components\file-explorer\thumbnail\file-thumbnail-grid.tsx
> src\components\features\spaces\components\file-explorer\toolbar.tsx
> src\components\features\spaces\components\file-explorer\version-history-drawer.tsx
> src\components\features\spaces\components\issues\issue-details.tsx
> src\components\features\spaces\components\issues\issue-list.tsx
> src\components\features\spaces\components\participants\advanced-filters.tsx
> src\components\features\spaces\components\participants\card-grid.tsx
> src\components\features\spaces\components\participants\invite-participant-dialog.tsx
> src\components\features\spaces\components\participants\participant-card.tsx
> src\components\features\spaces\components\participants\participant-filters.tsx
> src\components\features\spaces\components\participants\participant-list.tsx
> src\components\features\spaces\components\participants\participant-role-editor.tsx
> src\components\features\spaces\components\participants\participant-table.tsx
> src\components\features\spaces\components\participants\virtualized-table.tsx
**詳細說明:**
> 修正未終止字串、意外字元及缺少分號等語法錯誤，確保 ESLint/TS 編譯可通過。
**@assignee** dev
---
## 🟠 P1 (1 個)
### 1. [FIX] 修復 React Hooks 依賴缺失與不穩定依賴（useEffect/useMemo/useCallback）
**位置:**
> src\app\(app)\layout.tsx（useMemo 依賴不穩定）
> src\app\(app)\organizations\[organizationslug]\inventory\page.tsx（useEffect/useMemo 與 warehouses）
> src\app\(app)\organizations\[organizationslug]\inventory\[itemId]\page.tsx（useEffect 與 warehouses）
> src\app\(app)\spaces\page.tsx（多處 useMemo 與 allSpaces）
> src\components\auth\auth-provider.tsx（useEffect 缺少 fetchUserRoleAssignment）
> src\components\auth\role-manager.tsx（useEffect 缺少 loadRoles/loadUsers）
> src\components\features\spaces\hooks\use-file-actions.ts（多處 useCallback 缺少 fileOperations）
> src\hooks\use-permissions.ts（useCallback 缺少 checkOrganizationPermissionInternal）
**詳細說明:**
> 依 React/TanStack Query 最佳實踐，解構 hook 回傳或以 useMemo/useCallback 包裝依賴來源，並補齊缺少的依賴，避免無限重算與潛在記憶體洩漏。
**@assignee** dev
## 🟡 P2 (54 個)
### 1. [FEAT] src/app/actions/contracts.ts - 實作合約 AI 分析
**位置:** `src\app\actions\contracts.ts:89`
**詳細說明:**
> 說明：整合 Genkit AI 或其他 AI 服務，輸出摘要與風險點
---
### 2. [FEAT] src/app/actions/contracts.ts - 實作合約 PDF 生成
**位置:** `src\app\actions\contracts.ts:102`
**詳細說明:**
> 說明：整合 PDF 生成服務（含標題、雙方、金額、日期、簽名）
---
### 3. [REFACTOR] src/components/adjust-stock-dialog.tsx - 清理未使用的導入（setDoc 未使用）
**位置:** `src\components\adjust-stock-dialog.tsx:15`
---
### 4. [FIX] src/components/adjust-stock-dialog.tsx - 修復非空斷言警告
**位置:** `src\components\adjust-stock-dialog.tsx:131`
**詳細說明:**
> 說明：在使用 stockInfo.stockId 前進行存在性檢查，移除非空斷言
---
### 5. [REFACTOR] src/components/contribution-breakdown-chart.tsx - 清理未使用的導入（Card* 未使用）
**位置:** `src\components\contribution-breakdown-chart.tsx:11`
---
### 6. [FEAT] src/components/features/organizations/components/roles/create-role-dialog.tsx - 實現角色創建 API 調用
**位置:** `src\components\features\organizations\components\roles\create-role-dialog.tsx:70`
---
### 7. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現權限更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:169`
---
### 8. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現訪問級別更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:175`
---
### 9. [REFACTOR] src/components/features/spaces/components/acceptance/acceptance-item.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\acceptance\acceptance-item.tsx:6`
---
### 10. [FIX] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 acceptance 建立明確型別介面
---
### 11. [FEAT] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實作創建驗收 API 呼叫
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:57`
---
### 12. [REFACTOR] src/components/features/spaces/components/contracts/contract-details.tsx - 清理未使用的導入（Avatar, AvatarFallback, AvatarImage, Phone 未使用）
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:11`
---
### 13. [FEAT] src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:98`
---
### 14. [FIX] src/components/features/spaces/components/contracts/contract-list.tsx - 修復 JSX 語法錯誤（第317行未閉合標籤或無效字元）
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:3`
---
### 15. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx - 清理未使用的導入（FileText, DollarSign 未使用）
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:11`
---
### 16. [FIX] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 contract 建立明確型別介面
---
### 17. [FEAT] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 實作創建合約 API 呼叫
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:71`
---
### 18. [FIX] src/components/features/spaces/components/file-explorer/context-menu.tsx - 修復字符串字面量錯誤（第126行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\context-menu.tsx:7`
---
### 19. [FIX] src/components/features/spaces/components/file-explorer/deleted-items.tsx - 修復字符串字面量錯誤（第50行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\deleted-items.tsx:8`
---
### 20. [FIX] src/components/features/spaces/components/file-explorer/detail/file-detail-view.tsx - 修復字符串字面量錯誤（第75行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\detail\file-detail-view.tsx:6`
---
### 21. [FIX] src/components/features/spaces/components/file-explorer/empty-folder-state.tsx - 修復字符串字面量錯誤（第31行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\empty-folder-state.tsx:8`
---
### 22. [FIX] src/components/features/spaces/components/file-explorer/file-explorer.tsx - 修復語法錯誤（第95行缺少分號）
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:9`
---
### 23. [REFACTOR] src/components/features/spaces/components/file-explorer/upload-dialog.tsx - 清理未使用的導入（Input 未使用）
**位置:** `src\components\features\spaces\components\file-explorer\upload-dialog.tsx:13`
---
### 24. [FIX] src/components/features/spaces/components/issues/create-issue-form.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 issue 建立明確型別介面
---
### 25. [FEAT] src/components/features/spaces/components/issues/create-issue-form.tsx - 實作創建問題 API 呼叫
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:52`
---
### 26. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:41`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 27. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:60`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 28. [FIX] src/components/features/spaces/components/overview/recent-activity.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\overview\recent-activity.tsx:17`
**詳細說明:**
> 說明：定義 metadata 結構或使用更嚴格的型別映射
---
### 29. [FIX] src/components/features/spaces/components/overview/types.ts - 修正 unknown/any 類型（定義 metadata 結構）
**位置:** `src\components\features\spaces\components\overview\types.ts:41`
---
### 30. [FEAT] src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 顯示錯誤提示
**位置:** `src\components\features\spaces\components\participants\invite-participant-dialog.tsx:54`
**負責人:** @dev
---
### 31. [FEAT] src/components/features/spaces/components/participants/participant-role-editor.tsx - 實現角色變更 API 調用
**位置:** `src\components\features\spaces\components\participants\participant-role-editor.tsx:47`
---
### 32. [FEAT] src/components/features/spaces/components/participants/participant-table.tsx - 打開角色更新對話框
**位置:** `src\components\features\spaces\components\participants\participant-table.tsx:141`
---
### 33. [REFACTOR] src/components/features/spaces/components/participants/view-toggle.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\participants\view-toggle.tsx:10`
---
### 34. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現編輯對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:211`
---
### 35. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現角色變更對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:215`
---
### 36. [REFACTOR] src/components/features/spaces/components/quality/checklist.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\quality\checklist.tsx:5`
---
### 37. [FIX] src/components/features/spaces/components/quality/create-checklist-template.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:33`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 template 建立明確型別介面
---
### 38. [FEAT] src/components/features/spaces/components/quality/create-checklist-template.tsx - 實現創建模板 API 調用
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:71`
---
### 39. [FIX] src/components/features/spaces/components/report/create-report-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 report 建立明確型別介面
---
### 40. [FEAT] src/components/features/spaces/components/report/create-report-dialog.tsx - 實現創建報告 API 調用
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:70`
---
### 41. [FEAT] src/components/features/spaces/components/report/report-dashboard.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-dashboard.tsx:124`
---
### 42. [REFACTOR] src/components/features/spaces/components/report/report-viewer.tsx - 清理未使用的導入（Avatar, AvatarFallback, AvatarImage 未使用）
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:4`
---
### 43. [FEAT] src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:79`
---
### 44. [REFACTOR] src/components/features/spaces/components/spaces-list-view.tsx - 清理未使用的導入（cn 未使用）
**位置:** `src\components\features\spaces\components\spaces-list-view.tsx:28`
---
### 45. [REFACTOR] src/components/features/spaces/hooks/use-star-actions.ts - 清理未使用的導入（Space 未使用）
**位置:** `src\components\features\spaces\hooks\use-star-actions.ts:14`
---
### 46. [REFACTOR] src/components/follower-list.tsx - 清理未使用的導入（doc 未使用）
**位置:** `src\components\follower-list.tsx:12`
---
### 47. [REFACTOR] src/components/forms/form-card.tsx - 清理未使用的導入（Skeleton 未使用）
**位置:** `src\components\forms\form-card.tsx:19`
---
### 48. [REFACTOR] src/components/layout/sidebar.tsx - 清理未使用的導入（Settings, Tooltip* 未使用）
**位置:** `src\components\layout\sidebar.tsx:16`
---
### 49. [REFACTOR] src/components/ui/file-type-icon.tsx - 清理未使用的導入（useEffect, Image, Video, Music, Archive, Code 未使用）
**位置:** `src\components\ui\file-type-icon.tsx:20`
---
### 50. [REFACTOR] src/components/ui/file-upload.tsx - 清理未使用的導入（Badge, X, CheckCircle, AlertCircle 未使用）
**位置:** `src\components\ui\file-upload.tsx:27`
---
### 51. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:12`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 dialog data 建立明確型別
---
### 52. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:28`
**詳細說明:**
> 說明：替換為具名型別或泛型參數，避免使用 unknown
---
### 53. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:74`
**詳細說明:**
> 說明：為 data 提供具名型別或受限泛型，避免使用 unknown
---
### 54. [FIX] src/lib/types-unified.ts - 修正 unknown/any 類型
**位置:** `src\lib\types-unified.ts:245`
**詳細說明:**
> 說明：以具名型別替代 unknown，或引入泛型以約束資料型別
---
## 🟢 P3 (3 個)
### 1. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 清理未使用的參數（params 未使用）
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:10`
**詳細說明:**
> Redirect to unified spaces page
---
### 2. [REFACTOR] src/components/features/spaces/components/overview/recent-activity.tsx - 清理未使用的參數
**位置:** `src\components\features\spaces\components\overview\recent-activity.tsx:28`
---
### 3. [REFACTOR] src/components/features/spaces/components/quality/quality-dashboard.tsx - 清理未使用的參數（spaceId 未使用）
**位置:** `src\components\features\spaces\components\quality\quality-dashboard.tsx:28`
---