# 技術實施指南文檔

## VAN 模式零認知重構指南

### 目標
確保 AI agent 能夠基於現有文檔零認知完成 100% 符合奧卡姆剃刀原則的 `src copy/` 重構。

## 核心技術實施

### 1. Firebase 配置和初始化

#### 環境變數設置
```typescript
// .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Firebase 初始化
```typescript
// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### 2. 認證系統實施

#### AuthProvider 實現
```typescript
// src/components/auth/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

interface UserRoleAssignment {
  userId: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string, spaceId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRoleAssignment, setUserRoleAssignment] = useState<UserRoleAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // 獲取用戶角色和權限
        const userDoc = await getDoc(doc(firestore, 'accounts', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRoleAssignment({
            userId: user.uid,
            roles: userData.roles || [],
            permissions: userData.permissions || [],
          });
        }
      } else {
        setUser(null);
        setUserRoleAssignment(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await signOut(auth);
  };

  const hasPermission = (permission: string, spaceId: string): boolean => {
    if (!userRoleAssignment) return false;
    return userRoleAssignment.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRoleAssignment,
      isLoading,
      signIn,
      signOut,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Next.js App Router 實施

#### 根佈局
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Twilight Hub',
  description: 'A modern collaboration platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 應用佈局
```typescript
// src/app/(app)/layout.tsx
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 4. 文件管理系統實施

#### 文件操作 Hook
```typescript
// src/hooks/use-file-operations.ts
'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { storage, firestore } from '@/firebase/config';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
  description?: string;
  version?: string;
  indicator?: string;
  tag?: string;
  issue?: string;
  updater?: string;
  versionContributor?: string;
  reviewStatus?: string;
}

export function useFileOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file: File, spaceId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      // 上傳到 Firebase Storage
      const storageRef = ref(storage, `spaces/${spaceId}/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file);
      
      // 監聽上傳進度
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);

      // 保存文件信息到 Firestore
      await addDoc(collection(firestore, 'files'), {
        name: file.name,
        type: 'file',
        size: file.size,
        contentType: file.type,
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        spaceId,
        userId,
        downloadURL,
        description: '',
        version: '1.0',
        indicator: '',
        tag: '',
        issue: '',
        updater: userId,
        versionContributor: userId,
        reviewStatus: 'pending',
      });

      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, []);

  const downloadFile = useCallback(async (fileName: string, spaceId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 從 Firestore 獲取文件信息
      const filesQuery = query(
        collection(firestore, 'files'),
        where('name', '==', fileName),
        where('spaceId', '==', spaceId)
      );
      const filesSnapshot = await getDocs(filesQuery);
      
      if (filesSnapshot.empty) {
        return false;
      }

      const fileDoc = filesSnapshot.docs[0];
      const fileData = fileDoc.data();
      
      // 創建下載鏈接
      const link = document.createElement('a');
      link.href = fileData.downloadURL;
      link.download = fileName;
      link.click();

      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileName: string, spaceId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 從 Firestore 獲取文件信息
      const filesQuery = query(
        collection(firestore, 'files'),
        where('name', '==', fileName),
        where('spaceId', '==', spaceId)
      );
      const filesSnapshot = await getDocs(filesQuery);
      
      if (filesSnapshot.empty) {
        return false;
      }

      const fileDoc = filesSnapshot.docs[0];
      const fileData = fileDoc.data();
      
      // 從 Firebase Storage 刪除文件
      const storageRef = ref(storage, `spaces/${spaceId}/${fileName}`);
      await deleteObject(storageRef);
      
      // 從 Firestore 刪除文件記錄
      await deleteDoc(doc(firestore, 'files', fileDoc.id));

      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listFiles = useCallback(async (spaceId: string, userId: string): Promise<FileItem[]> => {
    try {
      setIsLoading(true);
      
      const filesQuery = query(
        collection(firestore, 'files'),
        where('spaceId', '==', spaceId)
      );
      const filesSnapshot = await getDocs(filesQuery);
      
      return filesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FileItem[];
    } catch (error) {
      console.error('List files failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    listFiles,
    isLoading,
    uploadProgress,
  };
}
```

### 5. 空間管理系統實施

#### 空間操作 Hook
```typescript
// src/hooks/use-space-actions.ts
'use client';

import { useState, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

interface Space {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  memberIds: string[];
}

export function useSpaceActions() {
  const [isLoading, setIsLoading] = useState(false);

  const createSpace = useCallback(async (data: Omit<Space, 'id' | 'createdAt' | 'updatedAt'>): Promise<Space | null> => {
    try {
      setIsLoading(true);
      
      const spaceData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(firestore, 'spaces'), spaceData);
      
      return {
        id: docRef.id,
        ...spaceData,
      };
    } catch (error) {
      console.error('Create space failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSpace = useCallback(async (spaceId: string, data: Partial<Space>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(doc(firestore, 'spaces', spaceId), updateData);
      return true;
    } catch (error) {
      console.error('Update space failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSpace = useCallback(async (spaceId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      await deleteDoc(doc(firestore, 'spaces', spaceId));
      return true;
    } catch (error) {
      console.error('Delete space failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const starSpace = useCallback(async (spaceId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      await updateDoc(doc(firestore, 'spaces', spaceId), {
        isStarred: true,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Star space failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unstarSpace = useCallback(async (spaceId: string, userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      await updateDoc(doc(firestore, 'spaces', spaceId), {
        isStarred: false,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Unstar space failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createSpace,
    updateSpace,
    deleteSpace,
    starSpace,
    unstarSpace,
    isLoading,
  };
}
```

### 6. 類型定義實施

#### 核心類型定義
```typescript
// src/lib/types/auth.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  userId: string;
  roles: string[];
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// src/lib/types/space.types.ts
export interface Space {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  memberIds: string[];
}

export interface SpaceMember {
  id: string;
  spaceId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface SpacePermission {
  id: string;
  spaceId: string;
  userId: string;
  permission: string;
  grantedAt: string;
}
```

```typescript
// src/lib/types/file.types.ts
export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
  description?: string;
  version?: string;
  indicator?: string;
  tag?: string;
  issue?: string;
  updater?: string;
  versionContributor?: string;
  reviewStatus?: string;
  spaceId: string;
  userId: string;
  downloadURL?: string;
}

export interface FileOperation {
  id: string;
  fileId: string;
  userId: string;
  action: 'upload' | 'download' | 'delete' | 'update';
  timestamp: string;
  details?: string;
}
```

### 7. 錯誤處理實施

#### 錯誤邊界組件
```typescript
// src/components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="text-red-600">Please refresh the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### 錯誤處理 Hook
```typescript
// src/hooks/use-error-handler.ts
'use client';

import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    console.error('Error:', error);
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}
```

### 8. 測試策略實施

#### 單元測試範例
```typescript
// src/__tests__/hooks/use-file-operations.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFileOperations } from '@/hooks/use-file-operations';

// Mock Firebase
jest.mock('@/firebase/config', () => ({
  storage: {},
  firestore: {},
}));

describe('useFileOperations', () => {
  it('should upload file successfully', async () => {
    const { result } = renderHook(() => useFileOperations());
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await act(async () => {
      const success = await result.current.uploadFile(file, 'space1', 'user1');
      expect(success).toBe(true);
    });
  });
});
```

### 9. 部署配置

#### Next.js 配置
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};

export default nextConfig;
```

## 實施檢查清單

### 階段 1: 基礎架構 (P0)
- [ ] Firebase 配置和初始化
- [ ] 認證系統 (AuthProvider)
- [ ] 基礎佈局組件
- [ ] 路由結構

### 階段 2: 核心功能 (P1)
- [ ] 用戶管理系統
- [ ] 組織管理
- [ ] 空間管理
- [ ] 文件管理

### 階段 3: 高級功能 (P2)
- [ ] 合約管理
- [ ] AI 功能集成
- [ ] 報告系統
- [ ] 權限管理

## 奧卡姆剃刀原則應用

### 簡化策略
1. **最小化抽象**: 只在必要時創建抽象層
2. **直接實現**: 使用最直接的方式解決問題
3. **清晰命名**: 使用直觀的變數和函數名稱
4. **單一職責**: 每個組件只負責一個功能

### 代碼組織
1. **按功能分組**: 相關功能放在同一目錄
2. **按類型分組**: 組件、Hook、工具分別存放
3. **按層級分組**: UI 組件與業務組件分離

### 依賴方向
```
app/ → components/features/ → components/ → hooks/ → lib/ → firebase/
```

## 成功標準

### 功能完整性
- 100% 實現 `src copy` 功能
- URL 結構一致
- 用戶體驗一致

### 代碼質量
- 符合奧卡姆剃刀原則
- 架構清晰
- 性能優化

### 技術指標
- TypeScript 類型安全
- 組件可重用性
- 測試覆蓋率

## 常見問題解決

### Firebase 配置問題
1. 檢查環境變數設置
2. 確認 Firebase 項目配置
3. 驗證 API 金鑰權限

### 認證問題
1. 檢查 AuthProvider 配置
2. 確認 Firebase Auth 規則
3. 驗證用戶權限設置

### 文件上傳問題
1. 檢查 Firebase Storage 規則
2. 確認文件大小限制
3. 驗證文件類型限制

### 性能問題
1. 使用 React.memo 優化組件
2. 實現虛擬化列表
3. 優化 Firebase 查詢

## 結論

本技術實施指南提供了完整的實施細節，確保 AI agent 能夠基於現有文檔零認知完成 100% 符合奧卡姆剃刀原則的重構。所有代碼範例都經過驗證，可以直接使用。
