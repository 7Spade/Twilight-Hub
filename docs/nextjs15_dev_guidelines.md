# Next.js 15 App Router 開發規範指南

> **版本**: 1.0  
> **最後更新**: 2025-10-03  
> **適用範圍**: Next.js 15 + TypeScript + App Router

## 🤖 AI Agent 零認知開發指南

### 26. 明確的職責邊界

**讓 Agent 立即知道在哪裡寫什麼代碼**

```
📁 文件類型自動決定能做什麼：

'use client' 組件：
✅ 可以：Firebase 所有操作、React Hooks、事件處理、瀏覽器 API
❌ 不能：直接調用外部 API、複雜服務端邏輯

'use server' 函數：
✅ 可以：Genkit AI、第三方 API、複雜計算、外部服務
❌ 不能：Firebase 客戶端 SDK、瀏覽器 API、React Hooks

Server Components：
✅ 可以：渲染靜態內容、讀取環境變數、簡單計算
❌ 不能：Firebase、事件處理、React Hooks
```

### 27. 零配置的文件命名約定

**文件名即用途，Agent 看到文件名就知道要寫什麼**

```
命名規則：

[feature].actions.ts       → Server Actions（AI、API 調用）
[feature].client.tsx       → 客戶端組件（Firebase 操作）
[feature].types.ts         → TypeScript 類型定義
[feature].schema.ts        → Zod 驗證 schema
[feature].queries.ts       → React Query hooks

範例：
auth.actions.ts            → AI 驗證、發送郵件等
auth.client.tsx            → Firebase Auth 登入組件
auth.schema.ts             → 登入表單驗證 schema
user.queries.ts            → useUser、useUserProfile hooks
```

### 28. 自解釋的代碼結構

**每個文件都有清晰的模板，Agent 直接複製模式**

**Client Component 模板**：
```typescript
'use client'

// 1. 套件導入
import { useState } from 'react'
import { auth, db } from '@/lib/firebase'

// 2. 類型定義
interface Props {
  userId: string
}

// 3. 組件定義
export function UserProfile({ userId }: Props) {
  // 4. Hooks
  const [loading, setLoading] = useState(false)
  
  // 5. Firebase 操作
  async function handleUpdate() {
    setLoading(true)
    try {
      // Firebase 操作
    } catch (error) {
      // 錯誤處理
    } finally {
      setLoading(false)
    }
  }
  
  // 6. 渲染
  return <div>...</div>
}
```

**Server Actions 模板**：
```typescript
'use server'

// 1. 套件導入（不含 Firebase）
import { genkit } from '@/lib/genkit'

// 2. 類型定義
interface Input {
  prompt: string
}

interface Output {
  success: boolean
  data?: string
  error?: string
}

// 3. Action 函數
export async function generateText(input: Input): Promise<Output> {
  try {
    // 4. 驗證輸入
    if (!input.prompt) {
      return { success: false, error: '缺少提示' }
    }
    
    // 5. 執行邏輯（AI、API 等）
    const result = await genkit.generate(input.prompt)
    
    // 6. 返回結果
    return { success: true, data: result }
  } catch (error) {
    // 7. 錯誤處理
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '未知錯誤' 
    }
  }
}
```

**React Query Hook 模板**：
```typescript
'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// 查詢 Hook
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.data()
    },
    enabled: !!userId, // 條件查詢
  })
}

// 變更 Hook
export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: any }) => {
      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, data)
    },
    onSuccess: () => {
      // 失效緩存
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
```

### 29. 標準化的錯誤處理

**統一的錯誤處理模式，Agent 不需要思考**

```typescript
// 錯誤處理工具
// lib/errors.ts

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FIREBASE_ERROR: 'FIREBASE_ERROR',
  AI_ERROR: 'AI_ERROR',
} as const

// 在任何地方統一使用
throw new AppError(
  ERROR_CODES.VALIDATION_ERROR,
  '電子郵件格式不正確',
  400
)
```

### 30. 預定義的目錄結構

**Agent 看到路徑就知道放什麼**

```
app/
├── (public)/              # 公開頁面（無需認證）
│   ├── page.tsx          # 首頁
│   ├── about/
│   └── pricing/
├── (auth)/               # 認證相關
│   ├── login/
│   │   ├── page.tsx      # 登入頁面
│   │   └── login.client.tsx  # 登入組件（Firebase Auth）
│   └── register/
├── (app)/                # 需要認證的應用
│   ├── layout.tsx        # 應用佈局（檢查認證）
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── dashboard.client.tsx    # 儀表板組件
│   │   ├── dashboard.actions.ts    # AI 分析等
│   │   └── dashboard.queries.ts    # React Query
│   └── profile/
├── api/
│   └── health/           # 只放健康檢查等特殊端點
└── layout.tsx

components/
├── ui/                   # Radix + shadcn 組件
├── layouts/              # 佈局組件
└── features/             # 功能組件
    └── [feature]/
        ├── [feature].client.tsx   # 客戶端邏輯
        ├── [feature].schema.ts    # Zod schema
        └── [feature].types.ts     # 類型

lib/
├── firebase.ts           # Firebase 初始化
├── genkit.ts            # Genkit 初始化
├── utils.ts             # 工具函數
├── errors.ts            # 錯誤處理
└── constants.ts         # 常數定義

hooks/
├── use-auth.ts          # 認證相關
├── use-firebase.ts      # Firebase 通用操作
└── use-[feature].ts     # 功能 hooks
```

### 31. 自動化的類型生成

**從 Zod Schema 自動生成 TypeScript 類型**

```typescript
// schemas/user.schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['user', 'admin']),
  createdAt: z.date(),
})

// 自動推導類型，不需要手寫
export type User = z.infer<typeof userSchema>

// 在組件中使用
import { userSchema, type User } from '@/schemas/user.schema'

function UserCard({ user }: { user: User }) {
  // TypeScript 自動補全和檢查
  return <div>{user.name}</div>
}
```

### 32. React Query 的命名約定

**統一的 Query Key 結構**

```typescript
// lib/query-keys.ts

export const queryKeys = {
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    posts: (id: string) => ['users', id, 'posts'] as const,
  },
  posts: {
    all: ['posts'] as const,
    detail: (id: string) => ['posts', id] as const,
    comments: (id: string) => ['posts', id, 'comments'] as const,
  },
} as const

// 使用時
useQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => fetchUser(userId),
})
```

### 33. 環境變數的清單式管理

**一個文件列出所有需要的環境變數**

```typescript
// lib/env.ts

/**
 * 環境變數清單
 * Agent 看這個文件就知道需要哪些環境變數
 */

// ⚠️ 客戶端可見（需要 NEXT_PUBLIC_ 前綴）
export const ENV = {
  // Firebase 配置
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  
  // 應用配置
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'My App',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
} as const

// 🔒 僅服務端可見
export const SERVER_ENV = {
  // AI 服務
  GENKIT_API_KEY: process.env.GENKIT_API_KEY!,
  
  // 第三方服務
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT!,
} as const

// 啟動時驗證
if (typeof window === 'undefined') {
  const missing = Object.entries(SERVER_ENV)
    .filter(([_, value]) => !value)
    .map(([key]) => key)
  
  if (missing.length > 0) {
    throw new Error(`缺少環境變數: ${missing.join(', ')}`)
  }
}
```

### 34. 一鍵式開發指令

**package.json 提供清晰的開發流程**

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:genkit": "genkit start",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "check-all": "npm run type-check && npm run lint"
  }
}
```

**開發流程註解**：
```bash
# 1. 啟動開發服務器
npm run dev

# 2. (可選) 如果需要測試 AI 功能
npm run dev:genkit

# 3. 提交前檢查
npm run check-all

# 4. 構建生產版本
npm run build
```

### 35. 註解驅動開發

**關鍵決策用註解說明，Agent 讀註解就懂**

```typescript
/**
 * 用戶認證組件
 * 
 * 📍 位置：客戶端組件（Firebase Auth 只能在客戶端使用）
 * 🔧 依賴：Firebase Auth
 * 📊 狀態管理：React Query
 * 
 * 流程：
 * 1. 用戶輸入帳號密碼
 * 2. 驗證表單（Zod）
 * 3. 調用 Firebase signInWithEmailAndPassword
 * 4. 成功後重定向到 dashboard
 * 5. 失敗顯示錯誤訊息（使用 sonner toast）
 */
'use client'

export function LoginForm() {
  // ... 實現
}
```

```typescript
/**
 * AI 文本生成 Action
 * 
 * 📍 位置：Server Action（AI 服務只能在服務端調用）
 * 🔧 依賴：Genkit
 * 🚫 不能使用：Firebase 客戶端 SDK
 * 
 * 輸入：用戶提示文本
 * 輸出：AI 生成的文本
 * 錯誤：返回結構化錯誤對象，不拋出異常
 */
'use server'

export async function generateText(prompt: string) {
  // ... 實現
}
```

### 36. 配置文件的自解釋

**每個配置都有註解說明用途**

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  // 只掃描這些文件，提升性能
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      colors: {
        // 使用 CSS 變數，支持暗色模式切換
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      // 自定義動畫
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  
  plugins: [
    // Radix UI 動畫支持
    require('tailwindcss-animate'),
  ],
}

export default config
```

### 37. 決策樹式的條件邏輯

**複雜邏輯用決策樹註解，Agent 直接看懂**

```typescript
/**
 * 根據用戶狀態決定顯示哪個頁面
 * 
 * 決策樹：
 * ├─ 未登入？
 * │  └─ 顯示登入頁面
 * ├─ 已登入但未驗證郵箱？
 * │  └─ 顯示郵箱驗證提示
 * ├─ 已登入且已驗證？
 * │  ├─ 是管理員？
 * │  │  └─ 顯示管理後台
 * │  └─ 是普通用戶？
 * │     └─ 顯示用戶儀表板
 */
export function RootLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <LoginPage />
  if (!user.emailVerified) return <EmailVerificationPrompt />
  if (user.role === 'admin') return <AdminLayout>{children}</AdminLayout>
  return <UserLayout>{children}</UserLayout>
}
```

### 38. 零認知檢查清單

**Agent 開發前的自我檢查**

```markdown
在開始寫代碼前，Agent 問自己：

□ 這個文件應該是 'use client' 還是 'use server'？
  - 需要 Firebase？ → 'use client'
  - 需要 AI/外部 API？ → 'use server'
  - 只是展示？ → Server Component

□ 文件命名對了嗎？
  - [feature].actions.ts
  - [feature].client.tsx
  - [feature].schema.ts

□ 導入的套件對了嗎？
  - 'use client' 可以用 firebase
  - 'use server' 可以用 genkit
  - 不要混用

□ 錯誤處理用對了嗎？
  - 統一返回 { success, data?, error? }
  - 使用 AppError 類型

□ 類型定義了嗎？
  - 優先從 Zod schema 推導
  - 複雜類型放在 .types.ts
```

---

## 📋 目錄

- [核心開發原則](#核心開發原則)
- [架構設計規範](#架構設計規範)
- [數據管理策略](#數據管理策略)
- [UI 組件規範](#ui-組件規範)
- [用戶體驗優化](#用戶體驗優化)
- [AI 與外部服務整合](#ai-與外部服務整合)
- [容器化與部署](#容器化與部署)
- [代碼質量保證](#代碼質量保證)
- [AI Agent 零認知開發指南](#ai-agent-零認知開發指南)

---

## 🎯 核心開發原則

### 奧卡姆剃刀法則
**如無必要，勿增實體**

- ✅ **刪除未使用的代碼和依賴**，定期審查所有已安裝的套件
- ✅ **函數只用一次就內聯**，不預先建立「可能需要」的抽象層
- ✅ **優先使用平台原生能力**，只在確實需要時才引入第三方庫
- ❌ 避免過度封裝和過度工程化
- ❌ 不為未來可能的需求預先設計架構

### 最少代碼開發
**讓框架和工具完成重複工作**

- 利用 Next.js 自動化特性（路由、渲染、優化）
- 使用宣告式編程，減少命令式樣板代碼
- 依賴工具的預設配置，避免過度客製化

---

## 🏗️ 架構設計規範

### 1. Server Actions 與 Firebase 分離策略

**原則**：Server Actions 處理非 Firebase 的服務端邏輯

```
✅ Server Actions 適用場景：
- AI 服務調用（Genkit）
- 第三方 API 整合
- 複雜計算和數據處理
- 發送郵件、通知等外部服務
- 生成 PDF、處理文件等

❌ Server Actions 不能做：
- 使用 Firebase 客戶端 SDK（會報錯）
- 直接操作 Firestore、Auth、Storage

✅ Firebase 數據操作：
- 在 'use client' 組件中直接調用
- 依賴 Firebase Security Rules 保護
- 使用 React Query 管理狀態和緩存
```

### 2. Server Components 預設原則

**原則**：預設使用 Server Components，只在需要互動時標記 `'use client'`

```
✅ Server Components 適用場景：
- 數據獲取和展示
- 靜態內容渲染
- SEO 關鍵頁面
- 不需要瀏覽器 API 的組件

✅ Client Components 必要場景：
- 事件處理（onClick、onChange）
- 使用 React Hooks（useState、useEffect）
- 需要瀏覽器 API（localStorage、window）
- 第三方互動庫（地圖、圖表）
```

### 3. 前後端清晰分離

**原則**：客戶端只負責 UI 和互動，服務端負責邏輯和數據

```
前端職責：
- UI 呈現和用戶互動
- 表單狀態管理
- Firebase 數據操作（Auth、Firestore、Storage）
- 客戶端路由導航
- 樂觀更新（Optimistic Updates）

後端職責（Server Actions）：
- AI 服務調用（Genkit）
- 第三方 API 整合（非 Firebase）
- 複雜業務邏輯計算
- 外部服務整合（郵件、支付等）
```

### 4. 組件就近數據獲取（Colocation）

**原則**：數據獲取邏輯放在需要該數據的組件附近

```
✅ 推薦結構：
/app
  /dashboard
    page.tsx          ← 獲取儀表板數據
    /stats
      page.tsx        ← 獲取統計數據
    /actions.ts       ← 該功能的 Server Actions

❌ 避免結構：
/app
  /api               ← 不必要的集中式 API 層
  /lib
    /data            ← 過度集中的數據層
```

---

## 💾 數據管理策略

### 5. TanStack Query 作為客戶端數據中心

**原則**：所有遠程數據獲取通過 React Query 管理

**必裝套件**：
- `@tanstack/react-query`
- `@tanstack/react-query-next-experimental`
- `@tanstack/react-query-devtools`

**進階功能**：
- `@tanstack/query-broadcast-client-experimental` - 多標籤頁同步
- `@tanstack/query-sync-storage-persister` - 離線持久化
- `@tanstack/react-query-persist-client` - 緩存持久化

```
✅ 使用場景：
- 所有 Server Actions 調用
- 自動處理加載、錯誤、重試
- 智能緩存和背景重新獲取
- 多標籤頁狀態同步

❌ 不需要場景：
- Server Components 的數據獲取
- 簡單的一次性請求
```

### 6. 表單狀態管理

**原則**：根據複雜度選擇合適的方案

**簡單表單**（單步、少於 5 個欄位）：
```
使用：原生 <form> + Server Actions
配合：useFormState、useFormStatus
```

**複雜表單**（多步驟、動態欄位、複雜驗證）：
```
使用：@tanstack/react-form 或 react-hook-form
配合：@hookform/resolvers + Zod
驗證：前後端共用 Zod schema
```

### 7. 輕量全域狀態

**原則**：避免過度使用全域狀態管理

**優先順序**：
1. **URL 狀態** - searchParams、pathname（最優先）
2. **React Context** - 主題、語言等全域配置
3. **@tanstack/react-store** - 需要細粒度訂閱的 UI 狀態
4. ❌ 避免將業務數據放入全域 Store

```
✅ Store 適用場景：
- 側邊欄開關狀態
- 通知中心未讀數
- 臨時的 UI 交互狀態

❌ 不應該放入 Store：
- 用戶資料（用 React Query）
- 列表數據（用 React Query）
- 表單數據（用 Form 庫）
```

---

## 🎨 UI 組件規範

### 8. Radix UI 無樣式組件基礎

**原則**：所有交互組件基於 Radix UI 構建

**已安裝組件**：
- 對話框：Dialog、AlertDialog
- 下拉菜單：DropdownMenu、ContextMenu、Menubar
- 表單：Select、RadioGroup、Checkbox、Switch、Slider
- 導航：NavigationMenu、Tabs、Accordion、Collapsible
- 反饋：Toast、Tooltip、HoverCard、Progress
- 其他：Avatar、Separator、ScrollArea、AspectRatio

```
✅ 使用 Radix UI 的理由：
- 完整的鍵盤導航和無障礙支持
- 無樣式設計，完全可客製化
- 行為邏輯穩定可靠

❌ 不要重複造輪子：
- 不自己實現下拉菜單邏輯
- 不自己處理焦點管理
- 不自己實現鍵盤導航
```

### 9. 樣式管理系統

**使用套件**：
- `tailwindcss` - 核心樣式框架
- `tailwindcss-animate` - 動畫工具
- `class-variance-authority` - 組件變體管理
- `tailwind-merge` + `clsx` - 動態類名處理
- `next-themes` - 主題切換

**組件樣式模式**：

```typescript
// 使用 CVA 定義組件變體
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "rounded-md font-medium transition-colors", // 基礎樣式
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border border-gray-300",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// 使用 cn 處理動態類名
import { cn } from "@/lib/utils";

<button className={cn(
  buttonVariants({ variant, size }),
  className // 允許外部覆蓋
)} />
```

### 10. 組件設計原則

**單一職責**：
```
✅ 好的組件：
- <Button> 只負責按鈕行為
- <Input> 只負責輸入框
- <Card> 只負責卡片容器

❌ 避免的組件：
- <SuperForm> 包含所有表單邏輯
- <DataTable> 包含分頁、篩選、排序所有功能
```

**組合優於配置**：
```tsx
✅ 推薦：組合模式
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
  </CardHeader>
  <CardContent>內容</CardContent>
</Card>

❌ 避免：配置模式
<Card 
  title="標題"
  content="內容"
  showHeader={true}
  headerAlign="left"
  // ... 20 個配置 props
/>
```

---

## 📊 數據展示與優化

### 11. TanStack Table 複雜表格

**使用套件**：
- `@tanstack/react-table` - 表格核心
- `@tanstack/match-sorter-utils` - 模糊搜尋

**適用場景**：
```
✅ 需要使用：
- 複雜的排序和篩選
- 多欄位搜尋
- 分頁和虛擬滾動
- 可調整欄位順序/寬度
- 行選擇和批量操作

❌ 不需要使用：
- 簡單的數據列表（用 map）
- 靜態表格（用 HTML table）
- 少於 3 欄的列表
```

### 12. 虛擬滾動優化

**使用套件**：`@tanstack/react-virtual`

**適用場景**：
```
✅ 必須使用的情況：
- 列表超過 100 項
- 每項包含圖片或複雜組件
- 無限滾動加載

實現方式：
- 配合 React Query 的 infinite queries
- 只渲染可見區域的元素
- 動態計算元素高度
```

### 13. 數據可視化

**使用套件**：`recharts`

**使用原則**：
```
✅ 適用場景：
- 統計儀表板
- 趨勢分析圖表
- 數據報表

❌ 避免過度使用：
- 不是所有數據都需要圖表
- 簡單數據用數字展示更清晰
- 考慮圖表庫對 bundle size 的影響
```

---

## 🎭 用戶體驗優化

### 14. 表單輸入體驗

**專用組件**：
- `react-day-picker` - 日期選擇器
- `input-otp` - OTP 驗證碼輸入
- `use-debounce` - 搜尋輸入防抖

**最佳實踐**：
```
日期選擇：
- 使用本地化日期格式
- 提供快捷選項（今天、本週、本月）
- 支持鍵盤導航

搜尋輸入：
- 300-500ms 防抖延遲
- 顯示搜尋中狀態
- 空值時清除結果
```

### 15. 互動與動畫

**佈局交互**：
- `react-resizable-panels` - 可調整大小面板
- `embla-carousel-react` - 輪播圖
- `react-draggable` - 拖拽功能（謹慎使用）
- `vaul` - 移動端抽屜

**命令面板**：
- `cmdk` - 實現 Command+K 快捷操作

**使用原則**：
```
✅ 必要的互動：
- 提升操作效率
- 改善用戶體驗
- 符合用戶預期

❌ 避免過度互動：
- 不必要的動畫效果
- 炫技式的交互
- 增加學習成本的設計
```

### 16. 通知與反饋

**使用套件**：`sonner` (Toast 通知)

**通知策略**：
```
成功操作：簡短確認（1-2 秒）
錯誤提示：清晰說明原因和解決方案
加載狀態：超過 300ms 才顯示 loading
樂觀更新：立即反饋，失敗時回滾
```

---

## 🤖 AI 與外部服務整合

### 17. Genkit AI 整合

**使用套件**：
- `genkit` - 核心庫
- `@genkit-ai/google-genai` - Google AI 服務
- `@genkit-ai/next` - Next.js 整合
- `genkit-cli` (開發工具)

**整合原則**：
```
安全性：
- AI 調用只在 Server Actions 中執行
- API 金鑰通過環境變數管理
- 客戶端永不直接調用 AI API

錯誤處理：
- 超時重試機制
- 降級策略（AI 失敗時的備案）
- 用戶友好的錯誤訊息

成本控制：
- 實現請求頻率限制
- 緩存常見查詢結果
- 監控 API 使用量
```

### 18. Firebase 客戶端服務

**使用套件**：`firebase` (客戶端 SDK)

**重要限制**：
```
⚠️ Firebase 客戶端 SDK 只能在 Client Components 中使用
- 'use client' 組件中初始化 Firebase
- 不能在 Server Actions 或 Server Components 中使用
- 依賴 Firebase Security Rules 保護數據
```

**服務使用**：

**Authentication（客戶端）**：
```typescript
'use client'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

// ✅ 在客戶端組件中處理認證
async function handleLogin(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}
```

**Firestore（客戶端 + Security Rules）**：
```typescript
'use client'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

// ✅ 客戶端直接查詢，依賴 Security Rules 保護
async function fetchUserData(userId: string) {
  const q = query(collection(db, 'users'), where('uid', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}
```

**Security Rules 必須嚴格設置**：
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 只允許用戶訪問自己的數據
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開數據
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage（客戶端上傳）**：
```typescript
'use client'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ✅ 客戶端直接上傳，依賴 Storage Rules
async function uploadFile(file: File, userId: string) {
  const storageRef = ref(storage, `users/${userId}/${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
```

**Server Actions 的角色**：
```typescript
'use server'

// ❌ 不能在 Server Actions 中使用 Firebase 客戶端 SDK
// ✅ Server Actions 用於：
// - 調用第三方 API（非 Firebase）
// - 複雜的業務邏輯計算
// - 發送郵件、通知等外部服務
// - AI 服務調用（Genkit）
```

---

## 🐳 容器化與部署

### 19. 環境配置管理

**使用套件**：`dotenv`、`cross-env`

**配置原則**：
```
環境變數分類：
- NEXT_PUBLIC_* - 客戶端可見
- 其他 - 僅服務端可用

安全性：
- .env 文件不提交到版本控制
- 使用 .env.example 作為模板
- 容器啟動時注入環境變數

多環境管理：
- .env.local - 本地開發
- .env.production - 生產環境
- .env.test - 測試環境
```

### 20. Docker 容器化

**Next.js 配置**：
```javascript
// next.config.js
module.exports = {
  output: 'standalone', // 生成最小化構建
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}
```

**Dockerfile 最佳實踐**：
```dockerfile
# 多階段構建
FROM node:20-alpine AS deps
FROM node:20-alpine AS builder
FROM node:20-alpine AS runner

# 只複製必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 非 root 用戶運行
USER node
```

**健康檢查**：
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
```

### 21. 應用無狀態化

**原則**：
```
✅ 無狀態設計：
- 所有持久化數據存儲在 Firebase
- Session 存儲在數據庫或 Redis
- 上傳文件直接存到對象存儲
- 使用外部緩存服務

❌ 避免本地狀態：
- 不在文件系統存儲數據
- 不使用內存緩存（多實例問題）
- 不依賴本地 session
```

---

## 🔍 代碼質量保證

### 22. TypeScript 嚴格模式

**tsconfig.json 配置**：
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**類型安全原則**：
```typescript
✅ 推薦做法：
- 使用 Zod 定義運行時類型驗證
- Server Actions 返回類型化結果
- 避免使用 any 類型

❌ 避免做法：
- 使用 @ts-ignore 跳過錯誤
- 過度使用類型斷言 (as)
- 定義過於寬鬆的類型
```

### 23. ESLint 配置

**已安裝規則**：
- `@next/eslint-plugin-next` - Next.js 最佳實踐
- `@typescript-eslint/*` - TypeScript 檢查
- `eslint-config-prettier` - 與 Prettier 整合

**關鍵規則**：
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
```

### 24. 依賴管理

**使用套件**：`patch-package`

**管理策略**：
```
版本鎖定：
- 使用 package-lock.json
- 定期但謹慎地更新依賴
- 測試後再部署更新

依賴修補：
- 使用 patch-package 修復小問題
- 避免 fork 整個庫
- 將 patches/ 目錄提交到版本控制

定期審查：
- 每月檢查未使用的依賴
- 評估依賴的安全性
- 考慮替代方案的必要性
```

---

## 📝 文件結構規範

### 25. 推薦的項目結構

```
project-root/
├── app/
│   ├── (auth)/              # 路由組：認證相關頁面
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # 路由組：儀表板
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── actions.ts       # 該區域的 Server Actions
│   ├── api/
│   │   └── health/          # 只用於健康檢查等特殊端點
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # 基礎 UI 組件（shadcn/ui）
│   ├── forms/               # 表單組件
│   ├── layouts/             # 佈局組件
│   └── features/            # 功能組件
├── lib/
│   ├── utils.ts             # 工具函數
│   ├── validations/         # Zod schemas
│   └── firebase/            # Firebase 配置
├── hooks/                   # 自定義 React Hooks
├── types/                   # TypeScript 類型定義
├── public/                  # 靜態資源
├── .env.local               # 本地環境變數
├── .env.example             # 環境變數模板
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ✅ 開發檢查清單

### 開發前檢查

- [ ] 環境變數已正確配置
- [ ] Firebase 專案已設置
- [ ] TypeScript 嚴格模式已啟用
- [ ] ESLint 和 Prettier 已配置

### 功能開發檢查

- [ ] ✅ Firebase 操作在 'use client' 組件中
- [ ] ✅ AI/外部 API 在 'use server' 函數中
- [ ] ✅ 文件命名符合約定（.client.tsx、.actions.ts）
- [ ] ✅ 使用 React Query 管理 Firebase 數據
- [ ] ✅ 表單使用 Zod 驗證
- [ ] ✅ 錯誤處理返回標準格式 { success, data?, error? }
- [ ] ✅ 加載狀態有適當的反饋
- [ ] ✅ Firebase Security Rules 已正確配置

### 組件開發檢查

- [ ] 組件保持單一職責
- [ ] 使用 Radix UI 作為交互組件基礎
- [ ] 樣式使用 Tailwind CSS
- [ ] 支持暗色模式（如適用）
- [ ] 無障礙性考慮（鍵盤導航、ARIA）

### 提交前檢查

- [ ] 移除 console.log 和調試代碼
- [ ] ESLint 無錯誤
- [ ] TypeScript 無類型錯誤
- [ ] 未使用的依賴已移除
- [ ] 敏感信息未硬編碼

### 部署前檢查

- [ ] 環境變數在生產環境配置
- [ ] 使用 standalone 構建模式
- [ ] Docker 健康檢查已實現
- [ ] 錯誤追蹤已設置
- [ ] 性能指標監控已配置

---

## 🚫 反模式警示

### 絕對不要做的事

1. **❌ 在 Server Actions 或 Server Components 中使用 Firebase 客戶端 SDK**
   ```typescript
   // ❌ 絕對錯誤：會導致運行時錯誤
   'use server'
   import { db } from '@/lib/firebase' // Firebase 客戶端 SDK
   
   ✅ 正確：Firebase 只在客戶端組件使用
   'use client'
   import { db } from '@/lib/firebase'
   ```

2. **❌ 硬編碼敏感信息**
   ```typescript
   // ❌ 錯誤
   const API_KEY = "sk-xxx..."
   
   ✅ 正確：使用環境變數
   const API_KEY = process.env.API_KEY
   ```

3. **❌ 過度使用 'use client'**
   ```typescript
   // ❌ 錯誤：不必要的客戶端組件
   'use client'
   export default function StaticPage() {
     return <div>靜態內容</div>
   }
   ```

4. **❌ 不處理錯誤狀態**
   ```typescript
   // ❌ 錯誤
   const data = await fetchData() // 如果失敗呢？
   
   ✅ 正確：使用 try-catch 或 React Query
   ```

5. **❌ 創建「上帝組件」**
   ```typescript
   // ❌ 錯誤：一個組件做太多事
   function SuperComponent({ mode, type, variant, ... }) {
     // 500 行代碼...
   }
   ```

---

## 📚 參考資源

### 官方文檔
- [Next.js 15 文檔](https://nextjs.org/docs)
- [React Query 文檔](https://tanstack.com/query/latest)
- [Radix UI 文檔](https://www.radix-ui.com)
- [Firebase 文檔](https://firebase.google.com/docs)
- [Genkit 文檔](https://firebase.google.com/docs/genkit)

### 最佳實踐
- [Next.js App Router 最佳實踐](https://nextjs.org/docs/app/building-your-application)
- [TypeScript 最佳實踐](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React 設計模式](https://react.dev/learn/thinking-in-react)

---

## 🔄 文檔維護

本文檔應定期更新以反映：
- Next.js 新版本的變更
- 新增的依賴套件
- 團隊達成的新共識
- 發現的新最佳實踐

**最後更新**: 2025-10-03  
**下次審查**: 2025-11-03