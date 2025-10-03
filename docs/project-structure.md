# 項目結構

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: 2025/10/03 下午03:13:59

## 目錄結構

```
└── src/
    ├── ai/
    │   ├── flows/
    │   │   ├── extract-engagement-data.ts
    │   ├── types/
    │   │   ├── engagement.types.ts
    │   ├── dev.ts
    │   ├── genkit.ts
    ├── app/
    │   ├── (app)/
    │   │   ├── [userslug]/
    │   │   │   ├── [spaceslug]/
    │   │   │   │   ├── page.tsx
    │   │   │   ├── page.tsx
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx
    │   │   ├── discover/
    │   │   │   ├── page.tsx
    │   │   ├── organizations/
    │   │   │   ├── [organizationslug]/
    │   │   │   │   ├── [spaceslug]/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── groups/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── inventory/
    │   │   │   │   │   ├── [itemId]/
    │   │   │   │   │   │   ├── page.tsx
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── members/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── roles/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── spaces/
    │   │   │   │   │   ├── page.tsx
    │   │   │   │   ├── page.tsx
    │   │   │   ├── page.tsx
    │   │   ├── settings/
    │   │   │   ├── account/
    │   │   │   │   ├── page.tsx
    │   │   │   ├── notifications/
    │   │   │   │   ├── page.tsx
    │   │   │   ├── profile/
    │   │   │   │   └── page.tsx
    │   │   ├── spaces/
    │   │   │   ├── [spaceslug]/
    │   │   │   │   ├── files/
    │   │   │   │   ├── page.tsx
    │   │   │   ├── page.tsx
    │   │   ├── page.tsx
    │   ├── login/
    │   │   ├── page.tsx
    │   ├── signup/
    │   │   ├── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── page.tsx
    ├── components/
    │   ├── auth/
    │   │   ├── auth-provider.tsx
    │   │   ├── index.ts
    │   │   ├── permission-guard.tsx
    │   │   ├── role-manager.tsx
    │   ├── features/
    │   │   ├── organizations/
    │   │   │   ├── components/
    │   │   │   │   ├── roles/
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── role-list.tsx
    │   │   │   │   ├── index.ts
    │   │   │   ├── index.ts
    │   │   ├── spaces/
    │   │   │   ├── actions/
    │   │   │   │   ├── file-actions.ts
    │   │   │   │   ├── index.ts
    │   │   │   ├── components/
    │   │   │   │   ├── acceptance/
    │   │   │   │   │   ├── acceptance-item.tsx
    │   │   │   │   │   ├── acceptance-list.tsx
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── initiate-acceptance-flow.tsx
    │   │   │   │   ├── contracts/
    │   │   │   │   │   ├── contract-details.tsx
    │   │   │   │   │   ├── contract-list.tsx
    │   │   │   │   │   ├── index.ts
    │   │   │   │   ├── file-explorer/
    │   │   │   │   │   ├── detail/
    │   │   │   │   │   │   ├── file-detail-view.tsx
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-file-explorer-context.tsx
    │   │   │   │   │   ├── services/
    │   │   │   │   │   │   ├── file-preview-service.ts
    │   │   │   │   │   ├── thumbnail/
    │   │   │   │   │   │   ├── file-thumbnail-card.tsx
    │   │   │   │   │   │   ├── file-thumbnail-grid.tsx
    │   │   │   │   │   │   ├── file-type-icon.tsx
    │   │   │   │   │   ├── breadcrumb-navigation.tsx
    │   │   │   │   │   ├── column-settings-menu.tsx
    │   │   │   │   │   ├── context-menu.tsx
    │   │   │   │   │   ├── deleted-items.tsx
    │   │   │   │   │   ├── empty-folder-state.tsx
    │   │   │   │   │   ├── file-explorer.tsx
    │   │   │   │   │   ├── file-table.tsx
    │   │   │   │   │   ├── filter-panel.tsx
    │   │   │   │   │   ├── folder-tree.tsx
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── packages-tab.tsx
    │   │   │   │   │   ├── toolbar.tsx
    │   │   │   │   │   ├── version-history-drawer.tsx
    │   │   │   │   ├── issues/
    │   │   │   │   │   ├── create-issue-form.tsx
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── issue-details.tsx
    │   │   │   │   │   ├── issue-list.tsx
    │   │   │   │   ├── overview/
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-dashboard-data.ts
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── loading-skeleton.tsx
    │   │   │   │   │   ├── overview-dashboard.tsx
    │   │   │   │   │   ├── recent-activity.tsx
    │   │   │   │   │   ├── stat-card.tsx
    │   │   │   │   │   ├── types.ts
    │   │   │   │   ├── participants/
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-participants.ts
    │   │   │   │   │   ├── advanced-filters.tsx
    │   │   │   │   │   ├── card-grid.tsx
    │   │   │   │   │   ├── data.ts
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── participant-card.tsx
    │   │   │   │   │   ├── participant-filters.tsx
    │   │   │   │   │   ├── participant-list.tsx
    │   │   │   │   │   ├── participant-role-editor.tsx
    │   │   │   │   │   ├── participant-table.tsx
    │   │   │   │   │   ├── types.ts
    │   │   │   │   │   ├── view-toggle.tsx
    │   │   │   │   │   ├── virtualized-table.tsx
    │   │   │   │   ├── quality/
    │   │   │   │   │   ├── checklist.tsx
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── quality-dashboard.tsx
    │   │   │   │   ├── report/
    │   │   │   │   │   ├── index.ts
    │   │   │   │   │   ├── report-dashboard.tsx
    │   │   │   │   │   ├── report-viewer.tsx
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── index.ts
    │   │   │   │   ├── index.ts
    │   │   │   │   ├── spaces-detail-view.tsx
    │   │   │   │   ├── spaces-files-view.tsx
    │   │   │   │   ├── spaces-list-view.tsx
    │   │   │   │   ├── spaces-settings-view.tsx
    │   │   │   │   ├── spaces-star-button.tsx
    │   │   │   │   ├── spaces-starred-list.tsx
    │   │   │   │   ├── spaces-starred-view.tsx
    │   │   │   │   ├── spaces-visibility-badge.tsx
    │   │   │   ├── hooks/
    │   │   │   │   ├── index.ts
    │   │   │   │   ├── use-file-actions.ts
    │   │   │   │   ├── use-space-actions.ts
    │   │   │   │   ├── use-star-actions.ts
    │   │   │   │   ├── use-visibility-actions.ts
    │   │   │   ├── index.ts
    │   │   │   ├── spaces-schemas.ts
    │   │   ├── users/
    │   │   │   └── pages/
    │   │   │       └── user-profile-page.tsx
    │   ├── forms/
    │   │   ├── form-card.tsx
    │   │   ├── form-field.tsx
    │   │   ├── form-input.tsx
    │   │   ├── form-switch.tsx
    │   │   ├── form-textarea.tsx
    │   │   ├── index.ts
    │   ├── ui/
    │   │   ├── accordion.tsx
    │   │   ├── alert.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   ├── tooltip.tsx
    │   ├── achievements-list.tsx
    │   ├── activity-overview-chart.tsx
    │   ├── contribution-breakdown-chart.tsx
    │   ├── firebase-error-listener.tsx
    │   ├── FirebaseErrorListener.tsx
    │   ├── follower-list.tsx
    │   ├── following-list.tsx
    │   ├── form-card-skeleton.tsx
    │   ├── github-heat-map.tsx
    │   ├── issues-placeholder.tsx
    │   ├── logo.tsx
    │   ├── membership-list.tsx
    │   ├── notification-popover.tsx
    │   ├── recent-activity-timeline.tsx
    │   ├── search-command.tsx
    │   ├── user-profile-card.tsx
    ├── firebase/
    │   ├── firestore/
    │   │   ├── use-collection.tsx
    │   │   ├── use-doc.tsx
    │   ├── client-provider.tsx
    │   ├── config.ts
    │   ├── error-emitter.ts
    │   ├── errors.ts
    │   ├── index.ts
    │   ├── provider.tsx
    ├── hooks/
    │   ├── index.ts
    │   ├── use-app-state.ts
    │   ├── use-mobile.tsx
    │   ├── use-permissions.ts
    │   ├── use-toast.ts
    ├── lib/
    │   └── placeholder-images.json
    │   └── placeholder-images.ts
    │   └── role-management.ts
    │   └── types-unified.ts
    │   └── types.ts
    │   └── utils.ts
└── .eslintrc.json
└── .prettierignore
└── .prettierrc
└── apphosting.yaml
└── components.json
└── firestore.rules
└── next.config.ts
└── package-lock.json
└── package.json
└── postcss.config.mjs
└── README.md
└── storage.rules
└── tailwind.config.ts
└── tsconfig.json

```

## 排除規則

以下目錄和文件已被排除在結構圖之外：

### 目錄排除

#### IDE 和編輯器配置
- `.playwright-mcp` - Playwright MCP 相關文件
- `.cursor` - Cursor IDE 配置
- `.vscode` - VS Code 配置
- `.idea` - IntelliJ IDEA 配置
- `.idx` - 索引文件目錄

#### 構建和依賴目錄
- `.next` - Next.js 構建輸出
- `node_modules` - Node.js 依賴包
- `dist` - 構建輸出目錄
- `build` - 構建輸出目錄
- `out` - 輸出目錄
- `.pnp`, `.pnp.*` - Yarn PnP 文件
- `.yarn` - Yarn 配置目錄

#### 版本控制
- `.git` - Git 版本控制文件
- `.husky` - Git hooks 配置
- `.github` - GitHub 配置目錄

#### Agent 和文檔目錄
- `docs` - 項目文檔目錄
- `memory-bank` - Agent 記憶庫目錄
- `scripts` - 自動化腳本目錄

#### 測試和覆蓋率
- `coverage` - 測試覆蓋率報告
- `.nyc_output` - NYC 測試覆蓋率輸出
- `__tests__`, `test`, `tests` - 測試目錄
- `spec`, `specs` - 規格測試目錄

#### 部署和雲端配置
- `.vercel` - Vercel 部署配置
- `.netlify` - Netlify 部署配置
- `.firebase` - Firebase 配置

### 文件排除

#### 日誌和臨時文件
- `*.log` - 日誌文件
- `*.tmp`, `*.temp` - 臨時文件
- `*.swp`, `*.swo` - Vim 交換文件
- `*~` - 備份文件
- `.modified` - 修改標記文件

#### 系統文件
- `.DS_Store` - macOS 系統文件
- `Thumbs.db` - Windows 縮略圖文件
- `desktop.ini` - Windows 桌面配置

#### 環境變量文件
- `.env`, `.env.*` - 環境變量文件
- `firebase-debug.log`, `firestore-debug.log` - Firebase 調試日誌

#### 構建和編譯文件
- `*.map` - Source map 文件
- `tsconfig.tsbuildinfo` - TypeScript 構建信息
- `next-env.d.ts` - Next.js 環境類型定義

#### 證書和密鑰文件
- `*.pem`, `*.key`, `*.crt` - 證書文件
- `*.p12`, `*.pfx` - PKCS 證書文件

#### 其他開發工具文件
- `.genkit` - Genkit 配置目錄
- `.eslintcache`, `.stylelintcache`, `.prettiercache` - 緩存文件

## 自動化說明

此文件通過 Git pre-commit hook 自動更新，確保項目結構文檔始終保持最新狀態。

### 更新觸發條件
- 每次 Git 提交時
- 目錄結構發生變化時
- 手動執行 `npm run docs:update` 時

### 手動更新
```bash
npm run docs:update
```
