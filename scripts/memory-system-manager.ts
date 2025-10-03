#!/usr/bin/env tsx

/**
 * Memory System Manager - 記憶系統管理器
 * 提供健壯的記憶數據管理、驗證和錯誤處理功能
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface MemoryEntity {
  type: 'entity' | 'relation';
  name?: string;
  entityType?: string;
  observations?: string[];
  from?: string;
  to?: string;
  relationType?: string;
}

interface MemorySystemConfig {
  maxObservations: number;
  minObservations: number;
  allowedEntityTypes: string[];
  allowedRelationTypes: string[];
  backupEnabled: boolean;
  validationEnabled: boolean;
}

class MemorySystemManager {
  private config: MemorySystemConfig;
  private memoryFilePath: string;
  private backupFilePath: string;

  constructor(config?: Partial<MemorySystemConfig>) {
    this.config = {
      maxObservations: 7,
      minObservations: 1,
      allowedEntityTypes: [
        'user_preference', 'project', 'problem_solution', 'technical_decision',
        'technical_architecture', 'backend_service', 'ui_component_library',
        'security_feature', 'core_feature', 'ai_service', 'design_pattern',
        'type_system', 'data_management', 'architecture_pattern'
      ],
      allowedRelationTypes: [
        'prefers_working_on', 'solved_for', 'requested_solution_for', 'enhances',
        'requested', 'uses', 'includes', 'implements', 'enables', 'supports',
        'follows', 'integrates_with'
      ],
      backupEnabled: true,
      validationEnabled: true,
      ...config
    };

    this.memoryFilePath = join(process.cwd(), 'memory-bank', 'memory.json');
    this.backupFilePath = join(process.cwd(), 'memory-bank', 'memory.backup.json');
  }

  /**
   * 讀取並解析記憶文件
   */
  public readMemoryFile(): MemoryEntity[] {
    try {
      if (!existsSync(this.memoryFilePath)) {
        throw new Error(`Memory file not found: ${this.memoryFilePath}`);
      }

      const content = readFileSync(this.memoryFilePath, 'utf-8');
      const lines = content.trim().split('\n');
      const entities: MemoryEntity[] = [];

      for (const line of lines) {
        if (line.trim()) {
          try {
            const entity = JSON.parse(line) as MemoryEntity;
            entities.push(entity);
          } catch (parseError) {
            console.warn(`Failed to parse line: ${line}`, parseError);
          }
        }
      }

      return entities;
    } catch (error) {
      console.error('Error reading memory file:', error);
      throw error;
    }
  }

  /**
   * 驗證記憶實體
   */
  public validateEntity(entity: MemoryEntity): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 基本結構驗證
    if (!entity.type) {
      errors.push('Entity must have a type');
    }

    if (entity.type === 'entity') {
      if (!entity.name) errors.push('Entity must have a name');
      if (!entity.entityType) errors.push('Entity must have an entityType');
      if (!entity.observations || !Array.isArray(entity.observations)) {
        errors.push('Entity must have observations array');
      } else {
        // 驗證 observations 數量
        if (entity.observations.length > this.config.maxObservations) {
          errors.push(`Entity observations exceed maximum (${this.config.maxObservations})`);
        }
        if (entity.observations.length < this.config.minObservations) {
          errors.push(`Entity observations below minimum (${this.config.minObservations})`);
        }
        // 驗證 entityType
        if (!this.config.allowedEntityTypes.includes(entity.entityType!)) {
          errors.push(`Invalid entityType: ${entity.entityType}`);
        }
      }
    } else if (entity.type === 'relation') {
      if (!entity.from) errors.push('Relation must have from');
      if (!entity.to) errors.push('Relation must have to');
      if (!entity.relationType) errors.push('Relation must have relationType');
      
      // 驗證 relationType
      if (!this.config.allowedRelationTypes.includes(entity.relationType!)) {
        errors.push(`Invalid relationType: ${entity.relationType}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 驗證所有記憶實體
   */
  public validateAllEntities(entities: MemoryEntity[]): {
    validEntities: MemoryEntity[];
    invalidEntities: { entity: MemoryEntity; errors: string[] }[];
  } {
    const validEntities: MemoryEntity[] = [];
    const invalidEntities: { entity: MemoryEntity; errors: string[] }[] = [];

    for (const entity of entities) {
      const validation = this.validateEntity(entity);
      if (validation.isValid) {
        validEntities.push(entity);
      } else {
        invalidEntities.push({ entity, errors: validation.errors });
      }
    }

    return { validEntities, invalidEntities };
  }

  /**
   * 創建備份
   */
  public createBackup(): void {
    try {
      if (existsSync(this.memoryFilePath)) {
        const content = readFileSync(this.memoryFilePath, 'utf-8');
        writeFileSync(this.backupFilePath, content, 'utf-8');
        console.log('✅ Backup created successfully');
      }
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
    }
  }

  /**
   * 恢復備份
   */
  public restoreBackup(): void {
    try {
      if (existsSync(this.backupFilePath)) {
        const content = readFileSync(this.backupFilePath, 'utf-8');
        writeFileSync(this.memoryFilePath, content, 'utf-8');
        console.log('✅ Backup restored successfully');
      } else {
        throw new Error('Backup file not found');
      }
    } catch (error) {
      console.error('❌ Failed to restore backup:', error);
    }
  }

  /**
   * 優化實體 observations
   */
  public optimizeEntityObservations(entity: MemoryEntity): MemoryEntity {
    if (entity.type !== 'entity' || !entity.observations) {
      return entity;
    }

    // 去重
    const uniqueObservations = [...new Set(entity.observations)];
    
    // 如果仍然超過限制，保留最重要的
    if (uniqueObservations.length > this.config.maxObservations) {
      // 簡單的優先級排序：保留前 N 個
      entity.observations = uniqueObservations.slice(0, this.config.maxObservations);
    } else {
      entity.observations = uniqueObservations;
    }

    return entity;
  }

  /**
   * 保存記憶文件
   */
  public saveMemoryFile(entities: MemoryEntity[]): void {
    try {
      // 創建備份
      if (this.config.backupEnabled) {
        this.createBackup();
      }

      // 優化實體
      const optimizedEntities = entities.map(entity => this.optimizeEntityObservations(entity));

      // 驗證
      if (this.config.validationEnabled) {
        const validation = this.validateAllEntities(optimizedEntities);
        if (validation.invalidEntities.length > 0) {
          console.warn('⚠️ Some entities failed validation:', validation.invalidEntities);
        }
      }

      // 寫入文件
      const content = optimizedEntities
        .map(entity => JSON.stringify(entity))
        .join('\n') + '\n';

      writeFileSync(this.memoryFilePath, content, 'utf-8');
      console.log('✅ Memory file saved successfully');
    } catch (error) {
      console.error('❌ Failed to save memory file:', error);
      throw error;
    }
  }

  /**
   * 獲取統計信息
   */
  public getStatistics(): {
    totalEntities: number;
    totalRelations: number;
    entityTypes: Record<string, number>;
    relationTypes: Record<string, number>;
    averageObservations: number;
  } {
    const entities = this.readMemoryFile();
    const entityCount = entities.filter(e => e.type === 'entity').length;
    const relationCount = entities.filter(e => e.type === 'relation').length;

    const entityTypes: Record<string, number> = {};
    const relationTypes: Record<string, number> = {};
    let totalObservations = 0;

    for (const entity of entities) {
      if (entity.type === 'entity') {
        entityTypes[entity.entityType!] = (entityTypes[entity.entityType!] || 0) + 1;
        totalObservations += entity.observations?.length || 0;
      } else if (entity.type === 'relation') {
        relationTypes[entity.relationType!] = (relationTypes[entity.relationType!] || 0) + 1;
      }
    }

    return {
      totalEntities: entityCount,
      totalRelations: relationCount,
      entityTypes,
      relationTypes,
      averageObservations: entityCount > 0 ? Math.round(totalObservations / entityCount * 100) / 100 : 0
    };
  }
}

// CLI 接口
if (require.main === module) {
  const manager = new MemorySystemManager();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'validate':
      try {
        const entities = manager.readMemoryFile();
        const validation = manager.validateAllEntities(entities);
        console.log(`✅ Valid entities: ${validation.validEntities.length}`);
        console.log(`❌ Invalid entities: ${validation.invalidEntities.length}`);
        if (validation.invalidEntities.length > 0) {
          validation.invalidEntities.forEach(({ entity, errors }) => {
            console.log(`- ${entity.name || 'Unknown'}: ${errors.join(', ')}`);
          });
        }
      } catch (error) {
        console.error('Validation failed:', error);
      }
      break;
      
    case 'stats':
      try {
        const stats = manager.getStatistics();
        console.log('📊 Memory System Statistics:');
        console.log(`Total Entities: ${stats.totalEntities}`);
        console.log(`Total Relations: ${stats.totalRelations}`);
        console.log(`Average Observations: ${stats.averageObservations}`);
        console.log('Entity Types:', stats.entityTypes);
        console.log('Relation Types:', stats.relationTypes);
      } catch (error) {
        console.error('Failed to get statistics:', error);
      }
      break;
      
    case 'optimize':
      try {
        const entities = manager.readMemoryFile();
        manager.saveMemoryFile(entities);
        console.log('✅ Memory file optimized successfully');
      } catch (error) {
        console.error('Optimization failed:', error);
      }
      break;
      
    case 'backup':
      try {
        manager.createBackup();
      } catch (error) {
        console.error('Backup failed:', error);
      }
      break;
      
    case 'restore':
      try {
        manager.restoreBackup();
      } catch (error) {
        console.error('Restore failed:', error);
      }
      break;
      
    default:
      console.log('Usage: tsx memory-system-manager.ts [validate|stats|optimize|backup|restore]');
  }
}

export default MemorySystemManager;
