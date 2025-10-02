# Autodesk Cost Management 功能清單

基於 Autodesk Platform Services (APS) 的 Cost Management 模組功能清單，包含完整的 API 端點和功能說明。

## 概述

Autodesk Cost Management 是 Autodesk Platform Services 中的成本管理模組，提供全面的建築項目成本控制和管理功能。該模組整合了預算管理、成本追蹤、合約管理和績效監控等功能。

## 主要功能模組

### 1. Actions API - 成本管理操作

**功能描述：** 管理成本管理相關的操作和工作流程

**主要端點：**
- `POST /actions` - 創建新的成本管理操作
- `GET /actions` - 獲取所有成本管理操作列表

**核心功能：**
- 成本審批操作
- 變更訂單審核
- 成本項目審查
- 工作流程管理
- 操作歷史追蹤

**支援的操作類型：**
- 審批變更訂單 (Approve Change Order)
- 審查成本項目 (Review Cost Item)
- 拒絕成本項目 (Reject Cost Item)
- 成本審批 (Approve Cost)

### 2. Budgets API - 預算管理

**功能描述：** 管理項目預算的創建、更新和監控

**主要端點：**
- `GET /budgets` - 獲取預算列表
- `POST /budgets` - 創建新預算
- `GET /budgets/:budgetId` - 獲取特定預算詳情
- `PATCH /budgets/:budgetId` - 更新預算
- `DELETE /budgets/:budgetId` - 刪除預算
- `POST /budgets:import` - 批量導入預算

**核心功能：**
- 預算創建和配置
- 預算版本控制
- 預算比較分析
- 預算執行監控
- 預算偏差警報
- 多級預算管理
- 預算模板應用

### 3. Cost Items API - 成本項目管理

**功能描述：** 管理詳細的成本項目和成本結構

**主要端點：**
- `GET /cost-items` - 獲取成本項目列表
- `POST /cost-items` - 創建新成本項目
- `POST /cost-items:batch-create` - 批量創建成本項目
- `GET /cost-items/:costItemId` - 獲取特定成本項目
- `PATCH /cost-items/:costItemId` - 更新成本項目
- `DELETE /cost-items/:costItemId` - 刪除成本項目
- `POST /cost-items:attach` - 附加文件到成本項目

**核心功能：**
- 成本項目定義
- 成本分類管理
- 成本編碼系統
- 成本項目屬性設定
- 成本項目關聯
- 批量成本項目處理
- 成本項目附件管理

### 4. Sub Cost Items API - 子成本項目管理

**功能描述：** 管理成本項目的子項目和詳細分解

**主要端點：**
- `GET /sub-cost-items` - 獲取子成本項目列表
- `POST /sub-cost-items` - 創建子成本項目
- `PATCH /sub-cost-items/:id` - 更新子成本項目
- `DELETE /sub-cost-items/:id` - 刪除子成本項目
- `POST /sub-cost-items/:id/copy` - 複製子成本項目

**核心功能：**
- 成本項目分解
- 子項目層級管理
- 成本分配計算
- 子項目複製功能
- 成本結構優化
- 詳細成本追蹤

### 5. Contracts API - 合約管理

**功能描述：** 管理主合約和分包合約

**主要端點：**
- `GET /main-contracts` - 獲取主合約列表
- `GET /main-contracts/:contractId` - 獲取特定主合約
- `PATCH /main-contracts/:contractId` - 更新主合約
- `POST /main-contracts/:contractId/items` - 為主合約添加項目

**核心功能：**
- 主合約管理
- 分包合約管理
- 合約項目關聯
- 合約條款追蹤
- 合約變更管理
- 合約執行監控

### 6. Schedule of Values - 價值計劃

**功能描述：** 管理項目的價值計劃和進度付款

**主要端點：**
- `GET /schedule-of-values` - 獲取價值計劃
- `POST /schedule-of-values` - 創建價值計劃
- `PATCH /schedule-of-values/:id` - 更新價值計劃

**核心功能：**
- 價值計劃制定
- 進度付款計算
- 完成百分比追蹤
- 付款申請管理
- 價值計劃審批
- 付款歷史記錄

### 7. Expenses API - 費用管理

**功能描述：** 管理項目相關的費用和支出

**主要端點：**
- `GET /expenses` - 獲取費用列表
- `POST /expenses` - 創建新費用記錄
- `GET /expenses/:expenseId` - 獲取特定費用詳情
- `PATCH /expenses/:expenseId` - 更新費用記錄

**核心功能：**
- 費用記錄管理
- 費用分類和編碼
- 費用審批流程
- 費用報銷管理
- 費用預算對比
- 費用分析報告

### 8. Time Sheets API - 時間表管理

**功能描述：** 管理工時記錄和時間追蹤

**主要端點：**
- `GET /time-sheets` - 獲取時間表列表
- `POST /time-sheets` - 創建時間表記錄
- `PATCH /time-sheets/:id` - 更新時間表

**核心功能：**
- 工時記錄管理
- 時間追蹤和計算
- 工時審批流程
- 工時成本計算
- 時間表報表生成
- 工時分析統計

### 9. Performance Tracking - 績效追蹤

**功能描述：** 追蹤和監控成本績效指標

**主要端點：**
- `POST /performance-tracking-items` - 創建績效追蹤項目
- `GET /performance-tracking-items` - 獲取績效追蹤項目

**核心功能：**
- 成本績效監控
- KPI 指標追蹤
- 績效分析報告
- 偏差警報系統
- 績效趨勢分析
- 成本效率評估

### 10. Templates API - 模板管理

**功能描述：** 管理成本管理相關的模板

**主要端點：**
- `GET /templates` - 獲取模板列表
- `POST /templates` - 創建新模板
- `GET /templates/:templateId` - 獲取特定模板

**核心功能：**
- 預算模板管理
- 成本項目模板
- 合約模板庫
- 報表模板設計
- 模板版本控制
- 模板共享和應用

### 11. Properties API - 屬性管理

**功能描述：** 管理成本項目的屬性和配置

**主要端點：**
- `GET /properties` - 獲取屬性列表
- `POST /properties` - 創建新屬性
- `PATCH /properties/:id` - 更新屬性

**核心功能：**
- 自定義屬性定義
- 屬性值管理
- 屬性驗證規則
- 屬性繼承設定
- 屬性權限控制
- 屬性搜尋和過濾

## 整合功能

### 數據整合
- 與 Autodesk BIM 360 整合
- 與 Autodesk Construction Cloud 整合
- 第三方系統數據同步
- 數據導入/導出功能

### 報表和分析
- 成本分析報表
- 預算執行報表
- 績效追蹤報表
- 自定義報表生成
- 數據視覺化
- 趨勢分析圖表

### 工作流程
- 審批工作流程
- 通知和警報系統
- 用戶權限管理
- 版本控制
- 審計追蹤

### API 特性
- RESTful API 設計
- OAuth 2.0 認證
- 速率限制保護
- 錯誤處理機制
- API 版本控制
- 批量操作支援

## 技術規格

### 認證方式
- 2-legged OAuth2 (Client Credentials)
- 3-legged OAuth2 (Authorization Code)
- Refresh Token 支援
- User Impersonation 支援

### 資料格式
- JSON 請求/響應格式
- ISO 8601 日期格式
- UTF-8 編碼支援
- 分頁查詢支援

### 速率限制
- 每分鐘 500 次 API 調用限制
- 批量操作優化
- 請求佇列管理

## 使用場景

### 建築項目管理
- 大型建築項目成本控制
- 分包商成本管理
- 材料成本追蹤
- 人工成本計算

### 基礎設施項目
- 道路建設成本管理
- 橋樑工程預算控制
- 公共設施成本追蹤
- 維護成本分析

### 製造業應用
- 產品成本計算
- 生產成本分析
- 供應鏈成本管理
- 質量成本追蹤

---

*本文檔基於 Autodesk Platform Services (APS) Cost Management API 文檔整理，涵蓋了完整的成本管理功能清單。*
