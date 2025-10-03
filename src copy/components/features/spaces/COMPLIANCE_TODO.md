# Spaces 功能規範合規 TODO

## 文件命名規範問題

### 缺少的規範文件
- [ ] `spaces.actions.ts` - 缺少統一的 Server Actions 文件
- [ ] `spaces.client.tsx` - 缺少統一的 Client Components 文件  
- [ ] `spaces.queries.ts` - 缺少統一的 React Query hooks 文件
- [ ] `spaces.schema.ts` - 缺少統一的 Zod schemas 文件

### 現有文件重命名建議
- [ ] `actions/file-actions.ts` → `spaces-file-actions.ts` (已添加 TODO)
- [ ] 其他組件文件應按照功能分組重命名

## 架構分離問題
- [ ] 將 Firebase 操作從 Server Actions 移至 Client Components
- [ ] 實施正確的前後端分離策略

## 代碼質量問題
- [ ] 修復所有字符串字面量錯誤
- [ ] 修復所有語法錯誤
- [ ] 清理未使用的導入和參數
