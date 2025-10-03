/**
 * @fileoverview 角色管理核心服務
 * 實現混合角色管理架構：組織層級 + 空間層級
 * 支持權限繼承和覆蓋機制
 */

import { 
  Permission, 
  OrganizationRole, 
  SpaceRole, 
  RoleDefinition, 
  UserRoleAssignment, 
  OrganizationRoleAssignment, 
  SpaceRoleAssignment, 
  PermissionCheckResult,
  RoleManagementConfig 
} from './types-unified';

// 預定義角色配置
export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  // 組織層級角色
  'super_admin': {
    id: 'super_admin',
    name: '超級管理員',
    description: '擁有所有權限，可管理整個系統',
    permissions: [
      'space:read', 'space:write', 'space:delete', 'space:manage',
      'participant:read', 'participant:invite', 'participant:remove', 'participant:manage',
      'file:read', 'file:upload', 'file:delete', 'file:manage',
      'issue:read', 'issue:create', 'issue:update', 'issue:delete',
      'report:read', 'report:create', 'report:manage',
      'settings:read', 'settings:update'
    ],
    level: 'organization',
    inheritable: true
  },
  'organization_admin': {
    id: 'organization_admin',
    name: '組織管理員',
    description: '可管理組織和授權的空間',
    permissions: [
      'space:read', 'space:write', 'space:manage',
      'participant:read', 'participant:invite', 'participant:manage',
      'file:read', 'file:upload', 'file:manage',
      'issue:read', 'issue:create', 'issue:update',
      'report:read', 'report:create',
      'settings:read', 'settings:update'
    ],
    level: 'organization',
    inheritable: true
  },
  'organization_member': {
    id: 'organization_member',
    name: '組織成員',
    description: '組織成員，可參與授權的空間',
    permissions: [
      'space:read',
      'participant:read',
      'file:read', 'file:upload',
      'issue:read', 'issue:create',
      'report:read'
    ],
    level: 'organization',
    inheritable: true
  },
  'organization_viewer': {
    id: 'organization_viewer',
    name: '組織檢視者',
    description: '只能查看組織信息',
    permissions: [
      'space:read',
      'participant:read',
      'file:read',
      'issue:read',
      'report:read'
    ],
    level: 'organization',
    inheritable: true
  },

  // 空間層級角色
  'space_owner': {
    id: 'space_owner',
    name: '空間擁有者',
    description: '空間的完全控制者',
    permissions: [
      'space:read', 'space:write', 'space:delete', 'space:manage',
      'participant:read', 'participant:invite', 'participant:remove', 'participant:manage',
      'file:read', 'file:upload', 'file:delete', 'file:manage',
      'issue:read', 'issue:create', 'issue:update', 'issue:delete',
      'report:read', 'report:create', 'report:manage',
      'settings:read', 'settings:update'
    ],
    level: 'space',
    inheritable: false
  },
  'space_admin': {
    id: 'space_admin',
    name: '空間管理員',
    description: '可管理空間成員和內容',
    permissions: [
      'space:read', 'space:write', 'space:manage',
      'participant:read', 'participant:invite', 'participant:manage',
      'file:read', 'file:upload', 'file:manage',
      'issue:read', 'issue:create', 'issue:update',
      'report:read', 'report:create',
      'settings:read'
    ],
    level: 'space',
    inheritable: false
  },
  'space_member': {
    id: 'space_member',
    name: '空間成員',
    description: '可參與空間活動',
    permissions: [
      'space:read',
      'participant:read',
      'file:read', 'file:upload',
      'issue:read', 'issue:create',
      'report:read'
    ],
    level: 'space',
    inheritable: false
  },
  'space_viewer': {
    id: 'space_viewer',
    name: '空間檢視者',
    description: '只能查看空間內容',
    permissions: [
      'space:read',
      'participant:read',
      'file:read',
      'issue:read',
      'report:read'
    ],
    level: 'space',
    inheritable: false
  }
};

// 角色繼承映射：組織角色 -> 空間角色
export const ROLE_INHERITANCE_MAP: Record<OrganizationRole, SpaceRole> = {
  'super_admin': 'space_owner',
  'organization_admin': 'space_admin',
  'organization_member': 'space_member',
  'organization_viewer': 'space_viewer'
};

/**
 * 角色管理服務類
 */
export class RoleManagementService {
  private config: RoleManagementConfig;

  constructor(config: RoleManagementConfig = {
    enableInheritance: true,
    enableOverride: true,
    defaultSpaceRole: 'space_viewer',
    requireApprovalForRoleChange: false
  }) {
    this.config = config;
  }

  /**
   * 獲取用戶在特定空間的有效權限
   */
  async getUserSpacePermissions(
    userId: string, 
    spaceId: string, 
    userRoleAssignment: UserRoleAssignment
  ): Promise<Permission[]> {
    const permissions = new Set<Permission>();

    // 1. 添加組織層級權限（如果啟用繼承）
    if (this.config.enableInheritance) {
      for (const orgRole of userRoleAssignment.organizationRoles) {
        const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
        if (roleDef && roleDef.inheritable) {
          // 檢查是否過期
          if (orgRole.expiresAt && orgRole.expiresAt.toDate() < new Date()) {
            continue;
          }
          
          // 添加繼承的空間角色權限
          const inheritedSpaceRole = ROLE_INHERITANCE_MAP[orgRole.roleId];
          if (inheritedSpaceRole) {
            const inheritedRoleDef = ROLE_DEFINITIONS[inheritedSpaceRole];
            inheritedRoleDef.permissions.forEach(permission => permissions.add(permission));
          }
        }
      }
    }

    // 2. 添加空間層級權限（可能覆蓋組織權限）
    const spaceRole = userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      // 檢查是否過期
      if (spaceRole.expiresAt && spaceRole.expiresAt.toDate() < new Date()) {
        return Array.from(permissions);
      }

      const roleDef = ROLE_DEFINITIONS[spaceRole.roleId];
      if (roleDef) {
        // 如果啟用覆蓋，空間權限會覆蓋組織權限
        if (this.config.enableOverride) {
          permissions.clear();
        }
        roleDef.permissions.forEach(permission => permissions.add(permission));
      }
    }

    return Array.from(permissions);
  }

  /**
   * 檢查用戶是否具有特定權限
   */
  async checkPermission(
    userId: string,
    spaceId: string,
    permission: Permission,
    userRoleAssignment: UserRoleAssignment
  ): Promise<PermissionCheckResult> {
    const permissions = await this.getUserSpacePermissions(userId, spaceId, userRoleAssignment);
    
    if (permissions.includes(permission)) {
      return {
        hasPermission: true,
        reason: 'granted',
        source: this.getPermissionSource(userId, spaceId, permission, userRoleAssignment),
        roleId: this.getPermissionRole(userId, spaceId, permission, userRoleAssignment)
      };
    }

    return {
      hasPermission: false,
      reason: 'not_assigned',
      source: 'space',
      roleId: undefined
    };
  }

  /**
   * 分配組織角色給用戶
   */
  async assignOrganizationRole(
    userId: string,
    roleId: OrganizationRole,
    assignedBy: string,
    expiresAt?: Date
  ): Promise<OrganizationRoleAssignment> {
    const assignment: OrganizationRoleAssignment = {
      roleId,
      assignedAt: { toDate: () => new Date() } as any, // Firebase Timestamp
      assignedBy,
      expiresAt: expiresAt ? { toDate: () => expiresAt } as any : undefined
    };

    // TODO: 保存到數據庫
    return assignment;
  }

  /**
   * 分配空間角色給用戶
   */
  async assignSpaceRole(
    userId: string,
    spaceId: string,
    roleId: SpaceRole,
    assignedBy: string,
    expiresAt?: Date
  ): Promise<SpaceRoleAssignment> {
    const assignment: SpaceRoleAssignment = {
      roleId,
      assignedAt: { toDate: () => new Date() } as any, // Firebase Timestamp
      assignedBy,
      expiresAt: expiresAt ? { toDate: () => expiresAt } as any : undefined
    };

    // TODO: 保存到數據庫
    return assignment;
  }

  /**
   * 獲取權限來源
   */
  private getPermissionSource(
    userId: string,
    spaceId: string,
    permission: Permission,
    userRoleAssignment: UserRoleAssignment
  ): 'organization' | 'space' | 'inherited' {
    const spaceRole = userRoleAssignment.spaceRoles[spaceId];
    
    if (spaceRole) {
      const roleDef = ROLE_DEFINITIONS[spaceRole.roleId];
      if (roleDef && roleDef.permissions.includes(permission)) {
        return spaceRole.inheritedFrom ? 'inherited' : 'space';
      }
    }

    return 'organization';
  }

  /**
   * 獲取權限對應的角色
   */
  private getPermissionRole(
    userId: string,
    spaceId: string,
    permission: Permission,
    userRoleAssignment: UserRoleAssignment
  ): string | undefined {
    const spaceRole = userRoleAssignment.spaceRoles[spaceId];
    
    if (spaceRole) {
      const roleDef = ROLE_DEFINITIONS[spaceRole.roleId];
      if (roleDef && roleDef.permissions.includes(permission)) {
        return spaceRole.roleId;
      }
    }

    // 檢查組織角色
    for (const orgRole of userRoleAssignment.organizationRoles) {
      const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
      if (roleDef && roleDef.permissions.includes(permission)) {
        return orgRole.roleId;
      }
    }

    return undefined;
  }

  /**
   * 獲取所有可用角色
   */
  getAvailableRoles(level: 'organization' | 'space'): RoleDefinition[] {
    return Object.values(ROLE_DEFINITIONS).filter(role => role.level === level);
  }

  /**
   * 獲取角色定義
   */
  getRoleDefinition(roleId: string): RoleDefinition | undefined {
    return ROLE_DEFINITIONS[roleId];
  }
}

// 導出單例實例
export const roleManagementService = new RoleManagementService();
