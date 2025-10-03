# 📝 TODO 報告
## 📊 統計摘要
- 總計: 108 個項目
- 🔴 緊急: 23 個項目
### 依優先級
- P2: 84 個
- P1: 17 個
- P3: 3 個
- P0: 4 個
### 依類型
- PERF: 11 個
- REFACTOR: 55 個
- CLEANUP: 5 個
- FEAT: 16 個
- TYPING: 1 個
- HOOK: 2 個
- FIX: 18 個
---
## 🔴 P0 (4 個)
### 1. [FIX] Parsing (L67)
**位置:** `src\components\features\spaces\components\participants\participant-list.tsx:2`
**詳細說明:**
> - Issue: Unexpected token (might need {'>'} or &gt;)
> - Guidance: Check JSX tag/table cells; use {'>'} instead of bare character.
---
### 2. [FIX] Parsing (L67) [低認知][現代化]
**位置:** `src\components\features\spaces\components\participants\participant-role-editor.tsx:2`
**詳細說明:**
> - 問題：Unterminated string literal
> - 指引：補齊引號或簡化字串；避免行內註解破壞字串。
---
### 3. [FIX] Parsing (L82) [低認知][現代化]
**位置:** `src\components\features\spaces\components\participants\participant-table.tsx:2`
**詳細說明:**
> - 問題：Unterminated string literal
> - 指引：補上結尾引號；若文案未定以 '--' 站位。
---
### 4. [FIX] Parsing (L106) [低認知][現代化]
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:7`
**詳細說明:**
> - 問題：Unexpected token（考慮 {'>'} 或 &gt;）
> - 指引：檢查 JSX 中的 '>' 與屬性，必要時以 {'>'} 顯示文字箭頭。
---
## 🟠 P1 (17 個)
### 1. [PERF] src/app/(app)/organizations/[organizationslug]/inventory/page.tsx:122 - 優化 React hooks 依賴項
**位置:** `src\app\(app)\organizations\[organizationslug]\inventory\page.tsx:126`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：warehouses 邏輯表達式可能導致 useEffect 和 useMemo Hook 依賴項在每次渲染時改變
> 影響：性能問題，不必要的重新渲染（影響 lines 150, 176）
> 建議：將 warehouses 初始化包裝在獨立的 useMemo Hook 中
---
### 2. [PERF] src/app/(app)/organizations/[organizationslug]/inventory/[itemId]/page.tsx:95 - 優化 React hooks 依賴項
**位置:** `src\app\(app)\organizations\[organizationslug]\inventory\[itemId]\page.tsx:99`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：warehouses 邏輯表達式可能導致 useEffect Hook 依賴項在每次渲染時改變
> 影響：性能問題，不必要的重新渲染（影響 line 128）
> 建議：將 warehouses 初始化包裝在獨立的 useMemo Hook 中
---
### 3. [PERF] src/app/(app)/spaces/page.tsx:42 - 優化 React hooks 依賴項
**位置:** `src\app\(app)\spaces\page.tsx:46`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：allSpaces 邏輯表達式可能導致多個 useMemo Hook 依賴項在每次渲染時改變
> 影響：性能問題，不必要的重新渲染（影響 lines 49, 70, 77, 82）
> 建議：將 allSpaces 初始化包裝在獨立的 useMemo Hook 中
---
### 4. [PERF] src/components/features/spaces/hooks/use-file-actions.ts:105 - 優化 React hooks 依賴項
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:106`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：React Hook useCallback 缺少依賴項 'fileOperations'
> 影響：可能導致過時閉包問題
> 建議：添加缺失的依賴項或移除依賴數組
---
### 5. [PERF] src/components/features/spaces/hooks/use-file-actions.ts:144 - 優化 React hooks 依賴項
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:145`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：React Hook useCallback 缺少依賴項 'fileOperations'
> 影響：可能導致過時閉包問題
> 建議：添加缺失的依賴項或移除依賴數組
---
### 6. [PERF] src/components/features/spaces/hooks/use-file-actions.ts:178 - 優化 React hooks 依賴項
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:186`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：React Hook useCallback 缺少依賴項 'fileOperations'
> 影響：可能導致過時閉包問題
> 建議：添加缺失的依賴項或移除依賴數組
---
### 7. [PERF] src/components/features/spaces/hooks/use-file-actions.ts:208 - 優化 React hooks 依賴項
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:223`
**負責人:** @frontend
**截止日期:** 2025-01-15
**詳細說明:**
> 問題：React Hook useCallback 缺少依賴項 'fileOperations'
> 影響：可能導致過時閉包問題
> 建議：添加缺失的依賴項或移除依賴數組
---
### 8. [REFACTOR] src/components/features/spaces/components/ - 減少過度抽象的組件層級
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
### 9. [REFACTOR] src/app/(app)/layout.tsx - 降低客戶端邊界與狀態複雜度
**位置:** `src\app\(app)\layout.tsx:2`
**負責人:** @ai
**詳細說明:**
> 導向：
> 1) 盡量保持本檔為瘦客戶端殼層，將資料抓取/權限/聚合移至 Server Components 或 Server Actions。
> 2) 將重型 UI（Sidebar/Nav 計算）與資料相依分離，採 props 注入；避免在 layout 內多重 useEffect/useMemo 疊加。
> 3) 使用 App Router 推薦：父層 Server Layout + 子層 Client Providers（參考 Next.js docs: server and client components, use client in provider）。
---
### 10. [PERF] Hooks deps (L122, L157, L183) [低認知][現代化]
**位置:** `src\app\(app)\organizations\[organizationslug]\inventory\page.tsx:2`
**詳細說明:**
> - 問題：'warehouses' 的邏輯表達式導致 useEffect/useMemo 依賴可能每次變更
> - 指引：以 useMemo 包裝初始化或將計算移入對應 useMemo/Effect 回呼中。
---
### 11. [PERF] Hooks deps (L95, L135) [低認知][現代化]
**位置:** `src\app\(app)\organizations\[organizationslug]\inventory\[itemId]\page.tsx:2`
**詳細說明:**
> - 問題：'warehouses' 的邏輯表達式可能使 useEffect 依賴每次改變
> - 指引：用 useMemo 固定引用或把初始化移入 effect 回呼。
---
### 12. [PERF] Hooks deps (L42, L56, L77, L84, L89) [低認知]
**位置:** `src\app\(app)\spaces\page.tsx:2`
**詳細說明:**
> - 問題：'allSpaces' 邏輯表達式導致 useMemo 依賴變動
> - 指引：以 useMemo 包裝初始化或移入對應 useMemo 回呼。
---
### 13. [TYPING] no-any (L192, L221) [低認知]
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
### 14. [HOOK] deps (L365) [低認知]
**位置:** `src\components\auth\auth-provider.tsx:10`
**負責人:** @ai
**詳細說明:**
> TODO: [P1] REFACTOR src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 15. [REFACTOR] src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
**位置:** `src\components\auth\auth-provider.tsx:11`
**負責人:** @ai
**詳細說明:**
> 原則（Next.js App Router / Firebase）：
> - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
> - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
> - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
---
### 16. [HOOK] deps (L156) [低認知]
**位置:** `src\components\auth\role-manager.tsx:9`
**負責人:** @ai
**詳細說明:**
> TODO: [P2] REFACTOR src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 17. [REFACTOR] src/firebase/provider.tsx - Provider 只做服務注入與極簡使用者狀態
**位置:** `src\firebase\provider.tsx:2`
**負責人:** @ai
**詳細說明:**
> 指南：
> 1) 移除非必要邏輯（如聚合/轉換），避免與授權/角色耦合；與 `components/auth` 分離。
> 2) 嚴格作為 Client Provider，被 Server Layout 包裹；避免在此放置 UI 或多重副作用。
> 3) 將錯誤呈現交由上層 global-error，僅維護 user/isUserLoading/userError 的最小狀態。
---
## 🟡 P2 (84 個)
### 1. [REFACTOR] src/components/adjust-stock-dialog.tsx:133 - 修復非空斷言警告
**位置:** `src\components\adjust-stock-dialog.tsx:138`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用非空斷言 (!) 可能導致運行時錯誤
> 影響：類型安全問題，可能導致應用崩潰
> 建議：添加適當的類型檢查或使用可選鏈操作符
---
### 2. [REFACTOR] src/components/auth/auth-provider.tsx:195 - 修復 TypeScript any 類型使用
**位置:** `src\components\auth\auth-provider.tsx:204`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 3. [REFACTOR] src/components/features/spaces/components/file-explorer/file-explorer.tsx:341 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:342`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 4. [REFACTOR] src/components/features/spaces/components/file-explorer/file-explorer.tsx:346 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\file-explorer.tsx:352`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 5. [REFACTOR] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts:52 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:66`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 6. [REFACTOR] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts:223 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:210`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的錯誤類型接口替代 any 類型
---
### 7. [REFACTOR] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts:28 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:240`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 8. [REFACTOR] src/components/features/spaces/components/file-explorer/services/file-preview-service.ts:50 - 修復 TypeScript any 類型使用
**位置:** `src\components\features\spaces\components\file-explorer\services\file-preview-service.ts:261`
**負責人:** @frontend
**截止日期:** 2025-01-25
**詳細說明:**
> 問題：使用 any 類型違反類型安全原則
> 影響：失去類型檢查，可能導致運行時錯誤
> 建議：定義具體的類型接口替代 any 類型
---
### 9. [REFACTOR] src/components/features/spaces/components/ - 合併重複的組件邏輯
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
### 10. [PERF] next.config.ts - 實現 Next.js 15 性能優化配置
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
### 11. [REFACTOR] src/components/features/spaces/hooks/ - 簡化 hooks 邏輯
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
### 12. [CLEANUP] unused import (L3) [低認知]
**位置:** `src\app\(app)\organizations\[organizationslug]\roles\page.tsx:2`
**詳細說明:**
> - 問題：useCollection 未使用
> - 指引：移除未使用匯入或以前綴 _ 命名表示暫未用。
---
### 13. [REFACTOR] src/app/(app)/organizations/[organizationslug]/roles/page.tsx:3 - 清理未使用的導入
**位置:** `src\app\(app)\organizations\[organizationslug]\roles\page.tsx:8`
**負責人:** @frontend
**詳細說明:**
> 問題：'useCollection' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 14. [CLEANUP] unused arg (L6) [低認知]
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:2`
**詳細說明:**
> - 問題：params 未使用
> - 指引：移除參數或以前綴 _ 命名。
---
### 15. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx:6 - 清理未使用的參數
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:15`
**負責人:** @frontend
**詳細說明:**
> 問題：'params' 參數已定義但從未使用
> 影響：代碼可讀性差，可能造成混淆
> 建議：移除未使用的參數或添加下劃線前綴表示有意未使用
> Redirect to unified spaces page
---
### 16. [FEAT] src/app/actions/contracts.ts - 實作合約 AI 分析
**位置:** `src\app\actions\contracts.ts:89`
**詳細說明:**
> 說明：整合 Genkit AI 或其他 AI 服務，輸出摘要與風險點
---
### 17. [FEAT] src/app/actions/contracts.ts - 實作合約 PDF 生成
**位置:** `src\app\actions\contracts.ts:102`
**詳細說明:**
> 說明：整合 PDF 生成服務（含標題、雙方、金額、日期、簽名）
---
### 18. [CLEANUP] unused import/ops (L13, L138) [低認知]
**位置:** `src\components\adjust-stock-dialog.tsx:3`
**詳細說明:**
> - 指引：移除未使用 setDoc；避免 non-null assertion，改以條件判斷。
---
### 19. [REFACTOR] src/components/adjust-stock-dialog.tsx:13 - 清理未使用的導入
**位置:** `src\components\adjust-stock-dialog.tsx:18`
**負責人:** @frontend
**詳細說明:**
> 問題：'setDoc' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 20. [CLEANUP] unused import (L39) [低認知]
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
### 21. [REFACTOR] src/components/auth/auth-provider.tsx - 奧卡姆剃刀精簡權限/認證 Provider
**位置:** `src\components\auth\auth-provider.tsx:18`
**詳細說明:**
> 建議：
> 1) 將 Firestore 讀取拆為最小 API（單一 fetchUserRoleAssignment），其餘聚合邏輯移至 service；Provider 僅保存必要狀態。
> 2) 僅暴露最小 API（hasPermission / checkPermission / signIn / signOut），其餘輔助函式封裝內部。
> 3) 避免渲染期副作用；所有 mutation 綁定事件或 Server Actions；避免將完整使用者資料下傳至 client。
---
### 22. [REFACTOR] src/components/auth/auth-provider.tsx:39 - 清理未使用的導入
**位置:** `src\components\auth\auth-provider.tsx:49`
**負責人:** @frontend
**詳細說明:**
> 問題：'getFirestore' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 23. [CLEANUP] unused imports/vars (L28, L41, L70, L88, L89, L134) [低認知]
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
### 24. [REFACTOR] src/components/auth/role-manager.tsx - 避免列表渲染期昂貴操作
**位置:** `src\components\auth\role-manager.tsx:10`
**負責人:** @ai
**詳細說明:**
> 建議：
> - 將 roles/users 載入改為懶載（按需打開時再查詢）；表格僅顯示前幾個權限，其餘以 lazy 展開。
> - 對話框抽成小型子元件或同檔內聯，避免 props 鏈過深；重複邏輯 ≥3 次再抽象。
> - 權限檢查改用 `useAuth()` 的單一 selector，移除本檔重複 hasPermission 調用。
---
### 25. [REFACTOR] src/components/auth/role-manager.tsx - 奧卡姆剃刀精簡角色管理
**位置:** `src\components\auth\role-manager.tsx:17`
**詳細說明:**
> 建議：
> 1) 合併 Firestore 讀取：批量查詢與最小欄位投影；以單一 hook/context 管理 users/roles 狀態，移除重複 useState。
> 2) 僅在互動時載入詳情（lazy/load-on-demand），表格只顯示最少欄位；避免在列表渲染時計算聚合。
> 3) 將對話框組件移至同一檔內的輕量內聯或共用子目錄；重複出現 ≥3 次的表單行為再抽象。
> 4) 權限判斷集中在 `useAuth()` 暴露的單一 selector，避免在本檔重複 hasPermission。
---
### 26. [REFACTOR] src/components/auth/role-manager.tsx:28 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:32`
**負責人:** @frontend
**詳細說明:**
> 問題：'Switch' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 27. [REFACTOR] src/components/auth/role-manager.tsx:34 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:46`
**負責人:** @frontend
**詳細說明:**
> 問題：'DialogTrigger' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 28. [REFACTOR] src/components/auth/role-manager.tsx:57 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:76`
**負責人:** @frontend
**詳細說明:**
> 問題：'Settings' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 29. [REFACTOR] src/components/auth/role-manager.tsx:61 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:84`
**負責人:** @frontend
**詳細說明:**
> 問題：'roleManagementService' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 30. [REFACTOR] src/components/auth/role-manager.tsx:62 - 清理未使用的導入
**位置:** `src\components\auth\role-manager.tsx:93`
**負責人:** @frontend
**詳細說明:**
> 問題：'UserRoleAssignment' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 31. [REFACTOR] src/components/contribution-breakdown-chart.tsx:10 - 清理未使用的導入
**位置:** `src\components\contribution-breakdown-chart.tsx:12`
**負責人:** @frontend
**詳細說明:**
> 問題：'Card', 'CardContent', 'CardHeader', 'CardTitle' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 32. [REFACTOR] src/components/features/contracts/contract-list.tsx:15 - 清理未使用的導入
**位置:** `src\components\features\contracts\contract-list.tsx:17`
**負責人:** @frontend
**詳細說明:**
> 問題：'Filter' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 33. [REFACTOR] src/components/features/contracts/contract-list.tsx:17 - 清理未使用的導入
**位置:** `src\components\features\contracts\contract-list.tsx:26`
**負責人:** @frontend
**詳細說明:**
> 問題：'useMemo' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 34. [FEAT] src/components/features/organizations/components/roles/create-role-dialog.tsx - 實現角色創建 API 調用
**位置:** `src\components\features\organizations\components\roles\create-role-dialog.tsx:70`
---
### 35. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現權限更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:169`
---
### 36. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現訪問級別更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:175`
---
### 37. [REFACTOR] src/components/features/spaces/components/acceptance/acceptance-item.tsx:5 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\acceptance\acceptance-item.tsx:7`
**負責人:** @frontend
**詳細說明:**
> 問題：'Button' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 38. [FIX] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 acceptance 建立明確型別介面
---
### 39. [FEAT] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實作創建驗收 API 呼叫
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:57`
---
### 40. [REFACTOR] src/components/features/spaces/components/contracts/contract-details.tsx:3 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:5`
**負責人:** @frontend
**詳細說明:**
> 問題：'Avatar', 'AvatarFallback', 'AvatarImage' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 41. [REFACTOR] src/components/features/spaces/components/contracts/contract-details.tsx:10 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:19`
**負責人:** @frontend
**詳細說明:**
> 問題：'Phone' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 42. [FEAT] src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:110`
---
### 43. [FIX] src/components/features/spaces/components/contracts/contract-list.tsx - 修復 JSX 語法錯誤（第317行未閉合標籤或無效字元）
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:3`
---
### 44. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx:10 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:12`
**負責人:** @frontend
**詳細說明:**
> 問題：'FileText', 'DollarSign' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
> TODO: [P2] REFACTOR src/components/features/spaces/components/contracts/contract-list.tsx - 奧卡姆剃刀精簡列表
> 建議：
> 1) 將統計（total/pending/active）移至 memo 或上層 hook，避免在渲染期反覆計算。
> 2) 類型圖示以 CSS/variant 取代多分支；最小化 UI 條件分支。
> 3) 詳情 `ContractDetails` 採 lazy import（動態載入），減少首屏負擔。
---
### 45. [REFACTOR] src/components/features/spaces/components/contracts/contract-list.tsx - 奧卡姆剃刀精簡列表
**位置:** `src\components\features\spaces\components\contracts\contract-list.tsx:17`
**詳細說明:**
> 建議：
> 1) 將統計（total/pending/active）移至 memo 或上層 hook，避免在渲染期反覆計算。
> 2) 類型圖示以 CSS/variant 取代多分支；最小化 UI 條件分支。
> 3) 詳情 `ContractDetails` 採 lazy import（動態載入），減少首屏負擔。
---
### 46. [FIX] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 contract 建立明確型別介面
---
### 47. [FIX] src/components/features/spaces/components/file-explorer/context-menu.tsx - 修復字符串字面量錯誤（第126行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\context-menu.tsx:7`
---
### 48. [FIX] src/components/features/spaces/components/file-explorer/deleted-items.tsx - 修復字符串字面量錯誤（第50行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\deleted-items.tsx:8`
---
### 49. [FIX] src/components/features/spaces/components/file-explorer/empty-folder-state.tsx - 修復字符串字面量錯誤（第31行未終止）
**位置:** `src\components\features\spaces\components\file-explorer\empty-folder-state.tsx:8`
---
### 50. [REFACTOR] src/components/features/spaces/components/file-explorer/file-table.tsx:29 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\file-table.tsx:27`
**負責人:** @frontend
**詳細說明:**
> 問題：'FolderOpen' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 51. [REFACTOR] src/components/features/spaces/components/file-explorer/filter-panel.tsx:27 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\filter-panel.tsx:34`
**負責人:** @frontend
**詳細說明:**
> 問題：'Filter' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 52. [REFACTOR] src/components/features/spaces/components/file-explorer/filter-panel.tsx:29 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\filter-panel.tsx:40`
**負責人:** @frontend
**詳細說明:**
> 問題：'Save' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 53. [REFACTOR] src/components/features/spaces/components/file-explorer/filter-panel.tsx:34 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\filter-panel.tsx:48`
**負責人:** @frontend
**詳細說明:**
> 問題：'cn' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 54. [REFACTOR] src/components/features/spaces/components/file-explorer/folder-tree.tsx:12 - Clean up unused imports
**位置:** `src\components\features\spaces\components\file-explorer\folder-tree.tsx:13`
**負責人:** @frontend
**詳細說明:**
> Issue: 'Button' is imported but never used
> Impact: Increases bundle size and affects performance
> Suggestion: Remove the unused import or prefix with underscore to indicate intentional unused
---
### 55. [REFACTOR] src/components/features/spaces/components/file-explorer/toolbar.tsx:13 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\toolbar.tsx:15`
**負責人:** @frontend
**詳細說明:**
> 問題：'Input' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 56. [REFACTOR] src/components/features/spaces/components/file-explorer/upload-dialog.tsx:12 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\file-explorer\upload-dialog.tsx:14`
**負責人:** @frontend
**詳細說明:**
> 問題：'Input' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 57. [FIX] src/components/features/spaces/components/issues/create-issue-form.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:29`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 issue 建立明確型別介面
---
### 58. [FEAT] src/components/features/spaces/components/issues/create-issue-form.tsx - 實作創建問題 API 呼叫
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:52`
---
### 59. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:41`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 60. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:60`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 61. [FIX] src/components/features/spaces/components/overview/types.ts - 修正 unknown/any 類型（定義 metadata 結構）
**位置:** `src\components\features\spaces\components\overview\types.ts:41`
---
### 62. [FEAT] src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 顯示錯誤提示
**位置:** `src\components\features\spaces\components\participants\invite-participant-dialog.tsx:55`
**負責人:** @dev
---
### 63. [FEAT] src/components/features/spaces/components/participants/participant-role-editor.tsx - 實現角色變更 API 調用
**位置:** `src\components\features\spaces\components\participants\participant-role-editor.tsx:50`
---
### 64. [REFACTOR] src/components/features/spaces/components/participants/view-toggle.tsx:9 - 清理未使用的導入
**位置:** `src\components\features\spaces\components\participants\view-toggle.tsx:10`
**負責人:** @frontend
**詳細說明:**
> 問題：'Button' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 65. [FIX] src/components/features/spaces/components/quality/create-checklist-template.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:33`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 template 建立明確型別介面
---
### 66. [FEAT] src/components/features/spaces/components/quality/create-checklist-template.tsx - 實現創建模板 API 調用
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:71`
---
### 67. [FIX] src/components/features/spaces/components/report/create-report-dialog.tsx - 修正 unknown/any 類型
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:36`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 report 建立明確型別介面
---
### 68. [FEAT] src/components/features/spaces/components/report/create-report-dialog.tsx - 實現創建報告 API 調用
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:70`
---
### 69. [FEAT] src/components/features/spaces/components/report/report-dashboard.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-dashboard.tsx:124`
---
### 70. [FEAT] src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:80`
---
### 71. [REFACTOR] src/components/features/spaces/hooks/use-file-actions.ts - 奧卡姆剃刀精簡檔案動作 Hook
**位置:** `src\components\features\spaces\hooks\use-file-actions.ts:8`
**詳細說明:**
> 建議：
> 1) 將 fileOperations 相關依賴集中於單一 factory/context，移除多處 useCallback 依賴項導致的 hooks 警告。
> 2) 僅回傳實際用到的最小 API（如 download/preview/delete），避免暴露整包操作以降低重渲染。
> 3) 針對重複邏輯（權限/錯誤處理/Toast）抽為 util，避免每個 action 內重複。
---
### 72. [REFACTOR] src/components/features/spaces/hooks/use-star-actions.ts - 清理未使用的導入（Space 未使用）
**位置:** `src\components\features\spaces\hooks\use-star-actions.ts:14`
---
### 73. [REFACTOR] src/components/follower-list.tsx:11 - 清理未使用的導入
**位置:** `src\components\follower-list.tsx:13`
**負責人:** @frontend
**詳細說明:**
> 問題：'doc' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 74. [REFACTOR] src/components/forms/form-card.tsx:18 - 清理未使用的導入
**位置:** `src\components\forms\form-card.tsx:20`
**負責人:** @frontend
**詳細說明:**
> 問題：'Skeleton' 已導入但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
---
### 75. [REFACTOR] src/components/github-heat-map.tsx:39 - 清理未使用的變數
**位置:** `src\components\github-heat-map.tsx:41`
**負責人:** @frontend
**詳細說明:**
> 問題：'weekDays' 已定義但從未使用
> 影響：增加 bundle 大小，影響性能
> 建議：移除未使用的變數或添加下劃線前綴表示有意未使用
---
### 76. [REFACTOR] src/components/ui/chart.tsx - 奧卡姆剃刀精簡圖表層
**位置:** `src\components\ui\chart.tsx:1`
**詳細說明:**
> 建議：
> 1) 以 props 驅動、單一責任：只渲染必要視圖，不內嵌資料轉換/來源選擇。
> 2) 將重複的 formatter/mapper 提升為 util，避免在多圖表內重複實作。
> 3) 禁止於渲染期間觸發副作用或資料拉取，將副作用遷至上層 hook。
---
### 77. [REFACTOR] src/firebase/firestore/use-collection.tsx - 控制快取與依賴穩定，降低重新訂閱
**位置:** `src\firebase\firestore\use-collection.tsx:37`
**詳細說明:**
> 建議：
> - 呼叫端須 useMemo 穩定 Query/Ref，hook 內可檢查相等性避免過度 unsubscribe/subscribe。
> - 提供選項：{ listen?: boolean; cache?: 'no-store'|'memory' }，與 App Router 快取策略對齊。
> - 僅回傳必要欄位，錯誤統一由 errorEmitter 傳遞。
---
### 78. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:12`
**詳細說明:**
> 說明：以具名型別替代 unknown，為 dialog data 建立明確型別
---
### 79. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:28`
**詳細說明:**
> 說明：替換為具名型別或泛型參數，避免使用 unknown
---
### 80. [FIX] src/hooks/use-app-state.ts - 修正 unknown/any 類型
**位置:** `src\hooks\use-app-state.ts:74`
**詳細說明:**
> 說明：為 data 提供具名型別或受限泛型，避免使用 unknown
---
### 81. [REFACTOR] src/hooks/use-permissions.ts - 奧卡姆剃刀精簡權限 Hook
**位置:** `src\hooks\use-permissions.ts:2`
**詳細說明:**
> 建議：
> 1) 將 checkOrganizationPermissionInternal 暴露為單一 memoized selector，避免多處 useCallback 依賴分散。
> 2) 僅回傳呼叫端實際需要的最小資料（布林/字串），降低重渲染與心智負擔。
> 3) 以穩定依賴陣列與衍生值 memo 化，移除多餘依賴導致的 hooks 警告。
---
### 82. [REFACTOR] src/lib/role-management.ts - 合併查詢與快取，僅回傳最小資料
**位置:** `src\lib\role-management.ts:112`
**負責人:** @ai
**詳細說明:**
> 指南：
> - 提供 in-memory 快取（弱映射）以減少 getRoleDefinition 重複查詢；
> - checkPermission 與 getAllRoleDefinitions 共享快取；
> - 僅暴露 id/name/permissions；將非必要欄位延後查詢。
---
### 83. [REFACTOR] src/lib/role-management.ts - 奧卡姆剃刀精簡服務層
**位置:** `src\lib\role-management.ts:121`
**詳細說明:**
> 建議：
> 1) 以 pure function + 最小輸出為主，避免在 service 層維持隱藏狀態。
> 2) 將 getAllRoleDefinitions 與 checkPermission 的重複查詢合併/快取；避免重複 Firestore round-trip。
> 3) 僅回傳渲染所需欄位（id/name/permissions），其餘細節延後查詢。
---
### 84. [FIX] src/lib/types-unified.ts - 修正 unknown/any 類型
**位置:** `src\lib\types-unified.ts:245`
**詳細說明:**
> 說明：以具名型別替代 unknown，或引入泛型以約束資料型別
---
## 🟢 P3 (3 個)
### 1. [REFACTOR] src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 清理未使用的參數（params 未使用）
**位置:** `src\app\(app)\organizations\[organizationslug]\spaces\page.tsx:13`
---
### 2. [REFACTOR] src/components/features/spaces/components/quality/quality-dashboard.tsx - 清理未使用的參數（spaceId 未使用）
**位置:** `src\components\features\spaces\components\quality\quality-dashboard.tsx:28`
---
### 3. [REFACTOR] src/components/ui/menubar.tsx - 奧卡姆剃刀精簡 API 表面
**位置:** `src\components\ui\menubar.tsx:8`
**詳細說明:**
> 建議：
> 1) 僅導出常用組件（Menubar, Trigger, Content, Item, Separator），其餘用到再暴露，降低 API 心智負擔。
> 2) 以範例/Story 取代過度封裝，鼓勵組合而非新增包裝層。
---