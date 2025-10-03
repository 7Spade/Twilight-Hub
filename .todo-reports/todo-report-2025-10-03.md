# 📝 TODO 報告
生成時間: 2025/10/3 下午7:58:24
## 📊 統計摘要
- 總計: 35 個項目
- 🔴 緊急: 0 個項目
### 依優先級
- P2: 24 個
- P1: 11 個
### 依類型
- FIX: 1 個
- FEAT: 34 個
---
## 🔴 P0 (0 個)
## 🟠 P1 (11 個)
### 1. [FEAT] src/components/auth/auth-provider.tsx - 從伺服器獲取用戶角色分配
**位置:** `src\components\auth\auth-provider.tsx:139`
**負責人:** @dev
**詳細說明:**
> const roleAssignment = await fetchUserRoleAssignment(state.userId);
> setState(prev => ({ ...prev, userRoleAssignment: roleAssignment }));
---
### 2. [FEAT] src/components/auth/permission-guard.tsx - 實現權限檢查邏輯
**位置:** `src\components\auth\permission-guard.tsx:18`
**負責人:** @dev
**詳細說明:**
> 需要根據用戶權限決定是否顯示子組件
---
### 3. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:97`
**負責人:** @dev
**詳細說明:**
> const rolesData = await fetchRoles(spaceId);
> setRoles(rolesData);
---
### 4. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:141`
**負責人:** @dev
**詳細說明:**
> const usersData = await fetchUsers(spaceId);
> setUsers(usersData);
---
### 5. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:168`
**負責人:** @dev
**詳細說明:**
> const newRole = await createRole(spaceId, roleData);
> setRoles(prev => [...prev, newRole]);
---
### 6. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:182`
**負責人:** @dev
**詳細說明:**
> const updatedRole = await updateRole(spaceId, roleId, roleData);
> setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
---
### 7. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:197`
**負責人:** @dev
**詳細說明:**
> await deleteRole(spaceId, roleId);
> setRoles(prev => prev.filter(role => role.id !== roleId));
---
### 8. [FEAT] src/components/auth/role-manager.tsx - 實現實際的 API 調用
**位置:** `src\components\auth\role-manager.tsx:210`
**負責人:** @dev
**詳細說明:**
> await assignRole(spaceId, userId, roleId);
> loadUsers(); // Reload users to reflect changes
---
### 9. [FEAT] src/components/features/contracts/contract-list.tsx - 整合 React Query hooks 和 Server Actions
**位置:** `src\components\features\contracts\contract-list.tsx:36`
---
### 10. [FEAT] src/hooks/use-permissions.ts - 實現實際的權限檢查邏輯
**位置:** `src\hooks\use-permissions.ts:23`
**負責人:** @dev
**詳細說明:**
> 這裡應該調用 Firebase 或 API 來檢查權限
---
### 11. [FEAT] src/lib/role-management.ts - 實作權限檢查邏輯
**位置:** `src\lib\role-management.ts:21`
**負責人:** @dev
**詳細說明:**
> 需要根據用戶角色和權限配置進行檢查
---
## 🟡 P2 (24 個)
### 1. [FIX] src/components/adjust-stock-dialog.tsx - 修復非空斷言警告
**位置:** `src\components\adjust-stock-dialog.tsx:131`
**負責人:** @dev
**詳細說明:**
> 應該先檢查 stockInfo.stockId 是否存在
---
### 2. [FEAT] src/components/features/contracts/contract-list.tsx - 實現刪除邏輯
**位置:** `src\components\features\contracts\contract-list.tsx:62`
---
### 3. [FEAT] src/components/features/contracts/contract-list.tsx - 實現 AI 分析邏輯
**位置:** `src\components\features\contracts\contract-list.tsx:69`
---
### 4. [FEAT] src/components/features/contracts/contract-list.tsx - 實現 PDF 生成邏輯
**位置:** `src\components\features\contracts\contract-list.tsx:75`
---
### 5. [FEAT] src/components/features/organizations/components/roles/create-role-dialog.tsx - 實現角色創建 API 調用
**位置:** `src\components\features\organizations\components\roles\create-role-dialog.tsx:70`
---
### 6. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現權限更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:169`
---
### 7. [FEAT] src/components/features/organizations/components/roles/role-list.tsx - 實現訪問級別更新邏輯
**位置:** `src\components\features\organizations\components\roles\role-list.tsx:175`
---
### 8. [FEAT] src/components/features/spaces/components/acceptance/initiate-acceptance-flow.tsx - 實現創建驗收 API 調用
**位置:** `src\components\features\spaces\components\acceptance\initiate-acceptance-flow.tsx:55`
---
### 9. [FEAT] src/components/features/spaces/components/contracts/contract-details.tsx - 實現合約下載邏輯
**位置:** `src\components\features\spaces\components\contracts\contract-details.tsx:98`
---
### 10. [FEAT] src/components/features/spaces/components/contracts/create-contract-dialog.tsx - 實現創建合約 API 調用
**位置:** `src\components\features\spaces\components\contracts\create-contract-dialog.tsx:69`
---
### 11. [FEAT] src/components/features/spaces/components/issues/create-issue-form.tsx - 實現創建問題 API 調用
**位置:** `src\components\features\spaces\components\issues\create-issue-form.tsx:50`
---
### 12. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:41`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 13. [FEAT] src/components/features/spaces/components/overview/hooks/use-dashboard-data.ts - 替換為實際的 API 調用
**位置:** `src\components\features\spaces\components\overview\hooks\use-dashboard-data.ts:60`
**負責人:** @dev
**詳細說明:**
> 這裡使用模擬數據
---
### 14. [FEAT] src/components/features/spaces/components/participants/invite-participant-dialog.tsx - 顯示錯誤提示
**位置:** `src\components\features\spaces\components\participants\invite-participant-dialog.tsx:54`
**負責人:** @dev
---
### 15. [FEAT] src/components/features/spaces/components/participants/participant-role-editor.tsx - 實現角色變更 API 調用
**位置:** `src\components\features\spaces\components\participants\participant-role-editor.tsx:47`
---
### 16. [FEAT] src/components/features/spaces/components/participants/participant-table.tsx - 打開角色更新對話框
**位置:** `src\components\features\spaces\components\participants\participant-table.tsx:141`
---
### 17. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現編輯對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:211`
---
### 18. [FEAT] src/components/features/spaces/components/participants/virtualized-table.tsx - 實現角色變更對話框
**位置:** `src\components\features\spaces\components\participants\virtualized-table.tsx:215`
---
### 19. [FEAT] src/components/features/spaces/components/quality/create-checklist-template.tsx - 實現創建模板 API 調用
**位置:** `src\components\features\spaces\components\quality\create-checklist-template.tsx:69`
---
### 20. [FEAT] src/components/features/spaces/components/report/create-report-dialog.tsx - 實現創建報告 API 調用
**位置:** `src\components\features\spaces\components\report\create-report-dialog.tsx:68`
---
### 21. [FEAT] src/components/features/spaces/components/report/report-dashboard.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-dashboard.tsx:124`
---
### 22. [FEAT] src/components/features/spaces/components/report/report-viewer.tsx - 實現實際下載邏輯
**位置:** `src\components\features\spaces\components\report\report-viewer.tsx:79`
---
### 23. [FEAT] src/hooks/use-permissions.ts - 實現組織權限檢查
**位置:** `src\hooks\use-permissions.ts:128`
**負責人:** @dev
**詳細說明:**
> 需要根據組織層級的權限配置進行檢查
---
### 24. [FEAT] src/lib/role-management.ts - 實作角色定義查詢功能
**位置:** `src\lib\role-management.ts:15`
**負責人:** @dev
**詳細說明:**
> 需要從資料庫或配置中獲取角色定義
---
## 🟢 P3 (0 個)