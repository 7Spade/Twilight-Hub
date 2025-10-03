#!/usr/bin/env tsx

/**
 * 記憶系統統計分析器
 */

import fs from 'fs';
import path from 'path';

interface MemoryEntity {
  type: 'entity' | 'relation';
  name?: string;
  entityType?: string;
  observations?: string[];
  from?: string;
  to?: string;
  relationType?: string;
}

interface MemoryStats {
  totalEntities: number;
  totalRelations: number;
  entityTypes: Record<string, number>;
  relationTypes: Record<string, number>;
  observationsCount: number;
  averageObservationsPerEntity: number;
  mostActiveEntities: Array<{name: string, observations: number}>;
  memoryFileSize: number;
  lastModified: Date;
}

class MemoryStatsAnalyzer {
  private memoryFilePath: string;

  constructor() {
    this.memoryFilePath = path.join(process.cwd(), 'memory-bank', 'memory.json');
  }

  async analyze(): Promise<MemoryStats> {
    console.log('📊 分析記憶系統統計...\n');

    const memories = await this.readMemories();
    const entities = memories.filter(m => m.type === 'entity');
    const relations = memories.filter(m => m.type === 'relation');

    // 統計實體類型
    const entityTypes: Record<string, number> = {};
    entities.forEach(entity => {
      if (entity.entityType) {
        entityTypes[entity.entityType] = (entityTypes[entity.entityType] || 0) + 1;
      }
    });

    // 統計關係類型
    const relationTypes: Record<string, number> = {};
    relations.forEach(relation => {
      if (relation.relationType) {
        relationTypes[relation.relationType] = (relationTypes[relation.relationType] || 0) + 1;
      }
    });

    // 統計觀察數量
    const totalObservations = entities.reduce((sum, entity) => 
      sum + (entity.observations?.length || 0), 0);

    // 最活躍的實體
    const mostActiveEntities = entities
      .map(entity => ({
        name: entity.name || 'Unknown',
        observations: entity.observations?.length || 0
      }))
      .sort((a, b) => b.observations - a.observations)
      .slice(0, 5);

    // 文件信息
    const stats = fs.statSync(this.memoryFilePath);
    const memoryFileSize = stats.size;

    return {
      totalEntities: entities.length,
      totalRelations: relations.length,
      entityTypes,
      relationTypes,
      observationsCount: totalObservations,
      averageObservationsPerEntity: entities.length > 0 ? totalObservations / entities.length : 0,
      mostActiveEntities,
      memoryFileSize,
      lastModified: stats.mtime
    };
  }

  private async readMemories(): Promise<MemoryEntity[]> {
    if (!fs.existsSync(this.memoryFilePath)) {
      return [];
    }

    const content = fs.readFileSync(this.memoryFilePath, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.warn('⚠️ 跳過無效的記憶行:', line);
        return null;
      }
    }).filter(Boolean);
  }

  displayStats(stats: MemoryStats): void {
    console.log('🧠 記憶系統統計報告');
    console.log('=' .repeat(50));
    
    console.log(`\n📈 基本統計:`);
    console.log(`   總實體數量: ${stats.totalEntities}`);
    console.log(`   總關係數量: ${stats.totalRelations}`);
    console.log(`   觀察總數: ${stats.observationsCount}`);
    console.log(`   平均觀察/實體: ${stats.averageObservationsPerEntity.toFixed(2)}`);
    console.log(`   文件大小: ${(stats.memoryFileSize / 1024).toFixed(2)} KB`);
    console.log(`   最後修改: ${stats.lastModified.toLocaleString()}`);

    console.log(`\n🏷️ 實體類型分布:`);
    Object.entries(stats.entityTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} 個`);
      });

    console.log(`\n🔗 關係類型分布:`);
    Object.entries(stats.relationTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} 個`);
      });

    console.log(`\n⭐ 最活躍實體 (觀察數量):`);
    stats.mostActiveEntities.forEach((entity, index) => {
      console.log(`   ${index + 1}. ${entity.name}: ${entity.observations} 個觀察`);
    });

    console.log('\n' + '='.repeat(50));
  }
}

async function main() {
  const analyzer = new MemoryStatsAnalyzer();
  
  try {
    const stats = await analyzer.analyze();
    analyzer.displayStats(stats);
  } catch (error) {
    console.error('❌ 統計分析失敗:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { MemoryStatsAnalyzer };
