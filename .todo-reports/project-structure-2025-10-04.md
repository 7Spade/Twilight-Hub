# 📁 項目結構報告

> 此文件由自動化腳本生成，請勿手動編輯
> 生成日期: 2025-10-04

## 📊 目錄結構

```
└── src/
    ├── ai/
    │   ├── flows/
    │   │   ├── analyze-contract.ts (142 B, 今天)
    │   │   ├── extract-engagement-data.ts (142 B, 今天)
    │   ├── services/
    │   │   ├── contract-analysis.service.ts (142 B, 今天)
    │   │   ├── document-analysis.service.ts (145 B, 今天)
    │   ├── types/
    │   │   ├── analysis.types.ts (148 B, 今天)
    │   │   ├── engagement.types.ts (148 B, 今天)
    │   ├── dev.ts (64 B, 今天)
    │   ├── genkit.ts (133 B, 今天)
    ├── app/
    │   ├── (app)/
    │   │   ├── [userslug]/
    │   │   │   ├── [spaceslug]/
    │   │   │   │   ├── page.tsx (439 B, 今天)
    │   │   │   ├── page.tsx (2.1 KB, 今天)
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx (3.7 KB, 今天)
    │   │   ├── discover/
    │   │   │   ├── page.tsx (438 B, 今天)
    │   │   ├── organizations/
    │   │   │   ├── [organizationslug]/
    │   │   │   │   ├── [spaceslug]/
    │   │   │   │   │   ├── page.tsx (438 B, 今天)
    │   │   │   │   ├── groups/
    │   │   │   │   │   ├── page.tsx (2.3 KB, 今天)
    │   │   │   │   ├── inventory/
    │   │   │   │   │   ├── [itemId]/
    │   │   │   │   │   │   ├── page.tsx (240 B, 今天)
    │   │   │   │   │   ├── page.tsx (4.4 KB, 今天)
    │   │   │   │   ├── members/
    │   │   │   │   │   ├── page.tsx (3.2 KB, 今天)
    │   │   │   │   ├── roles/
    │   │   │   │   │   ├── page.tsx (2.7 KB, 今天)
    │   │   │   │   ├── settings/
    │   │   │   │   │   ├── page.tsx (3.1 KB, 今天)
    │   │   │   │   ├── spaces/
    │   │   │   │   │   ├── page.tsx (4.2 KB, 今天)
    │   │   │   │   ├── page.tsx (1.7 KB, 今天)
    │   │   │   ├── page.tsx (6.1 KB, 今天)
    │   │   ├── settings/
    │   │   │   ├── account/
    │   │   │   │   ├── page.tsx (8.4 KB, 今天)
    │   │   │   ├── notifications/
    │   │   │   │   ├── page.tsx (13.5 KB, 今天)
    │   │   │   ├── profile/
    │   │   │   │   └── page.tsx (5 KB, 今天)
    │   │   ├── spaces/
    │   │   │   └── [spaceslug]/
    │   │   │       ├── page.tsx (2.7 KB, 今天)
    │   │   │   └── page.tsx (3.5 KB, 今天)
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   ├── page.tsx (1.1 KB, 今天)
    │   │   ├── signup/
    │   │   │   └── page.tsx (1.1 KB, 今天)
    │   ├── (public)/
    │   │   ├── page.tsx (4.3 KB, 今天)
    │   ├── favicon.ico (14.7 KB, 昨天)
    │   ├── globals.css (2.3 KB, 今天)
    │   ├── page.tsx (120 B, 今天)
    ├── components/
    │   ├── auth/
    │   │   ├── auth-navigation.tsx (1 KB, 今天)
    │   │   ├── auth-provider.tsx (844 B, 今天)
    │   │   ├── index.ts (253 B, 今天)
    │   │   ├── permission-guard.tsx (209 B, 今天)
    │   │   ├── role-manager.tsx (220 B, 今天)
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── auth-form.tsx (827 B, 今天)
    │   │   │   ├── login-form.tsx (2.2 KB, 今天)
    │   │   │   ├── register-form.tsx (3.8 KB, 今天)
    │   │   ├── contracts/
    │   │   │   ├── contract-list.tsx (5.9 KB, 今天)
    │   │   │   ├── index.ts (71 B, 今天)
    │   │   ├── organizations/
    │   │   │   ├── components/
    │   │   │   │   └── roles/
    │   │   │   │       └── index.ts (45 B, 今天)
    │   │   │   │       └── role-list.tsx (2.3 KB, 今天)
    │   │   ├── spaces/
    │   │   │   ├── actions/
    │   │   │   │   ├── file-actions.ts (3.1 KB, 今天)
    │   │   │   │   ├── index.ts (165 B, 今天)
    │   │   │   │   ├── space-actions.ts (2.4 KB, 今天)
    │   │   │   │   ├── star-actions.ts (1.7 KB, 今天)
    │   │   │   │   ├── visibility-actions.ts (2 KB, 今天)
    │   │   │   ├── components/
    │   │   │   │   ├── file-explorer/
    │   │   │   │   │   ├── file-breadcrumb.tsx (199 B, 今天)
    │   │   │   │   │   ├── file-context-menu.tsx (227 B, 今天)
    │   │   │   │   │   ├── file-deleted.tsx (231 B, 今天)
    │   │   │   │   │   ├── file-detail.tsx (216 B, 今天)
    │   │   │   │   │   ├── file-explorer.tsx (231 B, 今天)
    │   │   │   │   │   ├── file-filter.tsx (187 B, 今天)
    │   │   │   │   │   ├── file-table.tsx (225 B, 今天)
    │   │   │   │   │   ├── file-thumbnail.tsx (181 B, 今天)
    │   │   │   │   │   ├── file-tree.tsx (223 B, 今天)
    │   │   │   │   │   ├── file-upload.tsx (222 B, 今天)
    │   │   │   │   │   ├── file-version.tsx (222 B, 今天)
    │   │   │   │   ├── space-create.tsx (226 B, 今天)
    │   │   │   │   ├── space-detail.tsx (214 B, 今天)
    │   │   │   │   ├── space-list.tsx (211 B, 今天)
    │   │   │   │   ├── space-settings.tsx (220 B, 今天)
    │   │   │   │   ├── space-star-button.tsx (217 B, 今天)
    │   │   │   │   ├── space-visibility.tsx (232 B, 今天)
    │   │   │   ├── hooks/
    │   │   │   │   ├── index.ts (179 B, 今天)
    │   │   │   │   ├── use-file-actions.ts (1.5 KB, 今天)
    │   │   │   │   ├── use-space-actions.ts (1.5 KB, 今天)
    │   │   │   │   ├── use-star-actions.ts (1 KB, 今天)
    │   │   │   │   ├── use-visibility-actions.ts (1.2 KB, 今天)
    │   │   │   ├── index.ts (717 B, 今天)
    │   │   ├── users/
    │   │   │   ├── pages/
    │   │   │   │   ├── user-profile-page.tsx (8.3 KB, 今天)
    │   │   │   ├── index.ts (77 B, 今天)
    │   │   ├── avatar-demo.tsx (8 KB, 今天)
    │   ├── forms/
    │   │   ├── form-card.tsx (211 B, 今天)
    │   │   ├── form-field.tsx (211 B, 今天)
    │   │   ├── form-input.tsx (197 B, 今天)
    │   │   ├── form-switch.tsx (198 B, 今天)
    │   │   ├── form-textarea.tsx (224 B, 今天)
    │   │   ├── index.ts (143 B, 今天)
    │   ├── ui/
    │   │   ├── accordion.tsx (1.9 KB, 今天)
    │   │   ├── alert.tsx (1.5 KB, 今天)
    │   │   ├── avatar.tsx (1.4 KB, 今天)
    │   │   ├── badge.tsx (1.1 KB, 今天)
    │   │   ├── breadcrumb.tsx (2.6 KB, 今天)
    │   │   ├── button-group.tsx (2.2 KB, 今天)
    │   │   ├── button.tsx (1.9 KB, 今天)
    │   │   ├── calendar.tsx (7.4 KB, 今天)
    │   │   ├── card.tsx (1.8 KB, 今天)
    │   │   ├── carousel.tsx (6.1 KB, 今天)
    │   │   ├── chart.tsx (10.5 KB, 今天)
    │   │   ├── checkbox.tsx (1 KB, 今天)
    │   │   ├── collapsible.tsx (329 B, 今天)
    │   │   ├── command.tsx (4.8 KB, 今天)
    │   │   ├── context-menu.tsx (7.3 KB, 今天)
    │   │   ├── drawer.tsx (3 KB, 今天)
    │   │   ├── dropdown-menu.tsx (7.4 KB, 今天)
    │   │   ├── empty.tsx (2.3 KB, 今天)
    │   │   ├── field.tsx (5.9 KB, 今天)
    │   │   ├── form.tsx (4 KB, 今天)
    │   │   ├── hash-avatar.tsx (2.9 KB, 今天)
    │   │   ├── hover-card.tsx (1.2 KB, 今天)
    │   │   ├── input-group.tsx (4.9 KB, 今天)
    │   │   ├── input-otp.tsx (2.1 KB, 今天)
    │   │   ├── input.tsx (791 B, 今天)
    │   │   ├── item.tsx (4.4 KB, 今天)
    │   │   ├── kbd.tsx (862 B, 今天)
    │   │   ├── label.tsx (724 B, 今天)
    │   │   ├── menubar.tsx (8.4 KB, 今天)
    │   │   ├── navigation-menu.tsx (5 KB, 今天)
    │   │   ├── pagination.tsx (2.7 KB, 今天)
    │   │   ├── popover.tsx (1.3 KB, 今天)
    │   │   ├── progress.tsx (791 B, 今天)
    │   │   ├── radio-group.tsx (1.4 KB, 今天)
    │   │   ├── resizable.tsx (1.7 KB, 今天)
    │   │   ├── scroll-area.tsx (1.6 KB, 今天)
    │   │   ├── select.tsx (5.6 KB, 今天)
    │   │   ├── separator.tsx (770 B, 今天)
    │   │   ├── sheet.tsx (4.2 KB, 今天)
    │   │   ├── sidebar.tsx (23 KB, 今天)
    │   │   ├── skeleton.tsx (261 B, 今天)
    │   │   ├── slider.tsx (1.1 KB, 今天)
    │   │   ├── sonner.tsx (894 B, 今天)
    │   │   ├── spinner.tsx (331 B, 今天)
    │   │   ├── switch.tsx (1.1 KB, 今天)
    │   │   ├── table.tsx (2.7 KB, 今天)
    │   │   ├── tabs.tsx (1.9 KB, 今天)
    │   │   ├── textarea.tsx (689 B, 今天)
    │   │   ├── toast.tsx (4.9 KB, 今天)
    │   │   ├── toaster.tsx (821 B, 今天)
    │   │   ├── toggle-group.tsx (1.7 KB, 今天)
    │   │   ├── toggle.tsx (1.5 KB, 今天)
    │   │   ├── tooltip.tsx (1.2 KB, 今天)
    │   ├── logo.tsx (454 B, 今天)
    ├── firebase/
    │   ├── errors/
    │   │   ├── error-boundary.tsx (909 B, 今天)
    │   │   ├── error-emitter.ts (297 B, 今天)
    │   │   ├── errors.ts (200 B, 今天)
    │   ├── firestore/
    │   │   ├── use-collection.tsx (865 B, 今天)
    │   │   ├── use-doc.tsx (822 B, 今天)
    │   │   ├── use-query.tsx (794 B, 今天)
    │   ├── auth.ts (2.1 KB, 今天)
    │   ├── client-provider.tsx (125 B, 今天)
    │   ├── config.ts (646 B, 今天)
    │   ├── firestore.ts (156 B, 今天)
    │   ├── index.ts (847 B, 今天)
    │   ├── provider.tsx (2.1 KB, 今天)
    │   ├── storage.ts (55 B, 今天)
    ├── hooks/
    │   ├── index.ts (140 B, 今天)
    │   ├── use-app-state.ts (180 B, 今天)
    │   ├── use-auth.ts (2.2 KB, 今天)
    │   ├── use-contracts.ts (178 B, 今天)
    │   ├── use-file-operations.ts (193 B, 今天)
    │   ├── use-mobile.tsx (181 B, 今天)
    │   ├── use-permissions.ts (152 B, 今天)
    │   ├── use-spaces.ts (181 B, 今天)
    │   ├── use-toast.ts (173 B, 今天)
    │   ├── use-toast.tsx (679 B, 今天)
    ├── lib/
    │   └── schemas/
    │       ├── auth.schemas.ts (142 B, 今天)
    │       ├── contract.schemas.ts (142 B, 今天)
    │       ├── space.schemas.ts (142 B, 今天)
    │       ├── user.schemas.ts (142 B, 今天)
    │   └── services/
    │       ├── api.service.ts (127 B, 今天)
    │       ├── auth.service.ts (139 B, 今天)
    │       ├── contract.service.ts (136 B, 今天)
    │       ├── file.service.ts (136 B, 今天)
    │       ├── org.service.ts (136 B, 今天)
    │       ├── space.service.ts (136 B, 今天)
    │       ├── user.service.ts (136 B, 今天)
    │   └── types/
    │       ├── auth.types.ts (142 B, 今天)
    │       ├── common.types.ts (142 B, 今天)
    │       ├── contract.types.ts (142 B, 今天)
    │       ├── file.types.ts (142 B, 今天)
    │       ├── org.types.ts (142 B, 今天)
    │       ├── participant.types.ts (157 B, 今天)
    │       ├── space.types.ts (142 B, 今天)
    │       ├── user.types.ts (142 B, 今天)
    │   └── auth.ts (154 B, 今天)
    │   └── config.ts (124 B, 今天)
    │   └── constants.ts (124 B, 今天)
    │   └── formatting.ts (163 B, 今天)
    │   └── hash-avatar.ts (4.4 KB, 今天)
    │   └── placeholder-images.json (439 B, 今天)
    │   └── placeholder-images.ts (2.2 KB, 今天)
    │   └── utils.ts (349 B, 今天)
    │   └── validation.ts (142 B, 今天)
└── .editorconfig (873 B, 今天)
└── .eslintrc.json (1.1 KB, 昨天)
└── .prettierignore (276 B, 昨天)
└── .prettierrc (210 B, 昨天)
└── apphosting.yaml (277 B, 昨天)
└── components.json (467 B, 昨天)
└── firestore.rules (14.9 KB, 昨天)
└── next.config.ts (1.2 KB, 今天)
└── package-lock.json (796.3 KB, 今天)
└── package.json (5.1 KB, 今天)
└── postcss.config.mjs (143 B, 昨天)
└── README.md (119 B, 昨天)
└── storage.rules (2 KB, 昨天)
└── tailwind.config.ts (2.7 KB, 今天)
└── tsconfig.json (715 B, 今天)

```

## 🔄 自動化說明

此文件通過 Git pre-commit hook 自動更新，確保項目結構文檔始終保持最新狀態。

### 更新觸發條件
- 每次 Git 提交時
- 目錄結構發生變化時
- 手動執行 `npm run docs:update` 時

### 手動更新
```bash
npm run docs:update
```

### 相關報告
- TODO 報告: `todo-report-2025-10-04.md`
- AI 指令: `ai-prompt-2025-10-04.md`
- JSON 數據: `todo-report-2025-10-04.json`
