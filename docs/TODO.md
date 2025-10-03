# TODO 管理系統

> **版本**: 1.0  
> **更新**: 2024-12-19  
> **目標**: AI Agent 友好的標準化 TODO 管理

---

## 📋 TODO 標籤標準

### 優先級標籤
- `[P0]` - 緊急 (Critical) - 立即處理
- `[P1]` - 高 (High) - 24小時內
- `[P2]` - 中 (Medium) - 本週內
- `[P3]` - 低 (Low) - 下週內

### 狀態標籤
- `[TODO]` - 待開始
- `[IN_PROGRESS]` - 進行中
- `[BLOCKED]` - 被阻塞
- `[DONE]` - 已完成
- `[CANCELLED]` - 已取消

### 類型標籤
- `[BUG]` - 錯誤修復
- `[FEATURE]` - 新功能
- `[REFACTOR]` - 重構
- `[DOCS]` - 文檔
- `[TEST]` - 測試
- `[PERF]` - 性能優化
- `[SECURITY]` - 安全
- `[CLEANUP]` - 清理

### 模組標籤
- `[AUTH]` - 認證系統
- `[UI]` - 用戶界面
- `[API]` - API 接口
- `[DB]` - 資料庫
- `[CONFIG]` - 配置
- `[DEPLOY]` - 部署
- `[MEMORY_BANK]` - Memory Bank

---

## 🎯 當前活躍 TODO

### VAN 模式 - Memory Bank 同步
- `[P1]` `[MEMORY_BANK]` `[CLEANUP]` `[DONE]` 清理 Memory Bank 無用內容
- `[P1]` `[MEMORY_BANK]` `[REFACTOR]` `[DONE]` 優化 Memory Bank 結構降低認知負擔
- `[P1]` `[MEMORY_BANK]` `[DOCS]` `[DONE]` 建立標準化 TODO.md 文件
- `[P1]` `[MEMORY_BANK]` `[CLEANUP]` `[DONE]` 更新 Memory Bank 與專案同步

### 構建錯誤修復（緊急）
- `[P1]` `[BUG]` `[AUTH]` `[TODO]` 修復 UTF-8 編碼問題 - auth-provider.tsx, permission-guard.tsx
  - 問題: 文件包含無效的 UTF-8 字符導致構建失敗
  - 範圍/影響: src/components/auth/ 目錄，影響所有需要認證的頁面
  - 何時: 2025-10-03 發現，阻塞構建流程
  - 為什麼: 文件編輯時引入了非 UTF-8 字符或文件保存編碼錯誤
  - 解法: 使用支援 UTF-8 的編輯器重新保存文件，確保文件編碼為 UTF-8
  - 驗證: (1) npm run build 成功 (2) 文件可正常編譯 (3) 無編碼警告
  - 預防: 在 .editorconfig 中強制 UTF-8 編碼，使用 ESLint 插件檢測編碼問題
  - 風險/回滾: 風險低；若出現問題，從 git 歷史恢復文件

- `[P1]` `[BUG]` `[AUTH]` `[TODO]` 修復文件完整性問題 - role-manager.tsx 被截斷
  - 問題: role-manager.tsx 只剩 10 行，原本應有完整的角色管理功能
  - 範圍/影響: src/components/auth/role-manager.tsx，影響角色管理功能
  - 何時: 2025-10-03 發現，可能與 UTF-8 編碼問題同時發生
  - 為什麼: 編碼問題或文件保存時截斷
  - 解法: 從 git 歷史恢復完整的 role-manager.tsx 文件
  - 驗證: (1) 文件行數恢復正常 (2) 角色管理功能可用 (3) 無編譯錯誤
  - 預防: 定期 git commit，使用文件完整性檢查工具
  - 風險/回滾: 風險低；確保從正確的 commit 恢復

- `[P1]` `[BUG]` `[UI]` `[TODO]` 修復 JSX 語法錯誤 - search-command.tsx
  - 問題: 第94行 <span> 標籤未正確閉合，包含 "⌘</span>K" 錯誤寫法
  - 範圍/影響: src/components/search-command.tsx，影響搜尋功能
  - 何時: 2025-10-03 發現，阻塞構建
  - 為什麼: JSX 標籤編寫錯誤，</span> 和 K 之間缺少開始標籤
  - 解法: 修改為 <span className="text-xs">⌘</span><span>K</span> 或 <span>⌘ K</span>
  - 驗證: (1) npm run build 成功 (2) 搜尋快捷鍵顯示正確 (3) 無 JSX 錯誤
  - 預防: 使用 ESLint JSX 插件，編輯器 JSX 語法高亮
  - 風險/回滾: 風險低；純前端修改

- `[P1]` `[BUG]` `[UI]` `[TODO]` 修復 React Hooks 規則違反 - file-upload.tsx
  - 問題: 第65、72、252行在回調函數中調用 Hook（useIsFileTypeSupported, useFormatFileSize）
  - 範圍/影響: src/components/ui/file-upload.tsx，影響文件上傳功能
  - 何時: 2025-10-03 lint 檢測到，違反 React Hooks 規則
  - 為什麼: Hook 必須在組件頂層調用，不能在回調、條件或循環中調用
  - 解法: 將 Hook 調用移到組件頂層，在回調中使用計算結果
  - 驗證: (1) npm run lint 無 Hooks 錯誤 (2) 文件上傳功能正常 (3) 無運行時錯誤
  - 預防: 使用 eslint-plugin-react-hooks，代碼審查時檢查 Hook 使用
  - 風險/回滾: 風險中；需測試文件上傳流程

- `[P1]` `[BUG]` `[REFACTOR]` `[TODO]` 修復語法錯誤 - use-permissions.ts
  - 問題: 第66行包含不完整的元素訪問表達式（如 arr[] 缺少索引）
  - 範圍/影響: src/hooks/use-permissions.ts，影響權限檢查
  - 何時: 2025-10-03 發現，阻塞構建
  - 為什麼: 陣列或物件訪問語法不完整
  - 解法: 檢查第66行，補充完整的訪問表達式
  - 驗證: (1) TypeScript 編譯成功 (2) 權限檢查功能正常 (3) 無語法錯誤
  - 預防: TypeScript 嚴格模式，ESLint 語法檢查
  - 風險/回滾: 風險中；權限系統核心邏輯

- `[P1]` `[BUG]` `[REFACTOR]` `[TODO]` 修復語法錯誤 - role-management.ts
  - 問題: 第20行缺少分號，導致解析錯誤
  - 範圍/影響: src/lib/role-management.ts，影響角色管理服務
  - 何時: 2025-10-03 發現
  - 為什麼: 語句末尾缺少分號
  - 解法: 在第20行末尾添加分號
  - 驗證: (1) npm run lint 成功 (2) TypeScript 編譯成功 (3) 角色管理功能正常
  - 預防: 使用 Prettier 自動格式化，ESLint 檢查分號
  - 風險/回滾: 風險低；簡單語法修復

### 構建錯誤修復（中優先級）
- `[P2]` `[BUG]` `[UI]` `[TODO]` 修復字符串字面量錯誤 - file-explorer 相關組件
  - 問題: 多個文件包含未終止的字符串字面量（缺少閉合引號）
  - 範圍/影響: src/components/features/spaces/components/file-explorer/ 目錄
  - 受影響文件: column-settings-menu.tsx(L69), context-menu.tsx(L126), deleted-items.tsx(L50), file-detail-view.tsx(L75), empty-folder-state.tsx(L31), file-table.tsx(L51)
  - 何時: 2025-10-03 發現
  - 為什麼: 字符串字面量缺少結束引號或包含特殊字符
  - 解法: 檢查每個文件對應行，補充缺失的引號或轉義特殊字符
  - 驗證: (1) npm run build 成功 (2) file-explorer 功能正常 (3) 無語法錯誤
  - 預防: ESLint 語法檢查，編輯器語法高亮
  - 風險/回滾: 風險低；純語法修復

- `[P2]` `[BUG]` `[UI]` `[TODO]` 修復 JSX 語法錯誤 - contract-list.tsx
  - 問題: 第317行包含未閉合的標籤或無效字符
  - 範圍/影響: src/components/features/spaces/components/contracts/contract-list.tsx
  - 何時: 2025-10-03 發現
  - 為什麼: JSX 標籤未正確閉合或包含非法字符
  - 解法: 檢查第317行，確保所有 JSX 標籤正確閉合
  - 驗證: (1) npm run build 成功 (2) 合約列表顯示正常 (3) 無 JSX 錯誤
  - 預防: ESLint JSX 插件，編輯器 JSX 語法高亮
  - 風險/回滾: 風險低；純前端修改

- `[P2]` `[BUG]` `[UI]` `[TODO]` 修復語法錯誤 - file-explorer.tsx
  - 問題: 第95行缺少分號
  - 範圍/影響: src/components/features/spaces/components/file-explorer/file-explorer.tsx
  - 何時: 2025-10-03 發現
  - 為什麼: 語句末尾缺少分號
  - 解法: 在第95行末尾添加分號
  - 驗證: (1) npm run lint 成功 (2) file-explorer 功能正常 (3) 無語法錯誤
  - 預防: Prettier 自動格式化，ESLint 檢查分號
  - 風險/回滾: 風險低；簡單語法修復

### Lint 警告清理（低優先級）
- `[P3]` `[CLEANUP]` `[REFACTOR]` `[TODO]` 清理未使用的變量和 import
  - 問題: 多個文件包含未使用的 import 和變量聲明
  - 範圍/影響: 全專案，影響代碼質量和 bundle size
  - 解法: 使用 ESLint --fix 自動移除，或手動清理
  - 驗證: npm run lint 無未使用變量警告
  - 預防: 使用 ESLint，定期運行 lint --fix
  - 風險/回滾: 風險極低；自動化清理

- `[P3]` `[PERF]` `[REFACTOR]` `[TODO]` 修復 React Hooks 依賴問題
  - 問題: 多個組件的 useMemo/useEffect 依賴陣列不完整，可能導致每次渲染都重新計算
  - 範圍/影響: 多個頁面組件，影響性能
  - 解法: 根據 ESLint 提示，將依賴包裝在 useMemo 中
  - 驗證: npm run lint 無 exhaustive-deps 警告，性能無降低
  - 預防: 遵守 React Hooks 最佳實踐，使用 ESLint 檢查
  - 風險/回滾: 風險低；性能優化

### 專案結構優化
- `[P2]` `[REFACTOR]` `[TODO]` 實施 Next.js 15 標準文件命名規範
- `[P2]` `[CLEANUP]` `[TODO]` 清理重複文件 (FirebaseErrorListener.tsx)
- `[P2]` `[REFACTOR]` `[TODO]` 重組目錄結構建立清晰邊界
- `[P2]` `[CLEANUP]` `[TODO]` 統一類型系統 (types.ts vs types-unified.ts)

---

## 📊 TODO 統計

### 按優先級
- `[P0]`: 0 個
- `[P1]`: 10 個 (4 完成, 6 待開始)
- `[P2]`: 7 個 (全部待開始)
- `[P3]`: 2 個 (全部待開始)

### 按狀態
- `[TODO]`: 15 個
- `[IN_PROGRESS]`: 0 個
- `[DONE]`: 4 個
- `[BLOCKED]`: 0 個
- `[CANCELLED]`: 0 個

### 按類型
- `[BUG]`: 10 個
- `[REFACTOR]`: 4 個
- `[CLEANUP]`: 3 個
- `[DOCS]`: 1 個
- `[PERF]`: 1 個

---

## 🔄 TODO 更新規則

### 添加新 TODO
```markdown
- `[優先級]` `[模組]` `[類型]` `[狀態]` 描述內容
```

- 對於 `[BUG]`、`[REFACTOR]` 類型，必須在條目後附上「問題導向模板（RCA）」以利零認知處理。

### 更新 TODO 狀態
1. 將 `[TODO]` 改為 `[IN_PROGRESS]` 開始工作
2. 將 `[IN_PROGRESS]` 改為 `[DONE]` 完成工作
3. 將 `[IN_PROGRESS]` 改為 `[BLOCKED]` 遇到阻塞
4. 將任何狀態改為 `[CANCELLED]` 取消任務

### 優先級調整
- 根據業務影響和緊急程度調整
- 定期審查和重新排序
- 避免過多 P0 和 P1 任務

---

## 📝 TODO 模板

### 功能開發 TODO
```markdown
- `[P2]` `[FEATURE]` `[AUTH]` `[TODO]` 實現用戶登入功能
  - 子任務: 表單驗證、Firebase 整合、錯誤處理
  - 預估時間: 4 小時
  - 依賴: Firebase 配置完成
```

### 錯誤修復 TODO
```markdown
- `[P1]` `[BUG]` `[UI]` `[TODO]` 修復登入頁面樣式問題
  - 問題描述: 按鈕在移動端顯示異常
  - 預估時間: 1 小時
  - 測試: 多設備響應式測試
```

### 重構 TODO
```markdown
- `[P2]` `[REFACTOR]` `[API]` `[TODO]` 重構 API 錯誤處理
  - 目標: 統一錯誤響應格式
  - 預估時間: 2 小時
  - 影響範圍: 所有 API 端點
```

### 問題導向模板（RCA/5W1H 極簡版）
> 適用：`[BUG]`、`[REFACTOR]`、任何需要追根究柢與可預防性的任務。

```markdown
- 問題（What）: 用一句話描述發生了什麼問題？
- 範圍/影響（Who/Where）: 受影響的用戶/模組/路徑？
- 何時（When）: 何時首次出現/再次出現？是否可重現？
- 為什麼（Why/Root Cause）: 最小可驗證的根因陳述（單行）。
- 解法（How Fix）: 最小解法（單行），如需多步以清單列出。
- 驗證（How Verify）: 驗證步驟（最多 3 步）；指標/日誌位置。
- 預防（How Prevent）: 守護欄（Lint/Type/Test/監控/流程規範）。
- 風險/回滾: 主要風險與回滾條件與步驟（單行）。
```

示例（附於 TODO 條目下方）：
```markdown
- `[P1]` `[BUG]` `[AUTH]` `[IN_PROGRESS]` 登入表單提交間歇性 500
  - 問題: 提交頻繁時偶發 500
  - 範圍/影響: `features/auth` 登入流程，行動端影響較大
  - 何時: 2024-12-19 起，可 80% 重現於弱網
  - 為什麼: 客戶端重複提交，後端缺少冪等與速率限制
  - 解法: 前端防抖+按鈕 loading 鎖定；API 增加 429 與冪等鍵
  - 驗證: (1) 連點 5 次無 500 (2) 日誌無重複處理 (3) 429 呈現正確
  - 預防: 表單共用 `useSubmitGuard`、API 網關速率限制、監控 5xx 指標
  - 風險/回滾: 風險低；若轉化率下降>3%，回滾前端鎖定
```

### AI Agent 最小認知填寫規範（Zero-Cog）
- **單一來源**: 每個 TODO 條目自包含所有決策所需最小資訊，不跳轉多文件。
- **結構固定**: 標籤行 +（必要時）RCA 區塊，關鍵字段固定順序、單行敘述。
- **可執行性**: 解法與驗證可直接行動；避免模糊詞（如「優化」、「調整」）。
- **可預防性**: 每個問題必給一條守護欄（Lint/型別/測試/監控/流程）。
- **最少欄位**: 沒有問題就不填 RCA；有問題最少填「問題/為什麼/解法/預防/驗證」。

---

## 🎯 最佳實踐

### 1. 任務粒度
- 單個 TODO 不超過 4 小時工作量
- 複雜任務拆分成子任務
- 明確的完成標準

### 2. 描述清晰
- 使用動詞開頭 (實現、修復、優化)
- 包含具體的技術細節
- 標明預估時間和依賴

### 3. 定期審查
- 每日檢查 P0 和 P1 任務
- 每週審查所有任務優先級
- 及時更新狀態和進度

### 4. 依賴管理
- 明確標示任務依賴關係
- 優先處理阻塞其他任務的項目
- 考慮並行執行的可能性

---

## 🔍 搜尋和過濾

### 快速搜尋
- `[P1]` - 查看高優先級任務
- `[IN_PROGRESS]` - 查看進行中任務
- `[BUG]` - 查看所有錯誤修復
- `[AUTH]` - 查看認證相關任務

### 組合搜尋
- `[P1]` `[BUG]` - 高優先級錯誤
- `[TODO]` `[FEATURE]` - 待開始功能
- `[BLOCKED]` `[API]` - 被阻塞的 API 任務

---

## 📈 進度追蹤

### 每日檢查
- [ ] 檢查 P0 任務狀態
- [ ] 更新進行中任務進度
- [ ] 識別新的阻塞問題
- [ ] 調整任務優先級

### 每週回顧
- [ ] 統計完成任務數量
- [ ] 分析任務完成時間
- [ ] 識別重複出現的問題
- [ ] 優化工作流程

---

**最後更新**: 2024-12-19  
**下次審查**: 2024-12-20
