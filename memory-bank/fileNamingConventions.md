# 檔案名稱規範文檔

## 奧卡姆剃刀原則應用

### 核心原則
- **簡潔性**: 使用最短但清晰的檔案名稱
- **一致性**: 統一的命名模式
- **可讀性**: 一目了然的檔案用途
- **可維護性**: 便於查找和修改

## 檔案命名規範

### 1. 頁面檔案 (Pages)
```
app/
├── (auth)/
│   ├── login/page.tsx          # 登入頁面
│   └── signup/page.tsx        # 註冊頁面
├── (app)/
│   ├── dashboard/page.tsx     # 儀表板
│   ├── discover/page.tsx      # 發現頁面
│   └── settings/
│       ├── profile/page.tsx   # 個人資料
│       └── account/page.tsx   # 帳戶設定
└── (public)/
    └── page.tsx               # 公開首頁
```

### 2. 組件檔案 (Components)
```
components/
├── ui/                        # 基礎 UI 組件
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── auth/                      # 認證組件
│   ├── auth-provider.tsx
│   ├── permission-guard.tsx
│   └── role-manager.tsx
├── layout/                    # 佈局組件
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── navigation.tsx
└── features/                  # 功能組件
    ├── spaces/
    │   ├── space-list.tsx
    │   ├── space-detail.tsx
    │   └── space-create.tsx
    └── contracts/
        ├── contract-list.tsx
        └── contract-detail.tsx
```

### 3. Hook 檔案 (Hooks)
```
hooks/
├── use-auth.ts               # 認證 Hook
├── use-spaces.ts             # 空間 Hook
├── use-contracts.ts          # 合約 Hook
├── use-file-operations.ts    # 文件操作 Hook
└── use-permissions.ts        # 權限 Hook
```

### 4. 工具檔案 (Utils)
```
lib/
├── utils.ts                  # 通用工具函數
├── auth.ts                   # 認證工具
├── validation.ts             # 驗證工具
├── formatting.ts             # 格式化工具
└── types/
    ├── auth.types.ts         # 認證類型
    ├── space.types.ts        # 空間類型
    └── contract.types.ts     # 合約類型
```

### 5. Firebase 檔案
```
firebase/
├── config.ts                 # Firebase 配置
├── provider.tsx              # Firebase Provider
├── auth.ts                   # 認證服務
├── firestore.ts              # Firestore 服務
└── storage.ts                # Storage 服務
```

## 命名模式

### 1. 檔案類型後綴
- **組件**: `*.tsx`
- **Hook**: `use-*.ts` 或 `use-*.tsx`
- **工具**: `*.ts`
- **類型**: `*.types.ts`
- **配置**: `*.config.ts`
- **服務**: `*.service.ts`

### 2. 功能前綴
- **認證**: `auth-*`
- **空間**: `space-*`
- **合約**: `contract-*`
- **文件**: `file-*`
- **用戶**: `user-*`
- **組織**: `org-*`

### 3. 動作前綴
- **創建**: `create-*`
- **編輯**: `edit-*`
- **刪除**: `delete-*`
- **列表**: `*-list`
- **詳情**: `*-detail`
- **設定**: `*-settings`

### 4. 狀態前綴
- **載入**: `loading-*`
- **錯誤**: `error-*`
- **成功**: `success-*`
- **空狀態**: `empty-*`

## 目錄結構規範

### 1. 功能模組結構
```
features/
├── auth/                     # 認證功能
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── spaces/                   # 空間功能
│   ├── components/
│   │   ├── space-list.tsx
│   │   ├── space-detail.tsx
│   │   └── space-create.tsx
│   ├── hooks/
│   │   ├── use-spaces.ts
│   │   └── use-space-actions.ts
│   └── services/
│       └── space.service.ts
└── contracts/                # 合約功能
    ├── components/
    ├── hooks/
    └── services/
```

### 2. 組件層級結構
```
components/
├── ui/                       # 基礎 UI 組件
├── layout/                   # 佈局組件
├── forms/                    # 表單組件
├── charts/                   # 圖表組件
└── features/                 # 功能組件
    ├── auth/
    ├── spaces/
    └── contracts/
```

### 3. 頁面路由結構
```
app/
├── (auth)/                   # 認證路由組
├── (app)/                    # 應用路由組
├── (public)/                 # 公開路由組
└── api/                      # API 路由
    ├── auth/
    ├── spaces/
    └── contracts/
```

## 特殊檔案命名

### 1. 配置檔案
- `next.config.ts`           # Next.js 配置
- `tailwind.config.ts`        # Tailwind 配置
- `tsconfig.json`            # TypeScript 配置
- `firebase.config.ts`       # Firebase 配置

### 2. 環境檔案
- `.env.local`               # 本地環境變數
- `.env.development`         # 開發環境變數
- `.env.production`          # 生產環境變數

### 3. 文檔檔案
- `README.md`                # 項目說明
- `CHANGELOG.md`             # 變更日誌
- `CONTRIBUTING.md`          # 貢獻指南

### 4. 測試檔案
- `*.test.ts`                # 單元測試
- `*.spec.ts`                # 規格測試
- `*.test.tsx`               # 組件測試

## 檔案組織原則

### 1. 按功能分組
- 相關功能放在同一目錄
- 避免跨目錄的強依賴
- 保持目錄結構扁平

### 2. 按類型分組
- 組件、Hook、工具分別存放
- 類型定義集中管理
- 服務層獨立組織

### 3. 按層級分組
- UI 組件與業務組件分離
- 基礎組件與功能組件分離
- 通用工具與專用工具分離

## 命名最佳實踐

### 1. 使用描述性名稱
```typescript
// ✅ 好的命名
user-profile-card.tsx
space-detail-view.tsx
contract-analysis-dialog.tsx

// ❌ 避免的命名
card.tsx
view.tsx
dialog.tsx
```

### 2. 保持一致性
```typescript
// ✅ 一致的命名模式
create-space-dialog.tsx
edit-space-dialog.tsx
delete-space-dialog.tsx

// ✅ 一致的 Hook 命名
use-spaces.ts
use-space-actions.ts
use-space-permissions.ts
```

### 3. 避免過度縮寫
```typescript
// ✅ 清晰的名稱
user-profile-settings.tsx
contract-management-panel.tsx

// ❌ 過度縮寫
usr-prof-sett.tsx
ctr-mgmt-pnl.tsx
```

### 4. 使用 kebab-case
```typescript
// ✅ 標準命名
file-upload-dialog.tsx
user-role-manager.tsx
space-permission-guard.tsx

// ❌ 避免駝峰命名
fileUploadDialog.tsx
userRoleManager.tsx
spacePermissionGuard.tsx
```
