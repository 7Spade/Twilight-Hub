#!/usr/bin/env node

/**
 * 自動生成項目樹狀圖結構腳本 (TypeScript 版本)
 * 用於在 Git 提交時自動更新 docs/project-structure.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// 排除的目錄和文件模式
const EXCLUDE_PATTERNS: readonly string[] = [
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
  
  // 排除自動生成的文檔，但保留重要目錄結構
  // 'docs', // 保留 docs 目錄，但排除生成的文件
  // 'memory-bank', // 保留 memory-bank 目錄
  // 'scripts', // 保留 scripts 目錄
  
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
  
  // 排除自動生成的文檔文件
  'docs/project-structure.md',
  'docs/Commands/TODO-list.md',
  
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
] as const;

// 排除的文件擴展名
const EXCLUDE_EXTENSIONS: readonly string[] = [
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
] as const;

/**
 * 檢查路徑是否應該被排除
 */
function shouldExclude(filePath: string, fileName: string): boolean {
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
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 格式化修改時間
 */
function formatModTime(stats: fs.Stats): string {
  const now = new Date();
  const modTime = new Date(stats.mtime);
  const diffMs = now.getTime() - modTime.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}個月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}

/**
 * 生成樹狀結構 - 改進版本，包含文件信息
 */
function generateTree(
  dirPath: string, 
  prefix: string = '', 
  isLast: boolean = true, 
  depth: number = 0, 
  maxDepth: number = 10
): string {
  if (depth > maxDepth) {
    return '';
  }

  let result = '';
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter((item: fs.Dirent) => !shouldExclude(item.name, item.name))
    .sort((a: fs.Dirent, b: fs.Dirent) => {
      // 目錄優先，然後按名稱排序
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  items.forEach((item: fs.Dirent, index: number) => {
    const isLastItem = index === items.length - 1;
    const currentPrefix = isLast ? '└── ' : '├── ';
    const nextPrefix = isLast ? '    ' : '│   ';

    result += `${prefix}${currentPrefix}${item.name}`;

    if (item.isDirectory()) {
      result += '/\n';
      const subPath = path.join(dirPath, item.name);
      result += generateTree(subPath, prefix + nextPrefix, isLastItem, depth + 1, maxDepth);
    } else {
      // 添加文件信息
      try {
        const fullPath = path.join(dirPath, item.name);
        const stats = fs.statSync(fullPath);
        const size = formatFileSize(stats.size);
        const modTime = formatModTime(stats);
        result += ` (${size}, ${modTime})\n`;
      } catch (error) {
        result += '\n';
      }
    }
  });

  return result;
}

/**
 * 生成完整的項目結構文檔
 */
function generateProjectStructure(): void {
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
    console.error('❌ 生成項目結構文檔時發生錯誤:', (error as Error).message);
    process.exit(1);
  }
}

export { generateProjectStructure };