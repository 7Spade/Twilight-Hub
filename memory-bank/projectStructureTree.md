# 項目結構樹文檔

## 奧卡姆剃刀原則的完整規劃結構

### 核心設計原則
- **簡化優先**: 最簡單的目錄結構
- **清晰邊界**: 明確的模組分離
- **單一職責**: 每個目錄專注一個功能
- **依賴方向**: 單向依賴關係

## 完整項目結構樹

```
src/
├── app/                                    # Next.js App Router
│   ├── (auth)/                            # 認證路由組
│   │   ├── login/
│   │   │   └── page.tsx                   # 登入頁面
│   │   └── signup/
│   │       └── page.tsx                   # 註冊頁面
│   ├── (app)/                             # 應用主路由組
│   │   ├── layout.tsx                     # 應用佈局
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # 儀表板
│   │   ├── discover/
│   │   │   └── page.tsx                   # 發現頁面
│   │   ├── settings/                      # 用戶設定
│   │   │   ├── layout.tsx                 # 設定佈局
│   │   │   ├── profile/
│   │   │   │   └── page.tsx               # 個人資料
│   │   │   ├── account/
│   │   │   │   └── page.tsx               # 帳戶設定
│   │   │   └── notifications/
│   │   │       └── page.tsx               # 通知設定
│   │   ├── [userslug]/                    # 用戶路由
│   │   │   ├── page.tsx                   # 用戶資料
│   │   │   └── [spaceslug]/
│   │   │       └── page.tsx               # 用戶空間
│   │   ├── spaces/                        # 空間管理
│   │   │   ├── page.tsx                   # 空間列表
│   │   │   └── [spaceslug]/
│   │   │       └── page.tsx               # 空間詳情
│   │   └── organizations/                 # 組織管理
│   │       ├── page.tsx                   # 組織列表
│   │       └── [organizationslug]/        # 組織路由
│   │           ├── page.tsx               # 組織詳情
│   │           ├── settings/
│   │           │   └── page.tsx           # 組織設定
│   │           ├── members/
│   │           │   └── page.tsx          # 成員管理
│   │           ├── roles/
│   │           │   └── page.tsx           # 角色管理
│   │           ├── groups/
│   │           │   └── page.tsx           # 群組管理
│   │           ├── inventory/              # 庫存管理
│   │           │   ├── page.tsx           # 庫存列表
│   │           │   └── [itemId]/
│   │           │       └── page.tsx       # 庫存詳情
│   │           ├── audit-log/
│   │           │   └── page.tsx           # 審計日誌
│   │           ├── spaces/
│   │           │   └── page.tsx           # 組織空間
│   │           └── [spaceslug]/
│   │               └── page.tsx           # 組織空間詳情
│   ├── (public)/                           # 公開路由組
│   │   └── page.tsx                        # 公開首頁
│   ├── globals.css                         # 全域樣式
│   ├── layout.tsx                          # 根佈局
│   └── favicon.ico                         # 網站圖標
├── components/                             # React 組件
│   ├── ui/                                 # shadcn/ui 基礎組件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── switch.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── slider.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   ├── popover.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── command.tsx
│   │   ├── calendar.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── collapsible.tsx
│   │   ├── context-menu.tsx
│   │   ├── hover-card.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── toggle.tsx
│   │   ├── toggle-group.tsx
│   │   └── sonner.tsx
│   ├── auth/                                # 認證組件
│   │   ├── auth-provider.tsx               # 認證提供者
│   │   ├── permission-guard.tsx            # 權限守衛
│   │   ├── role-manager.tsx                # 角色管理
│   │   └── index.ts                        # 導出索引
│   ├── layout/                              # 佈局組件
│   │   ├── header.tsx                       # 頁首
│   │   ├── sidebar.tsx                      # 側邊欄
│   │   ├── navigation.tsx                  # 導航
│   │   ├── nav.tsx                         # 導航項目
│   │   ├── page-container.tsx             # 頁面容器
│   │   ├── team-switcher.tsx               # 團隊切換器
│   │   ├── user-nav.tsx                    # 用戶導航
│   │   └── index.ts                        # 導出索引
│   ├── forms/                               # 表單組件
│   │   ├── form-card.tsx                   # 表單卡片
│   │   ├── form-field.tsx                  # 表單欄位
│   │   ├── form-input.tsx                  # 表單輸入
│   │   ├── form-textarea.tsx               # 表單文字區域
│   │   ├── form-switch.tsx                 # 表單開關
│   │   └── index.ts                        # 導出索引
│   └── features/                           # 功能組件
│       ├── auth/                            # 認證功能
│       │   └── login-form.tsx              # 登入表單
│       ├── spaces/                          # 空間功能
│       │   ├── components/                 # 空間組件
│       │   │   ├── space-list.tsx          # 空間列表
│       │   │   ├── space-detail.tsx        # 空間詳情
│       │   │   ├── space-create.tsx        # 創建空間
│       │   │   ├── space-settings.tsx      # 空間設定
│       │   │   ├── space-star-button.tsx   # 星標按鈕
│       │   │   ├── space-visibility.tsx    # 可見性設定
│       │   │   ├── file-explorer/          # 文件瀏覽器
│       │   │   │   ├── file-explorer.tsx   # 主文件瀏覽器
│       │   │   │   ├── file-table.tsx      # 文件表格
│       │   │   │   ├── file-tree.tsx       # 文件樹
│       │   │   │   ├── file-upload.tsx     # 文件上傳
│       │   │   │   ├── file-detail.tsx     # 文件詳情
│       │   │   │   ├── file-thumbnail.tsx  # 文件縮圖
│       │   │   │   ├── file-context-menu.tsx # 文件右鍵選單
│       │   │   │   ├── file-filter.tsx     # 文件過濾
│       │   │   │   ├── file-breadcrumb.tsx # 文件麵包屑
│       │   │   │   ├── file-version.tsx    # 文件版本
│       │   │   │   └── file-deleted.tsx    # 已刪除文件
│       │   │   ├── participants/            # 參與者管理
│       │   │   │   ├── participant-list.tsx # 參與者列表
│       │   │   │   ├── participant-table.tsx # 參與者表格
│       │   │   │   ├── participant-card.tsx # 參與者卡片
│       │   │   │   ├── participant-invite.tsx # 邀請參與者
│       │   │   │   ├── participant-role.tsx # 參與者角色
│       │   │   │   └── participant-filter.tsx # 參與者過濾
│       │   │   ├── issues/                  # 問題管理
│       │   │   │   ├── issue-list.tsx      # 問題列表
│       │   │   │   ├── issue-detail.tsx    # 問題詳情
│       │   │   │   ├── issue-create.tsx    # 創建問題
│       │   │   │   └── issue-filter.tsx   # 問題過濾
│       │   │   ├── contracts/               # 合約管理
│       │   │   │   ├── contract-list.tsx   # 合約列表
│       │   │   │   ├── contract-detail.tsx # 合約詳情
│       │   │   │   ├── contract-create.tsx # 創建合約
│       │   │   │   └── contract-analysis.tsx # 合約分析
│       │   │   ├── quality/                 # 品質管理
│       │   │   │   ├── quality-dashboard.tsx # 品質儀表板
│       │   │   │   ├── quality-checklist.tsx # 品質檢查清單
│       │   │   │   └── quality-template.tsx # 品質模板
│       │   │   ├── reports/                 # 報告系統
│       │   │   │   ├── report-dashboard.tsx # 報告儀表板
│       │   │   │   ├── report-viewer.tsx   # 報告查看器
│       │   │   │   └── report-create.tsx   # 創建報告
│       │   │   ├── acceptance/              # 驗收管理
│       │   │   │   ├── acceptance-list.tsx # 驗收列表
│       │   │   │   ├── acceptance-item.tsx # 驗收項目
│       │   │   │   └── acceptance-flow.tsx # 驗收流程
│       │   │   └── overview/                # 概覽組件
│       │   │       ├── overview-dashboard.tsx # 概覽儀表板
│       │   │       ├── overview-stats.tsx   # 概覽統計
│       │   │       ├── overview-activity.tsx # 概覽活動
│       │   │       └── overview-skeleton.tsx # 概覽骨架
│       │   ├── hooks/                        # 空間 Hooks
│       │   │   ├── use-spaces.ts           # 空間 Hook
│       │   │   ├── use-space-actions.ts    # 空間操作 Hook
│       │   │   ├── use-space-star.ts       # 空間星標 Hook
│       │   │   ├── use-space-visibility.ts # 空間可見性 Hook
│       │   │   ├── use-file-operations.ts  # 文件操作 Hook
│       │   │   └── use-file-actions.ts     # 文件動作 Hook
│       │   ├── services/                    # 空間服務
│       │   │   ├── space.service.ts        # 空間服務
│       │   │   ├── file.service.ts         # 文件服務
│       │   │   └── participant.service.ts  # 參與者服務
│       │   ├── types/                       # 空間類型
│       │   │   ├── space.types.ts          # 空間類型
│       │   │   ├── file.types.ts           # 文件類型
│       │   │   └── participant.types.ts    # 參與者類型
│       │   └── index.ts                     # 導出索引
│       ├── organizations/                    # 組織功能
│       │   ├── components/                 # 組織組件
│       │   │   ├── org-list.tsx            # 組織列表
│       │   │   ├── org-detail.tsx          # 組織詳情
│       │   │   ├── org-create.tsx          # 創建組織
│       │   │   ├── org-settings.tsx        # 組織設定
│       │   │   ├── org-members.tsx         # 組織成員
│       │   │   ├── org-roles.tsx           # 組織角色
│       │   │   ├── org-groups.tsx           # 組織群組
│       │   │   ├── org-inventory.tsx        # 組織庫存
│       │   │   └── org-audit.tsx            # 組織審計
│       │   ├── hooks/                       # 組織 Hooks
│       │   │   ├── use-organizations.ts    # 組織 Hook
│       │   │   ├── use-org-actions.ts      # 組織操作 Hook
│       │   │   └── use-org-members.ts      # 組織成員 Hook
│       │   ├── services/                    # 組織服務
│       │   │   ├── org.service.ts          # 組織服務
│       │   │   └── member.service.ts       # 成員服務
│       │   ├── types/                       # 組織類型
│       │   │   ├── org.types.ts            # 組織類型
│       │   │   └── member.types.ts         # 成員類型
│       │   └── index.ts                     # 導出索引
│       ├── contracts/                        # 合約功能
│       │   ├── components/                 # 合約組件
│       │   │   ├── contract-list.tsx       # 合約列表
│       │   │   ├── contract-detail.tsx     # 合約詳情
│       │   │   ├── contract-create.tsx     # 創建合約
│       │   │   └── contract-analysis.tsx   # 合約分析
│       │   ├── hooks/                       # 合約 Hooks
│       │   │   ├── use-contracts.ts        # 合約 Hook
│       │   │   └── use-contract-actions.ts # 合約操作 Hook
│       │   ├── services/                    # 合約服務
│       │   │   └── contract.service.ts     # 合約服務
│       │   ├── types/                       # 合約類型
│       │   │   └── contract.types.ts       # 合約類型
│       │   └── index.ts                     # 導出索引
│       └── users/                            # 用戶功能
│           ├── components/                 # 用戶組件
│           │   ├── user-profile.tsx        # 用戶資料
│           │   ├── user-settings.tsx       # 用戶設定
│           │   └── user-avatar.tsx         # 用戶頭像
│           ├── hooks/                       # 用戶 Hooks
│           │   ├── use-user.ts             # 用戶 Hook
│           │   └── use-user-actions.ts     # 用戶操作 Hook
│           ├── services/                    # 用戶服務
│           │   └── user.service.ts         # 用戶服務
│           ├── types/                       # 用戶類型
│           │   └── user.types.ts           # 用戶類型
│           └── index.ts                     # 導出索引
├── hooks/                                   # 自定義 Hooks
│   ├── use-auth.ts                         # 認證 Hook
│   ├── use-spaces.ts                       # 空間 Hook
│   ├── use-contracts.ts                    # 合約 Hook
│   ├── use-file-operations.ts              # 文件操作 Hook
│   ├── use-permissions.ts                  # 權限 Hook
│   ├── use-toast.ts                        # Toast Hook
│   ├── use-mobile.ts                       # 移動端 Hook
│   ├── use-app-state.ts                    # 應用狀態 Hook
│   └── index.ts                            # 導出索引
├── lib/                                     # 工具函數和類型
│   ├── utils.ts                            # 通用工具函數
│   ├── auth.ts                             # 認證工具
│   ├── validation.ts                       # 驗證工具
│   ├── formatting.ts                       # 格式化工具
│   ├── constants.ts                        # 常數定義
│   ├── config.ts                           # 配置工具
│   ├── types/                              # 類型定義
│   │   ├── auth.types.ts                   # 認證類型
│   │   ├── space.types.ts                  # 空間類型
│   │   ├── contract.types.ts               # 合約類型
│   │   ├── user.types.ts                   # 用戶類型
│   │   ├── org.types.ts                    # 組織類型
│   │   ├── file.types.ts                   # 文件類型
│   │   ├── participant.types.ts           # 參與者類型
│   │   └── common.types.ts                 # 通用類型
│   ├── services/                           # 服務層
│   │   ├── auth.service.ts                 # 認證服務
│   │   ├── space.service.ts                # 空間服務
│   │   ├── contract.service.ts             # 合約服務
│   │   ├── user.service.ts                 # 用戶服務
│   │   ├── org.service.ts                  # 組織服務
│   │   ├── file.service.ts                 # 文件服務
│   │   └── api.service.ts                  # API 服務
│   └── schemas/                            # 驗證模式
│       ├── auth.schemas.ts                 # 認證模式
│       ├── space.schemas.ts                # 空間模式
│       ├── contract.schemas.ts             # 合約模式
│       └── user.schemas.ts                  # 用戶模式
├── firebase/                                # Firebase 集成
│   ├── config.ts                           # Firebase 配置
│   ├── provider.tsx                         # Firebase Provider
│   ├── client-provider.tsx                 # 客戶端 Provider
│   ├── auth.ts                             # 認證服務
│   ├── firestore.ts                        # Firestore 服務
│   ├── storage.ts                          # Storage 服務
│   ├── firestore/                          # Firestore Hooks
│   │   ├── use-collection.tsx              # 集合 Hook
│   │   ├── use-doc.tsx                     # 文檔 Hook
│   │   └── use-query.tsx                   # 查詢 Hook
│   ├── errors/                             # 錯誤處理
│   │   ├── error-emitter.ts                # 錯誤發射器
│   │   ├── errors.ts                       # 錯誤定義
│   │   └── error-boundary.tsx              # 錯誤邊界
│   └── index.ts                            # 導出索引
├── ai/                                      # AI 功能
│   ├── genkit.ts                           # Genkit 配置
│   ├── flows/                              # AI 流程
│   │   ├── extract-engagement-data.ts     # 提取參與數據
│   │   └── analyze-contract.ts             # 分析合約
│   ├── types/                              # AI 類型
│   │   ├── engagement.types.ts             # 參與類型
│   │   └── analysis.types.ts               # 分析類型
│   └── services/                           # AI 服務
│       ├── document-analysis.service.ts    # 文件分析服務
│       └── contract-analysis.service.ts    # 合約分析服務
└── styles/                                  # 樣式檔案
    ├── globals.css                          # 全域樣式
    ├── components.css                      # 組件樣式
    └── utilities.css                       # 工具樣式
```

## 依賴關係圖

### 1. 模組依賴方向
```
app/ (頁面層)
    ↓
components/features/ (功能組件層)
    ↓
components/ (基礎組件層)
    ↓
hooks/ (業務邏輯層)
    ↓
lib/ (工具層)
    ↓
firebase/ (數據層)
```

### 2. 功能模組依賴
```
auth/ (認證模組)
    ↓
users/ (用戶模組)
    ↓
organizations/ (組織模組)
    ↓
spaces/ (空間模組)
    ↓
contracts/ (合約模組)
```

### 3. 組件層級依賴
```
features/ (功能組件)
    ↓
layout/ (佈局組件)
    ↓
forms/ (表單組件)
    ↓
ui/ (基礎 UI 組件)
```

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

## 命名規範總結

### 1. 檔案命名
- 使用 kebab-case
- 功能-動作-類型 模式
- 避免過度縮寫

### 2. 目錄命名
- 使用小寫字母
- 功能名稱清晰
- 避免深層嵌套

### 3. 組件命名
- PascalCase 組件名
- 描述性命名
- 避免通用名稱

### 4. Hook 命名
- use- 前綴
- 功能描述
- 動作後綴

### 5. 服務命名
- 功能.service.ts
- 清晰的服務職責
- 避免過度抽象
