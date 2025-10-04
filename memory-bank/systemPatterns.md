# 系統模式文檔

## 奧卡姆剃刀原則應用

### 簡化原則
- **最小化抽象**: 只在必要時創建抽象層
- **直接實現**: 使用最直接的方式解決問題
- **避免過度工程**: 不預先創建可能不需要的功能
- **清晰命名**: 使用直觀的變數和函數名稱

### 代碼組織模式

#### 1. 組件結構
```typescript
// 單一職責組件
interface ComponentProps {
  // 最小必要的 props
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 單一功能實現
  return <div>...</div>;
}
```

#### 2. Hook 模式
```typescript
// 業務邏輯封裝
export function useFeature() {
  const [state, setState] = useState();
  
  const action = useCallback(() => {
    // 單一職責的業務邏輯
  }, []);
  
  return { state, action };
}
```

#### 3. 類型定義
```typescript
// 最小必要類型
interface Entity {
  id: string;
  name: string;
  // 只包含必要欄位
}
```

## 架構模式

### 核心架構決策
基於 ADR (Architecture Decision Records) 確定的架構模式：

#### 1. 技術棧選擇 (ADR-001, ADR-002, ADR-003)
- **前端框架**: Next.js 15 App Router
- **後端服務**: Firebase (Auth + Firestore + Storage)
- **開發語言**: TypeScript
- **UI 框架**: shadcn/ui + Tailwind CSS

#### 2. 組件架構 (ADR-007)
```
app/ (頁面層)
    ↓
components/features/ (功能組件層)
    ↓
components/ (基礎組件層)
    ↓
hooks/ (業務邏輯層)
    ↓
lib/ (工具層)
    ↓
firebase/ (數據層)
```

### 依賴方向原則
- **單向依賴**: 只能從上層依賴下層，嚴禁反向依賴
- **清晰邊界**: 模組間通過公共 API 互動
- **最小耦合**: 減少組件間的直接依賴

### 模組邊界定義
- **app/**: Next.js 頁面和路由
- **components/features/**: 功能特定的業務組件
- **components/**: 可重用的基礎 UI 組件
- **hooks/**: 業務邏輯封裝
- **lib/**: 工具函數和類型定義
- **firebase/**: Firebase 集成和數據層

### 資料流模式
```
Server Component → Client Component → Hook → Firebase
```

## 設計模式

### 1. Provider 模式
```typescript
// 狀態管理
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState();
  
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}
```

### 2. Hook 模式
```typescript
// 業務邏輯封裝
export function useBusinessLogic() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { data, loading, fetchData };
}
```

### 3. 組件組合模式
```typescript
// 組合而非繼承
export function FeatureComponent() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

## 錯誤處理模式

### 1. 邊界錯誤處理
```typescript
export function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <ErrorFallback />;
  }
  
  return children;
}
```

### 2. 異步錯誤處理
```typescript
export function useAsyncOperation() {
  const [error, setError] = useState<Error | null>(null);
  
  const execute = async () => {
    try {
      setError(null);
      await operation();
    } catch (err) {
      setError(err as Error);
    }
  };
  
  return { error, execute };
}
```

## 性能模式

### 1. 懶載入
```typescript
const LazyComponent = lazy(() => import('./Component'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2. 記憶化
```typescript
export function ExpensiveComponent({ data }: { data: Data[] }) {
  const processedData = useMemo(() => {
    return data.map(processItem);
  }, [data]);
  
  return <div>{processedData}</div>;
}
```

### 3. 虛擬化
```typescript
export function VirtualizedList({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <div style={style}>
          <ItemComponent item={items[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

## 測試模式

### 1. 單元測試
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });
});
```

### 2. 整合測試
```typescript
describe('Feature Integration', () => {
  it('should handle user interaction', async () => {
    render(<FeatureComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

## 部署模式

### 1. 環境配置
```typescript
const config = {
  development: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL_DEV,
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL_PROD,
  },
};
```

### 2. 功能標記
```typescript
export function FeatureComponent() {
  const isFeatureEnabled = process.env.NEXT_PUBLIC_FEATURE_FLAG === 'true';
  
  if (!isFeatureEnabled) {
    return null;
  }
  
  return <FeatureContent />;
}
```
