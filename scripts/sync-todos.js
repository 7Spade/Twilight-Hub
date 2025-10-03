#!/usr/bin/env node

/**
 * TODO 同步腳本
 * 掃描專案中的所有 TODO 註解並同步到 docs/TODO-list.md
 * 在每次 Git 提交時自動執行
 */

const fs = require('fs');
const path = require('path');

// 排除的目錄和文件模式
const EXCLUDE_PATTERNS = [
  // IDE 和編輯器配置
  '.playwright-mcp',
  '.cursor',
  '.vscode',
  '.idea',
  '.idx',
  
  // 構建和依賴目錄
  '.next',
  'node_modules',
  'dist',
  'build',
  'out',
  '.pnp',
  '.pnp.*',
  '.yarn',
  
  // 版本控制
  '.git',
  '.husky',
  '.github',
  
  // 文檔目錄（避免掃描自己生成的文檔）
  // 保留 memory-bank 排除，但允許掃描 docs（僅跳過自動生成的文件）
  'memory-bank',
  
  // 測試和覆蓋率
  'coverage',
  '.nyc_output',
  '__tests__',
  'test',
  'tests',
  'spec',
  'specs',
  
  // 日誌和臨時文件
  '*.log',
  '*.tmp',
  '*.temp',
  '.modified',
  
  // 系統文件
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  
  // 環境變量文件
  '.env',
  '.env.*',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  '*.swp',
  '*.swo',
  '*~',
  
  // 部署和雲端配置
  '.vercel',
  '.netlify',
  '.firebase',
  'firebase-debug.log',
  'firestore-debug.log',
  
  // 文檔和配置生成文件
  '*.md.map',
  'tsconfig.tsbuildinfo',
  'next-env.d.ts',
  
  // 其他開發工具
  '.genkit',
  '.eslintcache',
  '.stylelintcache',
  '.prettiercache',
  '*.pem',
  '*.key',
  '*.crt',
  '*.p12',
  '*.pfx'
];

// 支持的文件擴展名
const SUPPORTED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte',
  '.md', '.mdx',
  '.json', '.yaml', '.yml',
  '.css', '.scss', '.sass', '.less',
  '.html', '.htm',
  '.py', '.java', '.cpp', '.c', '.h',
  '.php', '.rb', '.go', '.rs', '.swift',
  '.kt', '.scala', '.clj', '.hs', '.ml'
];

// TODO 正則表達式模式 - 改進版本，避免重複匹配
const TODO_PATTERNS = [
  // JavaScript/TypeScript 單行註解 - 更精確的匹配
  { pattern: /^[ \t]*\/\/\s*(TODO|FIXME|HACK|NOTE):?\s*(.+)$/gm, type: 'js-single' },
  
  // JavaScript/TypeScript 多行註解 - 改進匹配
  { pattern: /\/\*\s*(TODO|FIXME|HACK|NOTE):?\s*(.+?)\s*\*\//gs, type: 'js-multi' },
  
  // Markdown TODO 列表 - 更精確的匹配
  { pattern: /^[-*+]\s*\[\s*\]\s*(.+)$/gm, type: 'md-checkbox' },
  { pattern: /^[-*+]\s*\[\s*x\s*\]\s*(.+)$/gm, type: 'md-checkbox-done' },
  
  // Markdown 標題 TODO - 改進匹配
  { pattern: /^#+\s*(TODO|FIXME|HACK|NOTE):?\s*(.+)$/gm, type: 'md-heading' },
  
  // 其他格式 - 改進匹配
  { pattern: /^[ \t]*#\s*(TODO|FIXME|HACK|NOTE):?\s*(.+)$/gm, type: 'hash' },
  { pattern: /<!--\s*(TODO|FIXME|HACK|NOTE):?\s*(.+?)\s*-->/gs, type: 'html-comment' }
];

// TODO 狀態標記模式
const TODO_STATUS_PATTERNS = [
  // 已完成的標記
  { pattern: /\[DONE\]/gi, status: 'completed' },
  { pattern: /\[COMPLETED\]/gi, status: 'completed' },
  { pattern: /\[FIXED\]/gi, status: 'completed' },
  { pattern: /\[RESOLVED\]/gi, status: 'completed' },
  { pattern: /\[CLOSED\]/gi, status: 'completed' },
  
  // 進行中的標記
  { pattern: /\[IN_PROGRESS\]/gi, status: 'in_progress' },
  { pattern: /\[WIP\]/gi, status: 'in_progress' },
  { pattern: /\[WORKING\]/gi, status: 'in_progress' },
  
  // 被阻塞的標記
  { pattern: /\[BLOCKED\]/gi, status: 'blocked' },
  { pattern: /\[WAITING\]/gi, status: 'blocked' },
  { pattern: /\[PENDING\]/gi, status: 'blocked' },
  
  // 已取消的標記
  { pattern: /\[CANCELLED\]/gi, status: 'cancelled' },
  { pattern: /\[CANCELED\]/gi, status: 'cancelled' },
  { pattern: /\[SKIP\]/gi, status: 'cancelled' }
];

// 自動清理的 TODO 模式（這些會被自動標記為完成）- 更保守的策略
const AUTO_CLEANUP_PATTERNS = [
  // 明確標記為已完成的項目
  /\[DONE\]/gi,
  /\[COMPLETED\]/gi,
  /\[FIXED\]/gi,
  /\[RESOLVED\]/gi,
  /\[CLOSED\]/gi,
  
  // 明確標記為已取消的項目
  /\[CANCELLED\]/gi,
  /\[CANCELED\]/gi,
  /\[SKIP\]/gi,
  
  // 已修復的編碼問題（更精確的匹配）
  /修復 UTF-8 編碼問題.*\[DONE\]/gi,
  /修復.*編碼問題.*\[DONE\]/gi,
  
  // 已完成的清理工作（需要明確標記）
  /清理.*\[DONE\]/gi,
  /移除.*\[DONE\]/gi,
  /修復.*\[DONE\]/gi,
  
  // 已實現的功能（需要明確標記）
  /實現.*\[DONE\]/gi,
  /添加.*\[DONE\]/gi,
  /創建.*\[DONE\]/gi
];

/**
 * 檢查路徑是否應該被排除
 */
function shouldExclude(filePath, fileName) {
  // 跳過自動生成的文檔，避免自引用
  const generatedDocs = [
    'docs/Commands/TODO-list.md',
  ];
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (generatedDocs.some((p) => normalizedPath.endsWith(p))) {
    return true;
  }

  // 檢查排除模式
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      // 處理通配符模式
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(fileName) || regex.test(filePath)) {
        return true;
      }
    } else {
      // 精確匹配
      if (fileName === pattern || filePath.includes(pattern)) {
        return true;
      }
    }
  }

  // 檢查文件擴展名
  const ext = path.extname(fileName);
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return true;
  }

  return false;
}

/**
 * 檢查目錄是否應該被排除（不依賴副檔名）
 */
function shouldExcludeDir(dirPath, dirName) {
  // 跳過特定自動生成的目錄（目前無）
  const normalizedPath = dirPath.replace(/\\/g, '/');

  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(dirName) || regex.test(normalizedPath)) {
        return true;
      }
    } else {
      if (dirName === pattern || normalizedPath.includes(pattern)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 檢查 TODO 是否應該被自動清理
 */
function shouldAutoCleanup(todoText) {
  return AUTO_CLEANUP_PATTERNS.some(pattern => pattern.test(todoText));
}

/**
 * 提取 TODO 狀態標記
 */
function extractTodoStatus(todoText) {
  for (const { pattern, status } of TODO_STATUS_PATTERNS) {
    if (pattern.test(todoText)) {
      return status;
    }
  }
  return 'pending';
}

/**
 * 提取優先級和分類標籤
 */
function extractPriorityAndTags(todoText) {
  const priorityPatterns = [
    { pattern: /\[P0\]/gi, priority: 'high' },
    { pattern: /\[P1\]/gi, priority: 'high' },
    { pattern: /\[P2\]/gi, priority: 'medium' },
    { pattern: /\[P3\]/gi, priority: 'low' },
    { pattern: /\[CRITICAL\]/gi, priority: 'high' },
    { pattern: /\[URGENT\]/gi, priority: 'high' }
  ];
  
  const categoryPatterns = [
    { pattern: /\[BUG\]/gi, category: 'bug' },
    { pattern: /\[FEATURE\]/gi, category: 'feature' },
    { pattern: /\[REFACTOR\]/gi, category: 'refactor' },
    { pattern: /\[DOCS\]/gi, category: 'docs' },
    { pattern: /\[TEST\]/gi, category: 'test' },
    { pattern: /\[PERF\]/gi, category: 'performance' },
    { pattern: /\[SECURITY\]/gi, category: 'security' },
    { pattern: /\[CLEANUP\]/gi, category: 'cleanup' },
    { pattern: /\[AUTH\]/gi, category: 'auth' },
    { pattern: /\[UI\]/gi, category: 'ui' },
    { pattern: /\[API\]/gi, category: 'api' },
    { pattern: /\[DB\]/gi, category: 'database' },
    { pattern: /\[CONFIG\]/gi, category: 'config' },
    { pattern: /\[DEPLOY\]/gi, category: 'deploy' }
  ];
  
  let priority = 'medium';
  const categories = [];
  
  // 檢查優先級
  for (const { pattern, priority: p } of priorityPatterns) {
    if (pattern.test(todoText)) {
      priority = p;
      break;
    }
  }
  
  // 檢查分類
  for (const { pattern, category } of categoryPatterns) {
    if (pattern.test(todoText)) {
      categories.push(category);
    }
  }
  
  return { priority, categories };
}

/**
 * 從文件內容中提取 TODO - 改進版本，支持去重和更好的解析
 */
function extractTodosFromContent(content, filePath) {
  const todos = [];
  const seenTodos = new Set(); // 用於去重
  
  TODO_PATTERNS.forEach(({ pattern, type }) => {
    let match;
    
    // 重置正則表達式的 lastIndex
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      const todoType = match[1] || 'TODO';
      const todoText = match[2] || match[1] || '';
      
      if (todoText.trim()) {
        // 計算行號
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        
        // 創建唯一標識符用於去重
        const uniqueId = `${filePath}:${lineNumber}:${todoText.trim()}`;
        
        if (seenTodos.has(uniqueId)) {
          continue; // 跳過重複的 TODO
        }
        seenTodos.add(uniqueId);
        
        // 檢查是否應該自動清理
        if (shouldAutoCleanup(todoText)) {
          console.log(`🧹 自動清理 TODO: ${filePath}:${lineNumber} - ${todoText.substring(0, 50)}...`);
          continue; // 跳過這個 TODO
        }
        
        // 提取狀態標記
        const status = extractTodoStatus(todoText);
        
        // 提取優先級和分類
        const { priority, categories } = extractPriorityAndTags(todoText);
        
        // 如果 TODO 已標記為完成，調整優先級
        if (status === 'completed') {
          priority = 'low';
        }
        
        todos.push({
          text: todoText.trim(),
          file: filePath,
          line: lineNumber,
          type: type,
          todoType: todoType,
          priority: priority,
          categories: categories,
          status: status,
          raw: match[0],
          uniqueId: uniqueId
        });
      }
    }
  });
  
  return todos;
}

/**
 * 掃描目錄中的所有 TODO
 */
function scanTodos(dirPath, relativePath = '') {
  const todos = [];
  
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativeFilePath = path.join(relativePath, item.name).replace(/\\/g, '/');

      if (item.isDirectory()) {
        // 目錄：只檢查是否屬於排除名單，不做副檔名判斷
        if (shouldExcludeDir(fullPath, item.name)) {
          continue;
        }
        // 遞歸掃描子目錄
        const subTodos = scanTodos(fullPath, relativeFilePath);
        todos.push(...subTodos);
      } else {
        // 掃描文件
        if (shouldExclude(fullPath, item.name)) {
          continue;
        }
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const fileTodos = extractTodosFromContent(content, relativeFilePath);
          todos.push(...fileTodos);
        } catch (error) {
          // 忽略無法讀取的文件（二進制文件等）
          if (error.code !== 'EISDIR') {
            console.warn(`⚠️  無法讀取文件: ${relativeFilePath}`);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  無法掃描目錄: ${relativePath}`);
  }

  return todos;
}

/**
 * 按優先級分組 TODO
 */
function groupTodosByPriority(todos) {
  const groups = {
    high: [],
    medium: [],
    low: []
  };

  todos.forEach(todo => {
    // 只顯示未完成的 TODO
    if (todo.status !== 'completed' && todo.status !== 'cancelled') {
      groups[todo.priority].push(todo);
    }
  });

  return groups;
}

/**
 * 按狀態分組 TODO
 */
function groupTodosByStatus(todos) {
  const groups = {
    pending: [],
    in_progress: [],
    completed: [],
    blocked: [],
    cancelled: []
  };

  todos.forEach(todo => {
    if (groups[todo.status]) {
      groups[todo.status].push(todo);
    }
  });

  return groups;
}

/**
 * 獲取狀態圖標
 */
function getStatusIcon(status) {
  const icons = {
    pending: '⏳',
    in_progress: '🔄',
    completed: '✅',
    blocked: '🚫',
    cancelled: '❌'
  };
  return icons[status] || '⏳';
}

/**
 * 按文件類型分組 TODO
 */
function groupTodosByFileType(todos) {
  const groups = {};

  todos.forEach(todo => {
    // 只顯示未完成的 TODO
    if (todo.status !== 'completed' && todo.status !== 'cancelled') {
      const ext = path.extname(todo.file);
      const category = getFileCategory(ext);
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(todo);
    }
  });

  return groups;
}

/**
 * 根據文件擴展名確定文件類別
 */
function getFileCategory(ext) {
  const categories = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript React',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript React',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.md': 'Markdown',
    '.mdx': 'MDX',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.html': 'HTML',
    '.htm': 'HTML',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.h': 'C Header',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.clj': 'Clojure',
    '.hs': 'Haskell',
    '.ml': 'OCaml'
  };

  return categories[ext] || 'Other';
}

/**
 * 按分類分組 TODO
 */
function groupTodosByCategory(todos) {
  const groups = {};
  
  todos.forEach(todo => {
    if (todo.status !== 'completed' && todo.status !== 'cancelled') {
      if (todo.categories.length === 0) {
        if (!groups['uncategorized']) {
          groups['uncategorized'] = [];
        }
        groups['uncategorized'].push(todo);
      } else {
        todo.categories.forEach(category => {
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(todo);
        });
      }
    }
  });
  
  return groups;
}

/**
 * 生成 TODO 列表 Markdown 內容 - 改進版本
 */
function generateTodoListMarkdown(todos) {
  const timestamp = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const priorityGroups = groupTodosByPriority(todos);
  const statusGroups = groupTodosByStatus(todos);
  const fileTypeGroups = groupTodosByFileType(todos);
  const categoryGroups = groupTodosByCategory(todos);
  
  const totalCount = todos.length;
  const highCount = priorityGroups.high.length;
  const mediumCount = priorityGroups.medium.length;
  const lowCount = priorityGroups.low.length;
  
  const pendingCount = statusGroups.pending.length;
  const inProgressCount = statusGroups.in_progress.length;
  const completedCount = statusGroups.completed.length;
  const blockedCount = statusGroups.blocked.length;
  const cancelledCount = statusGroups.cancelled.length;

  let content = `# TODO 列表

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: ${timestamp}

## 📊 統計信息

- **總計**: ${totalCount} 個 TODO
- **高優先級**: ${highCount} 個
- **中優先級**: ${mediumCount} 個  
- **低優先級**: ${lowCount} 個

## 📈 狀態分布

- **待處理**: ${pendingCount} 個
- **進行中**: ${inProgressCount} 個
- **已完成**: ${completedCount} 個
- **被阻塞**: ${blockedCount} 個
- **已取消**: ${cancelledCount} 個

## 🧹 自動清理提醒

> **注意**: 腳本會自動清理以下類型的 TODO：
> - 包含「已修復」、「已完成」、「已實現」等完成標記的項目
> - 標記為 \`[DONE]\`、\`[COMPLETED]\`、\`[FIXED]\` 的項目
> - 標記為 \`[CANCELLED]\`、\`[SKIP]\` 的項目
> 
> 請在處理 TODO 後添加適當的狀態標記，避免重複累積。

`;

  // 按優先級分組顯示
  if (highCount > 0) {
    content += `## 🔴 高優先級 (${highCount} 個)

`;
    priorityGroups.high.forEach(todo => {
      const statusIcon = getStatusIcon(todo.status);
      content += `- [ ] \`${todo.file}:${todo.line}\` ${statusIcon} ${todo.text}\n`;
    });
    content += '\n';
  }

  if (mediumCount > 0) {
    content += `## 🟡 中優先級 (${mediumCount} 個)

`;
    priorityGroups.medium.forEach(todo => {
      const statusIcon = getStatusIcon(todo.status);
      content += `- [ ] \`${todo.file}:${todo.line}\` ${statusIcon} ${todo.text}\n`;
    });
    content += '\n';
  }

  if (lowCount > 0) {
    content += `## 🟢 低優先級 (${lowCount} 個)

`;
    priorityGroups.low.forEach(todo => {
      const statusIcon = getStatusIcon(todo.status);
      content += `- [ ] \`${todo.file}:${todo.line}\` ${statusIcon} ${todo.text}\n`;
    });
    content += '\n';
  }

  // 按分類分組顯示
  content += `## 🏷️ 按分類分組

`;
  const categoryOrder = ['bug', 'feature', 'refactor', 'cleanup', 'docs', 'test', 'performance', 'security', 'auth', 'ui', 'api', 'database', 'config', 'deploy', 'uncategorized'];
  categoryOrder.forEach(category => {
    if (categoryGroups[category] && categoryGroups[category].length > 0) {
      const categoryName = category === 'uncategorized' ? '未分類' : category.toUpperCase();
      content += `### ${categoryName} (${categoryGroups[category].length} 個)

`;
      categoryGroups[category].forEach(todo => {
        const statusIcon = getStatusIcon(todo.status);
        const priorityIcon = todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢';
        content += `- [ ] \`${todo.file}:${todo.line}\` ${statusIcon} ${priorityIcon} ${todo.text}\n`;
      });
      content += '\n';
    }
  });

  // 按文件類型分組顯示
  content += `## 📁 按文件類型分組

`;
  Object.keys(fileTypeGroups).sort().forEach(category => {
    const categoryTodos = fileTypeGroups[category];
    if (categoryTodos.length > 0) {
      content += `### ${category} (${categoryTodos.length} 個)

`;
      categoryTodos.forEach(todo => {
        const statusIcon = getStatusIcon(todo.status);
        const priorityIcon = todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢';
        content += `- [ ] \`${todo.file}:${todo.line}\` ${statusIcon} ${priorityIcon} ${todo.text}\n`;
      });
      content += '\n';
    }
  });

  content += `## 🤖 自動化說明

此文件通過 Git pre-commit hook 自動更新，確保 TODO 列表始終保持最新狀態。

### 更新觸發條件
- 每次 Git 提交時
- 專案中 TODO 註解發生變化時
- 手動執行 \`npm run todos:sync\` 時

### 手動更新
\`\`\`bash
npm run todos:sync
\`\`\`

### 支持的 TODO 格式
- JavaScript/TypeScript: \`// TODO: 內容\`, \`/* TODO: 內容 */\`
- Markdown: \`- [ ] 內容\`, \`# TODO: 內容\`
- 其他: \`# TODO: 內容\`, \`<!-- TODO: 內容 -->\`

### 狀態標記支持
- **完成**: \`[DONE]\`, \`[COMPLETED]\`, \`[FIXED]\`, \`[RESOLVED]\`, \`[CLOSED]\`
- **進行中**: \`[IN_PROGRESS]\`, \`[WIP]\`, \`[WORKING]\`
- **被阻塞**: \`[BLOCKED]\`, \`[WAITING]\`, \`[PENDING]\`
- **已取消**: \`[CANCELLED]\`, \`[CANCELED]\`, \`[SKIP]\`

### 自動清理功能
腳本會自動清理以下類型的 TODO：
- 包含「已修復」、「已完成」、「已實現」等完成標記的項目
- 標記為完成狀態的項目
- 標記為已取消的項目

### 使用建議
1. 處理 TODO 後，請添加適當的狀態標記
2. 使用 \`[DONE]\` 標記已完成的項目
3. 使用 \`[IN_PROGRESS]\` 標記正在處理的項目
4. 使用 \`[BLOCKED]\` 標記被阻塞的項目
5. 定期檢查和更新 TODO 狀態，避免累積過多
`;

  return content;
}

/**
 * 同步 TODO 列表
 */
function syncTodos() {
  const rootPath = process.cwd();
  const outputPath = path.join(rootPath, 'docs', 'Commands', 'TODO-list.md');
  
  // 確保 docs 目錄存在
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('🔍 掃描專案中的 TODO...');
  const allTodos = scanTodos(rootPath);
  
  // 統計清理的 TODO
  let cleanedCount = 0;
  const todos = allTodos.filter(todo => {
    if (shouldAutoCleanup(todo.text)) {
      cleanedCount++;
      return false;
    }
    return true;
  });
  
  if (allTodos.length === 0) {
    console.log('✅ 未發現任何 TODO');
  } else {
    console.log(`✅ 發現 ${allTodos.length} 個 TODO`);
    if (cleanedCount > 0) {
      console.log(`🧹 自動清理了 ${cleanedCount} 個已完成的 TODO`);
    }
    console.log(`📋 顯示 ${todos.length} 個活躍的 TODO`);
  }

  const content = generateTodoListMarkdown(todos);
  
  try {
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`✅ TODO 列表已更新: ${outputPath}`);
  } catch (error) {
    console.error('❌ 更新 TODO 列表時發生錯誤:', error.message);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  try {
    syncTodos();
  } catch (error) {
    console.error('❌ 同步 TODO 時發生錯誤:', error.message);
    process.exit(1);
  }
}

module.exports = { syncTodos };
