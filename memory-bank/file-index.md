# Memory Bank 文件索引

## 文件分類和大小

### 🔥 核心狀態文件 (優先讀取)
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `activeContext.md` | 63 | 當前活動上下文 | 高 |
| `progress.md` | 79 | 項目進度追蹤 | 高 |
| `completed-work.md` | 131 | 已完成工作記錄 | 中 |

### 📋 項目管理文件
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `projectbrief.md` | 71 | 項目概述 | 低 |
| `tasks.md` | 108 | 任務追蹤 | 中 |
| `architecture-decisions.md` | 339 | 架構決策記錄 | 低 |

### 🎨 設計文檔 (按需讀取)
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `creative-firebase-architecture.md` | 519 | Firebase 架構設計 | 低 |
| `creative-auth-uiux.md` | 508 | 認證系統 UI/UX 設計 | 低 |
| `creative-system-integration.md` | 694 | 系統集成設計 | 低 |
| `creative-security-design.md` | 781 | 安全策略設計 | 低 |

### 🔧 技術參考文件
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `techContext.md` | 97 | 技術上下文 | 低 |
| `systemPatterns.md` | 222 | 系統模式 | 低 |
| `style-guide.md` | 193 | 樣式指南 | 低 |
| `technicalImplementationGuide.md` | 722 | 技術實施指南 | 低 |

### 📊 清單和報告文件
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `featureInventory.md` | 203 | 功能清單 | 低 |
| `functionInventory.md` | 162 | 函數清單 | 低 |
| `fileNamingConventions.md` | 225 | 檔案命名規範 | 低 |
| `projectStructureTree.md` | 394 | 項目結構樹 | 低 |

### 📝 QA 和反思文件
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `qaReport.md` | 115 | QA 一致性檢查報告 | 低 |
| `qa-validation-report.md` | 89 | QA 驗證報告 | 低 |
| `finalQaReport.md` | 135 | 最終 QA 報告 | 低 |
| `reflection-twilight-hub-refactor.md` | 304 | 反思文檔 | 低 |

### 🧠 記憶體文件
| 文件名 | 行數 | 用途 | 更新頻率 |
|--------|------|------|----------|
| `memory.json` | 498 | 核心記憶體知識圖譜 | 中 |
| `memory-clean.json` | 60 | 清理版記憶體 | 低 |
| `memory.backup.json` | 106 | 記憶體備份 | 低 |
| `monitor.json` | 9 | 監控配置 | 低 |

## 讀取優先級

### Level 1: 核心狀態 (必須讀取)
1. `activeContext.md` - 了解當前狀態
2. `progress.md` - 了解進度
3. `completed-work.md` - 了解已完成工作

### Level 2: 項目概覽 (建議讀取)
1. `projectbrief.md` - 項目概述
2. `core-summary.md` - 核心摘要
3. `tasks.md` - 任務狀態

### Level 3: 設計參考 (按需讀取)
1. `architecture-decisions.md` - 架構決策
2. 創意設計文檔 - 具體設計方案
3. 技術參考文檔 - 技術細節

### Level 4: 詳細文檔 (深度研究時讀取)
1. `technicalImplementationGuide.md` - 技術實施指南
2. `reflection-twilight-hub-refactor.md` - 反思文檔
3. 各種清單和報告文檔

## 認知成本優化建議

### 高認知成本文件 (>500 lines)
- `creative-security-design.md` (781 lines)
- `technicalImplementationGuide.md` (722 lines)
- `creative-system-integration.md` (694 lines)
- `creative-firebase-architecture.md` (519 lines)
- `creative-auth-uiux.md` (508 lines)

**建議**: 先讀取摘要，再按需深入

### 中認知成本文件 (200-500 lines)
- `projectStructureTree.md` (394 lines)
- `architecture-decisions.md` (339 lines)
- `reflection-twilight-hub-refactor.md` (304 lines)

**建議**: 分段讀取，重點關注相關部分

### 低認知成本文件 (<200 lines)
- 核心狀態文件
- 項目管理文件
- 技術參考文件

**建議**: 可以完整讀取

## 快速導航

### 開發新功能時
1. 讀取 `activeContext.md` 了解當前狀態
2. 查看 `architecture-decisions.md` 了解架構原則
3. 參考對應的創意設計文檔
4. 更新 `progress.md` 和 `tasks.md`

### 問題排查時
1. 查看 `qa-validation-report.md` 了解已知問題
2. 參考 `reflection-twilight-hub-refactor.md` 了解經驗教訓
3. 查看相關技術文檔

### 項目回顧時
1. 讀取 `completed-work.md` 了解已完成工作
2. 查看 `reflection-twilight-hub-refactor.md` 了解經驗總結
3. 更新 `memory.json` 進化記憶體

## 文件維護建議

### 定期更新
- 核心狀態文件 (每次開發會話)
- 進度文件 (每個階段)
- 記憶體文件 (重要里程碑)

### 按需更新
- 設計文檔 (架構變更時)
- 技術參考文件 (技術棧變更時)
- 清單和報告文件 (功能變更時)

### 歸檔處理
- 已完成的創意設計文檔
- 歷史 QA 報告
- 舊版本的反思文檔
