# Autodesk Platform Services (APS) API 完整文檔

## 概述

Autodesk Platform Services (APS) 是一套完整的開發者平台，提供雲端和桌面產品的API、工具API和SDK。APS讓開發者能夠建立與Autodesk產品和服務整合的應用程式。

### 主要服務

- **Data Management API** - 統一的數據訪問和管理
- **Model Derivative API** - 設計文件轉換和處理
- **Viewer API** - 3D模型查看和操作
- **Authentication API** - 認證和授權服務
- **Design Automation API** - 設計流程自動化
- **Service Limits API** - 服務限制管理

---

## 1. 認證與授權 API

### 1.1 獲取訪問令牌

**端點**: `POST /authentication/v2/token`

**操作ID**: `fetch-token`

**描述**: 獲取訪問令牌用於API認證

**請求示例**:
```json
{
  "grant_type": "client_credentials",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "scope": "data:read data:write"
}
```

**響應示例**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here"
}
```

### 1.2 用戶授權

**端點**: `GET /authentication/v2/authorize`

**操作ID**: `authorize`

**描述**: 啟動OAuth2授權碼授權流程，返回瀏覽器URL供用戶同意

**參數**:
- `response_type`: `code`
- `client_id`: 應用程式客戶端ID
- `redirect_uri`: 重定向URI
- `scope`: 請求的權限範圍

### 1.3 撤銷令牌

**端點**: `POST /authentication/v2/revoke`

**操作ID**: `revoke`

**描述**: 撤銷活動的訪問令牌或刷新令牌

**請求示例**:
```json
{
  "token": "access_token_or_refresh_token",
  "token_type_hint": "access_token"
}
```

### 1.4 服務帳戶管理

#### 創建服務帳戶
**端點**: `POST /authentication/v2/service-accounts`

**操作ID**: `create-service-account`

**請求示例**:
```json
{
  "name": "my_service_account"
}
```

#### 獲取所有服務帳戶
**端點**: `GET /authentication/v2/service-accounts`

**操作ID**: `get-service-accounts`

#### 創建服務帳戶密鑰
**端點**: `POST /authentication/v2/service-accounts/{serviceAccountId}/keys`

**操作ID**: `create-service-account-key`

---

## 2. 數據管理 API

### 2.1 概述

Data Management API 提供統一且一致的方式來訪問 BIM 360 Team、Fusion Team、BIM 360 Docs、A360 Personal 和 Object Storage Service 中的數據。

### 2.2 核心服務

#### Project Service
- 從 BIM 360 Team hub、Fusion Team hub、A360 Personal hub 或 BIM 360 Docs 帳戶導航到專案

#### Data Service  
- 管理 BIM 360 Team、Fusion Team、BIM 360 Docs 或 A360 Personal 的元數據
- 處理文件夾、項目和版本
- 管理這些實體之間的關係

#### Schema Service
- 理解擴展數據類型的結構和語義，如 Fusion 設計

#### Object Storage Service (OSS)
- 下載和上傳原始文件（如 PDF、XLS、DWG 或 RVT）

### 2.3 項目管理端點

#### 獲取項目詳情
**端點**: `GET /data/v1/projects/{project_id}`

**操作ID**: `getProject`

**參數**:
- `project_id` (路徑): 項目ID

#### 創建新項目
**端點**: `POST /construction/admin/v1/accounts/{accountId}/projects`

**操作ID**: `createProject`

**請求示例**:
```json
{
  "name": "New Project",
  "description": "Project description",
  "accountId": "account_123"
}
```

### 2.4 項目和版本管理

#### 獲取項目項目
**端點**: `GET /data/v1/projects/{project_id}/items/{item_id}`

#### 獲取項目版本
**端點**: `GET /data/v1/projects/{project_id}/versions/{version_id}`

#### 創建新項目
**端點**: `POST /data/v1/projects/{project_id}/items`

#### 創建新版本
**端點**: `POST /data/v1/projects/{project_id}/versions`

#### 更新項目
**端點**: `PATCH /data/v1/projects/{project_id}/items/{item_id}`

#### 更新版本
**端點**: `PATCH /data/v1/projects/{project_id}/versions/{version_id}`

### 2.5 關係管理

#### 獲取版本關係鏈接
**端點**: `GET /data/v1/projects/{project_id}/versions/{version_id}/relationships/links`

#### 創建自定義關係
**端點**: `POST /data/v1/projects/{project_id}/versions/{version_id}/relationships/refs`

**請求示例**:
```json
{
  "data": {
    "type": "refs",
    "id": "version_id",
    "relationships": {
      "refs": {
        "data": {
          "type": "versions",
          "id": "related_version_id"
        }
      }
    }
  }
}
```

### 2.6 對象存儲服務 (OSS)

#### 創建存儲位置
**端點**: `POST /data/v1/projects/{project_id}/storage`

**操作ID**: `postStorage`

#### 批量生成簽名S3上傳URL
**端點**: `POST /oss/v2/buckets/{bucketKey}/objects/batchsigneds3upload`

**操作ID**: `batch_signed_s3_upload`

**請求示例**:
```json
{
  "objects": [
    {
      "objectKey": "path/to/file.dwg",
      "access": "readwrite"
    }
  ]
}
```

#### 複製對象
**端點**: `PUT /oss/v2/buckets/{bucketKey}/objects/{objectKey}/copyto/{newObjName}`

**操作ID**: `copyTo`

---

## 3. 模型轉換 API

### 3.1 概述

Model Derivative API 允許管理和轉換設計文件為各種格式，適合在 Autodesk 平台內查看和分析。

### 3.2 核心類別

- **ModelViewsDataMetadata**: 表示模型視圖的元數據
- **ObjectTree**: 表示對象的層次結構
- **Properties**: 包含對象的屬性
- **SupportedFormats**: 列出支持的轉換文件格式
- **ModelDerivativeClient**: TypeScript SDK 中與 Model Derivative API 交互的主要客戶端

### 3.3 主要端點

#### 指定引用
**端點**: `POST /modelderivative/v2/designdata/{urn}/references`

**操作ID**: `specify-references`

**描述**: 指定源設計引用的文件位置

**請求示例**:
```json
{
  "urn": "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLnRlc3Q_dmVyc2lvbj0x",
  "references": [
    {
      "urn": "reference_urn_here",
      "filename": "reference_file.dwg"
    }
  ]
}
```

### 3.4 支持的格式

- **SVF**: 標準查看格式
- **SVF2**: 下一代查看格式
- **OBJ**: 3D模型格式
- **STL**: 3D打印格式
- **FBX**: 3D動畫格式

### 3.5 枚舉類型

- **Format**: 指定衍生文件的輸出格式
- **ExportFileStructure**: 定義導出文件的結構
- **Role**: 表示衍生文件的作用
- **ConversionMethod**: 指定轉換方法
- **MaterialMode**: 定義材質模式

---

## 4. 查看器 API

### 4.1 概述

Autodesk Viewer API 允許開發者在應用程式中整合和自定義各種 Autodesk 文件格式的查看體驗。

### 4.2 核心組件

- **Viewer3D**: 與3D查看器交互的主要類別
- **GuiViewer3D**: 提供查看器圖形用戶界面的類別
- **Extensions**: 為查看器添加特定功能的模組化組件
- **UI Components**: 用於構建和自定義查看器界面的元素

### 4.3 主要功能

#### 模型加載和管理
- 加載各種文件格式（RVT、DWG、IFC、glTF）
- 模型狀態管理
- 版本控制

#### 導航控制
- 相機控制
- 軌道和平移
- 縮放功能

#### 模型檢查
- 查詢屬性
- 選擇組件
- 顯示元數據

### 4.4 查看器初始化

```javascript
var options = {
  env: "AutodeskProduction",
  language: "en",
  getAccessToken: function(onSuccess) {
      var accessToken = 'your_access_token';
      var expirationTimeSeconds = 5 * 60; // 5分鐘
      onSuccess(accessToken, expirationTimeSeconds);
  }
};

Autodesk.Viewing.Initializer(options, function() {
  console.log("初始化完成，創建查看器...");
});
```

### 4.5 主要API方法

#### 獲取維度
```javascript
viewer.getDimensions()
// 返回: { width: Number, height: Number }
```

#### 調整大小
```javascript
viewer.resize()
```

#### 獲取相機
```javascript
viewer.getCamera()
// 返回: THREE.Camera
```

#### 獲取狀態
```javascript
viewer.getState(filter)
// 返回: 包含視口、選擇和隔離數據的狀態對象
```

#### 恢復狀態
```javascript
viewer.restoreState(viewerState, filter, immediate)
// 返回: boolean - 恢復操作是否成功
```

### 4.6 可用擴展

- **AnimationExtension**: 處理動畫
- **MeasureExtension**: 啟用測量工具
- **DocumentBrowser**: 允許瀏覽文檔結構
- **Edit2DExtension**: 啟用2D編輯功能
- **ExplodeExtension**: 提供爆炸模型組件的功能
- **SectionExtension**: 提供截面工具
- **MarkupsCore**: 標記核心功能
- **LayerManagerExtension**: 管理模型圖層
- **PropertiesManagerExtension**: 管理和顯示屬性

### 4.7 UI組件

- **ToolBar**: 管理查看器的工具欄
- **Button**: 表示UI中的可點擊按鈕
- **Control**: UI控件的基類
- **DataTable**: 用於顯示表格數據
- **DockingPanel**: 用於創建可調整大小和可停靠的面板
- **PropertyPanel**: 顯示選定對象的屬性
- **Tree**: 用於層次數據顯示

---

## 5. 設計自動化 API

### 5.1 概述

Design Automation API 提供自動化設計流程的能力，支持 AutoCAD、Inventor、Fusion 360 等應用程式。

### 5.2 服務限制管理

#### 獲取服務限制
**端點**: `GET /servicelimits/{owner}`

**描述**: 獲取指定所有者的服務限制

**響應示例**:
```json
{
  "limits": {
    "maxConcurrentJobs": 10,
    "maxJobDuration": 3600,
    "maxWorkItemsPerDay": 1000
  }
}
```

#### 更新服務限制
**端點**: `PUT /servicelimits/{owner}`

**描述**: 更新指定所有者的服務限制

**請求示例**:
```json
{
  "limits": {
    "maxConcurrentJobs": 10,
    "maxJobDuration": 3600,
    "maxWorkItemsPerDay": 1000
  }
}
```

### 5.3 工作項目管理

#### 創建工作項目
**端點**: `POST /da/us-east/v3/workitems`

#### 獲取工作項目狀態
**端點**: `GET /da/us-east/v3/workitems/{id}`

#### 取消工作項目
**端點**: `DELETE /da/us-east/v3/workitems/{id}`

---

## 6. 問題管理 API

### 6.1 概述

Issues API 提供管理項目問題的全面功能，包括配置文件、類型、屬性、評論和附件。

### 6.2 主要端點

#### 獲取項目問題
**端點**: `GET /construction/issues/v1/projects/{projectId}/issues`

**操作ID**: `getIssues`

**描述**: 檢索項目中所有問題的信息，包括相關評論和附件的詳細信息

#### 獲取問題詳情
**端點**: `GET /construction/issues/v1/projects/{projectId}/issues/{issueId}`

**操作ID**: `getIssueDetails`

#### 獲取問題類型
**端點**: `GET /construction/issues/v1/projects/{projectId}/issue-types`

**操作ID**: `getIssuesTypes`

**描述**: 檢索項目的類別和類型

**查詢參數**:
- `include`: 使用 `include=subtypes` 包含每個類別的類型
- `limit`: 限制結果數量（與 offset 一起支持分頁）
- `offset`: 獲取部分結果（與 limit 一起支持分頁）
- `filter[updatedAt]`: 檢索在指定日期時間最後更新的類型
- `filter[isActive]`: 按狀態過濾類型

#### 獲取當前用戶權限
**端點**: `GET /construction/issues/v1/projects/{projectId}/users/me`

**操作ID**: `getUserProfile`

**描述**: 返回當前用戶權限

---

## 7. 建築施工雲 API

### 7.1 概述

Autodesk Construction Cloud (ACC) API 提供管理建築項目的功能，包括用戶管理、公司管理和業務單位管理。

### 7.2 用戶管理

#### 獲取帳戶用戶
**端點**: `GET /hq/v1/accounts/{account_id}/users`

**操作ID**: `getUsers`

**查詢參數**:
- `limit`: 響應數組大小（默認值：10，最大限制：100）
- `offset`: 響應數組偏移量（默認值：0）
- `sort`: 逗號分隔的排序字段
- `field`: 逗號分隔的要包含在響應中的字段

#### 創建用戶
**端點**: `POST /hq/v1/accounts/{account_id}/users`

**操作ID**: `createUser`

**請求示例**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "companyId": "company_123",
  "roleId": "role_456"
}
```

### 7.3 公司管理

#### 創建合作夥伴公司
**端點**: `POST /hq/v1/accounts/{account_id}/companies`

**操作ID**: `createCompany`

#### 批量導入合作夥伴公司
**端點**: `POST /hq/v1/accounts/{account_id}/companies/import`

**操作ID**: `importCompanies`

**描述**: 批量導入合作夥伴公司到特定 BIM 360 帳戶的公司目錄。每次調用最多可包含 50 家公司。

### 7.4 業務單位管理

#### 獲取業務單位
**端點**: `GET /hq/v1/accounts/{account_id}/business_units_structure`

**操作ID**: `getBusinessUnits`

#### 創建業務單位
**端點**: `PUT /hq/v1/accounts/{account_id}/business_units_structure`

**操作ID**: `createBusinessUnits`

---

## 8. 數據可視化 API

### 8.1 概述

Data Visualization API 允許在 Autodesk 查看器中創建熱圖和精靈等可視化效果，實現更豐富的 2D 和 3D 模型數據表示。

### 8.2 主要功能

- **熱圖創建**: 在模型上創建數據熱圖
- **精靈管理**: 處理和顯示精靈對象
- **數據覆蓋**: 在模型上疊加數據層

### 8.3 使用場景

- 建築性能分析
- 環境數據可視化
- 設備狀態監控
- 能源使用分析

---

## 9. Webhooks API

### 9.1 概述

Webhooks API 提供事件驅動的通知機制，當特定事件發生時自動通知您的應用程式。

### 9.2 密鑰管理

#### 刪除 Webhook 密鑰令牌
**端點**: `DELETE /webhooks/v1/tokens/@me`

**操作ID**: `delete-token`

**描述**: 刪除 Webhook 密鑰令牌

**參數**:
- `x-ads-region` (header, 可選): 指定請求的地理位置（區域）
- `region` (query, 可選): 指定請求的地理位置（區域）

**支持的值**: EMEA, US（默認為 US）

**響應**: 204 - 成功刪除密鑰令牌

---

## 10. 常見響應代碼

### 10.1 HTTP 狀態碼

- **200**: 請求成功
- **201**: 新資源已成功創建
- **202**: APS 已接收請求但尚未完成
- **400**: 請求語法錯誤
- **401**: 未授權
- **403**: 禁止訪問
- **404**: 資源未找到
- **406**: 不可接受
- **409**: 資源衝突
- **410**: 目標資源不再可用
- **415**: 不支持的媒體類型
- **422**: 請求無法處理
- **429**: 請求過於頻繁
- **500**: 內部服務器錯誤
- **503**: 服務不可用

### 10.2 錯誤處理

所有 API 響應都遵循一致的錯誤格式：

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "id": "error_id",
      "status": "400",
      "code": "invalid_request",
      "title": "Invalid Request",
      "detail": "詳細錯誤描述",
      "source": {
        "pointer": "/data/attributes/field_name"
      }
    }
  ]
}
```

---

## 11. 認證和授權

### 11.1 OAuth 2.0 流程

APS 使用 OAuth 2.0 進行認證和授權：

1. **授權碼流程** (適用於客戶端應用)
2. **客戶端憑證流程** (適用於服務端應用)
3. **刷新令牌流程** (用於令牌更新)

### 11.2 權限範圍 (Scopes)

常見的權限範圍包括：

- `data:read` - 讀取數據
- `data:write` - 寫入數據
- `data:create` - 創建數據
- `data:search` - 搜索數據
- `bucket:create` - 創建存儲桶
- `bucket:read` - 讀取存儲桶
- `bucket:update` - 更新存儲桶
- `bucket:delete` - 刪除存儲桶

### 11.3 服務帳戶

服務帳戶提供了一種安全的方式來代表應用程式進行 API 調用，而無需最終用戶交互。

---

## 12. 最佳實踐

### 12.1 性能優化

- 使用適當的緩存策略
- 實現請求重試機制
- 批量處理多個操作
- 使用分頁處理大型數據集

### 12.2 錯誤處理

- 實現指數退避重試
- 記錄詳細的錯誤信息
- 處理速率限制
- 驗證輸入數據

### 12.3 安全性

- 安全存儲客戶端憑證
- 使用 HTTPS 進行所有通信
- 定期輪換訪問令牌
- 實施最小權限原則

### 12.4 監控和日誌

- 監控 API 使用情況
- 設置警報和通知
- 記錄關鍵操作
- 追蹤性能指標

---

## 13. SDK 和工具

### 13.1 官方 SDK

- **Node.js SDK**: 用於服務端 JavaScript 開發
- **.NET SDK**: 用於 .NET 應用程式開發
- **TypeScript SDK**: 用於類型安全的 JavaScript 開發

### 13.2 開發工具

- **Postman Collection**: API 測試集合
- **OpenAPI 規範**: 完整的 API 規範文檔
- **代碼示例**: 各種語言的示例代碼

---

## 14. 支持和資源

### 14.1 文檔資源

- [官方開發者文檔](https://aps.autodesk.com/developer/documentation)
- [API 參考指南](https://aps.autodesk.com/en/docs)
- [教程和示例](https://aps.autodesk.com/en/docs/tutorials)

### 14.2 社區支持

- [開發者論壇](https://forums.autodesk.com/t5/autodesk-platform-services/ct-p/autodesk-platform-services)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/autodesk-platform-services)
- [GitHub 示例](https://github.com/Autodesk-Forge)

### 14.3 聯繫方式

- 技術支持：通過 Autodesk 開發者門戶提交工單
- 社區論壇：參與開發者討論
- 文檔反饋：通過文檔頁面提供反饋

---

*此文檔基於 Autodesk Platform Services 官方文檔生成，最後更新時間：2024年*
