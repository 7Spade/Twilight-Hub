#!/usr/bin/env tsx

/**
 * 記憶系統優化器
 * 功能：智能去重、記憶整合、質量評估
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

interface MemoryGraph {
  entities: MemoryEntity[];
  relations: MemoryEntity[];
}

class MemoryOptimizer {
  private memoryFilePath: string;
  private backupPath: string;

  constructor() {
    this.memoryFilePath = path.join(process.cwd(), 'memory-bank', 'memory.json');
    this.backupPath = path.join(process.cwd(), 'memory-bank', 'memory.backup.json');
  }

  /**
   * 主要優化流程
   */
  async optimize(): Promise<void> {
    console.log('🧠 開始記憶系統優化...');
    
    try {
      // 1. 備份現有記憶
      await this.backupMemory();
      
      // 2. 讀取記憶數據
      const memories = await this.readMemories();
      
      // 3. 去重處理
      const deduplicatedMemories = this.deduplicateMemories(memories);
      
      // 4. 記憶整合
      const integratedMemories = this.integrateMemories(deduplicatedMemories);
      
      // 5. 質量評估和清理
      const optimizedMemories = this.assessAndCleanup(integratedMemories);
      
      // 6. 保存優化結果
      await this.saveMemories(optimizedMemories);
      
      console.log('✅ 記憶系統優化完成！');
      
    } catch (error) {
      console.error('❌ 記憶優化失敗:', error);
      throw error;
    }
  }

  /**
   * 備份記憶文件
   */
  private async backupMemory(): Promise<void> {
    if (fs.existsSync(this.memoryFilePath)) {
      const content = fs.readFileSync(this.memoryFilePath, 'utf-8');
      fs.writeFileSync(this.backupPath, content);
      console.log('📁 記憶文件已備份');
    }
  }

  /**
   * 讀取記憶數據
   */
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

  /**
   * 記憶去重
   */
  private deduplicateMemories(memories: MemoryEntity[]): MemoryEntity[] {
    console.log('🔍 開始去重處理...');
    
    const entities = new Map<string, MemoryEntity>();
    const relations = new Set<string>();

    for (const memory of memories) {
      if (memory.type === 'entity' && memory.name) {
        const existingEntity = entities.get(memory.name);
        
        if (existingEntity) {
          // 合併觀察結果
          const combinedObservations = [
            ...(existingEntity.observations || []),
            ...(memory.observations || [])
          ];
          
          // 去重觀察結果
          const uniqueObservations = Array.from(new Set(combinedObservations));
          
          entities.set(memory.name, {
            ...existingEntity,
            observations: uniqueObservations
          });
        } else {
          entities.set(memory.name, memory);
        }
      } else if (memory.type === 'relation') {
        // 關係去重
        const relationKey = `${memory.from}->${memory.to}:${memory.relationType}`;
        if (!relations.has(relationKey)) {
          relations.add(relationKey);
        }
      }
    }

    const result = [
      ...Array.from(entities.values()),
      ...memories.filter(m => m.type === 'relation')
        .filter(m => {
          const key = `${m.from}->${m.to}:${m.relationType}`;
          return relations.has(key);
        })
    ];

    console.log(`📊 去重結果: ${memories.length} -> ${result.length} 條記憶`);
    return result;
  }

  /**
   * 記憶整合
   */
  private integrateMemories(memories: MemoryEntity[]): MemoryEntity[] {
    console.log('🔗 開始記憶整合...');
    
    // 按實體類型分組
    const entitiesByType = new Map<string, MemoryEntity[]>();
    
    memories.filter(m => m.type === 'entity').forEach(entity => {
      if (!entity.entityType) return;
      
      if (!entitiesByType.has(entity.entityType)) {
        entitiesByType.set(entity.entityType, []);
      }
      entitiesByType.get(entity.entityType)!.push(entity);
    });

    // 智能整合相似實體
    const integratedEntities: MemoryEntity[] = [];
    
    entitiesByType.forEach((entities, type) => {
      if (type === 'user_preference') {
        // 用戶偏好整合
        const userPrefs = this.integrateUserPreferences(entities);
        integratedEntities.push(...userPrefs);
      } else if (type === 'technical_decision') {
        // 技術決策整合
        const techDecisions = this.integrateTechnicalDecisions(entities);
        integratedEntities.push(...techDecisions);
      } else {
        // 其他類型保持原樣
        integratedEntities.push(...entities);
      }
    });

    // 添加關係
    const relations = memories.filter(m => m.type === 'relation');
    
    console.log(`🔗 整合結果: ${entitiesByType.size} 個實體類型`);
    return [...integratedEntities, ...relations];
  }

  /**
   * 用戶偏好整合
   */
  private integrateUserPreferences(entities: MemoryEntity[]): MemoryEntity[] {
    // 合併所有用戶偏好到一個實體
    const combinedObservations = new Set<string>();
    
    entities.forEach(entity => {
      entity.observations?.forEach(obs => combinedObservations.add(obs));
    });

    return [{
      type: 'entity',
      name: 'user_preferences',
      entityType: 'user_preference',
      observations: Array.from(combinedObservations)
    }];
  }

  /**
   * 技術決策整合
   */
  private integrateTechnicalDecisions(entities: MemoryEntity[]): MemoryEntity[] {
    // 按技術領域分組整合
    const decisionsByDomain = new Map<string, MemoryEntity>();
    
    entities.forEach(entity => {
      const domain = this.extractTechDomain(entity.name || '');
      const existing = decisionsByDomain.get(domain);
      
      if (existing) {
        const combined = [
          ...(existing.observations || []),
          ...(entity.observations || [])
        ];
        decisionsByDomain.set(domain, {
          ...existing,
          observations: Array.from(new Set(combined))
        });
      } else {
        decisionsByDomain.set(domain, entity);
      }
    });

    return Array.from(decisionsByDomain.values());
  }

  /**
   * 提取技術領域
   */
  private extractTechDomain(entityName: string): string {
    if (entityName.includes('memory') || entityName.includes('記憶')) return 'memory_system';
    if (entityName.includes('ui') || entityName.includes('component')) return 'ui_framework';
    if (entityName.includes('database') || entityName.includes('firebase')) return 'database';
    if (entityName.includes('auth') || entityName.includes('認證')) return 'authentication';
    return 'general';
  }

  /**
   * 質量評估和清理
   */
  private assessAndCleanup(memories: MemoryEntity[]): MemoryEntity[] {
    console.log('📊 開始質量評估...');
    
    return memories.filter(memory => {
      if (memory.type === 'entity') {
        // 評估實體質量
        const score = this.assessEntityQuality(memory);
        return score >= 0.3; // 保留質量分數 >= 0.3 的實體
      }
      return true; // 保留所有關係
    });
  }

  /**
   * 評估實體質量
   */
  private assessEntityQuality(entity: MemoryEntity): number {
    let score = 0;
    
    // 觀察數量評分
    const obsCount = entity.observations?.length || 0;
    score += Math.min(obsCount * 0.1, 0.5);
    
    // 觀察內容質量評分
    if (entity.observations) {
      const avgLength = entity.observations.reduce((sum, obs) => sum + obs.length, 0) / entity.observations.length;
      score += Math.min(avgLength / 50, 0.3);
    }
    
    // 實體類型評分
    const typeScores = {
      'user_preference': 0.3,
      'technical_decision': 0.3,
      'project_requirement': 0.3,
      'problem_solution': 0.2,
      'learning_insight': 0.2
    };
    score += typeScores[entity.entityType as keyof typeof typeScores] || 0.1;
    
    return Math.min(score, 1.0);
  }

  /**
   * 保存優化後的記憶
   */
  private async saveMemories(memories: MemoryEntity[]): Promise<void> {
    const content = memories
      .map(memory => JSON.stringify(memory))
      .join('\n');
    
    fs.writeFileSync(this.memoryFilePath, content);
    console.log(`💾 已保存 ${memories.length} 條優化記憶`);
  }
}

// 主執行函數
async function main() {
  const optimizer = new MemoryOptimizer();
  
  try {
    await optimizer.optimize();
    console.log('🎉 記憶優化完成！');
  } catch (error) {
    console.error('💥 優化失敗:', error);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

export { MemoryOptimizer };
