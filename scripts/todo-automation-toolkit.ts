#!/usr/bin/env node
/**
 * TODO 自動化工具套件
 * 用途：掃描專案中的 TODO，生成 AI Agent 友好的報告
 * 使用：node todo-scanner.ts [選項]
 */

import * as fs from 'fs';
import * as path from 'path';

// ==================== 類型定義 ====================

interface TodoItem {
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  type: string;
  description: string;
  details: string[];
  file: string;
  line: number;
  assignee?: string;
  deadline?: string;
  context: string; // 前後3行程式碼
}

interface TodoReport {
  summary: {
    total: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    urgent: number; // P0 或過期的
  };
  todos: TodoItem[];
  aiInstructions: string;
}

// ==================== 設定 ====================

const CONFIG = {
  // 要掃描的檔案副檔名
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // 忽略的目錄
  ignoreDirs: ['memory-bank', 'scripts', 'docs', 'node_modules', '.next', 'dist', 'build', '.git'],
  
  // TODO 正則表達式
  todoRegex: /\/\/\s*TODO:\s*\[([^\]]+)\]\s*(\w+)\s+(.+)/,
  
  // 詳細資訊正則
  detailRegex: /\/\/\s*(.+)/,
  assigneeRegex: /\/\/\s*@assignee\s+(\w+)/,
  deadlineRegex: /\/\/\s*@deadline\s+(\d{4}-\d{2}-\d{2})/,
};

// ==================== 核心功能 ====================

class TodoScanner {
  private todos: TodoItem[] = [];

  /**
   * 掃描整個專案
   */
  scan(rootDir: string): void {
    this.scanDirectory(rootDir);
  }

  /**
   * 遞迴掃描目錄
   */
  private scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // 跳過忽略的目錄
      if (entry.isDirectory()) {
        if (!CONFIG.ignoreDirs.includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
        continue;
      }

      // 檢查副檔名
      const ext = path.extname(entry.name);
      if (CONFIG.extensions.includes(ext)) {
        this.scanFile(fullPath);
      }
    }
  }

  /**
   * 掃描單一檔案
   */
  private scanFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(CONFIG.todoRegex);

      if (match) {
        const todo = this.parseTodo(lines, i, filePath, match);
        this.todos.push(todo);
      }
    }
  }

  /**
   * 解析 TODO 項目
   */
  private parseTodo(
    lines: string[],
    lineIndex: number,
    filePath: string,
    match: RegExpMatchArray
  ): TodoItem {
    const [, priority, type, description] = match;
    
    // 收集詳細資訊（接下來的註解行）
    const details: string[] = [];
    let assignee: string | undefined;
    let deadline: string | undefined;

    for (let i = lineIndex + 1; i < lines.length; i++) {
      const detailLine = lines[i].trim();
      
      // 如果不是註解行，停止
      if (!detailLine.startsWith('//')) break;

      // 檢查特殊標記
      const assigneeMatch = detailLine.match(CONFIG.assigneeRegex);
      if (assigneeMatch) {
        assignee = assigneeMatch[1];
        continue;
      }

      const deadlineMatch = detailLine.match(CONFIG.deadlineRegex);
      if (deadlineMatch) {
        deadline = deadlineMatch[1];
        continue;
      }

      // 一般詳細資訊
      const detailMatch = detailLine.match(CONFIG.detailRegex);
      if (detailMatch && detailMatch[1]) {
        details.push(detailMatch[1]);
      }
    }

    // 收集上下文（前後3行程式碼）
    const contextStart = Math.max(0, lineIndex - 3);
    const contextEnd = Math.min(lines.length, lineIndex + 10);
    const context = lines.slice(contextStart, contextEnd).join('\n');

    return {
      priority: priority as TodoItem['priority'],
      type,
      description,
      details,
      file: path.relative(process.cwd(), filePath),
      line: lineIndex + 1,
      assignee,
      deadline,
      context,
    };
  }

  /**
   * 生成報告
   */
  generateReport(): TodoReport {
    const byPriority: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let urgent = 0;

    const today = new Date().toISOString().split('T')[0];

    for (const todo of this.todos) {
      // 統計優先級
      byPriority[todo.priority] = (byPriority[todo.priority] || 0) + 1;
      
      // 統計類型
      byType[todo.type] = (byType[todo.type] || 0) + 1;
      
      // 統計緊急項目
      if (todo.priority === 'P0' || (todo.deadline && todo.deadline <= today)) {
        urgent++;
      }
    }

    // 按優先級和截止日期排序
    const sortedTodos = this.todos.sort((a, b) => {
      // P0 優先
      if (a.priority !== b.priority) {
        return a.priority.localeCompare(b.priority);
      }
      // 有截止日期的優先
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;
      if (a.deadline && b.deadline) {
        return a.deadline.localeCompare(b.deadline);
      }
      return 0;
    });

    return {
      summary: {
        total: this.todos.length,
        byPriority,
        byType,
        urgent,
      },
      todos: sortedTodos,
      aiInstructions: this.generateAiInstructions(sortedTodos, urgent),
    };
  }

  /**
   * 生成 AI 指令
   */
  private generateAiInstructions(todos: TodoItem[], urgent: number): string {
    const instructions: string[] = [
      '# AI Agent 工作指令',
      '',
      '## 📊 專案狀態',
      `- 總 TODO 數量: ${todos.length}`,
      `- 🔴 緊急項目: ${urgent}`,
      '',
    ];

    if (urgent > 0) {
      instructions.push('## ⚠️ 立即處理（P0 或已過期）', '');
      
      todos
        .filter(t => t.priority === 'P0' || (t.deadline && t.deadline <= new Date().toISOString().split('T')[0]))
        .forEach((todo, index) => {
          instructions.push(
            `### ${index + 1}. ${todo.type}: ${todo.description}`,
            `- 檔案: \`${todo.file}:${todo.line}\``,
            `- 優先級: ${todo.priority}`,
            todo.deadline ? `- ⏰ 截止日期: ${todo.deadline}` : '',
            todo.assignee ? `- 負責人: @${todo.assignee}` : '',
            '',
            '**詳細說明:**',
            ...todo.details.map(d => `- ${d}`),
            '',
            '**程式碼上下文:**',
            '```typescript',
            todo.context,
            '```',
            '',
          );
        });
    }

    instructions.push(
      '## 📋 建議處理順序',
      '',
      '依照以下順序處理 TODO：',
      '1. P0 - SECURITY（安全性問題）',
      '2. P0 - FIX（緊急修復）',
      '3. P1 - SECURITY',
      '4. P1 - FIX',
      '5. P1 - FEAT（重要功能）',
      '6. P2 項目',
      '7. P3 項目',
      '',
    );

    return instructions.filter(Boolean).join('\n');
  }
}

// ==================== 報告生成器 ====================

class ReportGenerator {
  /**
   * 生成 Markdown 報告（人類閱讀）
   */
  static generateMarkdown(report: TodoReport): string {
    const lines: string[] = [
      '# 📝 TODO 報告',
      '',
      // 移除時間戳，避免無限循環
      // `生成時間: ${new Date().toLocaleString('zh-TW')}`,
      '',
      '## 📊 統計摘要',
      '',
      `- 總計: ${report.summary.total} 個項目`,
      `- 🔴 緊急: ${report.summary.urgent} 個項目`,
      '',
      '### 依優先級',
      '',
      ...Object.entries(report.summary.byPriority).map(
        ([p, count]) => `- ${p}: ${count} 個`
      ),
      '',
      '### 依類型',
      '',
      ...Object.entries(report.summary.byType).map(
        ([type, count]) => `- ${type}: ${count} 個`
      ),
      '',
      '---',
      '',
    ];

    // 分組顯示
    const grouped = this.groupByPriority(report.todos);

    for (const [priority, todos] of Object.entries(grouped)) {
      const emoji = { P0: '🔴', P1: '🟠', P2: '🟡', P3: '🟢' }[priority] || '';
      lines.push(`## ${emoji} ${priority} (${todos.length} 個)`, '');

      todos.forEach((todo, index) => {
        lines.push(
          `### ${index + 1}. [${todo.type}] ${todo.description}`,
          '',
          `**位置:** \`${todo.file}:${todo.line}\``,
          todo.assignee ? `**負責人:** @${todo.assignee}` : '',
          todo.deadline ? `**截止日期:** ${todo.deadline}` : '',
          '',
        );

        if (todo.details.length > 0) {
          lines.push('**詳細說明:**', '');
          todo.details.forEach(d => lines.push(`> ${d}`));
          lines.push('');
        }

        lines.push('---', '');
      });
    }

    return lines.filter(Boolean).join('\n');
  }

  /**
   * 生成 JSON 報告（AI 閱讀）
   */
  static generateJson(report: TodoReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * 生成 AI 指令檔案
   */
  static generateAiPrompt(report: TodoReport): string {
    const lines: string[] = [
      report.aiInstructions,
      '',
      '## 🎯 完整 TODO 清單（JSON 格式）',
      '',
      '```json',
      JSON.stringify(report.todos, null, 2),
      '```',
      '',
      '## 💡 建議的 AI 命令',
      '',
      '你可以使用以下命令讓 AI 處理特定 TODO：',
      '',
      '```',
      '# 處理第一個緊急項目',
      `請根據 ${report.todos[0]?.file} 第 ${report.todos[0]?.line} 行的 TODO，完成修復`,
      '',
      '# 處理所有 P0 安全性問題',
      '請處理所有標記為 P0-SECURITY 的 TODO',
      '',
      '# 生成測試檔案',
      '請為所有標記為 TEST 的 TODO 生成對應的測試檔案',
      '```',
    ];

    return lines.join('\n');
  }

  /**
   * 依優先級分組
   */
  private static groupByPriority(todos: TodoItem[]): Record<string, TodoItem[]> {
    const grouped: Record<string, TodoItem[]> = {
      P0: [],
      P1: [],
      P2: [],
      P3: [],
    };

    todos.forEach(todo => {
      grouped[todo.priority].push(todo);
    });

    return grouped;
  }
}

// ==================== CLI 主程式 ====================

function main() {
  console.log('🔍 開始掃描 TODO...\n');

  const scanner = new TodoScanner();
  const rootDir = process.cwd();

  scanner.scan(rootDir);
  const report = scanner.generateReport();

  // 建立 .todo-reports 目錄
  const reportsDir = path.join(rootDir, '.todo-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  // 生成報告
  const timestamp = new Date().toISOString().split('T')[0];

  // 1. Markdown 報告（人類閱讀）
  const markdownReport = ReportGenerator.generateMarkdown(report);
  fs.writeFileSync(
    path.join(reportsDir, `todo-report-${timestamp}.md`),
    markdownReport
  );

  // 2. JSON 報告（程式處理）
  const jsonReport = ReportGenerator.generateJson(report);
  fs.writeFileSync(
    path.join(reportsDir, `todo-report-${timestamp}.json`),
    jsonReport
  );

  // 3. AI 指令檔案（AI Agent 閱讀）
  const aiPrompt = ReportGenerator.generateAiPrompt(report);
  fs.writeFileSync(
    path.join(reportsDir, `ai-prompt-${timestamp}.md`),
    aiPrompt
  );

  // 輸出摘要
  console.log('✅ 掃描完成！\n');
  console.log('📊 統計摘要:');
  console.log(`   總計: ${report.summary.total} 個 TODO`);
  console.log(`   🔴 緊急: ${report.summary.urgent} 個`);
  console.log('');
  console.log('📁 報告已生成:');
  console.log(`   - .todo-reports/todo-report-${timestamp}.md`);
  console.log(`   - .todo-reports/todo-report-${timestamp}.json`);
  console.log(`   - .todo-reports/ai-prompt-${timestamp}.md`);
  console.log('');

  if (report.summary.urgent > 0) {
    console.log('⚠️  警告: 有 ' + report.summary.urgent + ' 個緊急項目需要立即處理！');
  }
}

// 執行
main();