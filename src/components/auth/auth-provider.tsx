/**
 * @fileoverview Unified Authentication and Permission Management System
 * Provides core functionality for permission guards and management
 * Follows Occam's Razor principle for minimal and practical implementation
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
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
  const hasPermission = (permission: Permission, spaceId: string): boolean => {
    if (!state.userId || !state.userRoleAssignment) {
      return false;
    }

    return state.userRoleAssignment.effectivePermissions.includes(permission);
  };

  // Fetch user role assignment from Firestore
  const fetchUserRoleAssignment = async (userId: string): Promise<UserRoleAssignment> => {
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

      const userData = userDoc.data();
      
      // Get space roles
      const spaceRolesQuery = query(
        collection(db, 'userSpaceRoles'),
        where('userId', '==', userId)
      );
      const spaceRolesSnapshot = await getDocs(spaceRolesQuery);
      const spaceRoles: Record<string, SpaceRoleAssignment> = {};
      
      spaceRolesSnapshot.forEach(d => {
        const data = d.data() as any;
        const ts: Timestamp = data.assignedAt && typeof data.assignedAt.toDate === 'function'
          ? data.assignedAt as Timestamp
          : Timestamp.fromDate(new Date());
        spaceRoles[data.spaceId] = {
          roleId: data.roleId as SpaceRole,
          assignedAt: ts,
          assignedBy: (data.assignedBy || '') as string,
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
        const data = d.data() as any;
        const ts: Timestamp = data.assignedAt && typeof data.assignedAt.toDate === 'function'
          ? data.assignedAt as Timestamp
          : Timestamp.fromDate(new Date());
        organizationRoles.push({
          roleId: data.roleId as OrganizationRole,
          assignedAt: ts,
          assignedBy: (data.assignedBy || '') as string,
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
  };

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
  }, [auth]);

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