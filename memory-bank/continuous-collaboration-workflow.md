# 連續任務協作流程 (Continuous Collaboration Workflow)

## 概述

這個流程定義了如何使用 context7 查詢官方文檔、sequential-thinking 進行多步驟分析，以及如何強化 memory.json 的完整協作方法。

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
# 查詢 Next.js 15
mcp_context7_resolve-library-id("Next.js")
mcp_context7_get-library-docs("/vercel/next.js", topic="App Router features")

# 查詢 React 19
mcp_context7_resolve-library-id("React")
mcp_context7_get-library-docs("/facebook/react", topic="React 19 features")
```

### 2. 分析階段 (Analysis Phase)

**目標**: 使用 sequential-thinking 進行結構化分析

**工具**: sequential-thinking MCP 服務
- `sequentialthinking`: 多步驟思考過程

**執行步驟**:
1. 分析任務複雜度
2. 識別技術知識缺口
3. 評估現有 memory.json 覆蓋範圍
4. 制定強化策略

**思考模式**:
- 多步驟問題分解
- 結構化思考過程
- 支援分支和修訂
- 支援假設生成和驗證

### 3. 增強階段 (Enhancement Phase)

**目標**: 基於官方文檔強化 memory.json

**工具**: Memory MCP 服務
- `add_observations`: 添加觀察結果
- `create_entities`: 創建新實體
- `create_relations`: 建立關係

**執行步驟**:
1. 更新現有實體的觀察結果
2. 創建新的技術知識實體
3. 建立實體間的關係網絡
4. 確保知識的完整性和一致性

### 4. 驗證階段 (Validation Phase)

**目標**: 驗證增強後的 memory.json 健壯性

**工具**: Memory MCP 服務
- `read_graph`: 讀取完整知識圖譜
- `search_nodes`: 搜索相關節點

**驗證標準**:
- 知識覆蓋完整性
- 關係邏輯正確性
- 技術準確性
- 實用性評估

## 協作模式

### 連續任務模式
1. **任務分解**: 將複雜任務分解為可管理的子任務
2. **並行處理**: 同時進行多個技術棧的查詢和分析
3. **迭代優化**: 基於反饋持續改進知識庫
4. **知識整合**: 將新知識與現有知識整合

### 質量保證
1. **官方文檔優先**: 始終使用最權威的官方文檔
2. **多源驗證**: 交叉驗證不同來源的技術信息
3. **實用性測試**: 確保知識的實際應用價值
4. **持續更新**: 定期更新以反映技術發展

## 最佳實踐

### 查詢策略
- 優先選擇 Trust Score 高的官方文檔
- 使用具體的 topic 參數獲取相關內容
- 平衡 token 使用和文檔完整性

### 分析策略
- 使用 structured thinking 進行邏輯分析
- 支援不確定性表達和假設驗證
- 動態調整思考步驟和方向

### 增強策略
- 基於項目需求優先增強相關知識
- 建立清晰的實體分類和關係
- 保持知識的模組化和可重用性

## 工具整合

### context7 整合
- 自動查詢 Next.js 15、React 19、TypeScript 5、shadcn/ui 官方文檔
- 整合官方最佳實踐
- 支援實時文檔查詢

### sequential-thinking 整合
- 多步驟問題分析
- 結構化思考過程
- 支援分支和修訂

### Memory 整合
- 基於項目分析結果強化記憶
- 建立實體關係和知識圖譜
- 支援連續學習和更新

## 成功指標

1. **知識覆蓋度**: 技術棧知識的完整覆蓋
2. **準確性**: 基於官方文檔的準確信息
3. **實用性**: 知識的實際應用價值
4. **一致性**: 知識間的邏輯一致性
5. **可維護性**: 知識庫的可持續維護

## 未來改進

1. **自動化程度**: 提高流程自動化程度
2. **智能推薦**: 基於項目需求智能推薦相關知識
3. **版本管理**: 支援知識的版本管理和回滾
4. **協作增強**: 支援多用戶協作和知識共享

