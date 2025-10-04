# Memory Bank 優化指南

## 認知成本分析

### 高認知成本文件 (>500 lines)
- `creative-security-design.md` (781 lines) - 安全設計詳細方案
- `technicalImplementationGuide.md` (722 lines) - 技術實施指南
- `creative-system-integration.md` (694 lines) - 系統集成設計
- `creative-firebase-architecture.md` (519 lines) - Firebase 架構設計
- `creative-auth-uiux.md` (508 lines) - 認證 UI/UX 設計

### 中認知成本文件 (200-500 lines)
- `projectStructureTree.md` (394 lines) - 項目結構樹
- `architecture-decisions.md` (339 lines) - 架構決策記錄
- `reflection-twilight-hub-refactor.md` (304 lines) - 反思文檔

## 優化策略

### 1. 分層讀取策略
- **Level 1**: 核心狀態文件 (activeContext.md, progress.md)
- **Level 2**: 摘要文件 (projectbrief.md, completed-work.md)
- **Level 3**: 詳細設計文件 (按需讀取)

### 2. 文件合併建議
- 將相關的創意設計文件合併為單一設計文檔
- 將重複的 QA 報告合併
- 創建統一的技術參考文檔

### 3. 摘要文件創建
- 為大型文件創建執行摘要
- 提供快速參考卡片
- 建立索引和導航系統

## 快速參考

### 當前項目狀態
- **階段**: 階段 1 完成，準備階段 2
- **進度**: 75% 完成
- **下一步**: 組織管理和空間管理功能開發

### 核心文件優先級
1. `activeContext.md` - 當前狀態
2. `completed-work.md` - 已完成工作
3. `progress.md` - 進度追蹤
4. `projectbrief.md` - 項目概述

### 設計文件 (按需讀取)
- `creative-firebase-architecture.md` - Firebase 架構
- `creative-auth-uiux.md` - 認證設計
- `creative-system-integration.md` - 系統集成
- `creative-security-design.md` - 安全設計

## 使用建議

### 日常開發
1. 先讀取 `activeContext.md` 了解當前狀態
2. 查看 `completed-work.md` 了解已完成工作
3. 根據需要讀取具體設計文檔

### 新功能開發
1. 查看 `architecture-decisions.md` 了解架構原則
2. 參考對應的創意設計文檔
3. 更新 `progress.md` 和 `tasks.md`

### 問題排查
1. 查看 `qa-validation-report.md` 了解已知問題
2. 參考 `reflection-twilight-hub-refactor.md` 了解經驗教訓
3. 查看相關技術文檔
