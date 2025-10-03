# 項目結構

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: 2025/10/03 下午07:55:32

## 目錄結構

```
└── .todo-reports/
    ├── ai-prompt-2025-10-03.md (28.6 KB, 今天)
    ├── todo-report-2025-10-03.json (29.1 KB, 今天)
    ├── todo-report-2025-10-03.md (7.7 KB, 今天)
└── docs/
    ├── TODO/
    │   ├── todo-automation-guide.md (19.4 KB, 今天)
    ├── backend.json (13.7 KB, 今天)
    ├── blueprint.md (1.5 KB, 今天)
    ├── natural-language-commands.md (17.7 KB, 今天)
    ├── nextjs15_dev-brief.md (12.2 KB, 今天)
    ├── nextjs15_dev-standard.md (35.5 KB, 今天)
    ├── project-structure.md (17.2 KB, 今天)
└── memory-bank/
    ├── archive/
    ├── creative/
    ├── reflection/
    ├── activeContext.md (191 B, 今天)
    ├── memory.json (2 B, 今天)
    ├── productContext.md (269 B, 今天)
    ├── progress.md (223 B, 今天)
    ├── projectbrief.md (240 B, 今天)
    ├── style-guide.md (289 B, 今天)
    ├── systemPatterns.md (277 B, 今天)
    ├── tasks.md (279 B, 今天)
    ├── techContext.md (237 B, 今天)
└── scripts/
    ├── generate-tree.ts (7 KB, 今天)
    ├── todo-automation-toolkit.ts (11.6 KB, 今天)
└── src/
    ├── ai/
    │   ├── flows/
    │   │   ├── extract-engagement-data.ts (2.9 KB, 今天)
    │   ├── types/
    │   │   ├── engagement.types.ts (955 B, 今天)
    │   ├── dev.ts (64 B, 今天)
    │   ├── genkit.ts (183 B, 今天)
    ├── app/
    │   ├── (app)/
    │   │   ├── [userslug]/
    │   │   │   ├── [spaceslug]/
    │   │   │   │   ├── page.tsx (360 B, 今天)
    │   │   │   ├── page.tsx (464 B, 今天)
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx (6.3 KB, 今天)
    │   │   ├── discover/
    │   │   │   ├── page.tsx (8.1 KB, 今天)
    │   │   ├── organizations/
    │   │   │   ├── [organizationslug]/
    │   │   │   │   ├── [spaceslug]/
    │   │   │   │   │   ├── page.tsx (368 B, 今天)
    │   │   │   │   ├── groups/
    │   │   │   │   │   ├── page.tsx (5.5 KB, 今天)
    │   │   │   │   ├── inventory/
    │   │   │   │   │   ├── [itemId]/
    │   │   │   │   │   │   ├── page.tsx (7.1 KB, 今天)
    │   │   │   │   │   ├── page.tsx (10 KB, 今天)
    │   │   │   │   ├── members/
    │   │   │   │   │   ├── page.tsx (6 KB, 今天)
    │   │   │   │   ├── roles/
    │   │   │   │   │   ├── page.tsx (3.7 KB, 今天)
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── page.tsx (4.8 KB, 今天)
    │   │   │   │   ├── spaces/
    │   │   │   │   │   ├── page.tsx (327 B, 今天)
    │   │   │   │   ├── page.tsx (7.4 KB, 今天)
    │   │   │   ├── page.tsx (4.1 KB, 今天)
    │   │   ├── settings/
    │   │   │   ├── account/
    │   │   │   │   ├── page.tsx (1.2 KB, 今天)
    │   │   │   ├── notifications/
    │   │   │   │   ├── page.tsx (1.7 KB, 今天)
    │   │   │   ├── profile/
    │   │   │   │   └── page.tsx (3.6 KB, 今天)
    │   │   ├── spaces/
    │   │   │   └── [spaceslug]/
    │   │   │       ├── page.tsx (2.9 KB, 今天)
    │   │   │   └── page.tsx (3.7 KB, 今天)
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   ├── page.tsx (5.2 KB, 今天)
    │   │   ├── signup/
    │   │   │   └── page.tsx (8.4 KB, 今天)
    │   ├── (public)/
    │   │   ├── page.tsx (3 KB, 今天)
    │   ├── favicon.ico (14.7 KB, 昨天)
    │   ├── globals.css (2.4 KB, 昨天)
    ├── components/
    │   ├── auth/
    │   │   ├── auth-provider.tsx (6.3 KB, 今天)
    │   │   ├── index.ts (509 B, 今天)
    │   │   ├── permission-guard.tsx (519 B, 今天)
    │   │   ├── role-manager.tsx (17.4 KB, 今天)
    │   ├── features/
    │   │   ├── contracts/
    │   │   │   ├── contract-list.tsx (11.7 KB, 今天)
    │   │   ├── organizations/
    │   │   │   ├── components/
    │   │   │   │   ├── roles/
    │   │   │   │   │   ├── index.ts (150 B, 今天)
    │   │   │   │   │   ├── role-list.tsx (14.3 KB, 今天)
    │   │   │   │   ├── index.ts (71 B, 今天)
    │   │   │   ├── index.ts (73 B, 今天)
    │   │   ├── spaces/
    │   │   │   ├── actions/
    │   │   │   │   ├── file-actions.ts (5 KB, 今天)
    │   │   │   │   ├── index.ts (347 B, 今天)
    │   │   │   │   ├── types.ts (869 B, 今天)
    │   │   │   ├── components/
    │   │   │   │   ├── acceptance/
    │   │   │   │   │   ├── acceptance-item.tsx (8.7 KB, 今天)
    │   │   │   │   │   ├── acceptance-list.tsx (9.1 KB, 今天)
    │   │   │   │   │   ├── index.ts (219 B, 今天)
    │   │   │   │   │   ├── initiate-acceptance-flow.tsx (7.3 KB, 今天)
    │   │   │   │   ├── contracts/
    │   │   │   │   │   ├── contract-details.tsx (10.9 KB, 今天)
    │   │   │   │   │   ├── contract-list.tsx (14 KB, 今天)
    │   │   │   │   │   ├── index.ts (212 B, 今天)
    │   │   │   │   ├── file-explorer/
    │   │   │   │   │   ├── detail/
    │   │   │   │   │   │   ├── file-detail-view.tsx (12.4 KB, 今天)
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-file-explorer-context.tsx (5.3 KB, 今天)
    │   │   │   │   │   ├── services/
    │   │   │   │   │   │   ├── file-preview-service.ts (7.5 KB, 今天)
    │   │   │   │   │   ├── thumbnail/
    │   │   │   │   │   │   ├── file-thumbnail-card.tsx (5.2 KB, 今天)
    │   │   │   │   │   │   ├── file-thumbnail-grid.tsx (8.1 KB, 今天)
    │   │   │   │   │   ├── breadcrumb-navigation.tsx (1.7 KB, 今天)
    │   │   │   │   │   ├── column-settings-menu.tsx (3.4 KB, 今天)
    │   │   │   │   │   ├── context-menu.tsx (6.9 KB, 今天)
    │   │   │   │   │   ├── deleted-items.tsx (8 KB, 今天)
    │   │   │   │   │   ├── empty-folder-state.tsx (2 KB, 今天)
    │   │   │   │   │   ├── file-explorer.tsx (17.4 KB, 今天)
    │   │   │   │   │   ├── file-table.tsx (11 KB, 今天)
    │   │   │   │   │   ├── filter-panel.tsx (14.7 KB, 今天)
    │   │   │   │   │   ├── folder-tree.tsx (26.7 KB, 今天)
    │   │   │   │   │   ├── index.ts (1.3 KB, 今天)
    │   │   │   │   │   ├── packages-tab.tsx (9.8 KB, 今天)
    │   │   │   │   │   ├── toolbar.tsx (5.1 KB, 今天)
    │   │   │   │   │   ├── version-history-drawer.tsx (5.9 KB, 今天)
    │   │   │   │   ├── issues/
    │   │   │   │   │   ├── create-issue-form.tsx (7.7 KB, 今天)
    │   │   │   │   │   ├── index.ts (187 B, 今天)
    │   │   │   │   │   ├── issue-details.tsx (7.9 KB, 今天)
    │   │   │   │   │   ├── issue-list.tsx (10.5 KB, 今天)
    │   │   │   │   ├── overview/
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-dashboard-data.ts (4.3 KB, 今天)
    │   │   │   │   │   ├── index.ts (747 B, 今天)
    │   │   │   │   │   ├── loading-skeleton.tsx (2.5 KB, 今天)
    │   │   │   │   │   ├── overview-dashboard.tsx (7 KB, 今天)
    │   │   │   │   │   ├── recent-activity.tsx (4.2 KB, 今天)
    │   │   │   │   │   ├── stat-card.tsx (5.9 KB, 今天)
    │   │   │   │   │   ├── types.ts (3.8 KB, 今天)
    │   │   │   │   ├── participants/
    │   │   │   │   │   ├── hooks/
    │   │   │   │   │   │   ├── use-participants.ts (4.3 KB, 今天)
    │   │   │   │   │   ├── advanced-filters.tsx (13.7 KB, 今天)
    │   │   │   │   │   ├── card-grid.tsx (7 KB, 今天)
    │   │   │   │   │   ├── data.ts (5.4 KB, 今天)
    │   │   │   │   │   ├── index.ts (1.3 KB, 今天)
    │   │   │   │   │   ├── participant-card.tsx (8 KB, 今天)
    │   │   │   │   │   ├── participant-filters.tsx (5.9 KB, 今天)
    │   │   │   │   │   ├── participant-list.tsx (6.1 KB, 今天)
    │   │   │   │   │   ├── participant-role-editor.tsx (4.5 KB, 今天)
    │   │   │   │   │   ├── participant-table.tsx (7.4 KB, 今天)
    │   │   │   │   │   ├── types.ts (4.5 KB, 今天)
    │   │   │   │   │   ├── view-toggle.tsx (2 KB, 今天)
    │   │   │   │   │   ├── virtualized-table.tsx (11.9 KB, 今天)
    │   │   │   │   ├── quality/
    │   │   │   │   │   ├── checklist.tsx (8.1 KB, 今天)
    │   │   │   │   │   ├── index.ts (211 B, 今天)
    │   │   │   │   │   ├── quality-dashboard.tsx (6.5 KB, 今天)
    │   │   │   │   ├── report/
    │   │   │   │   │   ├── index.ts (205 B, 今天)
    │   │   │   │   │   ├── report-dashboard.tsx (9 KB, 今天)
    │   │   │   │   │   ├── report-viewer.tsx (8.9 KB, 今天)
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── index.ts (41 B, 今天)
    │   │   │   │   ├── index.ts (1 KB, 今天)
    │   │   │   │   ├── spaces-detail-view.tsx (170 B, 今天)
    │   │   │   │   ├── spaces-files-view.tsx (592 B, 今天)
    │   │   │   │   ├── spaces-list-view.tsx (10.2 KB, 今天)
    │   │   │   │   ├── spaces-settings-view.tsx (2.5 KB, 今天)
    │   │   │   │   ├── spaces-star-button.tsx (1.5 KB, 今天)
    │   │   │   │   ├── spaces-starred-view.tsx (2.2 KB, 今天)
    │   │   │   │   ├── spaces-visibility-badge.tsx (1001 B, 今天)
    │   │   │   ├── hooks/
    │   │   │   │   ├── index.ts (516 B, 今天)
    │   │   │   │   ├── use-file-actions.ts (5.8 KB, 今天)
    │   │   │   │   ├── use-file-operations.ts (5.6 KB, 今天)
    │   │   │   │   ├── use-space-actions.ts (5 KB, 今天)
    │   │   │   │   ├── use-star-actions.ts (3.4 KB, 今天)
    │   │   │   │   ├── use-visibility-actions.ts (3.9 KB, 今天)
    │   │   │   ├── COMPLIANCE_TODO.md (817 B, 今天)
    │   │   │   ├── index.ts (407 B, 今天)
    │   │   │   ├── spaces-schemas.ts (591 B, 今天)
    │   │   ├── users/
    │   │   │   └── pages/
    │   │   │       └── user-profile-page.tsx (8 KB, 今天)
    │   ├── forms/
    │   │   ├── form-card.tsx (1.8 KB, 今天)
    │   │   ├── form-field.tsx (4.8 KB, 今天)
    │   │   ├── form-input.tsx (1.4 KB, 今天)
    │   │   ├── form-switch.tsx (1.6 KB, 今天)
    │   │   ├── form-textarea.tsx (1.4 KB, 今天)
    │   │   ├── index.ts (339 B, 今天)
    │   ├── ui/
    │   │   ├── accordion.tsx (2 KB, 今天)
    │   │   ├── alert.tsx (1.6 KB, 今天)
    │   │   ├── avatar.tsx (1.4 KB, 今天)
    │   │   ├── badge.tsx (1.1 KB, 今天)
    │   │   ├── breadcrumb.tsx (2.8 KB, 今天)
    │   │   ├── button.tsx (1.9 KB, 今天)
    │   │   ├── calendar.tsx (2.7 KB, 今天)
    │   │   ├── card.tsx (1.9 KB, 今天)
    │   │   ├── carousel.tsx (6.3 KB, 今天)
    │   │   ├── chart.tsx (10.6 KB, 今天)
    │   │   ├── checkbox.tsx (1.1 KB, 今天)
    │   │   ├── collapsible.tsx (340 B, 今天)
    │   │   ├── command.tsx (4.9 KB, 今天)
    │   │   ├── dropdown-menu.tsx (7.5 KB, 今天)
    │   │   ├── file-type-icon.tsx (8.4 KB, 今天)
    │   │   ├── file-upload.tsx (10.5 KB, 今天)
    │   │   ├── form.tsx (4.2 KB, 今天)
    │   │   ├── input.tsx (869 B, 今天)
    │   │   ├── label.tsx (750 B, 今天)
    │   │   ├── menubar.tsx (8.6 KB, 今天)
    │   │   ├── popover.tsx (1.2 KB, 今天)
    │   │   ├── progress.tsx (819 B, 今天)
    │   │   ├── radio-group.tsx (1.5 KB, 今天)
    │   │   ├── scroll-area.tsx (1.7 KB, 今天)
    │   │   ├── select.tsx (5.7 KB, 今天)
    │   │   ├── separator.tsx (801 B, 今天)
    │   │   ├── sheet.tsx (4.3 KB, 今天)
    │   │   ├── sidebar.tsx (22.9 KB, 今天)
    │   │   ├── skeleton.tsx (276 B, 今天)
    │   │   ├── slider.tsx (1.1 KB, 今天)
    │   │   ├── switch.tsx (1.2 KB, 今天)
    │   │   ├── table.tsx (2.8 KB, 今天)
    │   │   ├── tabs.tsx (1.9 KB, 今天)
    │   │   ├── textarea.tsx (792 B, 今天)
    │   │   ├── toast.tsx (4.9 KB, 今天)
    │   │   ├── toaster.tsx (821 B, 今天)
    │   │   ├── toggle-group.tsx (1.8 KB, 今天)
    │   │   ├── toggle.tsx (1.5 KB, 今天)
    │   │   ├── tooltip.tsx (1.2 KB, 今天)
    │   ├── achievements-list.tsx (3.7 KB, 今天)
    │   ├── activity-overview-chart.tsx (2.9 KB, 今天)
    │   ├── contribution-breakdown-chart.tsx (3 KB, 今天)
    │   ├── firebase-error-listener.tsx (1.1 KB, 今天)
    │   ├── follower-list.tsx (3.7 KB, 今天)
    │   ├── following-list.tsx (3.7 KB, 今天)
    │   ├── form-card-skeleton.tsx (1.2 KB, 今天)
    │   ├── github-heat-map.tsx (5.2 KB, 今天)
    │   ├── issues-placeholder.tsx (1.2 KB, 今天)
    │   ├── logo.tsx (1004 B, 今天)
    │   ├── membership-list.tsx (3.8 KB, 今天)
    │   ├── notification-popover.tsx (4.7 KB, 今天)
    │   ├── recent-activity-timeline.tsx (2.9 KB, 今天)
    │   ├── search-command.tsx (5.3 KB, 今天)
    │   ├── user-profile-card.tsx (8.6 KB, 今天)
    ├── firebase/
    │   ├── firestore/
    │   │   ├── use-collection.tsx (3.3 KB, 今天)
    │   │   ├── use-doc.tsx (3.1 KB, 今天)
    │   ├── client-provider.tsx (834 B, 今天)
    │   ├── config.ts (380 B, 今天)
    │   ├── error-emitter.ts (2.1 KB, 今天)
    │   ├── errors.ts (3.6 KB, 今天)
    │   ├── index.ts (1.8 KB, 今天)
    │   ├── provider.tsx (5.9 KB, 今天)
    ├── hooks/
    │   ├── index.ts (443 B, 今天)
    │   ├── use-app-state.ts (3 KB, 今天)
    │   ├── use-file-operations.ts (5.8 KB, 今天)
    │   ├── use-mobile.tsx (584 B, 今天)
    │   ├── use-permissions.ts (4.9 KB, 今天)
    │   ├── use-toast.ts (4.1 KB, 今天)
    ├── lib/
    │   └── services/
    │       ├── contracts/
    │   └── types/
    │       ├── contracts/
    │       ├── contract.types.ts (3.3 KB, 今天)
    │   └── placeholder-images.json (4.3 KB, 昨天)
    │   └── placeholder-images.ts (1.5 KB, 今天)
    │   └── role-management.ts (884 B, 今天)
    │   └── types-unified.ts (6.6 KB, 今天)
    │   └── utils.ts (172 B, 今天)
└── .editorconfig (873 B, 今天)
└── .eslintrc.json (1.1 KB, 昨天)
└── .prettierignore (276 B, 昨天)
└── .prettierrc (210 B, 昨天)
└── apphosting.yaml (277 B, 昨天)
└── components.json (467 B, 昨天)
└── firestore.rules (14.9 KB, 昨天)
└── next.config.ts (645 B, 今天)
└── package-lock.json (796.3 KB, 今天)
└── package.json (4.7 KB, 今天)
└── postcss.config.mjs (143 B, 昨天)
└── README.md (119 B, 昨天)
└── storage.rules (2 KB, 今天)
└── tailwind.config.ts (2.7 KB, 今天)
└── tsconfig.json (629 B, 昨天)

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
