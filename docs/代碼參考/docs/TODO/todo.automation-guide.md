# 🚀 TODO 自動化完整指南

讓 AI Agent 自動理解和處理你的 TODO，零認知難度！

---

## 📦 快速開始

### 1. 安裝工具

```bash
# 將 todo-scanner.ts 放到專案根目錄的 scripts/ 資料夾
mkdir -p scripts
# 複製 todo-scanner.ts 到 scripts/

# 安裝依賴（如果需要）
npm install -D @types/node tsx
```

### 2. 設定 package.json

```json
{
  "scripts": {
    "todo:scan": "tsx scripts/todo-scanner.ts",
    "todo:watch": "nodemon --watch 'src/**/*.{ts,tsx}' --exec 'npm run todo:scan'",
    "todo:ai": "cat .todo-reports/ai-prompt-$(date +%Y-%m-%d).md | pbcopy && echo '✅ AI 指令已複製到剪貼簿'"
  }
}
```

### 3. 執行掃描

```bash
# 掃描專案
npm run todo:scan

# 監聽模式（檔案變更時自動掃描）
npm run todo:watch

# 複製 AI 指令到剪貼簿
npm run todo:ai
```

---

## 📂 生成的報告檔案

執行掃描後，會在 `.todo-reports/` 目錄生成三種報告：

### 1. `todo-report-YYYY-MM-DD.md`
**用途：** 人類閱讀  
**格式：** Markdown，包含統計圖表和分組清單

```markdown
# 📝 TODO 報告

## 📊 統計摘要
- 總計: 23 個項目
- 🔴 緊急: 3 個項目

### 依優先級
- P0: 3 個
- P1: 8 個
- P2: 10 個
- P3: 2 個
```

### 2. `todo-report-YYYY-MM-DD.json`
**用途：** 程式處理、CI/CD 整合  
**格式：** 結構化 JSON

```json
{
  "summary": {
    "total": 23,
    "byPriority": { "P0": 3, "P1": 8 },
    "urgent": 3
  },
  "todos": [...]
}
```

### 3. `ai-prompt-YYYY-MM-DD.md`
**用途：** 直接餵給 AI Agent  
**格式：** 包含上下文和指令的提示詞

---

## 🤖 AI Agent 使用流程

### 方法 1：直接餵入 AI（推薦）

```bash
# 1. 掃描專案
npm run todo:scan

# 2. 打開 AI 聊天（Claude、ChatGPT 等）

# 3. 貼上指令：
"請閱讀以下 TODO 報告，並按照優先級開始處理"

# 4. 貼上 ai-prompt-YYYY-MM-DD.md 的完整內容
```

### 方法 2：使用 AI CLI 工具

```bash
# 使用 Claude CLI（需安裝 claude-cli）
cat .todo-reports/ai-prompt-2025-10-03.md | claude "請處理這些 TODO"

# 使用 GitHub Copilot CLI
gh copilot suggest -t shell "處理 .todo-reports/ai-prompt-2025-10-03.md 中的 P0 項目"
```

### 方法 3：自動化腳本

創建 `scripts/ai-auto-fix.sh`：

```bash
#!/bin/bash

# 掃描 TODO
npm run todo:scan

# 取得最新報告
LATEST_REPORT=$(ls -t .todo-reports/ai-prompt-*.md | head -1)

# 餵給 AI（需要你的 AI API）
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 4096,
    "messages": [{
      "role": "user",
      "content": "請閱讀以下 TODO 並生成修復方案：\n\n'"$(cat $LATEST_REPORT)"'"
    }]
  }'
```

---

## 📊 AI Agent 自動理解的資訊

AI 掃描報告後，會自動知道：

### ✅ 立即可見的資訊

1. **優先級排序** - 自動按 P0 → P1 → P2 → P3 排序
2. **緊急程度** - 標記過期和 P0 項目
3. **檔案位置** - 精確的檔案路徑和行號
4. **程式碼上下文** - 前後 3-10 行程式碼
5. **詳細說明** - 收集所有註解細節
6. **負責人** - 自動識別 @assignee
7. **截止日期** - 自動計算是否過期

### 🎯 AI 會自動建議

- 先處理 SECURITY 和 P0
- 相似的 TODO 可以批次處理
- 哪些 TODO 可以用工具自動生成（如測試）
- 哪些需要人工決策

---

## 🔄 整合到開發流程

### 1. Git Hooks（提交前檢查）

創建 `.husky/pre-commit`：

```bash
#!/bin/sh

# 掃描 TODO
npm run todo:scan

# 檢查緊急項目
URGENT=$(cat .todo-reports/todo-report-*.json | jq '.summary.urgent')

if [ "$URGENT" -gt 5 ]; then
  echo "⚠️  警告: 有 $URGENT 個緊急 TODO，建議先處理！"
  echo "執行 'npm run todo:ai' 取得 AI 處理指令"
  exit 1
fi
```

### 2. CI/CD 整合（GitHub Actions）

創建 `.github/workflows/todo-check.yml`：

```yaml
name: TODO Check

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: 掃描 TODO
        run: npm run todo:scan
      
      - name: 檢查緊急項目
        run: |
          URGENT=$(cat .todo-reports/todo-report-*.json | jq '.summary.urgent')
          echo "緊急項目數: $URGENT"
          
          if [ "$URGENT" -gt 0 ]; then
            echo "::warning::有 $URGENT 個緊急 TODO 需要處理"
          fi
      
      - name: 上傳報告
        uses: actions/upload-artifact@v3
        with:
          name: todo-reports
          path: .todo-reports/
```

### 3. VS Code 快速鍵

在 `.vscode/tasks.json` 新增：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "掃描 TODO",
      "type": "shell",
      "command": "npm run todo:scan",
      "problemMatcher": []
    },
    {
      "label": "開啟 AI 指令",
      "type": "shell",
      "command": "code .todo-reports/ai-prompt-$(date +%Y-%m-%d).md",
      "problemMatcher": []
    }
  ]
}
```

快速鍵：`Cmd+Shift+P` → `Tasks: Run Task` → `掃描 TODO`

---

## 🎨 進階自動化

### 1. 自動生成修復分支

創建 `scripts/auto-branch.sh`：

```bash
#!/bin/bash

# 掃描 TODO
npm run todo:scan

# 讀取第一個 P0 項目
FIRST_TODO=$(cat .todo-reports/todo-report-*.json | jq -r '.todos[0]')
TYPE=$(echo $FIRST_TODO | jq -r '.type')
DESC=$(echo $FIRST_TODO | jq -r '.description' | sed 's/ /-/g')

# 建立分支
BRANCH="$TYPE-$DESC"
git checkout -b "$BRANCH"

echo "✅ 已建立分支: $BRANCH"
echo "📝 請處理: $(echo $FIRST_TODO | jq -r '.file'):$(echo $FIRST_TODO | jq -r '.line')"
```

### 2. 自動生成測試檔案

當 AI 看到 `[P1] TEST` 的 TODO，可以自動生成：

```typescript
// AI 讀到這個 TODO：
// TODO: [P1] TEST app/api/users/route.ts
// 需要測試 GET 和 POST 端點

// AI 自動生成 app/api/users/route.test.ts：
import { GET, POST } from './route'

describe('/api/users', () => {
  it('should return users list', async () => {
    // ...
  })
})
```

### 3. 智能提醒系統

創建 `scripts/todo-reminder.sh`（配合 cron）：

```bash
#!/bin/bash

# 每天早上 9:00 執行
# crontab: 0 9 * * * /path/to/todo-reminder.sh

npm run todo:scan

URGENT=$(cat .todo-reports/todo-report-*.json | jq '.summary.urgent')
DEADLINE=$(cat .todo-reports/todo-report-*.json | jq -r '.todos[] | select(.deadline != null) | .deadline' | sort | head -1)

if [ "$URGENT" -gt 0 ]; then
  # 發送 Slack 通知
  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"⚠️ 有 $URGENT 個緊急 TODO！最近截止日期：$DEADLINE\"}"
fi
```

---

## 🧪 實際案例

### 案例 1：AI 自動修復 Bug

```bash
# 1. 掃描發現 P0 Bug
npm run todo:scan

# 2. AI 讀取報告
# 報告顯示：
# [P0] FIX app/checkout/page.tsx:45
# Stripe webhook 未處理 payment_intent.succeeded

# 3. AI 自動生成修復
AI 看到上下文程式碼，直接生成：
- 修復 webhook 處理邏輯
- 新增錯誤處理
- 補充測試

# 4. 人工確認後提交
```

### 案例 2：批次生成文件

```bash
# AI 發現多個 [P2] DOCS 的 TODO
# 自動生成所有缺少的 API 文件
# 統一格式和風格
```

### 案例 3：重構建議

```bash
# AI 分析多個 [P2] REFACTOR
# 發現它們都指向相同的問題
# 提供統一的重構方案
```

---

## 📊 效益評估

### 傳統方式 vs 自動化方式

| 項目 | 傳統方式 | 自動化方式 | 節省時間 |
|------|----------|------------|----------|
| 找出所有 TODO | 手動搜尋，10 分鐘 | 自動掃描，5 秒 | **99%** |
| 理解優先級 | 逐個閱讀，30 分鐘 | 自動排序，0 秒 | **100%** |
| 準備 AI 提示詞 | 手動整理，15 分鐘 | 自動生成，0 秒 | **100%** |
| 追蹤進度 | Excel/Notion，5 分鐘/天 | JSON 報告，自動 | **100%** |

**總計：每天節省 50+ 分鐘** ⏰

---

## 🎯 最佳實踐

### ✅ DO

1. **每次提交前掃描** - 確保 TODO 更新
2. **定期檢視 AI 報告** - 每週一次
3. **善用 AI 批次處理** - 相似的 TODO 一起解決
4. **保持 TODO 新鮮度** - 完成就刪除
5. **使用統一格式** - 讓 AI 更容易理解

### ❌ DON'T

1. **不要堆積 P0** - 應立即處理
2. **不要忽略過期項目** - 重新評估優先級
3. **不要省略細節** - AI 需要上下文才能幫忙
4. **不要手動整理** - 讓工具自動化
5. **不要跳過掃描** - 自動化是為了減輕負擔

---

## 🛠️ 實用腳本集合

### 1. 快速啟動腳本

創建 `scripts/todo-quickstart.sh`：

```bash
#!/bin/bash
echo "🚀 TODO 自動化快速啟動"
echo ""

# 1. 掃描專案
echo "📊 步驟 1/3: 掃描專案..."
npm run todo:scan

# 2. 顯示摘要
echo ""
echo "📈 步驟 2/3: 統計摘要"
TOTAL=$(cat .todo-reports/todo-report-*.json | jq '.summary.total')
URGENT=$(cat .todo-reports/todo-report-*.json | jq '.summary.urgent')
P0=$(cat .todo-reports/todo-report-*.json | jq '.summary.byPriority.P0 // 0')

echo "   總 TODO: $TOTAL 個"
echo "   緊急項目: $URGENT 個"
echo "   P0 項目: $P0 個"

# 3. 提供下一步建議
echo ""
echo "🎯 步驟 3/3: 下一步建議"

if [ "$URGENT" -gt 0 ]; then
  echo "   ⚠️  建議立即處理緊急項目！"
  echo "   執行: npm run todo:ai"
  echo "   然後將指令貼給 AI Agent"
else
  echo "   ✅ 目前沒有緊急項目"
  echo "   可以查看完整報告: .todo-reports/todo-report-*.md"
fi
```

### 2. AI 對話生成器

創建 `scripts/generate-ai-conversation.ts`：

```typescript
import * as fs from 'fs';
import * as path from 'path';

/**
 * 生成針對特定 TODO 的 AI 對話模板
 */
function generateAiConversation(todoIndex: number = 0) {
  // 讀取最新報告
  const reportsDir = path.join(process.cwd(), '.todo-reports');
  const files = fs.readdirSync(reportsDir).filter(f => f.startsWith('todo-report-') && f.endsWith('.json'));
  const latestReport = files.sort().reverse()[0];
  
  const report = JSON.parse(
    fs.readFileSync(path.join(reportsDir, latestReport), 'utf-8')
  );
  
  const todo = report.todos[todoIndex];
  
  if (!todo) {
    console.error('找不到指定的 TODO');
    return;
  }
  
  const conversation = `
# AI Agent 對話模板

## 背景資訊
專案: Next.js 專案
當前任務: 處理 TODO #${todoIndex + 1}

## TODO 詳情
- **優先級**: ${todo.priority}
- **類型**: ${todo.type}
- **描述**: ${todo.description}
- **位置**: \`${todo.file}:${todo.line}\`
${todo.assignee ? `- **負責人**: @${todo.assignee}` : ''}
${todo.deadline ? `- **截止日期**: ${todo.deadline}` : ''}

## 詳細說明
${todo.details.map((d: string) => `- ${d}`).join('\n')}

## 程式碼上下文
\`\`\`typescript
${todo.context}
\`\`\`

---

## 🤖 推薦的 AI 提示詞

### 方案 A：完整修復（推薦）
\`\`\`
請幫我處理以上 TODO：

1. 分析問題根源
2. 提供完整的解決方案
3. 包含必要的測試
4. 確保符合 Next.js 最佳實踐

請直接生成可用的程式碼。
\`\`\`

### 方案 B：逐步指導
\`\`\`
請幫我理解這個 TODO：

1. 問題是什麼？
2. 為什麼會發生？
3. 有哪些解決方案？
4. 你推薦哪一種？為什麼？

請用淺顯易懂的方式解釋。
\`\`\`

### 方案 C：程式碼審查
\`\`\`
請審查以上程式碼，針對 TODO 提到的問題：

1. 找出所有潛在問題
2. 評估影響範圍
3. 提供修復建議
4. 評估修復的優先級

請提供詳細的分析。
\`\`\`

---

## 📝 對話範例

**你**: 請使用「方案 A：完整修復」來處理這個 TODO

**AI**: [AI 會提供完整的修復方案]

**你**: 請生成對應的測試檔案

**AI**: [AI 會生成測試]

**你**: 完成後請更新 TODO，標記為已完成

`;

  // 儲存對話模板
  const outputPath = path.join(reportsDir, `ai-conversation-todo-${todoIndex}.md`);
  fs.writeFileSync(outputPath, conversation);
  
  console.log(`✅ AI 對話模板已生成: ${outputPath}`);
  console.log(`📋 可以直接複製內容給 AI Agent 使用`);
}

// 執行
const todoIndex = parseInt(process.argv[2] || '0');
generateAiConversation(todoIndex);
```

使用方式：
```bash
# 為第一個 TODO 生成 AI 對話
tsx scripts/generate-ai-conversation.ts 0

# 為第三個 TODO 生成 AI 對話
tsx scripts/generate-ai-conversation.ts 2
```

### 3. TODO 健康檢查

創建 `scripts/todo-health-check.ts`：

```typescript
import * as fs from 'fs';
import * as path from 'path';

interface HealthReport {
  score: number; // 0-100
  issues: string[];
  recommendations: string[];
}

function checkTodoHealth(): HealthReport {
  const reportsDir = path.join(process.cwd(), '.todo-reports');
  const files = fs.readdirSync(reportsDir).filter(f => f.startsWith('todo-report-') && f.endsWith('.json'));
  const latestReport = files.sort().reverse()[0];
  
  const report = JSON.parse(
    fs.readFileSync(path.join(reportsDir, latestReport), 'utf-8')
  );
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // 檢查 1: 緊急項目過多
  if (report.summary.urgent > 5) {
    score -= 20;
    issues.push(`⚠️ 緊急項目過多 (${report.summary.urgent} 個)`);
    recommendations.push('建議立即處理或重新評估優先級');
  }
  
  // 檢查 2: P0 項目應該 = 0
  const p0Count = report.summary.byPriority.P0 || 0;
  if (p0Count > 0) {
    score -= 30;
    issues.push(`🔴 有 ${p0Count} 個 P0 項目未處理`);
    recommendations.push('P0 應該立即處理，不應該存在超過 1 天');
  }
  
  // 檢查 3: TODO 總數過多
  if (report.summary.total > 50) {
    score -= 15;
    issues.push(`📊 TODO 總數過多 (${report.summary.total} 個)`);
    recommendations.push('建議清理已完成或過時的 TODO');
  }
  
  // 檢查 4: 過期項目
  const today = new Date().toISOString().split('T')[0];
  const overdue = report.todos.filter(
    (t: any) => t.deadline && t.deadline < today
  );
  
  if (overdue.length > 0) {
    score -= 25;
    issues.push(`⏰ 有 ${overdue.length} 個項目已過期`);
    recommendations.push('重新評估過期項目的優先級和可行性');
  }
  
  // 檢查 5: SECURITY 類型應優先處理
  const securityTodos = report.todos.filter((t: any) => t.type === 'SECURITY');
  if (securityTodos.length > 0) {
    score -= 10;
    issues.push(`🔒 有 ${securityTodos.length} 個安全性 TODO`);
    recommendations.push('安全性問題應該優先處理');
  }
  
  return { score: Math.max(0, score), issues, recommendations };
}

// 執行檢查
const health = checkTodoHealth();

console.log('\n🏥 TODO 健康檢查報告');
console.log('='.repeat(50));
console.log(`\n📊 健康分數: ${health.score}/100`);

if (health.score >= 80) {
  console.log('✅ 狀態良好！');
} else if (health.score >= 60) {
  console.log('⚠️ 需要注意');
} else {
  console.log('🔴 需要立即改善');
}

if (health.issues.length > 0) {
  console.log('\n❌ 發現的問題:');
  health.issues.forEach(issue => console.log(`   ${issue}`));
}

if (health.recommendations.length > 0) {
  console.log('\n💡 改善建議:');
  health.recommendations.forEach(rec => console.log(`   ${rec}`));
}

console.log('\n' + '='.repeat(50) + '\n');

// 如果分數低於 60，返回錯誤碼（用於 CI）
process.exit(health.score < 60 ? 1 : 0);
```

### 4. 智能分配器

創建 `scripts/auto-assign.ts`：

```typescript
/**
 * 根據 TODO 類型和團隊成員專長，自動分配負責人
 */

const TEAM_EXPERTISE = {
  john: ['SECURITY', 'FIX', 'PERF'],
  sarah: ['FEAT', 'REFACTOR', 'A11Y'],
  mike: ['TEST', 'DOCS', 'STYLE'],
  alice: ['SEO', 'PERF', 'FEAT'],
};

function autoAssign(todos: any[]) {
  const assignments: Record<string, any[]> = {};
  
  todos.forEach(todo => {
    // 跳過已分配的
    if (todo.assignee) return;
    
    // 找出最適合的人
    let bestMatch = '';
    let maxScore = 0;
    
    for (const [person, expertise] of Object.entries(TEAM_EXPERTISE)) {
      if (expertise.includes(todo.type)) {
        const score = todo.priority === 'P0' ? 10 : 
                     todo.priority === 'P1' ? 5 : 1;
        
        if (score > maxScore) {
          maxScore = score;
          bestMatch = person;
        }
      }
    }
    
    if (bestMatch) {
      if (!assignments[bestMatch]) assignments[bestMatch] = [];
      assignments[bestMatch].push(todo);
    }
  });
  
  // 輸出分配結果
  console.log('\n👥 智能分配結果:\n');
  for (const [person, todos] of Object.entries(assignments)) {
    console.log(`@${person}:`);
    todos.forEach(todo => {
      console.log(`  - [${todo.priority}] ${todo.type}: ${todo.description}`);
      console.log(`    ${todo.file}:${todo.line}`);
    });
    console.log('');
  }
}
```

---

## 🎓 進階技巧

### 技巧 1: 使用標籤過濾

```bash
# 只掃描 SECURITY 相關的 TODO
npm run todo:scan | jq '.todos[] | select(.type=="SECURITY")'

# 找出所有過期的 TODO
npm run todo:scan | jq '.todos[] | select(.deadline < "2025-10-03")'

# 找出特定負責人的 TODO
npm run todo:scan | jq '.todos[] | select(.assignee=="john")'
```

### 技巧 2: 整合 Notion

```typescript
// 自動同步 TODO 到 Notion
import { Client } from '@notionhq/client';

async function syncToNotion(todos: TodoItem[]) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  
  for (const todo of todos) {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID! },
      properties: {
        Title: { title: [{ text: { content: todo.description } }] },
        Priority: { select: { name: todo.priority } },
        Type: { select: { name: todo.type } },
        File: { rich_text: [{ text: { content: todo.file } }] },
        Deadline: todo.deadline ? { date: { start: todo.deadline } } : undefined,
      },
    });
  }
}
```

### 技巧 3: Slack 通知

```bash
# 每日早報
curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' -d @- <<EOF
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "📝 每日 TODO 報告"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*總計*: $(cat .todo-reports/todo-report-*.json | jq '.summary.total') 個\n*緊急*: $(cat .todo-reports/todo-report-*.json | jq '.summary.urgent') 個"
      }
    }
  ]
}
EOF
```

---

## 🎬 完整工作流程範例

### 情境：新功能開發

```bash
# 1. 開始新功能
git checkout -b feat-user-profile

# 2. 加入 TODO
# TODO: [P1] FEAT 實作使用者個人資料編輯
# 需要：表單驗證、頭像上傳、即時預覽

# 3. 掃描並生成 AI 指令
npm run todo:scan
npm run todo:ai

# 4. 餵給 AI
# AI 生成完整的實作方案

# 5. 實作後標記完成
# 刪除 TODO 或改為
# DONE: [P1] FEAT 使用者個人資料編輯 ✅

# 6. 提交前檢查
npm run todo:scan
git add .
git commit -m "feat: 實作使用者個人資料編輯"
```

---

## 📚 參考資源

- [Next.js 文件](https://nextjs.org/docs)
- [Claude API 文件](https://docs.claude.com)
- [jq 命令手冊](https://stedolan.github.io/jq/manual/)
- [GitHub Actions 文件](https://docs.github.com/en/actions)

---

## ❓ 常見問題

### Q: 掃描速度太慢？
A: 在 CONFIG 中增加更多忽略目錄，或使用 `--incremental` 模式只掃描變更的檔案

### Q: AI 理解不了我的 TODO？
A: 確保遵循標準格式，提供足夠的上下文和程式碼範例

### Q: 如何自訂類型標籤？
A: 修改掃描器的 `CONFIG.types` 陣列

### Q: 可以用在其他框架嗎？
A: 可以！只需要調整檔案副檔名和路徑規則

---

**版本**: 2.0.0  
**更新日期**: 2025-10-03  
**作者**: TODO 自動化團隊