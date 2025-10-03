# Memory Bank: 系統模式

## 🏗️ 核心架構模式

### 1. 分層架構 (Layered Architecture)
```
┌─────────────────────────────────────┐
│           Presentation Layer        │ ← React Components, Pages
├─────────────────────────────────────┤
│           Business Logic Layer      │ ← Hooks, Services, Context
├─────────────────────────────────────┤
│           Data Access Layer         │ ← Firebase Hooks, Queries
├─────────────────────────────────────┤
│           External Services         │ ← Firebase, AI Services
└─────────────────────────────────────┘
```

### 2. 模組化架構 (Modular Architecture)
| 目錄 | 用途 | 依賴方向 |
|------|------|----------|
| **features/** | 功能模組 (organizations, spaces, users) | → components |
| **components/** | 可重用元件 | → shared |
| **shared/** | 共享工具與類型 | 無依賴 |

### 3. 容器-展示模式 (Container-Presenter Pattern)
| 類型 | 職責 | 位置 |
|------|------|------|
| **Container** | 資料邏輯與狀態管理 | 業務邏輯層 |
| **Presenter** | UI 渲染與用戶互動 | 展示層 |

## 設計模式

### 1. Provider 模式
```typescript
// 認證 Provider
<AuthProvider>
  <AppStateProvider>
    <FirebaseClientProvider>
      {children}
    </FirebaseClientProvider>
  </AppStateProvider>
</AuthProvider>
```

### 2. Hook 模式
```typescript
// 自定義 Hook 封裝邏輯
const { user, isUserLoading } = useUser();
const { data: spaces, isLoading } = useCollection<Space>(spacesQuery);
```

### 3. Compound Component 模式
```typescript
// 複合元件組合
<FormCard form={form} onSubmit={handleSubmit}>
  <FormField control={control} name="name" />
  <FormField control={control} name="description" />
</FormCard>
```

### 4. Render Props 模式
```typescript
// 透過 children 函數傳遞資料
<DataProvider>
  {({ data, loading, error }) => (
    <Component data={data} loading={loading} error={error} />
  )}
</DataProvider>
```

## 狀態管理模式

### 1. Context + Reducer 模式
```typescript
// 全域狀態管理
const AppStateContext = createContext<AppState | null>(null);
const AppStateReducer = (state: AppState, action: AppStateAction) => { ... };
```

### 2. Server State 分離
```typescript
// TanStack Query 管理伺服器狀態
const { data, isLoading, error } = useQuery({
  queryKey: ['spaces', userId],
  queryFn: () => fetchSpaces(userId)
});
```

### 3. 樂觀更新 (Optimistic Updates)
```typescript
// 立即更新 UI，後台同步
const mutation = useMutation({
  mutationFn: createSpace,
  onMutate: async (newSpace) => {
    // 樂觀更新
    queryClient.setQueryData(['spaces'], old => [...old, newSpace]);
  }
});
```

## 資料管理模式

### 1. 統一資料模型
```typescript
// 統一的 Account 類型
interface Account extends BaseEntity {
  type: 'user' | 'organization';
  name: string;
  slug: string;
  // ... 其他欄位
}
```

### 2. 資料正規化
```typescript
// Firestore 資料結構
/accounts/{accountId}           // 用戶與組織
/spaces/{spaceId}              // 空間實體
/organizations/{orgId}/items/  // 組織相關資料
```

### 3. 查詢優化
```typescript
// 複合查詢與索引
const spacesQuery = query(
  collection(firestore, 'spaces'),
  where('ownerId', '==', userId),
  orderBy('createdAt', 'desc')
);
```

## 錯誤處理模式

### 1. 錯誤邊界 (Error Boundaries)
```typescript
// React Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
}
```

### 2. 統一錯誤處理
```typescript
// Firebase 錯誤監聽器
const FirebaseErrorListener = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && isAuthenticated) {
        // 處理認證錯誤
      }
    });
    return unsubscribe;
  }, []);
};
```

### 3. 錯誤狀態管理
```typescript
// 錯誤狀態整合
interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}
```

## 效能優化模式

### 1. 程式碼分割 (Code Splitting)
```typescript
// 動態導入
const LazyComponent = lazy(() => import('./LazyComponent'));

// 路由層級分割
const Dashboard = lazy(() => import('./dashboard/page'));
```

### 2. 虛擬化 (Virtualization)
```typescript
// 大量資料虛擬化
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

### 3. 記憶化 (Memoization)
```typescript
// React.memo 與 useMemo
const MemoizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processData(data), [data]
  );
  return <div>{processedData}</div>;
});
```

## 安全性模式

### 1. 權限檢查模式
```typescript
// 權限守衛元件
const PermissionGuard = ({ permission, children }) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <AccessDenied />;
  }
  
  return children;
};
```

### 2. 輸入驗證模式
```typescript
// Zod Schema 驗證
const SpaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  isPublic: z.boolean()
});
```

### 3. 資料清理模式
```typescript
// XSS 防護
const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input);
};
```

## 測試模式

### 1. 測試金字塔
```
    E2E Tests (少量)
   /               \
  Integration Tests (中等)
 /                   \
Unit Tests (大量)
```

### 2. 測試隔離
```typescript
// Mock Firebase
jest.mock('@/firebase', () => ({
  useUser: () => ({ user: mockUser, isLoading: false }),
  useFirestore: () => mockFirestore,
}));
```

### 3. 測試驅動開發
```typescript
// 先寫測試
describe('SpaceService', () => {
  it('should create space with valid data', async () => {
    const space = await createSpace(validSpaceData);
    expect(space.id).toBeDefined();
  });
});
```

## 部署模式

### 1. 環境配置
```typescript
// 環境變數管理
const config = {
  development: { apiUrl: 'http://localhost:3000' },
  production: { apiUrl: 'https://api.production.com' }
};
```

### 2. 功能開關 (Feature Flags)
```typescript
// 功能開關
const useFeatureFlag = (flag: string) => {
  return process.env.NEXT_PUBLIC_FEATURE_FLAGS?.includes(flag) ?? false;
};
```

### 3. 漸進式部署
```typescript
// A/B 測試
const useABTest = (testName: string) => {
  const variant = useFeatureFlag(`AB_${testName}`);
  return variant;
};
```

## 監控與日誌模式

### 1. 結構化日誌
```typescript
// 統一日誌格式
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, meta }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({ level: 'error', message, error }));
  }
};
```

### 2. 效能監控
```typescript
// 效能指標收集
const trackPerformance = (metric: string, value: number) => {
  // 發送到監控服務
  analytics.track('performance', { metric, value });
};
```

### 3. 錯誤追蹤
```typescript
// 錯誤報告
const reportError = (error: Error, context?: object) => {
  // 發送到錯誤追蹤服務
  errorReporting.captureException(error, { extra: context });
};
```