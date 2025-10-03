# 連續任務協作流程 v3.0 (Continuous Collaboration Workflow v3.0)

## 概述

這個流程定義了如何使用 VAN 模式、context7 查詢官方文檔、sequential-thinking 進行多步驟分析，以及如何強化 memory.json 的完整協作方法。

## 流程階段

### 1. 知識查詢階段 (Knowledge Query Phase)

**目標**: 獲取最新、最準確的官方技術文檔

**工具**: context7 MCP 服務
- `resolve-library-id`: 解析庫 ID
- `get-library-docs`: 獲取官方文檔

**執行步驟**:
1. 識別需要查詢的技術棧
2. 使用 `resolve-library-id` 獲取最權威的庫 ID
3. 使用 `get-library-docs` 獲取詳細文檔
4. 分析文檔內容，提取關鍵知識點

**示例**:
```bash
# 查詢 Vercel 部署優化
mcp_context7_resolve-library-id("Vercel")
mcp_context7_get-library-docs("/websites/vercel", topic="deployment optimization best practices")

# 查詢 ESLint 最佳實踐
mcp_context7_resolve-library-id("ESLint")
mcp_context7_get-library-docs("/eslint/eslint", topic="modern development workflow best practices")

# 查詢 Next.js 15 最新特性
mcp_context7_resolve-library-id("Next.js")
mcp_context7_get-library-docs("/vercel/next.js", topic="App Router features")

# 查詢 React 19 最新特性
mcp_context7_resolve-library-id("React")
mcp_context7_get-library-docs("/facebook/react", topic="React 19 features")
```

### 2. 分析階段 (Analysis Phase)

**工具**: sequential-thinking
- `sequentialthinking`: 進行多步驟分析

**執行步驟**:
1. 使用 sequential-thinking 進行結構化分析
2. 識別知識缺口和強化機會
3. 評估新知識的整合策略
4. 形成強化 memory.json 的具體計劃

**示例**:
```javascript
mcp_sequential-thinking_sequentialthinking({
  thought: "分析當前 memory.json 的狀態...",
  nextThoughtNeeded: true,
  thoughtNumber: 1,
  totalThoughts: 3
})
```

### 3. 增強階段 (Enhancement Phase)

**工具**: Memory Bank 操作
- `add_observations`: 添加觀察結果
- `create_entities`: 創建新實體
- `create_relations`: 建立關係

**執行步驟**:
1. 更新現有實體的觀察結果
2. 創建新的技術實體
3. 建立實體間的關係連接
4. 確保知識圖譜的完整性

**示例**:
```javascript
// 更新現有實體
mcp_memory_add_observations({
  observations: [{
    entityName: "vercel_deployment_optimization",
    contents: ["使用 vercel build 進行本地構建", "支援 vercel deploy --prebuilt --archive=tgz"]
  }]
})

// 創建新實體
mcp_memory_create_entities({
  entities: [{
    name: "modern_dev_tools_chain",
    entityType: "development_tools",
    observations: ["使用 ESLint 8+ 進行代碼檢查", "整合 Prettier 進行代碼格式化"]
  }]
})

// 建立關係
mcp_memory_create_relations({
  relations: [{
    from: "modern_dev_tools_chain",
    to: "dev_tools",
    relationType: "extends"
  }]
})
```

### 4. 驗證階段 (Validation Phase)

**工具**: Memory Bank 查詢
- `read_graph`: 獲取整個知識圖譜
- `search_nodes`: 搜索特定節點
- `open_nodes`: 打開特定節點

**執行步驟**:
1. 驗證知識圖譜的完整性
2. 檢查關係的正確性
3. 確保實用性和可擴展性
4. 記錄驗證結果

**示例**:
```javascript
// 讀取整個知識圖譜
mcp_memory_read_graph({})

// 搜索特定節點
mcp_memory_search_nodes({query: "vercel_deployment_optimization"})

// 打開特定節點
mcp_memory_open_nodes({names: ["modern_dev_tools_chain"]})
```

## 強化成果

### 新增技術領域
1. **Vercel 部署優化**: 本地構建、預構建部署、地理區域部署、邊緣計算
2. **現代開發工具鏈**: ESLint 8+、Prettier、Husky、Vitest、Playwright
3. **高級測試策略**: Jest、React Testing Library、MSW、Visual Regression Testing
4. **監控分析工具**: Vercel Analytics、Sentry、LogRocket、DataDog、New Relic

### 技術深度提升
- **Vercel 部署**: 從基礎部署擴展到 CLI、Functions、Analytics、Edge Functions、A/B Testing
- **開發工具鏈**: 從基礎工具擴展到 ESLint 8+、Prettier、Husky、Vitest、Playwright、Storybook
- **測試策略**: 從基礎測試擴展到 Jest、React Testing Library、MSW、Visual Regression、Accessibility Testing
- **監控工具**: 從基礎監控擴展到 Vercel Analytics、Sentry、LogRocket、Hotjar、DataDog、Grafana

### 關係網絡完整性
- 建立了完整的技術棧關聯網絡
- 每個新實體都有 20+ 個觀察結果
- 建立了 50+ 個新關係連接

## 持續優化與反饋循環

這個流程是一個迭代的循環，每次任務完成後，都應重新評估知識庫的狀態。鼓勵用戶提供反饋，以進一步完善和調整協作流程及知識庫內容。定期審查和更新 memory.json，以適應項目進展和技術發展。

## 最佳實踐

1. **優先查詢官方文檔**: 使用 context7 獲取最權威的技術文檔
2. **結構化分析**: 使用 sequential-thinking 進行多步驟分析
3. **增量增強**: 逐步增強 memory.json，避免一次性大量修改
4. **關係完整性**: 確保新實體與現有實體建立適當的關係
5. **驗證檢查**: 每次增強後都要驗證知識圖譜的完整性
6. **持續學習**: 根據項目進展和技術發展持續更新知識庫

## 技術整合

- **VAN 模式**: 項目初始化、任務分析、技術驗證
- **Context7**: 官方文檔查詢和最佳實踐獲取
- **Sequential-thinking**: 多步驟問題分析和解決方案驗證
- **Memory Bank**: 知識圖譜管理和實體關係維護
- **MCP 服務**: 工具集成和自動化協作

這個流程確保了知識庫的持續增強和技術棧的全面覆蓋，為項目開發提供了強有力的技術支持。

