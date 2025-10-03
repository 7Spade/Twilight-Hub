# 📝 TODO 報告
## 📊 統計摘要
- 總計: 62 個項目
- 🔴 緊急: 7 個項目
### 依優先級
- P2: 41 個
- P1: 18 個
- P0: 3 個
### 依類型
- PERF: 1 個
- REFACTOR: 33 個
- FEAT: 14 個
- CLEANUP: 2 個
- TYPING: 1 個
- HOOK: 2 個
- VAN: 9 個
---
## 🔴 P0 (3 個)
### 1. [REFACTOR] src/app/(app)/organizations/[organizationslug]/[spaceslug]/page.tsx - 伺服端處理 redirect
**位置:** `src\app\(app)\organizations\[organizationslug]\[spaceslug]\page.tsx:2`
**負責人:** @ai
**詳細說明:**
> 說明：將 params 解析與 redirect 放到 server page，縮小 client 邊界，降低 AI agent 認知負擔。
---
### 2. [REFACTOR] src/app/(app)/[userslug]/[spaceslug]/page.tsx - 將 client 端 redirect 移至 Server Component
**位置:** `src\app\(app)\[userslug]\[spaceslug]\page.tsx:2`
**負責人:** @ai
**詳細說明:**
> 說明：`redirect` 應優先在伺服端執行以降低邊界複雜度；可改為 server page 直接 `await params` 後 redirect。
> 參考：Next.js App Router（server/client components、redirect、params）。
---
### 3. [REFACTOR] src/components/features/spaces/components/file-explorer/file-explorer.tsx - 縮小 client 邊界與拆分職責
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:9`
**負責人:** @ai
**詳細說明:**
> 說明：目前元件同時負責資料抓取、狀態、呈現與互動。建議：
> 1) 將 listFiles/upload/download/delete 等 IO 行為抽離至專用 hook/service；
> 2) 視需要由父層 Server Component 提供序列化資料（或以 Suspense 分段）；
> 3) 拆分 FileExplorerContent 為更小的展示型子元件，降低 useState/useMemo 密度。
> 目標：維持效能並大幅降低 AI agent 認知負擔。
---
## 🟠 P1 (18 個)
### 1. [REFACTOR] src/components/features/spaces/components/ - 減少過度抽象的組件層級
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
### 2. [REFACTOR] src/app/(app)/layout.tsx - 降低客戶端邊界與狀態複雜度
**位置:** `src\app\(app)\layout.tsx:2`
**負責人:** @ai
**詳細說明:**
> 導向：
> 1) 盡量保持本檔為瘦客戶端殼層，將資料抓取/權限/聚合移至 Server Components 或 Server Actions。
> 2) 將重型 UI（Sidebar/Nav 計算）與資料相依分離，採 props 注入；避免在 layout 內多重 useEffect/useMemo 疊加。
> 3) 使用 App Router 推薦：父層 Server Layout + 子層 Client Providers（參考 Next.js docs: server and client components, use client in provider）。
---
### 3. [REFACTOR] src/app/(app)/organizations/[organizationslug]/inventory/page.tsx - 以 Server 取得 org 與清單
**位置:** `src\app\(app)\organizations\[organizationslug]\inventory\page.tsx:3`
**負責人:** @ai
**詳細說明:**
> 說明：目前在 client 端以 getDocs/queries 聚合多個集合，建議改為父層 Server Page 聚合輸出，
> 並以 props 餵入（或分段 Suspense），降低 client 邏輯與狀態，維持效能且更易讀。
---
### 4. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 統一由伺服端進行 redirect
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:2`
**負責人:** @ai
**詳細說明:**
> 說明：改為 server page 直接 redirect('/spaces')，避免在 client 內呼叫 redirect。
---
### 5. [REFACTOR] src/app/(app)/[userslug]/page.tsx - 將 params 解析改由 server page 處理
**位置:** `src\app\(app)\[userslug]\page.tsx:6`
**負責人:** @ai
**詳細說明:**
> 說明：避免在 client 端使用 React.use(params)，改為 server page 解析後以 props 傳入，降低邊界與型別負擔。
---
### 6. [TYPING] no-any (L192, L221) [低認知]
**位置:** `src\components\auth\auth-provider.tsx:9`
**負責人:** @ai
**詳細說明:**
> TODO: [P1] HOOK deps (L365) [低認知]
> TODO: [P1] REFACTOR src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 7. [HOOK] deps (L365) [低認知]
**位置:** `src\components\auth\auth-provider.tsx:10`
**負責人:** @ai
**詳細說明:**
> TODO: [P1] REFACTOR src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 8. [REFACTOR] src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
**位置:** `src\components\auth\auth-provider.tsx:11`
**負責人:** @ai
**詳細說明:**
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 9. [HOOK] deps (L156) [低認知]
**位置:** `src\components\auth\role-manager.tsx:9`
**負責人:** @ai
**詳細說明:**
> TODO: [P2] REFACTOR src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 10. [VAN] - 移除未使用的重命名導入
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:3`
**詳細說明:**
> 問題：Avatar, AvatarFallback, AvatarImage, Phone 導入後從未使用
> 解決方案：直接移除未使用的導入語句
> 現代化建議：使用 ESLint no-unused-vars 規則自動檢測
> 效能影響：減少 bundle 大小，降低認知負擔，提升 AI agent 代碼理解
> 相關受影響檔案：無（這些導入未在任何地方使用）
---
### 11. [REFACTOR] src/components/features/spaces/components/file-explorer/filter-panel.tsx - 抽離 UI 與狀態設定
**位置:** `src\components\features\spaces\components\file-explorer\filter-panel.tsx:9`
**負責人:** @ai
**詳細說明:**
> 說明：將篩選條件狀態 schema 與預設值抽到 `shared`（或 features 專屬 types）集中管理；
> Panel 僅處理展示與事件回呼，提升模組邊界清晰度與型別一致性。
---
### 12. [REFACTOR] src/components/features/spaces/components/file-explorer/folder-tree.tsx - 抽離 mock 與分層
**位置:** `src\components\features\spaces\components\file-explorer\folder-tree.tsx:9`
**負責人:** @ai
**詳細說明:**
> 說明：將 mockFolders 與 organizeFilesIntoFolders 移到純函數模組（shared/utils 或 features 層 utils），
> 並以 props 注入結果；本元件專注渲染與互動，降低檔案長度與複雜度。
---
### 13. [VAN] - 移除未使用的重命名導入
**位置:** `src\components\features\spaces\components\file-explorer\packages-tab.tsx:18`
**詳細說明:**
> 問題：Table, TableBody, TableCell, TableHead, TableHeader, TableRow, User 導入後從未使用
> 解決方案：直接移除未使用的導入語句
> 現代化建議：使用 ESLint no-unused-vars 規則自動檢測
> 效能影響：減少 bundle 大小，降低認知負擔，提升 AI agent 代碼理解
> 相關受影響檔案：無（這些導入未在任何地方使用）
---
### 14. [VAN] - 移除未使用的重命名導入
**位置:** `src\components\forms\form-card.tsx:18`
**詳細說明:**
> 問題：Skeleton 導入後從未使用
> 解決方案：直接移除未使用的導入語句
> 現代化建議：使用 ESLint no-unused-vars 規則自動檢測
> 效能影響：減少 bundle 大小，降低認知負擔，提升 AI agent 代碼理解
> 相關受影響檔案：無（這個導入未在任何地方使用）
---
### 15. [REFACTOR] src/components/search-command.tsx - 抽離查詢為 Server Action/API 並以 props 餵入
**位置:** `src\components\search-command.tsx:10`
**負責人:** @ai
**詳細說明:**
> 說明：目前直接在 client 端組合 Firestore 查詢，造成 UI 與資料耦合、增加狀態複雜度。
> 建議：建立 server action（或輕量 API route）處理查詢與權限，再以 props 餵入、或使用 Suspense + use 從父層 Server Component 傳資料。
> 目標：降低認知負擔與邊界複雜度，維持現有效能。
---
### 16. [REFACTOR] src/firebase/provider.tsx - Provider 只做服務注入與極簡使用者狀態
**位置:** `src\firebase\provider.tsx:2`
**負責人:** @ai
**詳細說明:**
> 指南：
> 1) 移除非必要邏輯（如聚合/轉換），避免與授權/角色耦合；與 `components/auth` 分離。
> 2) 嚴格作為 Client Provider，被 Server Layout 包裹；避免在此放置 UI 或多重副作用。
> 3) 將錯誤呈現交由上層 global-error，僅維護 user/isUserLoading/userError 的最小狀態。
---
### 17. [VAN] - 現代化類型斷言，使用更安全的對象初始化
**位置:** `src\hooks\use-permissions.ts:128`
**詳細說明:**
> 問題：{} as Record<Permission, PermissionCheckResult> 使用類型斷言初始化空對象
> 解決方案：使用 Object.fromEntries() 或 reduce() 來創建類型安全的對象
> 現代化建議：const results = Object.fromEntries(permissions.map(p => [p, null])) as Record<Permission, PermissionCheckResult>
> 效能影響：無，但提升類型安全性和代碼可讀性
> 相關受影響檔案：無（內部重構，不影響外部接口）
---
### 18. [VAN] - 現代化類型斷言，使用更安全的對象初始化
**位置:** `src\hooks\use-permissions.ts:250`
**詳細說明:**
> 問題：{} as Record<Permission, PermissionCheckResult> 使用類型斷言初始化空對象
> 解決方案：使用 Object.fromEntries() 或 reduce() 來創建類型安全的對象
> 現代化建議：const results = Object.fromEntries(permissions.map(p => [p, null])) as Record<Permission, PermissionCheckResult>
> 效能影響：無，但提升類型安全性和代碼可讀性
> 相關受影響檔案：無（內部重構，不影響外部接口）
---
## 🟡 P2 (41 個)
### 1. [REFACTOR] src/components/features/spaces/components/ - 合併重複的組件邏輯
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
### 2. [PERF] next.config.ts - 實現 Next.js 15 性能優化配置
**位置:** `next.config.ts:16`
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
### 3. [REFACTOR] src/components/features/spaces/hooks/ - 簡化 hooks 邏輯
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
### 4. [REFACTOR] src/app/(app)/dashboard/page.tsx - 將 Firestore 資料抓取下沉至 Server 組件
**位置:** `src\app\(app)\dashboard\page.tsx:3`
**負責人:** @ai
**詳細說明:**
> 說明：目前多個 useMemo + useCollection 於 client 端，建議由父層 Server Page 取得序列化資料後以 props 傳入，
> 並將 Dashboard 純化為展示，減少 client 邊界與效能負擔，提升 AI agent 可讀性。
---
### 5. [FEAT] src/app/actions/contracts.ts - 實作合約 AI 分析
**位置:** `src\app\actions\contracts.ts:89`
**詳細說明:**
> 說明：整合 Genkit AI 或其他 AI 服務，輸出摘要與風險點
---
### 6. [FEAT] src/app/actions/contracts.ts - 實作合約 PDF 生成
**位置:** `src\app\actions\contracts.ts:102`
**詳細說明:**
> 說明：整合 PDF 生成服務（含標題、雙方、金額、日期、簽名）
---
### 7. [CLEANUP] unused import (L39) [低認知]
**位置:** `src\components\auth\auth-provider.tsx:8`
**負責人:** @ai
**詳細說明:**
> TODO: [P1] TYPING no-any (L192, L221) [低認知]
> TODO: [P1] HOOK deps (L365) [低認知]
> TODO: [P1] REFACTOR src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 8. [REFACTOR] src/components/auth/auth-provider.tsx - 奧卡姆剃刀精簡權限/認證 Provider
**位置:** `src\components\auth\auth-provider.tsx:18`
**詳細說明:**
> 建議：
> 1) 將 Firestore 讀取拆為最小 API（單一 fetchUserRoleAssignment），其餘聚合邏輯移至 service；Provider 僅保存必要狀態。
> 2) 僅暴露最小 API（hasPermission / checkPermission / signIn / signOut），其餘輔助函式封裝內部。
> 3) 避免渲染期副作用；所有 mutation 綁定事件或 Server Actions；避免將完整使用者資料下傳至 client。
---
### 9. [CLEANUP] unused imports/vars (L28, L41, L70, L88, L89, L134) [低認知]
**位置:** `src\components\auth\role-manager.tsx:8`
**負責人:** @ai
**詳細說明:**
> TODO: [P1] HOOK deps (L156) [低認知]
> TODO: [P2] REFACTOR src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 10. [REFACTOR] src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
**位置:** `src\components\auth\role-manager.tsx:10`
**負責人:** @ai
**詳細說明:**
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 11. [REFACTOR] src/components/auth/role-manager.tsx - 奧卡姆剃刀精簡角色管理
**位置:** `src\components\auth\role-manager.tsx:17`
**詳細說明:**
> 建議：
> 1) 合併 Firestore 讀取：批量查詢與最小欄位投影；以單一 hook/context 管理 users/roles 狀態，移除重複 useState。
> 2) 僅在互動時載入詳情（lazy/load-on-demand），表格只顯示最少欄位；避免在列表渲染時計算聚合。
> 3) 將對話框組件移至同一檔內的輕量內聯或共用子目錄；重複出現 ≥3 次的表單行為再抽象。
> 4) 權限判斷集中在 `useAuth()` 暴露的單一 selector，避免在本檔重複 hasPermission。
---
### 12. [REFACTOR] src/components/auth/role-manager.tsx:28 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:31`
**負責人:** @frontend
**詳細說明:**
> 問題：'Switch' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 13. [REFACTOR] src/components/auth/role-manager.tsx:34 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:44`
**負責人:** @frontend
**詳細說明:**
> 問題：'DialogTrigger' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 14. [REFACTOR] src/components/auth/role-manager.tsx:57 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:73`
**負責人:** @frontend
**詳細說明:**
> 問題：'Settings' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 15. [REFACTOR] src/components/auth/role-manager.tsx:61 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:81`
**負責人:** @frontend
**詳細說明:**
> 問題：'roleManagementService' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 16. [REFACTOR] src/components/auth/role-manager.tsx:62 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:89`
**負責人:** @frontend
**詳細說明:**
> 問題：'UserRoleAssignment' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 17. [FEAT] src/components/features/organizations/components/roles/create-role-dialog.tsx - 實現角色創建 API 調用
**位置:** `src\components\features\organizations\components\roles\create-role-dialog.tsx:70`
---
### 18. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現權限更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:169`
---
### 19. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現訪問級別更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:175`
---
### 20. [FEAT] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實作創建驗收 API 呼叫
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:74`
---
### 21. [FEAT] src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:103`
---
### 22. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx - 奧卡姆剃刀精簡列表
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:14`
**詳細說明:**
> 建議：
> 1) 將統計（total/pending/active）移至 memo 或上層 hook，避免在渲染期反覆計算。
> 2) 類型圖示以 CSS/variant 取代多分支；最小化 UI 條件分支。
> 3) 詳情 `ContractDetails` 採 lazy import（動態載入），減少首屏負擔。
---
### 23. [REFACTOR] src/components/features/spaces/components/file-explorer/context-menu.tsx - 將靜態選單結構抽為常數
**位置:** `src\components\features\spaces\components\file-explorer\context-menu.tsx:7`
**負責人:** @ai
**詳細說明:**
> 說明：menuItems 可抽成常數與型別，避免於 render 期建構大型物件；保留動作回呼介面。
> 影響：無功能變動、降低渲染負擔與閱讀成本。
---
### 24. [VAN] - 現代化類型定義，移除不必要的類型斷言
**位置:** `src\components\features\spaces\components\file-explorer\file-table.tsx:41`
**詳細說明:**
> 問題：column.id as SortField 和 checked as boolean 需要類型斷言
> 解決方案：定義更精確的類型，使用類型守衛替代類型斷言
> 現代化建議：使用 const assertions 和聯合類型提升類型安全
> 效能影響：無，但提升類型安全性和代碼可讀性
> 相關受影響檔案：無（內部重構）
---
### 25. [REFACTOR] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts - 強化型別與錯誤處理
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:7`
**負責人:** @ai
**詳細說明:**
> 說明：為 handleError 增加類型守衛，並將 MIME 對照表抽出常數；可提供 `isPreviewError` type guard。
> 目標：提升型別安全與可測性，降低 AI agent 理解成本。
---
### 26. [FEAT] src/components/features/spaces/components/issues/create-issue-form.tsx - 實作創建問題 API 呼叫
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:69`
---
### 27. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:41`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 28. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:60`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 29. [VAN] - 現代化類型斷言，使用更安全的類型守衛
**位置:** `src\components\features\spaces\components\participants\view-toggle.tsx:53`
**詳細說明:**
> 問題：value as ViewMode['type'] 使用類型斷言，可能存在類型不安全
> 解決方案：使用類型守衛函數驗證 value 是否為有效的 ViewMode['type']
> 現代化建議：const isValidViewMode = (val: string): val is ViewMode['type'] => VIEW_MODES.some(m => m.type === val)
> 效能影響：無，但提升類型安全性和運行時安全性
> 相關受影響檔案：無（內部重構，不影響外部接口）
---
### 30. [VAN] - 現代化類型斷言，使用更安全的鍵值訪問
**位置:** `src\components\features\spaces\components\participants\view-toggle.tsx:65`
**詳細說明:**
> 問題：mode.icon as keyof typeof ICON_MAP 使用類型斷言，可能存在鍵值不存在的情況
> 解決方案：使用 Object.hasOwn() 或 in 運算符驗證鍵值存在
> 現代化建議：const IconComponent = Object.hasOwn(ICON_MAP, mode.icon) ? ICON_MAP[mode.icon] : DefaultIcon
> 效能影響：無，但提升類型安全性和運行時安全性
> 相關受影響檔案：無（內部重構，不影響外部接口）
---
### 31. [VAN] - 現代化 reduce 類型推斷
**位置:** `src\components\features\spaces\components\quality\checklist.tsx:137`
**詳細說明:**
> 問題：使用 as Record<string, ChecklistItem[]> 類型斷言
> 解決方案：使用更精確的類型定義或類型守衛
> 現代化建議：考慮使用 Map 或更精確的類型定義
> 效能影響：無，但提升類型安全性
> 相關受影響檔案：無（內部重構）
---
### 32. [FEAT] src/components/features/spaces/components/quality/create-checklist-template.tsx - 實現創建模板 API 調用
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:88`
---
### 33. [FEAT] src/components/features/spaces/components/report/create-report-dialog.tsx - 實現創建報告 API 調用
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:90`
---
### 34. [FEAT] src/components/features/spaces/components/report/report-dashboard.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-dashboard.tsx:124`
---
### 35. [FEAT] src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:77`
---
### 36. [REFACTOR] src/components/features/spaces/hooks/use-file-actions.ts - 奧卡姆剃刀精簡檔案動作 Hook
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:8`
**詳細說明:**
> 建議：
> 1) 將 fileOperations 相關依賴集中於單一 factory/context，移除多處 useCallback 依賴項導致的 hooks 警告。
> 2) 僅回傳實際用到的最小 API（如 download/preview/delete），避免暴露整包操作以降低重渲染。
> 3) 針對重複邏輯（權限/錯誤處理/Toast）抽為 util，避免每個 action 內重複。
---
### 37. [REFACTOR] src/components/ui/chart.tsx - 奧卡姆剃刀精簡圖表層
**位置:** `src\components\ui\chart.tsx:1`
**詳細說明:**
> 建議：
> 1) 以 props 驅動、單一責任：只渲染必要視圖，不內嵌資料轉換/來源選擇。
> 2) 將重複的 formatter/mapper 提升為 util，避免在多圖表內重複實作。
> 3) 禁止於渲染期間觸發副作用或資料拉取，將副作用遷至上層 hook。
---
### 38. [REFACTOR] src/firebase/firestore/use-collection.tsx - 控制快取與依賴穩定，降低重新訂閱
**位置:** `src\firebase\firestore\use-collection.tsx:37`
**詳細說明:**
> 建議：
> - 呼叫端須 useMemo 穩定 Query/Ref，hook 內可檢查相等性避免過度 unsubscribe/subscribe。
> - 提供選項：{ listen?: boolean; cache?: 'no-store'|'memory' }，與 App Router 快取策略對齊。
> - 僅回傳必要欄位，錯誤統一由 errorEmitter 傳遞。
---
### 39. [REFACTOR] src/hooks/use-permissions.ts - 奧卡姆剃刀精簡權限 Hook
**位置:** `src\hooks\use-permissions.ts:2`
**詳細說明:**
> 建議：
> 1) 將 checkOrganizationPermissionInternal 暴露為單一 memoized selector，避免多處 useCallback 依賴分散。
> 2) 僅回傳呼叫端實際需要的最小資料（布林/字串），降低重渲染與心智負擔。
> 3) 以穩定依賴陣列與衍生值 memo 化，移除多餘依賴導致的 hooks 警告。
---
### 40. [REFACTOR] src/lib/role-management.ts - 合併查詢與快取，僅回傳最小資料
**位置:** `src\lib\role-management.ts:112`
**負責人:** @ai
**詳細說明:**
> 指南：
> - 提供 in-memory 快取（弱映射）以減少 getRoleDefinition 重複查詢；
> - checkPermission 與 getAllRoleDefinitions 共享快取；
> - 僅暴露 id/name/permissions；將非必要欄位延後查詢。
---
### 41. [REFACTOR] src/lib/role-management.ts - 奧卡姆剃刀精簡服務層
**位置:** `src\lib\role-management.ts:121`
**詳細說明:**
> 建議：
> 1) 以 pure function + 最小輸出為主，避免在 service 層維持隱藏狀態。
> 2) 將 getAllRoleDefinitions 與 checkPermission 的重複查詢合併/快取；避免重複 Firestore round-trip。
> 3) 僅回傳渲染所需欄位（id/name/permissions），其餘細節延後查詢。
---
## 🟢 P3 (0 個)