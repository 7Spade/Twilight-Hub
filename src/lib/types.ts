// This file is for defining custom TypeScript types and interfaces.
// You can use it to define complex data structures for your application.
// For example:
//
// export interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
// }
//
// Then in your component, you can import and use it like so:
//
// import { UserProfile } from '@/lib/types';
//
// const user: UserProfile = { ... };

import { Timestamp } from "firebase/firestore";

export interface Account {
    id: string;
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

export interface Space {
    id: string;
    ownerId: string;
    ownerType: 'user' | 'organization';
    name: string;
    slug: string;
    description: string;
    isPublic: boolean;
    moduleIds?: string[];
    starredByUserIds?: string[];
}

export interface Module {
    id: string;
    name: string;
    description: string;
    icon?: string;
    type: 'user' | 'organization' | 'common';
}

export interface Group {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    memberIds: string[];
}

export interface Item {
    id: string;
    name: string;
    description?: string;
    sku?: string;
    category?: string;
    lowStockThreshold?: number;
    price?: number;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
}

export interface Stock {
    id: string;
    itemId: string;
    warehouseId: string;
    quantity: number;
}

export interface AuditLog {
    id: string;
    organizationId: string;
    userId: string;
    userName: string;
    userAvatarUrl: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: 'ORGANIZATION' | 'ITEM' | 'WAREHOUSE' | 'MEMBER';
    entityId: string;
    entityTitle: string;
    createdAt: Timestamp;
}

export interface UserAchievement {
    achievementId: string;
    unlockedAt: Timestamp;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
}

// ===== 角色管理系統 =====

// 權限枚舉
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

// 組織層級角色
export type OrganizationRole = 
  | 'super_admin'
  | 'organization_admin'
  | 'organization_member'
  | 'organization_viewer';

// 空間層級角色
export type SpaceRole = 
  | 'space_owner'
  | 'space_admin'
  | 'space_member'
  | 'space_viewer';

// 角色定義
export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: 'organization' | 'space';
  inheritable: boolean; // 是否可以繼承到空間
}

// 用戶角色分配
export interface UserRoleAssignment {
  userId: string;
  organizationRoles: OrganizationRoleAssignment[];
  spaceRoles: Record<string, SpaceRoleAssignment>; // spaceId -> role
  effectivePermissions: Permission[]; // 計算後的有效權限
}

// 組織角色分配
export interface OrganizationRoleAssignment {
  roleId: OrganizationRole;
  assignedAt: Timestamp;
  assignedBy: string;
  expiresAt?: Timestamp;
}

// 空間角色分配
export interface SpaceRoleAssignment {
  roleId: SpaceRole;
  assignedAt: Timestamp;
  assignedBy: string;
  inheritedFrom?: OrganizationRole; // 如果從組織角色繼承
  expiresAt?: Timestamp;
}

// 權限檢查結果
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason: 'granted' | 'denied' | 'expired' | 'not_assigned';
  source: 'organization' | 'space' | 'inherited';
  roleId?: string;
}

// 角色管理配置
export interface RoleManagementConfig {
  enableInheritance: boolean;
  enableOverride: boolean;
  defaultSpaceRole: SpaceRole;
  requireApprovalForRoleChange: boolean;
}