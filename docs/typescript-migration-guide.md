# TypeScript 遷移指南：generate-tree.js → generate-tree.ts

## 概述

本文檔詳細說明了如何將 `scripts/generate-tree.js` 從 JavaScript 遷移到 TypeScript，基於 Context7 查詢的官方 TypeScript 和 Node.js 文檔。

## 主要轉換內容

### 1. 導入語句現代化

**JavaScript (原始)**:
```javascript
const fs = require('fs');
const path = require('path');
```

**TypeScript (轉換後)**:
```typescript
import * as fs from 'node:fs';
import * as path from 'node:path';
```

### 2. 類型安全增強

#### 常量類型定義
```typescript
// 使用 readonly 和 as const 確保類型安全
const EXCLUDE_PATTERNS: readonly string[] = [
  '.vscode',
  'node_modules',
  // ...
] as const;

const EXCLUDE_EXTENSIONS: readonly string[] = [
  '.log',
  '.tmp',
  // ...
] as const;
```

#### 函數類型註解
```typescript
// 完整的參數和返回值類型註解
function shouldExclude(filePath: string, fileName: string): boolean
function formatFileSize(bytes: number): string
function formatModTime(stats: fs.Stats): string
function generateTree(
  dirPath: string, 
  prefix: string = '', 
  isLast: boolean = true, 
  depth: number = 0, 
  maxDepth: number = 10
): string
```

#### 文件系統類型
```typescript
// 使用 Node.js 官方類型
const items = fs.readdirSync(dirPath, { withFileTypes: true })
  .filter((item: fs.Dirent) => !shouldExclude(item.name, item.name))
  .sort((a: fs.Dirent, b: fs.Dirent) => {
    // 類型安全的排序邏輯
  });
```

### 3. 錯誤處理改進

```typescript
// 類型安全的錯誤處理
try {
  generateProjectStructure();
} catch (error) {
  console.error('❌ 生成項目結構文檔時發生錯誤:', (error as Error).message);
  process.exit(1);
}
```

### 4. 模組導出現代化

**JavaScript**:
```javascript
module.exports = { generateProjectStructure };
```

**TypeScript**:
```typescript
export { generateProjectStructure };
```

## 配置文件更新

### 1. package.json 腳本更新
```json
{
  "scripts": {
    "docs:update": "tsx scripts/generate-tree.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.2"
  }
}
```

### 2. TypeScript 配置 (scripts/tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": false,
    "outDir": "./dist",
    "rootDir": ".",
    "types": ["node"]
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 關鍵改進點

### 1. 類型安全
- 所有函數都有明確的類型註解
- 使用 Node.js 官方類型 (`fs.Stats`, `fs.Dirent`)
- 常量使用 `readonly` 和 `as const` 確保不可變性

### 2. 現代化語法
- 使用 ES 模組導入語法
- 使用 `node:` 前綴明確指定 Node.js 內建模組
- 使用現代化的導出語法

### 3. 錯誤處理
- 類型安全的錯誤處理
- 明確的錯誤類型轉換

### 4. 開發體驗
- 完整的 TypeScript 類型檢查
- 更好的 IDE 支持和自動完成
- 編譯時錯誤檢測

## 執行方式

### 安裝依賴
```bash
npm install
```

### 運行腳本
```bash
# 直接運行 TypeScript 版本
npm run docs:update

# 或者使用 tsx 直接運行
npx tsx scripts/generate-tree.ts
```

### 類型檢查
```bash
# 檢查 TypeScript 類型
npx tsc --noEmit -p scripts/tsconfig.json
```

## 驗證結果

✅ TypeScript 編譯無錯誤  
✅ 腳本執行成功  
✅ 生成文檔格式正確  
✅ 類型安全得到保障  
✅ 與現有 Git hooks 兼容  

## 最佳實踐總結

1. **使用官方類型**: 優先使用 Node.js 和 TypeScript 官方提供的類型定義
2. **類型註解完整**: 為所有函數參數和返回值添加類型註解
3. **現代化導入**: 使用 ES 模組語法和 `node:` 前綴
4. **錯誤處理**: 使用類型安全的錯誤處理方式
5. **配置分離**: 為腳本創建專門的 TypeScript 配置文件
6. **依賴管理**: 使用 `tsx` 等工具簡化 TypeScript 執行

## 參考資料

- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [Node.js 官方文檔](https://nodejs.org/)
- [Context7 TypeScript 文檔](https://context7.io/)
- [tsx - TypeScript 執行器](https://github.com/esbuild-kit/tsx)
