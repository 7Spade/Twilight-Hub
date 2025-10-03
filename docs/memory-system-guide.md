# Memory System Management Guide
## 記憶系統管理指南

### 📋 概述

本指南說明如何使用健壯的記憶系統管理工具來維護 `memory-bank/memory.json` 文件的質量和一致性。

### 🛠️ 工具說明

#### 1. Memory Validator (`scripts/memory-validator.js`)
快速驗證記憶文件格式和內容的 Node.js 腳本。

**使用方法:**
```bash
node scripts/memory-validator.js
```

**功能:**
- ✅ 驗證 JSON 格式正確性
- ✅ 檢查實體和關係的必需字段
- ✅ 驗證 observations 數量限制（≤7個）
- ✅ 檢查重複項和數據一致性
- ✅ 生成詳細的統計報告

#### 2. Memory System Manager (`scripts/memory-system-manager.ts`)
完整的 TypeScript 記憶系統管理類，提供高級功能。

**使用方法:**
```bash
# 驗證記憶文件
tsx scripts/memory-system-manager.ts validate

# 獲取統計信息
tsx scripts/memory-system-manager.ts stats

# 優化記憶文件
tsx scripts/memory-system-manager.ts optimize

# 創建備份
tsx scripts/memory-system-manager.ts backup

# 恢復備份
tsx scripts/memory-system-manager.ts restore
```

### 📊 記憶文件結構

#### 實體 (Entity)
```json
{
  "type": "entity",
  "name": "實體名稱",
  "entityType": "實體類型",
  "observations": ["觀察1", "觀察2", "觀察3"]
}
```

#### 關係 (Relation)
```json
{
  "type": "relation",
  "from": "源實體",
  "to": "目標實體",
  "relationType": "關係類型"
}
```

### 🎯 質量標準

#### 實體類型 (Entity Types)
- `user_preference` - 用戶偏好
- `project` - 項目
- `problem_solution` - 問題解決方案
- `technical_decision` - 技術決策
- `technical_architecture` - 技術架構
- `backend_service` - 後端服務
- `ui_component_library` - UI組件庫
- `security_feature` - 安全功能
- `core_feature` - 核心功能
- `ai_service` - AI服務
- `design_pattern` - 設計模式
- `type_system` - 類型系統
- `data_management` - 數據管理
- `architecture_pattern` - 架構模式

#### 關係類型 (Relation Types)
- `prefers_working_on` - 偏好工作於
- `solved_for` - 為...解決
- `requested_solution_for` - 為...請求解決方案
- `enhances` - 增強
- `requested` - 請求
- `uses` - 使用
- `includes` - 包含
- `implements` - 實現
- `enables` - 啟用
- `supports` - 支持
- `follows` - 遵循
- `integrates_with` - 與...集成

### ⚠️ 重要規則

1. **Observations 限制**: 每個實體的 observations 不得超過 7 個
2. **格式一致性**: 所有 JSON 行必須格式正確
3. **唯一性**: 實體名稱必須唯一
4. **完整性**: 所有必需字段必須存在
5. **文件結尾**: 文件必須以換行符結尾

### 🔧 維護流程

#### 日常維護
1. 使用 Memory Validator 檢查文件狀態
2. 定期運行優化命令清理重複項
3. 創建備份以防數據丟失

#### 添加新記憶
1. 確保新實體符合格式要求
2. 驗證 observations 數量不超標
3. 運行驗證器確認無錯誤

#### 錯誤修復
1. 檢查驗證器報告的錯誤
2. 使用備份恢復損壞的文件
3. 重新運行驗證確認修復

### 📈 最佳實踐

1. **定期驗證**: 每次修改後都運行驗證器
2. **自動備份**: 在重要修改前創建備份
3. **數據清理**: 定期清理重複和過時的 observations
4. **版本控制**: 將記憶文件納入版本控制
5. **文檔同步**: 保持記憶內容與項目文檔同步

### 🚨 故障排除

#### 常見問題

**JSON 解析錯誤**
- 檢查文件格式是否正確
- 確認每行都是有效的 JSON
- 檢查文件編碼

**Observations 超標**
- 合併相似的 observations
- 移除重複項
- 保留最重要的 7 個

**關係引用錯誤**
- 確認引用的實體存在
- 檢查實體名稱拼寫
- 驗證關係類型是否有效

### 📞 支持

如果遇到問題，請：
1. 運行驗證器獲取詳細錯誤信息
2. 檢查本指南的故障排除部分
3. 使用備份恢復到穩定狀態
4. 聯繫開發團隊獲取協助

---

**最後更新**: 2024年12月
**版本**: 1.0.0
