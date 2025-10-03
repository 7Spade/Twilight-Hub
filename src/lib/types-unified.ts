/**
 * @fileoverview 統�??��??��?�? * ?��??�散?��??��?義�??�循奧卡姆�??�?��?
 */

import { Timestamp } from "firebase/firestore";

// ===== ?��?類�? =====

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== ?�戶?��?織�???=====

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

// ===== 空�??�模組�???=====

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

// ===== 組�?管�?類�? =====

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

// ===== 審�??��?就�???=====

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

// ===== 權�?管�?類�? =====

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

// ===== UI 組件類�? =====

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

// ===== 表單類�? =====

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

// ===== ?�?�管?��???=====

export interface AppState {
  chat: {
    isOpen: boolean;
    isMinimized: boolean;
  };
  dialog: {
    type: string | null;
    data: any; /* TODO: [P2] [BUG] [UI] [TODO] 修復 TypeScript any 類型警告 */
    isOpen: boolean;
  };
}

export interface AuthState {
  userId: string | null;
  userRoleAssignment: UserRoleAssignment | null;
  isLoading: boolean;
  error: string | null;
}

// ===== ?�件?��?類�? =====

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

// ===== 導出?�?��???=====

// ?�新導出 React Hook Form 類�?
export type {
  FieldValues,
  FieldPath,
  Control,
  UseFormReturn,
} from 'react-hook-form';
