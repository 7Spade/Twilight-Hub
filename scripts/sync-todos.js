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
  'docs',
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

// TODO 正則表達式模式
const TODO_PATTERNS = [
  // JavaScript/TypeScript 單行註解
  { pattern: /\/\/\s*TODO:?\s*(.+)/gi, type: 'js-single' },
  { pattern: /\/\/\s*FIXME:?\s*(.+)/gi, type: 'js-single' },
  { pattern: /\/\/\s*HACK:?\s*(.+)/gi, type: 'js-single' },
  { pattern: /\/\/\s*NOTE:?\s*(.+)/gi, type: 'js-single' },
  
  // JavaScript/TypeScript 多行註解
  { pattern: /\/\*\s*TODO:?\s*(.+?)\s*\*\//gi, type: 'js-multi' },
  { pattern: /\/\*\s*FIXME:?\s*(.+?)\s*\*\//gi, type: 'js-multi' },
  { pattern: /\/\*\s*HACK:?\s*(.+?)\s*\*\//gi, type: 'js-multi' },
  { pattern: /\/\*\s*NOTE:?\s*(.+?)\s*\*\//gi, type: 'js-multi' },
  
  // Markdown TODO 列表
  { pattern: /^[-*+]\s*\[\s*\]\s*(.+)$/gm, type: 'md-checkbox' },
  { pattern: /^[-*+]\s*\[\s*x\s*\]\s*(.+)$/gm, type: 'md-checkbox-done' },
  
  // Markdown 標題 TODO
  { pattern: /^#+\s*TODO:?\s*(.+)$/gm, type: 'md-heading' },
  { pattern: /^#+\s*FIXME:?\s*(.+)$/gm, type: 'md-heading' },
  
  // 其他格式
  { pattern: /#\s*TODO:?\s*(.+)/gi, type: 'hash' },
  { pattern: /<!--\s*TODO:?\s*(.+?)\s*-->/gi, type: 'html-comment' },
  { pattern: /#\s*FIXME:?\s*(.+)/gi, type: 'hash' },
  { pattern: /#\s*HACK:?\s*(.+)/gi, type: 'hash' }
];

/**
 * 檢查路徑是否應該被排除
 */
function shouldExclude(filePath, fileName) {
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
 * 從文件內容中提取 TODO
 */
function extractTodosFromContent(content, filePath) {
  const todos = [];
  
  TODO_PATTERNS.forEach(({ pattern, type }) => {
    let match;
    const lines = content.split('\n');
    
    while ((match = pattern.exec(content)) !== null) {
      const todoText = match[1].trim();
      if (todoText) {
        // 計算行號
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split('\n').length;
        
        // 確定優先級
        let priority = 'medium';
        if (type.includes('FIXME') || type.includes('HACK')) {
          priority = 'high';
        } else if (type.includes('NOTE')) {
          priority = 'low';
        }
        
        todos.push({
          text: todoText,
          file: filePath,
          line: lineNumber,
          type: type,
          priority: priority,
          raw: match[0]
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
      .filter(item => !shouldExclude(item.name, item.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativeFilePath = path.join(relativePath, item.name).replace(/\\/g, '/');

      if (item.isDirectory()) {
        // 遞歸掃描子目錄
        const subTodos = scanTodos(fullPath, relativeFilePath);
        todos.push(...subTodos);
      } else {
        // 掃描文件
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
    groups[todo.priority].push(todo);
  });

  return groups;
}

/**
 * 按文件類型分組 TODO
 */
function groupTodosByFileType(todos) {
  const groups = {};

  todos.forEach(todo => {
    const ext = path.extname(todo.file);
    const category = getFileCategory(ext);
    
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(todo);
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
 * 生成 TODO 列表 Markdown 內容
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
  const fileTypeGroups = groupTodosByFileType(todos);
  
  const totalCount = todos.length;
  const highCount = priorityGroups.high.length;
  const mediumCount = priorityGroups.medium.length;
  const lowCount = priorityGroups.low.length;

  let content = `# TODO 列表

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: ${timestamp}

## 統計信息

- **總計**: ${totalCount} 個 TODO
- **高優先級**: ${highCount} 個
- **中優先級**: ${mediumCount} 個  
- **低優先級**: ${lowCount} 個

`;

  // 按優先級分組顯示
  if (highCount > 0) {
    content += `## 🔴 高優先級 (${highCount} 個)

`;
    priorityGroups.high.forEach(todo => {
      content += `- [ ] \`${todo.file}:${todo.line}\` - ${todo.text}\n`;
    });
    content += '\n';
  }

  if (mediumCount > 0) {
    content += `## 🟡 中優先級 (${mediumCount} 個)

`;
    priorityGroups.medium.forEach(todo => {
      content += `- [ ] \`${todo.file}:${todo.line}\` - ${todo.text}\n`;
    });
    content += '\n';
  }

  if (lowCount > 0) {
    content += `## 🟢 低優先級 (${lowCount} 個)

`;
    priorityGroups.low.forEach(todo => {
      content += `- [ ] \`${todo.file}:${todo.line}\` - ${todo.text}\n`;
    });
    content += '\n';
  }

  // 按文件類型分組顯示
  content += `## 按文件類型分組

`;
  Object.keys(fileTypeGroups).sort().forEach(category => {
    const categoryTodos = fileTypeGroups[category];
    content += `### ${category} (${categoryTodos.length} 個)

`;
    categoryTodos.forEach(todo => {
      content += `- [ ] \`${todo.file}:${todo.line}\` - ${todo.text}\n`;
    });
    content += '\n';
  });

  content += `## 自動化說明

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
`;

  return content;
}

/**
 * 同步 TODO 列表
 */
function syncTodos() {
  const rootPath = process.cwd();
  const outputPath = path.join(rootPath, 'docs', 'TODO-list.md');
  
  // 確保 docs 目錄存在
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  console.log('🔍 掃描專案中的 TODO...');
  const todos = scanTodos(rootPath);
  
  if (todos.length === 0) {
    console.log('✅ 未發現任何 TODO');
    // 仍然生成空的 TODO 列表
  } else {
    console.log(`✅ 發現 ${todos.length} 個 TODO`);
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
