#!/usr/bin/env node

/**
 * Memory Validator - 記憶驗證器
 * 快速驗證 memory.json 格式和內容的 Node.js 腳本
 */

const fs = require('fs');
const path = require('path');

class MemoryValidator {
  constructor() {
    this.memoryFilePath = path.join(process.cwd(), 'memory-bank', 'memory.json');
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 驗證記憶文件
   */
  validate() {
    console.log('🔍 開始驗證 memory.json...\n');

    // 檢查文件是否存在
    if (!fs.existsSync(this.memoryFilePath)) {
      this.errors.push(`記憶文件不存在: ${this.memoryFilePath}`);
      return this.getResults();
    }

    try {
      // 讀取文件內容
      const content = fs.readFileSync(this.memoryFilePath, 'utf-8');
      
      // 檢查是否為空
      if (!content.trim()) {
        this.errors.push('記憶文件為空');
        return this.getResults();
      }

      // 解析 JSON 行
      const lines = content.trim().split('\n');
      const entities = [];
      const relations = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const entity = JSON.parse(line);
          
          // 基本結構驗證
          this.validateBasicStructure(entity, i + 1);
          
          // 分類統計
          if (entity.type === 'entity') {
            entities.push(entity);
            this.validateEntity(entity, i + 1);
          } else if (entity.type === 'relation') {
            relations.push(entity);
            this.validateRelation(entity, i + 1);
          }

        } catch (parseError) {
          this.errors.push(`第 ${i + 1} 行 JSON 解析錯誤: ${parseError.message}`);
        }
      }

      // 統計驗證
      this.validateStatistics(entities, relations);

      // 格式一致性驗證
      this.validateFormatConsistency(content);

    } catch (error) {
      this.errors.push(`文件讀取錯誤: ${error.message}`);
    }

    return this.getResults();
  }

  /**
   * 驗證基本結構
   */
  validateBasicStructure(entity, lineNumber) {
    if (!entity.type) {
      this.errors.push(`第 ${lineNumber} 行缺少 type 字段`);
    } else if (!['entity', 'relation'].includes(entity.type)) {
      this.errors.push(`第 ${lineNumber} 行無效的 type: ${entity.type}`);
    }
  }

  /**
   * 驗證實體
   */
  validateEntity(entity, lineNumber) {
    // 必需字段檢查
    const requiredFields = ['name', 'entityType', 'observations'];
    for (const field of requiredFields) {
      if (!entity[field]) {
        this.errors.push(`第 ${lineNumber} 行實體缺少 ${field} 字段`);
      }
    }

    // 驗證 observations
    if (entity.observations) {
      if (!Array.isArray(entity.observations)) {
        this.errors.push(`第 ${lineNumber} 行 observations 必須是數組`);
      } else {
        // 檢查數量限制
        if (entity.observations.length > 7) {
          this.warnings.push(`第 ${lineNumber} 行實體 ${entity.name} 的 observations 超過 7 個 (${entity.observations.length})`);
        }
        if (entity.observations.length === 0) {
          this.warnings.push(`第 ${lineNumber} 行實體 ${entity.name} 的 observations 為空`);
        }

        // 檢查重複項
        const uniqueObservations = [...new Set(entity.observations)];
        if (uniqueObservations.length !== entity.observations.length) {
          this.warnings.push(`第 ${lineNumber} 行實體 ${entity.name} 的 observations 有重複項`);
        }
      }
    }

    // 驗證實體類型
    const allowedEntityTypes = [
      'user_preference', 'project', 'problem_solution', 'technical_decision',
      'technical_architecture', 'backend_service', 'ui_component_library',
      'security_feature', 'core_feature', 'ai_service', 'design_pattern',
      'type_system', 'data_management', 'architecture_pattern'
    ];
    
    if (entity.entityType && !allowedEntityTypes.includes(entity.entityType)) {
      this.warnings.push(`第 ${lineNumber} 行實體 ${entity.name} 使用了未定義的實體類型: ${entity.entityType}`);
    }
  }

  /**
   * 驗證關係
   */
  validateRelation(relation, lineNumber) {
    // 必需字段檢查
    const requiredFields = ['from', 'to', 'relationType'];
    for (const field of requiredFields) {
      if (!relation[field]) {
        this.errors.push(`第 ${lineNumber} 行關係缺少 ${field} 字段`);
      }
    }

    // 驗證關係類型
    const allowedRelationTypes = [
      'prefers_working_on', 'solved_for', 'requested_solution_for', 'enhances',
      'requested', 'uses', 'includes', 'implements', 'enables', 'supports',
      'follows', 'integrates_with'
    ];
    
    if (relation.relationType && !allowedRelationTypes.includes(relation.relationType)) {
      this.warnings.push(`第 ${lineNumber} 行使用了未定義的關係類型: ${relation.relationType}`);
    }
  }

  /**
   * 驗證統計信息
   */
  validateStatistics(entities, relations) {
    console.log(`📊 統計信息:`);
    console.log(`  實體數量: ${entities.length}`);
    console.log(`  關係數量: ${relations.length}`);

    // 檢查實體類型分佈
    const entityTypeCount = {};
    entities.forEach(entity => {
      if (entity.entityType) {
        entityTypeCount[entity.entityType] = (entityTypeCount[entity.entityType] || 0) + 1;
      }
    });

    console.log(`  實體類型分佈:`);
    Object.entries(entityTypeCount).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}`);
    });

    // 檢查關係類型分佈
    const relationTypeCount = {};
    relations.forEach(relation => {
      if (relation.relationType) {
        relationTypeCount[relation.relationType] = (relationTypeCount[relation.relationType] || 0) + 1;
      }
    });

    console.log(`  關係類型分佈:`);
    Object.entries(relationTypeCount).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}`);
    });

    // 檢查平均 observations 數量
    const totalObservations = entities.reduce((sum, entity) => sum + (entity.observations?.length || 0), 0);
    const averageObservations = entities.length > 0 ? (totalObservations / entities.length).toFixed(2) : 0;
    console.log(`  平均 observations 數量: ${averageObservations}`);
  }

  /**
   * 驗證格式一致性
   */
  validateFormatConsistency(content) {
    const lines = content.trim().split('\n');
    
    // 檢查每行是否為有效的 JSON
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim()) {
        try {
          JSON.parse(line);
        } catch (error) {
          this.errors.push(`第 ${i + 1} 行不是有效的 JSON`);
        }
      }
    }

    // 檢查文件結尾是否有換行符
    if (!content.endsWith('\n')) {
      this.warnings.push('文件結尾缺少換行符');
    }
  }

  /**
   * 獲取驗證結果
   */
  getResults() {
    console.log('\n📋 驗證結果:');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 所有驗證通過！記憶文件格式正確。');
    } else {
      if (this.errors.length > 0) {
        console.log(`❌ 錯誤 (${this.errors.length}):`);
        this.errors.forEach(error => console.log(`  - ${error}`));
      }
      
      if (this.warnings.length > 0) {
        console.log(`⚠️  警告 (${this.warnings.length}):`);
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

// 主執行邏輯
if (require.main === module) {
  const validator = new MemoryValidator();
  const results = validator.validate();
  
  // 設置退出碼
  process.exit(results.isValid ? 0 : 1);
}

module.exports = MemoryValidator;
