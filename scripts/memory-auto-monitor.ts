#!/usr/bin/env tsx

/**
 * 記憶系統自動監控器
 * 監控記憶系統是否正常工作，確保全自動化運行
 */

import fs from 'fs';
import path from 'path';

interface MemoryMonitor {
  lastMemoryUpdate: Date;
  totalMemories: number;
  autoTriggerStatus: boolean;
  lastOptimization: Date;
  memoryHealthScore: number;
}

class MemoryAutoMonitor {
  private memoryFilePath: string;
  private monitorFilePath: string;
  private lastCheck: Date;

  constructor() {
    this.memoryFilePath = path.join(process.cwd(), 'memory-bank', 'memory.json');
    this.monitorFilePath = path.join(process.cwd(), 'memory-bank', 'monitor.json');
    this.lastCheck = new Date();
  }

  /**
   * 檢查記憶系統自動化狀態
   */
  async checkAutomationStatus(): Promise<MemoryMonitor> {
    console.log('🤖 檢查記憶系統自動化狀態...\n');

    const memoryExists = fs.existsSync(this.memoryFilePath);
    const memoryStats = memoryExists ? fs.statSync(this.memoryFilePath) : null;
    
    const monitorData = this.loadMonitorData();
    
    const monitor: MemoryMonitor = {
      lastMemoryUpdate: memoryStats?.mtime || new Date(0),
      totalMemories: await this.countMemories(),
      autoTriggerStatus: this.checkAutoTriggerConfig(),
      lastOptimization: monitorData.lastOptimization || new Date(0),
      memoryHealthScore: await this.calculateHealthScore()
    };

    // 保存監控數據
    this.saveMonitorData(monitor);

    return monitor;
  }

  /**
   * 計算記憶健康分數
   */
  private async calculateHealthScore(): Promise<number> {
    if (!fs.existsSync(this.memoryFilePath)) {
      return 0;
    }

    const content = fs.readFileSync(this.memoryFilePath, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    let score = 0;
    
    // 基本分數：有記憶文件
    score += 20;
    
    // 記憶數量分數
    const memoryCount = lines.length;
    score += Math.min(memoryCount * 2, 40);
    
    // 記憶多樣性分數
    const entityTypes = new Set();
    lines.forEach(line => {
      try {
        const memory = JSON.parse(line);
        if (memory.entityType) {
          entityTypes.add(memory.entityType);
        }
      } catch (e) {
        // 忽略解析錯誤
      }
    });
    score += Math.min(entityTypes.size * 5, 20);
    
    // 記憶新鮮度分數
    const stats = fs.statSync(this.memoryFilePath);
    const hoursSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate < 24) {
      score += 20; // 24小時內有更新
    } else if (hoursSinceUpdate < 168) {
      score += 10; // 一週內有更新
    }

    return Math.min(score, 100);
  }

  /**
   * 檢查自動觸發配置
   */
  private checkAutoTriggerConfig(): boolean {
    const configFiles = [
      '.cursor/memory.behavior.mdc',
      '.cursor/memory.auto-rules.mdc',
      '.cursor/auto-triggers.mdc',
      '.cursor/mcp.json'
    ];

    let configScore = 0;
    
    configFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        configScore += 25;
      }
    });

    return configScore >= 75; // 至少75%的配置文件存在
  }

  /**
   * 計算記憶數量
   */
  private async countMemories(): Promise<number> {
    if (!fs.existsSync(this.memoryFilePath)) {
      return 0;
    }

    const content = fs.readFileSync(this.memoryFilePath, 'utf-8');
    return content.trim().split('\n').filter(line => line.trim()).length;
  }

  /**
   * 加載監控數據
   */
  private loadMonitorData(): any {
    if (!fs.existsSync(this.monitorFilePath)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.monitorFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  /**
   * 保存監控數據
   */
  private saveMonitorData(monitor: MemoryMonitor): void {
    const monitorData = {
      ...monitor,
      lastCheck: this.lastCheck,
      version: '1.0.0'
    };

    fs.writeFileSync(this.monitorFilePath, JSON.stringify(monitorData, null, 2));
  }

  /**
   * 顯示監控報告
   */
  displayReport(monitor: MemoryMonitor): void {
    console.log('🤖 記憶系統自動化監控報告');
    console.log('=' .repeat(50));
    
    console.log(`\n📊 系統狀態:`);
    console.log(`   記憶健康分數: ${monitor.memoryHealthScore}/100`);
    console.log(`   自動觸發狀態: ${monitor.autoTriggerStatus ? '✅ 正常' : '❌ 異常'}`);
    console.log(`   總記憶數量: ${monitor.totalMemories}`);
    
    console.log(`\n⏰ 時間統計:`);
    const lastUpdateHours = (Date.now() - monitor.lastMemoryUpdate.getTime()) / (1000 * 60 * 60);
    const lastOptimizationHours = (Date.now() - monitor.lastOptimization.getTime()) / (1000 * 60 * 60);
    
    console.log(`   最後記憶更新: ${lastUpdateHours.toFixed(1)} 小時前`);
    console.log(`   最後優化時間: ${lastOptimizationHours.toFixed(1)} 小時前`);
    
    console.log(`\n🎯 自動化建議:`);
    
    if (monitor.memoryHealthScore < 50) {
      console.log('   ⚠️ 記憶健康分數較低，建議運行記憶優化');
    }
    
    if (lastUpdateHours > 24) {
      console.log('   ⚠️ 記憶超過24小時未更新，檢查自動觸發是否正常工作');
    }
    
    if (lastOptimizationHours > 168) { // 一週
      console.log('   ⚠️ 建議運行記憶優化以保持系統健康');
    }
    
    if (!monitor.autoTriggerStatus) {
      console.log('   ❌ 自動觸發配置不完整，請檢查配置文件');
    }

    console.log('\n' + '='.repeat(50));
  }

  /**
   * 自動修復建議
   */
  suggestAutoFix(monitor: MemoryMonitor): void {
    console.log('\n🔧 自動修復建議:');
    
    if (monitor.memoryHealthScore < 70) {
      console.log('   npm run memory:optimize  # 優化記憶系統');
    }
    
    if (!monitor.autoTriggerStatus) {
      console.log('   檢查 .cursor/mcp.json 中的記憶服務器配置');
      console.log('   確認 autoApprove 設置正確');
    }
    
    const lastUpdateHours = (Date.now() - monitor.lastMemoryUpdate.getTime()) / (1000 * 60 * 60);
    if (lastUpdateHours > 48) {
      console.log('   記憶系統可能未正常自動運行');
      console.log('   檢查 Agent 是否正確執行自動記憶操作');
    }
  }
}

// 主執行函數
async function main() {
  const monitor = new MemoryAutoMonitor();
  
  try {
    const status = await monitor.checkAutomationStatus();
    monitor.displayReport(status);
    monitor.suggestAutoFix(status);
    
    // 如果健康分數過低，自動執行優化
    if (status.memoryHealthScore < 50) {
      console.log('\n🚀 自動執行記憶優化...');
      // 這裡可以調用記憶優化腳本
    }
    
  } catch (error) {
    console.error('❌ 監控檢查失敗:', error);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

export { MemoryAutoMonitor };
