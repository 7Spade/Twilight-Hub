#!/usr/bin/env node

/**
 * 自動生成項目樹狀圖結構腳本
 * 用於在 Git 提交時自動更新 docs/project-structure.md
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
  
  // Agent 和文檔目錄
  'docs',
  'memory-bank',
  'scripts',
  
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
  '*.swp',
  '*.swo',
  '*~',
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

// 排除的文件擴展名
const EXCLUDE_EXTENSIONS = [
  // 日誌和臨時文件
  '.log',
  '.tmp',
  '.temp',
  '.swp',
  '.swo',
  '~',
  
  // 構建和編譯文件
  '.map',
  '.tsbuildinfo',
  '.js.map',
  '.css.map',
  
  // 系統和備份文件
  '.bak',
  '.backup',
  '.orig',
  '.rej',
  
  // 壓縮文件
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  
  // 證書和密鑰文件
  '.pem',
  '.key',
  '.crt',
  '.p12',
  '.pfx',
  '.p8',
  '.der',
  
  // 其他開發工具生成的文件
  '.cache',
  '.lock',
  '.pid',
  '.sock'
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
  if (EXCLUDE_EXTENSIONS.includes(ext)) {
    return true;
  }

  return false;
}

/**
 * 生成樹狀結構
 */
function generateTree(dirPath, prefix = '', isLast = true, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) {
    return '';
  }

  let result = '';
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(item => !shouldExclude(item.name, item.name))
    .sort((a, b) => {
      // 目錄優先，然後按名稱排序
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1;
    const currentPrefix = isLast ? '└── ' : '├── ';
    const nextPrefix = isLast ? '    ' : '│   ';

    result += `${prefix}${currentPrefix}${item.name}`;

    if (item.isDirectory()) {
      result += '/\n';
      const subPath = path.join(dirPath, item.name);
      result += generateTree(subPath, prefix + nextPrefix, isLastItem, depth + 1, maxDepth);
    } else {
      result += '\n';
    }
  });

  return result;
}

/**
 * 生成完整的項目結構文檔
 */
function generateProjectStructure() {
  const rootPath = process.cwd();
  const outputPath = path.join(rootPath, 'docs', 'project-structure.md');
  
  // 確保 docs 目錄存在
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const tree = generateTree(rootPath);
  const timestamp = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const content = `# 項目結構

> 此文件由自動化腳本生成，請勿手動編輯
> 最後更新時間: ${timestamp}

## 目錄結構

\`\`\`
${tree}
\`\`\`

## 排除規則

以下目錄和文件已被排除在結構圖之外：

### 目錄排除

#### IDE 和編輯器配置
- \`.playwright-mcp\` - Playwright MCP 相關文件
- \`.cursor\` - Cursor IDE 配置
- \`.vscode\` - VS Code 配置
- \`.idea\` - IntelliJ IDEA 配置
- \`.idx\` - 索引文件目錄

#### 構建和依賴目錄
- \`.next\` - Next.js 構建輸出
- \`node_modules\` - Node.js 依賴包
- \`dist\` - 構建輸出目錄
- \`build\` - 構建輸出目錄
- \`out\` - 輸出目錄
- \`.pnp\`, \`.pnp.*\` - Yarn PnP 文件
- \`.yarn\` - Yarn 配置目錄

#### 版本控制
- \`.git\` - Git 版本控制文件
- \`.husky\` - Git hooks 配置
- \`.github\` - GitHub 配置目錄

#### Agent 和文檔目錄
- \`docs\` - 項目文檔目錄
- \`memory-bank\` - Agent 記憶庫目錄
- \`scripts\` - 自動化腳本目錄

#### 測試和覆蓋率
- \`coverage\` - 測試覆蓋率報告
- \`.nyc_output\` - NYC 測試覆蓋率輸出
- \`__tests__\`, \`test\`, \`tests\` - 測試目錄
- \`spec\`, \`specs\` - 規格測試目錄

#### 部署和雲端配置
- \`.vercel\` - Vercel 部署配置
- \`.netlify\` - Netlify 部署配置
- \`.firebase\` - Firebase 配置

### 文件排除

#### 日誌和臨時文件
- \`*.log\` - 日誌文件
- \`*.tmp\`, \`*.temp\` - 臨時文件
- \`*.swp\`, \`*.swo\` - Vim 交換文件
- \`*~\` - 備份文件
- \`.modified\` - 修改標記文件

#### 系統文件
- \`.DS_Store\` - macOS 系統文件
- \`Thumbs.db\` - Windows 縮略圖文件
- \`desktop.ini\` - Windows 桌面配置

#### 環境變量文件
- \`.env\`, \`.env.*\` - 環境變量文件
- \`firebase-debug.log\`, \`firestore-debug.log\` - Firebase 調試日誌

#### 構建和編譯文件
- \`*.map\` - Source map 文件
- \`tsconfig.tsbuildinfo\` - TypeScript 構建信息
- \`next-env.d.ts\` - Next.js 環境類型定義

#### 證書和密鑰文件
- \`*.pem\`, \`*.key\`, \`*.crt\` - 證書文件
- \`*.p12\`, \`*.pfx\` - PKCS 證書文件

#### 其他開發工具文件
- \`.genkit\` - Genkit 配置目錄
- \`.eslintcache\`, \`.stylelintcache\`, \`.prettiercache\` - 緩存文件

## 自動化說明

此文件通過 Git pre-commit hook 自動更新，確保項目結構文檔始終保持最新狀態。

### 更新觸發條件
- 每次 Git 提交時
- 目錄結構發生變化時
- 手動執行 \`npm run docs:update\` 時

### 手動更新
\`\`\`bash
npm run docs:update
\`\`\`
`;

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✅ 項目結構文檔已更新: ${outputPath}`);
}

// 如果直接執行此腳本
if (require.main === module) {
  try {
    generateProjectStructure();
  } catch (error) {
    console.error('❌ 生成項目結構文檔時發生錯誤:', error.message);
    process.exit(1);
  }
}

module.exports = { generateProjectStructure };
