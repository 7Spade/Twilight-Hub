# 項目結構

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: 2025/10/03 下午03:58:31

## 目錄結構

```
└── --version/
    ├── _/
    │   └── applypatch-msg
    │   └── commit-msg
    │   └── h
    │   └── husky.sh
    │   └── post-applypatch
    │   └── post-commit
    │   └── post-merge
    │   └── post-rewrite
    │   └── pre-applypatch
    │   └── pre-auto-gc
    │   └── pre-commit
    │   └── pre-merge-commit
    │   └── pre-push
    │   └── pre-rebase
    │   └── prepare-commit-msg
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
    │   │   ├── permission-guard.tsx
    │   │   ├── role-manager.tsx
    │   ├── contracts/
    │   │   ├── files/
    │   │   ├── search/
    │   ├── features/
    │   │   ├── organizations/
    │   │   │   ├── components/
    │   │   │   │   └── roles/
    │   │   │   │       └── role-list.tsx
    │   │   ├── spaces/
    │   │   │   ├── actions/
    │   │   │   │   ├── file-actions.ts
    │   │   │   ├── components/
    │   │   │   │   ├── acceptance/
    │   │   │   │   │   ├── acceptance-item.tsx
    │   │   │   │   │   ├── acceptance-list.tsx
    │   │   │   │   │   ├── initiate-acceptance-flow.tsx
    │   │   │   │   ├── contracts/
    │   │   │   │   │   ├── contract-details.tsx
    │   │   │   │   │   ├── contract-list.tsx
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
    │   │   │   │   │   ├── packages-tab.tsx
    │   │   │   │   │   ├── toolbar.tsx
    │   │   │   │   │   ├── version-history-drawer.tsx
    │   │   │   │   ├── issues/
    │   │   │   │   │   ├── create-issue-form.tsx
    │   │   │   │   │   ├── issue-details.tsx
    │   │   │   │   │   ├── issue-list.tsx
    │   │   │   │   ├── overview/
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-dashboard-data.ts
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
    │   │   │   │   │   ├── quality-dashboard.tsx
    │   │   │   │   ├── report/
    │   │   │   │   │   ├── report-dashboard.tsx
    │   │   │   │   │   ├── report-viewer.tsx
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── index.ts
    │   │   │   │   ├── spaces-detail-view.tsx
    │   │   │   │   ├── spaces-files-view.tsx
    │   │   │   │   ├── spaces-list-view.tsx
    │   │   │   │   ├── spaces-settings-view.tsx
    │   │   │   │   ├── spaces-star-button.tsx
    │   │   │   │   ├── spaces-starred-list.tsx
    │   │   │   │   ├── spaces-starred-view.tsx
    │   │   │   │   ├── spaces-visibility-badge.tsx
    │   │   │   ├── hooks/
    │   │   │   │   ├── use-file-actions.ts
    │   │   │   │   ├── use-space-actions.ts
    │   │   │   │   ├── use-star-actions.ts
    │   │   │   │   ├── use-visibility-actions.ts
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
    │   ├── use-app-state.ts
    │   ├── use-mobile.tsx
    │   ├── use-permissions.ts
    │   ├── use-toast.ts
    ├── lib/
    │   └── services/
    │       ├── contracts/
    │   └── types/
    │       ├── contracts/
    │   └── placeholder-images.json
    │   └── placeholder-images.ts
    │   └── role-management.ts
    │   └── types-unified.ts
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
