/**
 * @fileoverview Unified Authentication and Permission Management System
 * Provides core functionality for permission guards and management
 * Follows Occam's Razor principle for minimal and practical implementation
 */

'use client';
// TODO: [P2] CLEANUP unused import (L39) [低認知]
// TODO: [P1] TYPING no-any (L192, L221) [低認知]
// TODO: [P1] HOOK deps (L365) [低認知]
// TODO: [P1] REFACTOR src/components/auth/auth-provider.tsx - 縮減責任邊界與資料下傳
// 原則（Next.js App Router / Firebase）：
// - Firestore 聚合轉服務層；Provider 僅保留 userId/effectivePermissions 等最小必要。
// - 禁止在 render 期間做 I/O；mutation 走 Server Actions 或明確事件觸發。
// - 將 `PermissionGuard` 抽至更小 API（例如 useHasPermission(selector)）以便編譯期 tree-shaking。
// @assignee ai

// TODO: [P2] REFACTOR src/components/auth/auth-provider.tsx - 奧卡姆剃刀精簡權限/認證 Provider
// 建議：
// 1) 將 Firestore 讀取拆為最小 API（單一 fetchUserRoleAssignment），其餘聚合邏輯移至 service；Provider 僅保存必要狀態。
// 2) 僅暴露最小 API（hasPermission / checkPermission / signIn / signOut），其餘輔助函式封裝內部。
// 3) 避免渲染期副作用；所有 mutation 綁定事件或 Server Actions；避免將完整使用者資料下傳至 client。

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Permission, 
  UserRoleAssignment, 
  PermissionCheckResult,
  OrganizationRole,
  SpaceRole,
  OrganizationRoleAssignment,
  SpaceRoleAssignment
} from '@/lib/types-unified';
import { roleManagementService } from '@/lib/role-management';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { 
  getFirestore as _getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where,
  
// TODO: [P2] REFACTOR src/components/auth/auth-provider.tsx:39 - 清理未使用的導入
// 問題：'getFirestore' 已導入但從未使用
// 影響：增加 bundle 大小，影響性能
// 建議：移除未使用的導入或添加下劃線前綴表示有意未使用
// @assignee frontend-team 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Authentication state interface
interface AuthState {
  userId: string | null;
  user: FirebaseUser | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Authentication actions interface
interface AuthActions {
  setUser: (userId: string, roleAssignment: UserRoleAssignment) => void;
  clearUser: () => void;
  checkPermission: (permission: Permission, spaceId: string) => Promise<PermissionCheckResult>;
  hasPermission: (permission: Permission, spaceId: string) => boolean;
  refreshPermissions: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Complete authentication context
interface AuthContext extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContext | undefined>(undefined);

// Authentication provider props
export interface AuthProviderProps {
  children: ReactNode;
  initialUserId?: string;
}

// Authentication provider component
export function AuthProvider({ children, initialUserId }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    userId: initialUserId || null,
    user: null,
    userRoleAssignment: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  // Initialize Firebase services
  const { auth, firestore } = initializeFirebase();
  const db = firestore;

  // Set user
  const setUser = (userId: string, roleAssignment: UserRoleAssignment) => {
    setState(prev => ({
      ...prev,
      userId,
      userRoleAssignment: roleAssignment,
      isAuthenticated: true,
      error: null,
    }));
  };

  // Clear user
  const clearUser = () => {
    setState(prev => ({
      ...prev,
      userId: null,
      user: null,
      userRoleAssignment: null,
      isAuthenticated: false,
      error: null,
    }));
  };

  // Check permission
  const checkPermission = async (permission: Permission, spaceId: string): Promise<PermissionCheckResult> => {
    if (!state.userId || !state.userRoleAssignment) {
      return {
        hasPermission: false,
        reason: 'not_assigned',
        source: 'space',
        roleId: undefined,
      };
    }

    try {
      return await roleManagementService.checkPermission(
        state.userId,
        spaceId,
        permission,
        state.userRoleAssignment
      );
    } catch (error) {
      console.error('Permission check failed:', error);
      return {
        hasPermission: false,
        reason: 'denied',
        source: 'space',
        roleId: undefined,
      };
    }
  };

  // Quick synchronous check
  const hasPermission = (permission: Permission, _spaceId: string): boolean => {
    if (!state.userId || !state.userRoleAssignment) {
      return false;
    }

    return state.userRoleAssignment.effectivePermissions.includes(permission);
  };

  // Fetch user role assignment from Firestore
  const fetchUserRoleAssignment = useCallback(async (userId: string): Promise<UserRoleAssignment> => {
    try {
      // Get user document
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Gracefully handle missing user document by returning empty assignments
        return {
          userId,
          spaceRoles: {},
          organizationRoles: [],
          effectivePermissions: [],
        } as UserRoleAssignment;
      }

      const _userData = userDoc.data();
      
      // Get space roles
      const spaceRolesQuery = query(
        collection(db, 'userSpaceRoles'),
        where('userId', '==', userId)
      );
      const spaceRolesSnapshot = await getDocs(spaceRolesQuery);
      const spaceRoles: Record<string, SpaceRoleAssignment> = {};
      
      spaceRolesSnapshot.forEach(d => {
        // TODO: [P2] REFACTOR src/components/auth/auth-provider.tsx:195 - 修復 TypeScript any 類型使用
        // 問題：使用 any 類型違反類型安全原則
        // 影響：失去類型檢查，可能導致運行時錯誤
        // 建議：定義具體的類型接口替代 any 類型
        // @assignee frontend-team
        // @deadline 2025-01-25
        const raw = d.data() as Record<string, unknown>;
        const assignedAtRaw = raw.assignedAt as unknown;
        // TODO: 現代化 - 使用類型守衛替代 any，提升類型安全
        const assignedAtTs: Timestamp = assignedAtRaw && typeof (assignedAtRaw as { toDate?: () => Date }).toDate === 'function'
          ? (assignedAtRaw as Timestamp)
          : Timestamp.fromDate(new Date());
        const spaceIdKey = typeof raw.spaceId === 'string' ? (raw.spaceId as string) : d.id;
        spaceRoles[spaceIdKey] = {
          roleId: raw.roleId as SpaceRole,
          assignedAt: assignedAtTs,
          assignedBy: (raw.assignedBy || '') as string,
          expiresAt: undefined,
          inheritedFrom: undefined,
        };
      });

      // Get organization roles
      const orgRolesQuery = query(
        collection(db, 'userOrganizationRoles'),
        where('userId', '==', userId)
      );
      const orgRolesSnapshot = await getDocs(orgRolesQuery);
      const organizationRoles: OrganizationRoleAssignment[] = [];
      
      orgRolesSnapshot.forEach(d => {
        const raw = d.data() as Record<string, unknown>;
        const assignedAtRaw = raw.assignedAt as unknown;
        // TODO: 現代化 - 使用類型守衛替代 any，提升類型安全
        const assignedAtTs: Timestamp = assignedAtRaw && typeof (assignedAtRaw as { toDate?: () => Date }).toDate === 'function'
          ? (assignedAtRaw as Timestamp)
          : Timestamp.fromDate(new Date());
        organizationRoles.push({
          roleId: raw.roleId as OrganizationRole,
          assignedAt: assignedAtTs,
          assignedBy: (raw.assignedBy || '') as string,
          expiresAt: undefined,
        });
      });

      // Compute effective permissions from roles
      const effectivePermissions: Permission[] = [];
      // Aggregate space roles' permissions
      for (const key of Object.keys(spaceRoles)) {
        const spaceRole = spaceRoles[key];
        const roleDef = await roleManagementService.getRoleDefinition(spaceRole.roleId);
        if (roleDef) {
          for (const p of roleDef.permissions) {
            if (!effectivePermissions.includes(p)) effectivePermissions.push(p);
          }
        }
      }
      // Aggregate organization roles' permissions
      for (const org of organizationRoles) {
        const roleDef = await roleManagementService.getRoleDefinition(org.roleId);
        if (roleDef) {
          for (const p of roleDef.permissions) {
            if (!effectivePermissions.includes(p)) effectivePermissions.push(p);
          }
        }
      }

      return {
        userId,
        spaceRoles,
        organizationRoles,
        effectivePermissions,
      } as UserRoleAssignment;
    } catch (error) {
      console.error('Failed to fetch user role assignment:', error);
      throw error;
    }
  }, [db]);

  // Refresh permissions
  const refreshPermissions = async () => {
    if (!state.userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const roleAssignment = await fetchUserRoleAssignment(state.userId);
      setState(prev => ({ ...prev, userRoleAssignment: roleAssignment }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh permissions' 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user role assignment
      const roleAssignment = await fetchUserRoleAssignment(user.uid);
      
      setState(prev => ({
        ...prev,
        userId: user.uid,
        user,
        userRoleAssignment: roleAssignment,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign in failed',
        isLoading: false,
      }));
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      clearUser();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const roleAssignment = await fetchUserRoleAssignment(user.uid);
          setState(prev => ({
            ...prev,
            userId: user.uid,
            user,
            userRoleAssignment: roleAssignment,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Failed to load user data',
            isLoading: false,
          }));
        }
      } else {
        clearUser();
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => unsubscribe();
  }, [auth, fetchUserRoleAssignment]);

  const value: AuthContext = {
    ...state,
    setUser,
    clearUser,
    checkPermission,
    hasPermission,
    refreshPermissions,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use authentication context
export function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission guard component
interface PermissionGuardProps {
  permission: Permission;
  spaceId: string;
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function PermissionGuard({
  permission,
  spaceId,
  children,
  fallback = null,
  loading = <div className="animate-pulse bg-muted h-4 w-20 rounded" />
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasPermission(permission, spaceId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Permission button component
interface PermissionButtonProps extends PermissionGuardProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PermissionButton({
  permission,
  spaceId,
  children,
  onClick,
  disabled = false,
  className = '',
  fallback = null
}: PermissionButtonProps) {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <button disabled className={className}>
        {children}
      </button>
    );
  }

  if (!hasPermission(permission, spaceId)) {
    return <>{fallback}</>;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}