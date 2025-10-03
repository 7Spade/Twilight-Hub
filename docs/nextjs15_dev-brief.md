# Next.js 15 AI Agent 開發規範

> **版本**: 1.0 | **更新**: 2025-10-03  
> **目標**: 零認知、快速決策、標準化開發

---

## 🎯 核心原則（必讀）

### 黃金法則
```
1. Firebase = 'use client' 組件
2. AI/外部API = 'use server' 函數
3. 文件名 = 用途說明
4. 複製模板 > 從零開始
5. 如無必要，勿增實體
```

### 禁止事項（會報錯）
```
❌ Server Actions 中使用 Firebase SDK
❌ 硬編碼 API 金鑰
❌ 不處理錯誤狀態
❌ Firebase Security Rules 寬鬆設置
```

---

## 📁 文件命名規範（自動決策）

```
命名格式 → 自動決定能做什麼

[feature].actions.ts       → Server Actions (Genkit AI、外部API)
[feature].client.tsx       → Client Component (Firebase、Hooks、事件)
[feature].queries.ts       → React Query hooks
[feature].schema.ts        → Zod 驗證 schema
[feature].types.ts         → TypeScript 類型

範例：
auth.actions.ts            → AI 驗證、發送郵件
auth.client.tsx            → Firebase Auth 登入
auth.queries.ts            → useUser、useAuth hooks
auth.schema.ts             → 登入表單驗證
```

---

## 🏗️ 項目結構（複製即用）

```
app/
├── (public)/              ← 無需認證
├── (auth)/                ← 認證頁面
│   └── login/
│       ├── page.tsx
│       ├── login.client.tsx
│       └── login.schema.ts
└── (app)/                 ← 需要認證
    └── dashboard/
        ├── page.tsx
        ├── dashboard.client.tsx
        ├── dashboard.actions.ts
        └── dashboard.queries.ts

components/ui/             ← Radix UI 組件
lib/
├── firebase.ts            ← Firebase 初始化
├── genkit.ts              ← Genkit 初始化
├── env.ts                 ← 環境變數管理
└── errors.ts              ← 統一錯誤處理
hooks/                     ← 自定義 Hooks
schemas/                   ← Zod schemas
```

---

## 📝 代碼模板（直接複製）

### 1. Client Component 模板（Firebase 操作）

```typescript
'use client'

import { useState } from 'react'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { toast } from 'sonner'

interface Props {
  userId: string
}

export function UserProfile({ userId }: Props) {
  const [loading, setLoading] = useState(false)
  
  async function handleAction() {
    setLoading(true)
    try {
      // Firebase 操作
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      toast.success('操作成功')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失敗')
    } finally {
      setLoading(false)
    }
  }
  
  return <div>{/* UI */}</div>
}
```

### 2. Server Actions 模板（AI/API 調用）

```typescript
'use server'

import { genkit } from '@/lib/genkit'

interface Input {
  prompt: string
}

interface Result {
  success: boolean
  data?: string
  error?: string
}

export async function generateText(input: Input): Promise<Result> {
  try {
    // 驗證
    if (!input.prompt) {
      return { success: false, error: '缺少提示' }
    }
    
    // 執行
    const result = await genkit.generate(input.prompt)
    
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '未知錯誤' 
    }
  }
}
```

### 3. React Query Hook 模板

```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// 查詢
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      return docSnap.data()
    },
    enabled: !!userId,
  })
}

// 變更
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: any }) => {
      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
```

### 4. Zod Schema 模板

```typescript
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('無效的電子郵件'),
  password: z.string().min(8, '密碼至少 8 個字符'),
  name: z.string().min(2, '姓名至少 2 個字符'),
})

// 自動推導類型
export type UserInput = z.infer<typeof userSchema>
```

---

## 🔍 決策樹（快速判斷）

### 我應該用什麼？

```
需要 Firebase？
├─ YES → 'use client' 組件
│        import { db, auth, storage } from '@/lib/firebase'
│
└─ NO → 需要 AI 或外部 API？
        ├─ YES → 'use server' 函數
        │        import { genkit } from '@/lib/genkit'
        │
        └─ NO → 只是顯示內容？
                └─ Server Component (預設)

需要表單驗證？
├─ 簡單表單（< 5 欄位）→ useFormState + Zod
└─ 複雜表單 → react-hook-form + Zod

需要數據緩存？
└─ React Query
   ├─ useQuery (讀取)
   └─ useMutation (寫入)

需要全域狀態？
├─ URL 參數 → searchParams (優先)
├─ 主題/語言 → React Context
└─ UI 狀態 → @tanstack/react-store
```

---

## 📊 依賴套件速查

### 必用套件

| 套件 | 用途 | 使用位置 |
|-----|------|---------|
| `firebase` | 認證、數據庫、存儲 | Client Component |
| `genkit`, `@genkit-ai/*` | AI 服務 | Server Actions |
| `@tanstack/react-query` | 數據管理 | Client Component |
| `zod` | 驗證 | 任何地方 |
| `@radix-ui/*` | UI 組件基礎 | Client Component |
| `tailwindcss` | 樣式 | 任何地方 |
| `sonner` | Toast 通知 | Client Component |

### 條件使用

| 套件 | 何時使用 |
|-----|---------|
| `react-hook-form` | 複雜表單（多步驟、動態欄位） |
| `@tanstack/react-table` | 複雜表格（排序、篩選、分頁） |
| `@tanstack/react-virtual` | 列表 > 100 項 |
| `recharts` | 數據圖表 |
| `react-day-picker` | 日期選擇 |
| `use-debounce` | 搜尋輸入防抖 |

---

## ⚙️ 環境變數（必須配置）

```typescript
// lib/env.ts

// ⚠️ 客戶端可見
export const ENV = {
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// 🔒 僅服務端
export const SERVER_ENV = {
  GENKIT_API_KEY: process.env.GENKIT_API_KEY!,
}
```

```bash
# .env.example

# Firebase (客戶端)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Genkit (服務端)
GENKIT_API_KEY=
```

---

## 🔒 Firebase Security Rules（必須設置）

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶只能訪問自己的數據
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // 公開讀取，認證寫入
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

---

## ✅ 開發檢查清單

### 開始寫代碼前

```
□ 這是 Firebase 操作嗎？
  → YES: 用 .client.tsx
  → NO: 繼續

□ 這是 AI/外部 API 調用嗎？
  → YES: 用 .actions.ts
  → NO: 用 Server Component (page.tsx)

□ 需要數據緩存嗎？
  → YES: 用 React Query (.queries.ts)

□ 需要驗證嗎？
  → YES: 用 Zod (.schema.ts)
```

### 提交代碼前

```
□ 移除 console.log
□ 錯誤處理完整
□ 類型定義正確
□ ESLint 無錯誤
□ 環境變數已配置
```

---

## 🚨 常見錯誤（避免）

### 1. Firebase 位置錯誤

```typescript
// ❌ 錯誤
'use server'
import { db } from '@/lib/firebase'

// ✅ 正確
'use client'
import { db } from '@/lib/firebase'
```

### 2. 錯誤處理缺失

```typescript
// ❌ 錯誤
const data = await fetchData()

// ✅ 正確
try {
  const data = await fetchData()
} catch (error) {
  toast.error('獲取數據失敗')
}
```

### 3. 硬編碼敏感信息

```typescript
// ❌ 錯誤
const apiKey = "sk-xxx..."

// ✅ 正確
const apiKey = process.env.GENKIT_API_KEY
```

### 4. 不必要的客戶端組件

```typescript
// ❌ 錯誤
'use client'
export default function AboutPage() {
  return <div>關於我們</div>
}

// ✅ 正確（預設 Server Component）
export default function AboutPage() {
  return <div>關於我們</div>
}
```

---

## 📚 快速參考

### React Query Keys 規範

```typescript
// lib/query-keys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
  },
  posts: {
    all: ['posts'] as const,
    detail: (id: string) => ['posts', id] as const,
  },
}
```

### 統一錯誤處理

```typescript
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
```

### 常用命令

```bash
npm run dev              # 開發服務器
npm run dev:genkit       # Genkit 工具
npm run build            # 生產構建
npm run type-check       # 類型檢查
npm run lint             # 代碼檢查
npm run check-all        # 完整檢查
```

---

## 🎨 UI 組件規範

### 使用 Radix UI

```typescript
// ✅ 使用現有組件
import { Dialog, DialogContent } from '@/components/ui/dialog'

// ❌ 不要重新實現
function MyDialog() { /* 自己實現對話框邏輯 */ }
```

### 樣式使用 Tailwind

```typescript
// ✅ 使用 utility classes
<div className="flex items-center gap-4 p-4 rounded-lg bg-white">

// ❌ 不要用內聯樣式
<div style={{ display: 'flex', padding: '1rem' }}>
```

### 組件變體用 CVA

```typescript
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  "rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white",
        outline: "border border-gray-300",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
      },
    },
  }
)
```

---

## 🎯 性能優化速查

### 何時使用虛擬滾動

```
列表 > 100 項 → @tanstack/react-virtual
否則 → 普通 map
```

### 何時使用 React Query

```
任何 Firebase 數據操作 → React Query
一次性操作 → 直接調用
```

### 何時使用 Server Components

```
靜態內容 → Server Component
需要互動 → Client Component
```

---

## 📖 註解規範（提升可讀性）

```typescript
/**
 * 用戶認證組件
 * 
 * 📍 Client Component (Firebase Auth)
 * 🔧 依賴: Firebase Auth, React Query
 * 📊 狀態: loading, error
 * 
 * 流程:
 * 1. 驗證表單 (Zod)
 * 2. 調用 Firebase Auth
 * 3. 成功 → 重定向
 * 4. 失敗 → 顯示錯誤
 */
'use client'
export function LoginForm() { ... }
```

---

## 🔄 版本資訊

**當前版本**: 1.0  
**最後更新**: 2025-10-03  
**適用**: Next.js 15 + Firebase 客戶端 SDK

---

## 💡 記住這些就夠了

```
1. 看文件名 → 知道能做什麼
2. 複製模板 → 直接開始寫
3. 遵守決策樹 → 不會出錯
4. 檢查清單 → 確保質量
5. 簡單優於複雜 → 奧卡姆剃刀
```

**🎉 現在開始編碼吧！**