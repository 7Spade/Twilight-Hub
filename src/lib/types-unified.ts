/**
 * @fileoverview 統一的類型定義
 * 整合分散的類型定義，遵循奧卡姆剃刀原則
 */

import { Timestamp } from "firebase/firestore";
import type { 
  FieldValues, 
  Control, 
  FieldPath, 
  UseFormReturn 
} from "react-hook-form";

// ===== 基礎類型 =====

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== 用戶和組織類型 =====

export interface Account extends BaseEntity {
  type: 'user' | 'organization';
  name: string;
  slug: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  description?: string;
  memberIds?: string[];
  level?: number;
  experience?: number;
  managementScore?: number;
  followingCount?: number;
  followersCount?: number;
  moduleInventory?: { [key: string]: number };
}

// ===== 空間和模組類型 =====

export interface Space extends BaseEntity {
  ownerId: string;
  ownerType: 'user' | 'organization';
  name: string;
  slug: string;
  description: string;
  isPublic: boolean;
  moduleIds?: string[];
  starredByUserIds?: string[];
}

export interface Module extends BaseEntity {
  name: string;
  description: string;
  icon?: string;
  type: 'user' | 'organization' | 'common';
}

// ===== 組織管理類型 =====

export interface Group extends BaseEntity {
  organizationId: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface Item extends BaseEntity {
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  lowStockThreshold?: number;
  price?: number;
}

export interface Warehouse extends BaseEntity {
  name: string;
  location: string;
}

export interface Stock extends BaseEntity {
  itemId: string;
  warehouseId: string;
  quantity: number;
}

// ===== 審計和成就類型 =====

export interface AuditLog extends BaseEntity {
  organizationId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'ORGANIZATION' | 'ITEM' | 'WAREHOUSE' | 'MEMBER';
  entityId: string;
  entityTitle: string;
}

export interface UserAchievement extends BaseEntity {
  achievementId: string;
  unlockedAt: Timestamp;
}

export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  icon: string;
}

// ===== 權限管理類型 =====

export type Permission = 
  | 'space:read'
  | 'space:write'
  | 'space:delete'
  | 'space:manage'
  | 'participant:read'
  | 'participant:invite'
  | 'participant:remove'
  | 'participant:manage'
  | 'file:read'
  | 'file:upload'
  | 'file:delete'
  | 'file:manage'
  | 'issue:read'
  | 'issue:create'
  | 'issue:update'
  | 'issue:delete'
  | 'report:read'
  | 'report:create'
  | 'report:manage'
  | 'settings:read'
  | 'settings:update';

export type OrganizationRole = 
  | 'super_admin'
  | 'organization_admin'
  | 'organization_member'
  | 'organization_viewer';

export type SpaceRole = 
  | 'space_owner'
  | 'space_admin'
  | 'space_member'
  | 'space_viewer';

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: 'organization' | 'space';
  inheritable: boolean;
}

export interface UserRoleAssignment {
  userId: string;
  organizationRoles: OrganizationRoleAssignment[];
  spaceRoles: Record<string, SpaceRoleAssignment>;
  effectivePermissions: Permission[];
}

export interface OrganizationRoleAssignment {
  roleId: OrganizationRole;
  assignedAt: Timestamp;
  assignedBy: string;
  expiresAt?: Timestamp;
}

export interface SpaceRoleAssignment {
  roleId: SpaceRole;
  assignedAt: Timestamp;
  assignedBy: string;
  inheritedFrom?: OrganizationRole;
  expiresAt?: Timestamp;
}

export interface PermissionCheckResult {
  hasPermission: boolean;
  reason: 'granted' | 'denied' | 'expired' | 'not_assigned';
  source: 'organization' | 'space' | 'inherited';
  roleId?: string;
}

export interface RoleManagementConfig {
  enableInheritance: boolean;
  enableOverride: boolean;
  defaultSpaceRole: SpaceRole;
  requireApprovalForRoleChange: boolean;
}

// ===== UI 組件類型 =====

export interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

export interface Team {
  id: string;
  label: string;
  isUser: boolean;
  slug?: string;
}

// ===== 表單類型 =====

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export interface FormCardProps<T extends FieldValues> {
  title: string;
  description: string;
  isLoading: boolean;
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  children: React.ReactNode;
}

// ===== 狀態管理類型 =====

export interface AppState {
  chat: {
    isOpen: boolean;
    isMinimized: boolean;
  };
  dialog: {
    type: string | null;
    data: any;
    isOpen: boolean;
  };
}

export interface AuthState {
  userId: string | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
}

// ===== 文件操作類型 =====

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
  children?: FileItem[];
}

export interface FileActionItem {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

// ===== 導出所有類型 =====

// 重新導出 React Hook Form 類型
export type {
  FieldValues,
  FieldPath,
  Control,
  UseFormReturn,
} from 'react-hook-form';
