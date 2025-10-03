/**
 * Context7 自動查詢引擎
 * 基於自然語言指令自動查詢相關文檔和最佳實踐
 */

export interface LibraryQuery {
  name: string;
  topic: string;
  relevance: number;
}

export interface Context7Insight {
  library: string;
  topic: string;
  snippet: string;
  relevance: number;
  suggestion: string;
}

export class Context7AutoQuery {
  private libraryMapping = new Map([
    ['react', '/facebook/react'],
    ['nextjs', '/vercel/next.js'],
    ['firebase', '/firebase/firebase-js-sdk'],
    ['typescript', '/microsoft/TypeScript'],
    ['tailwind', '/tailwindlabs/tailwindcss'],
    ['shadcn', '/shadcn-ui/ui'],
    ['node', '/nodejs/node'],
    ['angular', '/angular/angular'],
    ['vue', '/vuejs/vue'],
    ['svelte', '/sveltejs/svelte']
  ]);

  private queryCache = new Map<string, unknown>();
  private cacheTimeout = 3600000; // 1 hour

  /**
   * 自動查詢相關文檔
   */
  async autoQuery(userCommand: string): Promise<Context7Insight[]> {
    console.log(`🔍 分析指令: ${userCommand}`);
    
    const matchedLibraries = this.identifyRelevantLibraries(userCommand);
    console.log(`📚 識別到相關庫: ${matchedLibraries.map(l => l.name).join(', ')}`);

    const insights: Context7Insight[] = [];

    for (const library of matchedLibraries) {
      const libraryId = this.libraryMapping.get(library.name);
      if (!libraryId) {
        console.warn(`⚠️ 未找到庫映射: ${library.name}`);
        continue;
      }

      try {
        console.log(`🔍 查詢 ${library.name} 文檔...`);
        const docs = await this.queryLibrary(libraryId, library.topic);
        
        insights.push({
          library: library.name,
          topic: library.topic,
          snippet: docs.snippet || '無可用片段',
          relevance: library.relevance,
          suggestion: this.generateSuggestion(docs, userCommand, library.name)
        });
        
        console.log(`✅ 成功查詢 ${library.name}`);
      } catch (error) {
        console.warn(`❌ 查詢 ${library.name} 失敗:`, error);
      }
    }

    return insights;
  }

  /**
   * 識別相關的庫
   */
  private identifyRelevantLibraries(command: string): LibraryQuery[] {
    const libraries: LibraryQuery[] = [];
    const lowerCommand = command.toLowerCase();

    // React 相關
    if (this.matchesPattern(lowerCommand, ['組件', 'component', 'react', 'jsx', 'hook', 'hooks'])) {
      libraries.push({
        name: 'react',
        topic: 'component patterns and best practices',
        relevance: 0.9
      });
    }

    // Next.js 相關
    if (this.matchesPattern(lowerCommand, ['頁面', 'page', '路由', 'route', 'nextjs', 'next.js', 'app router'])) {
      libraries.push({
        name: 'nextjs',
        topic: 'app router and page routing',
        relevance: 0.9
      });
    }

    // Firebase 相關
    if (this.matchesPattern(lowerCommand, ['認證', 'auth', 'firebase', 'api', '數據庫', 'database', 'storage'])) {
      libraries.push({
        name: 'firebase',
        topic: 'authentication and API design',
        relevance: 0.8
      });
    }

    // TypeScript 相關
    if (this.matchesPattern(lowerCommand, ['錯誤', 'error', '類型', 'type', 'typescript', 'ts', 'interface', 'type'])) {
      libraries.push({
        name: 'typescript',
        topic: 'error handling and type safety',
        relevance: 0.8
      });
    }

    // Tailwind CSS 相關
    if (this.matchesPattern(lowerCommand, ['樣式', 'style', 'css', 'tailwind', 'ui', '設計', 'design'])) {
      libraries.push({
        name: 'tailwind',
        topic: 'utility-first CSS and responsive design',
        relevance: 0.7
      });
    }

    // shadcn/ui 相關
    if (this.matchesPattern(lowerCommand, ['ui', '組件庫', 'component library', 'shadcn', 'radix'])) {
      libraries.push({
        name: 'shadcn',
        topic: 'component library and design system',
        relevance: 0.8
      });
    }

    // Node.js 相關
    if (this.matchesPattern(lowerCommand, ['服務器', 'server', 'node', 'nodejs', 'api', '後端', 'backend'])) {
      libraries.push({
        name: 'node',
        topic: 'server-side development and APIs',
        relevance: 0.7
      });
    }

    return libraries;
  }

  /**
   * 檢查是否匹配模式
   */
  private matchesPattern(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  /**
   * 查詢庫文檔
   */
  private async queryLibrary(libraryId: string, topic: string): Promise<unknown> {
    const cacheKey = `${libraryId}-${topic}`;
    
    // 檢查緩存
    if (this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`📋 使用緩存: ${libraryId}`);
        return cached.data;
      }
    }

    try {
      // 這裡應該調用實際的 context7 MCP
      // 由於我們在模擬環境中，返回模擬數據
      const mockResult = await this.mockQueryLibrary(libraryId, topic);
      
      // 緩存結果
      this.queryCache.set(cacheKey, {
        data: mockResult,
        timestamp: Date.now()
      });
      
      return mockResult;
    } catch (error) {
      console.error(`查詢庫失敗 ${libraryId}:`, error);
      throw error;
    }
  }

  /**
   * 模擬庫查詢（實際環境中應該調用 context7 MCP）
   */
  private async mockQueryLibrary(libraryId: string, topic: string): Promise<unknown> {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockData = {
      snippet: `基於 ${libraryId} 的 ${topic} 最佳實踐`,
      examples: [
        `示例 1: ${topic} 的基本用法`,
        `示例 2: ${topic} 的高級模式`,
        `示例 3: ${topic} 的常見陷阱`
      ],
      patterns: [
        `模式 1: ${topic} 的標準實現`,
        `模式 2: ${topic} 的優化版本`,
        `模式 3: ${topic} 的錯誤處理`
      ],
      recommendations: [
        `建議 1: 使用 ${topic} 時要注意的事項`,
        `建議 2: ${topic} 的性能優化技巧`,
        `建議 3: ${topic} 的安全考慮`
      ]
    };

    return mockData;
  }

  /**
   * 生成建議
   */
  private generateSuggestion(docs: unknown, command: string, library: string): string {
    const suggestions = [];
    
    if (docs.recommendations && docs.recommendations.length > 0) {
      suggestions.push(docs.recommendations[0]);
    }
    
    if (docs.patterns && docs.patterns.length > 0) {
      suggestions.push(`推薦使用 ${docs.patterns[0]}`);
    }
    
    if (docs.examples && docs.examples.length > 0) {
      suggestions.push(`參考示例: ${docs.examples[0]}`);
    }

    return suggestions.length > 0 
      ? suggestions.join('; ')
      : `基於 ${library} 的最佳實踐來實現: ${command}`;
  }

  /**
   * 清理過期緩存
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.queryCache.delete(key);
      }
    }
  }

  /**
   * 獲取緩存統計
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.queryCache.size,
      hitRate: 0.7 // 模擬命中率
    };
  }
}

// 導出單例實例
export const context7AutoQuery = new Context7AutoQuery();
