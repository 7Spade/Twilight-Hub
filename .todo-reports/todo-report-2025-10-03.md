# 📝 TODO 報告
## 📊 統計摘要
- 總計: 105 個項目
- 🔴 緊急: 28 個項目
### 依優先級
- P2: 78 個
- P1: 10 個
- P3: 4 個
- P0: 13 個
### 依類型
- PERF: 9 個
- REFACTOR: 46 個
- FEAT: 20 個
- FIX: 30 個
---
## 🔴 P0 (13 個)
### 1. [FIX] src/components/features/spaces/components/file-explorer/file-table.tsx - 修復語法錯誤（第52行未終止的字串）
**位置:** `src\components\features\spaces\components\file-explorer\file-table.tsx:1`
**詳細說明:**
> 說明：修正字串/JSX 轉義，確保語法正確並通過 Lint
---
### 2. [FIX] src/components/features/spaces/components/file-explorer/filter-panel.tsx - 修復語法錯誤（第141行 Unexpected token）
**位置:** `src\components\features\spaces\components\file-explorer\filter-panel.tsx:1`
**詳細說明:**
> 說明：檢查 JSX 標籤與大於號轉義，修正不合法符號
---
### 3. [FIX] src/components/features/spaces/components/file-explorer/folder-tree.tsx - 修復語法錯誤（第480行 Unexpected token）
**位置:** `src\components\features\spaces\components\file-explorer\folder-tree.tsx:1`
**詳細說明:**
> 說明：檢查 JSX 結構與轉義，修正不合法符號
---
### 4. [FIX] src/components/features/spaces/components/file-explorer/packages-tab.tsx - 修復語法錯誤（第61行未終止的字串）
**位置:** `src\components\features\spaces\components\file-explorer\packages-tab.tsx:1`
**詳細說明:**
> 說明：修正字串/模板字面量，避免編譯失敗
---
### 5. [FIX] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts - 修復語法錯誤（第224行未終止的字串）
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:1`
**詳細說明:**
> 說明：補齊引號或移除多餘字元，確保語法正確
---
### 6. [FIX] src/components/features/spaces/components/file-explorer/thumbnail/file-thumbnail-grid.tsx - 修復語法錯誤（第212行未終止的字串）
**位置:** `src\components\features\spaces\components\file-explorer\thumbnail\file-thumbnail-grid.tsx:1`
**詳細說明:**
> 說明：修正模板/普通字串，避免解析錯誤
---
### 7. [FIX] src/components/features/spaces/components/file-explorer/toolbar.tsx - 修復語法錯誤（第138行未終止的字串）
**位置:** `src\components\features\spaces\components\file-explorer\toolbar.tsx:1`
**詳細說明:**
> 說明：修正字串與 JSX 構造，確保可編譯
---
### 8. [FIX] src/components/features/spaces/components/issues/issue-details.tsx - 修復語法錯誤（第106行未終止的字串）
**位置:** `src\components\features\spaces\components\issues\issue-details.tsx:1`
**詳細說明:**
> 說明：修正字串或模板字面量，避免 Lint 解析錯誤
---
### 9. [FIX] src/components/features/spaces/components/issues/issue-list.tsx - 修復語法錯誤（第137行未終止的字串）
**位置:** `src\components\features\spaces\components\issues\issue-list.tsx:1`
**詳細說明:**
> 說明：補齊引號或修正 JSX 文字，確保通過 Lint
---
### 10. [FIX] src/components/features/spaces/components/participants/advanced-filters.tsx - 修復語法錯誤（第34行 ',' 缺失）
**位置:** `src\components\features\spaces\components\participants\advanced-filters.tsx:1`
**詳細說明:**
> 說明：檢查物件/參數列表逗號缺失與 JSX 分隔
---
### 11. [FIX] src/components/features/spaces/components/participants/card-grid.tsx - 修復語法錯誤（第123行未終止的字串）
**位置:** `src\components\features\spaces\components\participants\card-grid.tsx:1`
**詳細說明:**
> 說明：補齊字串/模板字面量，避免解析錯誤
---
### 12. [FIX] src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 修復語法錯誤（第98行 Unexpected token）
**位置:** `src\components\features\spaces\components\participants\invite-participant-dialog.tsx:1`
**詳細說明:**
> 說明：檢查 JSX 標籤是否缺失閉合或有非法字元
---
### 13. [FIX] src/components/features/spaces/components/participants/participant-card.tsx - 修復語法錯誤（第109行 Unexpected token）
**位置:** `src\components\features\spaces\components\participants\participant-card.tsx:6`
**詳細說明:**
> 說明：檢查 JSX 屬性與標籤閉合，修正不合法符號
---
## 🟠 P1 (10 個)
### 1. [PERF] src/app/(app)/layout.tsx:71 - 優化 React hooks 依賴項
**位置:** `src\app\(app)\layout.tsx:73`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：organizations 邏輯表達式可能導致 useMemo Hook 依賴項在每次渲染時改變
> 影響：性能問題，不必要的重新渲染
> 建議：將 organizations 初始化包裝在獨立的 useMemo Hook 中
---
### 2. [PERF] src/app/(app)/spaces/page.tsx:42 - 優化 React hooks 依賴項
**位置:** `src\app\(app)\spaces\page.tsx:44`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：allSpaces 邏輯表達式可能導致多個 useMemo Hook 依賴項在每次渲染時改變
> 影響：性能問題，不必要的重新渲染（影響 lines 49, 70, 77, 82）
> 建議：將 allSpaces 初始化包裝在獨立的 useMemo Hook 中
---
### 3. [PERF] src/components/auth/auth-provider.tsx:345 - 修復 React Hook 缺失依賴項
**位置:** `src\components\auth\auth-provider.tsx:360`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：useEffect Hook 缺少 'fetchUserRoleAssignment' 依賴項
> 影響：可能導致過時閉包問題，狀態更新不及時
> 建議：將 'fetchUserRoleAssignment' 添加到依賴數組中，或移除依賴數組
---
### 4. [PERF] src/components/auth/role-manager.tsx:123 - 修復 React Hook 缺失依賴項
**位置:** `src\components\auth\role-manager.tsx:125`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：useEffect Hook 缺少 'loadRoles' 和 'loadUsers' 依賴項
> 影響：可能導致過時閉包問題，函數更新不及時
> 建議：將 'loadRoles' 和 'loadUsers' 添加到依賴數組中，或使用 useCallback 包裝函數
---
### 5. [REFACTOR] src/components/features/spaces/components/file-explorer/file-explorer.tsx - 簡化過度複雜的組件結構
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:14`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：FileExplorer 組件超過 540 行，違反奧卡姆剃刀原則
> 影響：維護困難、測試複雜、性能問題
> 建議：
> 1) 將組件拆分為更小的單一職責組件
> 2) 移除多層 Context Provider 嵌套
> 3) 使用 Next.js 15 Server Components 替代不必要的 Client Components
> 4) 統一狀態管理，避免 prop drilling
---
### 6. [PERF] src/components/features/spaces/hooks/use-file-actions.ts:105 - 修復 React Hook 缺失依賴項
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:107`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：useCallback Hook 缺少 'fileOperations' 依賴項
> 影響：可能導致過時閉包問題，函數更新不及時
> 建議：將 'fileOperations' 添加到依賴數組中，或移除依賴數組
---
### 7. [REFACTOR] src/components/features/spaces/components/ - 減少過度抽象的組件層級
**位置:** `src\components\features\spaces\components\index.ts:7`
**負責人:** @frontend
**截止日期:** 2025-01-20
**詳細說明:**
> 問題：70 個文件過度拆分，造成不必要的複雜性
> 影響：導入路徑過長、維護成本高、認知負擔重
> 建議：
> 1) 合併功能相似的組件（如多個 list 組件）
> 2) 簡化目錄結構，減少嵌套層級
> 3) 移除不必要的 barrel exports
> 4) 遵循 Next.js 15 組件組合模式
---
### 8. [REFACTOR] src/app/(app)/layout.tsx - 降低客戶端邊界與狀態複雜度
**位置:** `src\app\(app)\layout.tsx:2`
**負責人:** @ai
**詳細說明:**
> 導向：
> 1) 盡量保持本檔為瘦客戶端殼層，將資料抓取/權限/聚合移至 Server Components 或 Server Actions。
> 2) 將重型 UI（Sidebar/Nav 計算）與資料相依分離，採 props 注入；避免在 layout 內多重 useEffect/useMemo 疊加。
> 3) 使用 App Router 推薦：父層 Server Layout + 子層 Client Providers（參考 Next.js docs: server and client components, use client in provider）。
---
### 9. [REFACTOR] src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
**位置:** `src\components\auth\auth-provider.tsx:8`
**負責人:** @ai
**詳細說明:**
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 10. [REFACTOR] src/firebase/provider.tsx - Provider 只做服務注入與極簡使用者狀態
**位置:** `src\firebase\provider.tsx:2`
**負責人:** @ai
**詳細說明:**
> 指南：
> 1) 移除非必要邏輯（如聚合/轉換），避免與授權/角色耦合；與 `components/auth` 分離。
> 2) 嚴格作為 Client Provider，被 Server Layout 包裹；避免在此放置 UI 或多重副作用。
> 3) 將錯誤呈現交由上層 global-error，僅維護 user/isUserLoading/userError 的最小狀態。
---
## 🟡 P2 (78 個)
### 1. [REFACTOR] src/components/auth/auth-provider.tsx:192 - 修復 TypeScript any 類型使用
**位置:** `src\components\auth\auth-provider.tsx:194`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 2. [PERF] src/components/features/spaces/components/file-explorer/ - 優化 Client/Server Components 使用
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:25`
**負責人:** @performance
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：過度使用 Client Components，違反 Next.js 15 最佳實踐
> 影響：增加 JavaScript bundle 大小、影響首屏性能
> 建議：
> 1) 將純展示組件改為 Server Components
> 2) 使用 Next.js 15 的 'use client' 邊界優化
> 3) 實現適當的代碼分割和懶加載
> 4) 使用 React 19 的新特性優化渲染
---
### 3. [REFACTOR] src/components/features/spaces/components/file-explorer/file-table.tsx:76-77 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\file-table.tsx:85`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 4. [REFACTOR] src/components/features/spaces/components/ - 合併重複的組件邏輯
**位置:** `src\components\features\spaces\components\index.ts:18`
**負責人:** @frontend
**截止日期:** 2025-01-30
**詳細說明:**
> 問題：多個 list/card/dialog 組件存在重複邏輯
> 影響：代碼重複、維護困難、一致性問題
> 建議：
> 1) 創建通用的 List/Card/Dialog 基礎組件
> 2) 使用 TypeScript 泛型提高類型安全
> 3) 實現組合模式而非繼承
> 4) 遵循 DRY 原則和奧卡姆剃刀
> Spaces feature components exports
---
### 5. [PERF] next.config.ts - 實現 Next.js 15 性能優化配置
**位置:** `next.config.ts:12`
**負責人:** @performance
**截止日期:** 2025-02-01
**詳細說明:**
> 問題：未充分利用 Next.js 15 的性能優化特性
> 影響：圖片載入性能差、bundle 大小過大
> 建議：
> 1) 啟用 optimizePackageImports 減少 bundle 大小
> 2) 配置 bundlePagesRouterDependencies 優化依賴打包
> 3) 添加 experimental.turbo 配置提升開發體驗
> 4) 配置適當的圖片優化參數
---
### 6. [PERF] src/components/ui/file-type-icon.tsx - 實現 Next.js 15 圖片優化最佳實踐
**位置:** `src\components\ui\file-type-icon.tsx:34`
**負責人:** @performance
**截止日期:** 2025-02-01
**詳細說明:**
> 問題：未充分利用 Next.js Image 組件的優化特性
> 影響：圖片載入性能差、LCP 指標不佳
> 建議：
> 1) 使用 next/image 替代所有 <img> 標籤
> 2) 配置適當的 priority 和 sizes 屬性
> 3) 實現圖片預載入和懶加載策略
> 4) 使用 WebP/AVIF 格式優化
---
### 7. [PERF] src/components/ui/file-type-icon.tsx:221 - 實現 Next.js 15 圖片優化最佳實踐
**位置:** `src\components\ui\file-type-icon.tsx:222`
**負責人:** @performance
**截止日期:** 2025-02-01
**詳細說明:**
> 問題：使用 <img> 標籤可能導致較慢的 LCP 和更高的頻寬使用
> 影響：圖片載入性能差、LCP 指標不佳
> 建議：使用 next/image 組件自動優化圖片，考慮使用自定義圖片載入器
---
### 8. [REFACTOR] src/components/features/spaces/hooks/ - 簡化 hooks 邏輯
**位置:** `src\components\features\spaces\hooks\index.ts:7`
**負責人:** @frontend
**截止日期:** 2025-02-05
**詳細說明:**
> 問題：多個 hooks 文件可能包含重複邏輯
> 影響：代碼重複、狀態管理複雜
> 建議：
> 1) 合併相似的 hooks 邏輯
> 2) 使用 React 19 的新 hooks 特性
> 3) 實現更簡單的狀態管理模式
> 4) 減少不必要的 useEffect 使用
> Spaces feature hooks exports
---
### 9. [REFACTOR] src/app/(app)/organizations/[organizationslug]/roles/page.tsx:3 - 清理未使用的導入
**位置:** `src\app\(app)\organizations\[organizationslug]\roles\page.tsx:5`
**負責人:** @frontend
**詳細說明:**
> 問題：'useCollection' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 10. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx:6 - 清理未使用的參數
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:12`
**負責人:** @frontend
**詳細說明:**
> 問題：'params' 參數已定義但從未使用
> 影響：代碼可讀性差，可能造成混淆
> 建議：移除未使用的參數或添加下劃線前綴表示有意未使用
> Redirect to unified spaces page
---
### 11. [FEAT] src/app/actions/contracts.ts - 實作合約 AI 分析
**位置:** `src\app\actions\contracts.ts:89`
**詳細說明:**
> 說明：整合 Genkit AI 或其他 AI 服務，輸出摘要與風險點
---
### 12. [FEAT] src/app/actions/contracts.ts - 實作合約 PDF 生成
**位置:** `src\app\actions\contracts.ts:102`
**詳細說明:**
> 說明：整合 PDF 生成服務（含標題、雙方、金額、日期、簽名）
---
### 13. [REFACTOR] src/components/adjust-stock-dialog.tsx - 清理未使用的導入（setDoc 未使用）
**位置:** `src\components\adjust-stock-dialog.tsx:15`
---
### 14. [FIX] src/components/adjust-stock-dialog.tsx - 修復非空斷言警告
**位置:** `src\components\adjust-stock-dialog.tsx:131`
**詳細說明:**
> 說明：在使用 stockInfo.stockId 前進行存在性檢查，移除非空斷言
---
### 15. [REFACTOR] src/components/auth/auth-provider.tsx - 奧卡姆剃刀精簡權限/認證 Provider
**位置:** `src\components\auth\auth-provider.tsx:15`
**詳細說明:**
> 建議：
> 1) 將 Firestore 讀取拆為最小 API（單一 fetchUserRoleAssignment），其餘聚合邏輯移至 service；Provider 僅保存必要狀態。
> 2) 僅暴露最小 API（hasPermission / checkPermission / signIn / signOut），其餘輔助函式封裝內部。
> 3) 避免渲染期副作用；所有 mutation 綁定事件或 Server Actions；避免將完整使用者資料下傳至 client。
---
### 16. [REFACTOR] src/components/auth/auth-provider.tsx:39 - 清理未使用的導入
**位置:** `src\components\auth\auth-provider.tsx:46`
**負責人:** @frontend
**詳細說明:**
> 問題：'getFirestore' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 17. [REFACTOR] src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
**位置:** `src\components\auth\role-manager.tsx:8`
**負責人:** @ai
**詳細說明:**
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 18. [REFACTOR] src/components/auth/role-manager.tsx - 奧卡姆剃刀精簡角色管理
**位置:** `src\components\auth\role-manager.tsx:15`
**詳細說明:**
> 建議：
> 1) 合併 Firestore 讀取：批量查詢與最小欄位投影；以單一 hook/context 管理 users/roles 狀態，移除重複 useState。
> 2) 僅在互動時載入詳情（lazy/load-on-demand），表格只顯示最少欄位；避免在列表渲染時計算聚合。
> 3) 將對話框組件移至同一檔內的輕量內聯或共用子目錄；重複出現 ≥3 次的表單行為再抽象。
> 4) 權限判斷集中在 `useAuth()` 暴露的單一 selector，避免在本檔重複 hasPermission。
---
### 19. [REFACTOR] src/components/contribution-breakdown-chart.tsx - 清理未使用的導入（Card* 未使用）
**位置:** `src\components\contribution-breakdown-chart.tsx:11`
---
### 20. [FEAT] src/components/features/organizations/components/roles/create-role-dialog.tsx - 實現角色創建 API 調用
**位置:** `src\components\features\organizations\components\roles\create-role-dialog.tsx:70`
---
### 21. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現權限更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:169`
---
### 22. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現訪問級別更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:175`
---
### 23. [REFACTOR] src/components/features/spaces/components/acceptance/acceptance-item.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\acceptance\acceptance-item.tsx:6`
---
### 24. [FIX] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 acceptance 建立明確型別介面
---
### 25. [FEAT] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實作創建驗收 API 呼叫
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:57`
---
### 26. [REFACTOR] src/components/features/spaces/components/contracts/contract-details.tsx - 清理未使用的導入（Avatar, AvatarFallback, AvatarImage, Phone 未使用）
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:11`
---
### 27. [FEAT] src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:98`
---
### 28. [FIX] src/components/features/spaces/components/contracts/contract-list.tsx - 修復 JSX 語法錯誤（第317行未閉合標籤或無效字元）
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:3`
---
### 29. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx - 清理未使用的導入（FileText, DollarSign 未使用）
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:11`
**詳細說明:**
> TODO: [P2] REFACTOR src/components/features/spaces/components/contracts/contract-list.tsx - 奧卡姆剃刀精簡列表
> 建議：
> 1) 將統計（total/pending/active）移至 memo 或上層 hook，避免在渲染期反覆計算。
> 2) 類型圖示以 CSS/variant 取代多分支；最小化 UI 條件分支。
> 3) 詳情 `ContractDetails` 採 lazy import（動態載入），減少首屏負擔。
---
### 30. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx - 奧卡姆剃刀精簡列表
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:12`
**詳細說明:**
> 建議：
> 1) 將統計（total/pending/active）移至 memo 或上層 hook，避免在渲染期反覆計算。
> 2) 類型圖示以 CSS/variant 取代多分支；最小化 UI 條件分支。
> 3) 詳情 `ContractDetails` 採 lazy import（動態載入），減少首屏負擔。
---
### 31. [FIX] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 contract 建立明確型別介面
---
### 32. [FEAT] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 實作創建合約 API 呼叫
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:71`
---
### 33. [FIX] src/components/features/spaces/components/file-explorer/context-menu.tsx - 修復字符串字面量錯誤（第126行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\context-menu.tsx:7`
---
### 34. [FIX] src/components/features/spaces/components/file-explorer/deleted-items.tsx - 修復字符串字面量錯誤（第50行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\deleted-items.tsx:8`
---
### 35. [FIX] src/components/features/spaces/components/file-explorer/detail/file-detail-view.tsx - 修復字符串字面量錯誤（第75行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\detail\file-detail-view.tsx:6`
---
### 36. [FIX] src/components/features/spaces/components/file-explorer/empty-folder-state.tsx - 修復字符串字面量錯誤（第31行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\empty-folder-state.tsx:8`
---
### 37. [REFACTOR] src/components/features/spaces/components/file-explorer/file-table.tsx:29 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\file-table.tsx:32`
**負責人:** @frontend
**詳細說明:**
> 問題：'FolderOpen' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 38. [REFACTOR] src/components/features/spaces/components/file-explorer/upload-dialog.tsx - 清理未使用的導入（Input 未使用）
**位置:** `src\components\features\spaces\components\file-explorer\upload-dialog.tsx:13`
---
### 39. [FIX] src/components/features/spaces/components/issues/create-issue-form.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 issue 建立明確型別介面
---
### 40. [FEAT] src/components/features/spaces/components/issues/create-issue-form.tsx - 實作創建問題 API 呼叫
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:52`
---
### 41. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:41`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 42. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:60`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 43. [FIX] src/components/features/spaces/components/overview/recent-activity.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\overview\recent-activity.tsx:17`
**詳細說明:**
> 說明：定義 metadata 結構或使用更嚴格的型別映射
---
### 44. [FIX] src/components/features/spaces/components/overview/types.ts - 修正 unknown/any 類型（定義 metadata 結構）
**位置:** `src\components\features\spaces\components\overview\types.ts:41`
---
### 45. [FEAT] src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 顯示錯誤提示
**位置:** `src\components\features\spaces\components\participants\invite-participant-dialog.tsx:56`
**負責人:** @dev
---
### 46. [FEAT] src/components/features/spaces/components/participants/participant-role-editor.tsx - 實現角色變更 API 調用
**位置:** `src\components\features\spaces\components\participants\participant-role-editor.tsx:47`
---
### 47. [FEAT] src/components/features/spaces/components/participants/participant-table.tsx - 打開角色更新對話框
**位置:** `src\components\features\spaces\components\participants\participant-table.tsx:141`
---
### 48. [REFACTOR] src/components/features/spaces/components/participants/view-toggle.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\participants\view-toggle.tsx:10`
---
### 49. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現編輯對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:211`
---
### 50. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現角色變更對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:215`
---
### 51. [REFACTOR] src/components/features/spaces/components/quality/checklist.tsx - 清理未使用的導入（Button 未使用）
**位置:** `src\components\features\spaces\components\quality\checklist.tsx:5`
---
### 52. [FIX] src/components/features/spaces/components/quality/create-checklist-template.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:33`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 template 建立明確型別介面
---
### 53. [FEAT] src/components/features/spaces/components/quality/create-checklist-template.tsx - 實現創建模板 API 調用
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:71`
---
### 54. [FIX] src/components/features/spaces/components/report/create-report-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 report 建立明確型別介面
---
### 55. [FEAT] src/components/features/spaces/components/report/create-report-dialog.tsx - 實現創建報告 API 調用
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:70`
---
### 56. [FEAT] src/components/features/spaces/components/report/report-dashboard.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-dashboard.tsx:124`
---
### 57. [REFACTOR] src/components/features/spaces/components/report/report-viewer.tsx - 清理未使用的導入（Avatar, AvatarFallback, AvatarImage 未使用）
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:4`
---
### 58. [FEAT] src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:79`
---
### 59. [REFACTOR] src/components/features/spaces/components/spaces-list-view.tsx - 清理未使用的導入（cn 未使用）
**位置:** `src\components\features\spaces\components\spaces-list-view.tsx:28`
---
### 60. [REFACTOR] src/components/features/spaces/hooks/use-file-actions.ts - 奧卡姆剃刀精簡檔案動作 Hook
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:8`
**詳細說明:**
> 建議：
> 1) 將 fileOperations 相關依賴集中於單一 factory/context，移除多處 useCallback 依賴項導致的 hooks 警告。
> 2) 僅回傳實際用到的最小 API（如 download/preview/delete），避免暴露整包操作以降低重渲染。
> 3) 針對重複邏輯（權限/錯誤處理/Toast）抽為 util，避免每個 action 內重複。
---
### 61. [REFACTOR] src/components/features/spaces/hooks/use-star-actions.ts - 清理未使用的導入（Space 未使用）
**位置:** `src\components\features\spaces\hooks\use-star-actions.ts:14`
---
### 62. [REFACTOR] src/components/follower-list.tsx - 清理未使用的導入（doc 未使用）
**位置:** `src\components\follower-list.tsx:12`
---
### 63. [REFACTOR] src/components/forms/form-card.tsx - 清理未使用的導入（Skeleton 未使用）
**位置:** `src\components\forms\form-card.tsx:19`
---
### 64. [REFACTOR] src/components/layout/sidebar.tsx - 清理未使用的導入（Settings, Tooltip* 未使用）
**位置:** `src\components\layout\sidebar.tsx:16`
**詳細說明:**
> TODO: [P2] REFACTOR src/components/layout/sidebar.tsx - 奧卡姆剃刀精簡側邊欄
> 建議：
> 1) 刪除未用的視覺裝飾/狀態與條件（保留最小導航能力）。
> 2) 將動態權限與導覽來源集中於單一 selector/hook，避免多處分支與重複邏輯。
> 3) 僅保留使用中之交互（hover/tooltip 適度減量），避免不必要的 re-render 與樣式開銷。
---
### 65. [REFACTOR] src/components/layout/sidebar.tsx - 奧卡姆剃刀精簡側邊欄
**位置:** `src\components\layout\sidebar.tsx:17`
**詳細說明:**
> 建議：
> 1) 刪除未用的視覺裝飾/狀態與條件（保留最小導航能力）。
> 2) 將動態權限與導覽來源集中於單一 selector/hook，避免多處分支與重複邏輯。
> 3) 僅保留使用中之交互（hover/tooltip 適度減量），避免不必要的 re-render 與樣式開銷。
---
### 66. [REFACTOR] src/components/ui/chart.tsx - 奧卡姆剃刀精簡圖表層
**位置:** `src\components\ui\chart.tsx:1`
**詳細說明:**
> 建議：
> 1) 以 props 驅動、單一責任：只渲染必要視圖，不內嵌資料轉換/來源選擇。
> 2) 將重複的 formatter/mapper 提升為 util，避免在多圖表內重複實作。
> 3) 禁止於渲染期間觸發副作用或資料拉取，將副作用遷至上層 hook。
---
### 67. [REFACTOR] src/components/ui/file-type-icon.tsx:7 - 清理未使用的導入
**位置:** `src\components\ui\file-type-icon.tsx:9`
**負責人:** @frontend
**詳細說明:**
> 問題：'useEffect' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 68. [REFACTOR] src/components/ui/file-type-icon.tsx:18-22 - 清理未使用的導入
**位置:** `src\components\ui\file-type-icon.tsx:24`
**負責人:** @frontend
**詳細說明:**
> 問題：'Image', 'Video', 'Music', 'Archive', 'Code' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 69. [REFACTOR] src/components/ui/file-type-icon.tsx - 清理未使用的導入（useEffect, Image, Video, Music, Archive, Code 未使用）
**位置:** `src\components\ui\file-type-icon.tsx:32`
---
### 70. [REFACTOR] src/components/ui/file-upload.tsx - 清理未使用的導入（Badge, X, CheckCircle, AlertCircle 未使用）
**位置:** `src\components\ui\file-upload.tsx:27`
---
### 71. [REFACTOR] src/firebase/firestore/use-collection.tsx - 控制快取與依賴穩定，降低重新訂閱
**位置:** `src\firebase\firestore\use-collection.tsx:37`
**詳細說明:**
> 建議：
> - 呼叫端須 useMemo 穩定 Query/Ref，hook 內可檢查相等性避免過度 unsubscribe/subscribe。
> - 提供選項：{ listen?: boolean; cache?: 'no-store'|'memory' }，與 App Router 快取策略對齊。
> - 僅回傳必要欄位，錯誤統一由 errorEmitter 傳遞。
---
### 72. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:12`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 dialog data 建立明確型別
---
### 73. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:28`
**詳細說明:**
> 說明：替換為具名型別或泛型參數，避免使用 unknown
---
### 74. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:74`
**詳細說明:**
> 說明：為 data 提供具名型別或受限泛型，避免使用 unknown
---
### 75. [REFACTOR] src/hooks/use-permissions.ts - 奧卡姆剃刀精簡權限 Hook
**位置:** `src\hooks\use-permissions.ts:2`
**詳細說明:**
> 建議：
> 1) 將 checkOrganizationPermissionInternal 暴露為單一 memoized selector，避免多處 useCallback 依賴分散。
> 2) 僅回傳呼叫端實際需要的最小資料（布林/字串），降低重渲染與心智負擔。
> 3) 以穩定依賴陣列與衍生值 memo 化，移除多餘依賴導致的 hooks 警告。
---
### 76. [REFACTOR] src/lib/role-management.ts - 合併查詢與快取，僅回傳最小資料
**位置:** `src\lib\role-management.ts:112`
**負責人:** @ai
**詳細說明:**
> 指南：
> - 提供 in-memory 快取（弱映射）以減少 getRoleDefinition 重複查詢；
> - checkPermission 與 getAllRoleDefinitions 共享快取；
> - 僅暴露 id/name/permissions；將非必要欄位延後查詢。
---
### 77. [REFACTOR] src/lib/role-management.ts - 奧卡姆剃刀精簡服務層
**位置:** `src\lib\role-management.ts:121`
**詳細說明:**
> 建議：
> 1) 以 pure function + 最小輸出為主，避免在 service 層維持隱藏狀態。
> 2) 將 getAllRoleDefinitions 與 checkPermission 的重複查詢合併/快取；避免重複 Firestore round-trip。
> 3) 僅回傳渲染所需欄位（id/name/permissions），其餘細節延後查詢。
---
### 78. [FIX] src/lib/types-unified.ts - 修正 unknown/any 類型
**位置:** `src\lib\types-unified.ts:245`
**詳細說明:**
> 說明：以具名型別替代 unknown，或引入泛型以約束資料型別
---
## 🟢 P3 (4 個)
### 1. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 清理未使用的參數（params 未使用）
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:10`
---
### 2. [REFACTOR] src/components/features/spaces/components/overview/recent-activity.tsx - 清理未使用的參數
**位置:** `src\components\features\spaces\components\overview\recent-activity.tsx:28`
---
### 3. [REFACTOR] src/components/features/spaces/components/quality/quality-dashboard.tsx - 清理未使用的參數（spaceId 未使用）
**位置:** `src\components\features\spaces\components\quality\quality-dashboard.tsx:28`
---
### 4. [REFACTOR] src/components/ui/menubar.tsx - 奧卡姆剃刀精簡 API 表面
**位置:** `src\components\ui\menubar.tsx:8`
**詳細說明:**
> 建議：
> 1) 僅導出常用組件（Menubar, Trigger, Content, Item, Separator），其餘用到再暴露，降低 API 心智負擔。
> 2) 以範例/Story 取代過度封裝，鼓勵組合而非新增包裝層。
---