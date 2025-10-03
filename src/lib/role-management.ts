/**
 * @fileoverview 角色管�??��??��?
 * 實現混�?角色管�??��?：�?織層�?+ 空�?層�?
 * ?��?權�?繼承?��??��??? */

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
} from './types';

// ?��?義�??��?�?export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  // 組�?層�?角色
  'super_admin': {
    id: 'super_admin',
    name: '超�?管�???,
    description: '?��??�?��??��??�管?�整?�系�?,
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
    name: '組�?管�???,
    description: '?�管?��?織�??��??�空??,
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
    name: '組�??�員',
    description: '組�??�員，可?��??��??�空??,
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
    name: '組�?檢�???,
    description: '?�能?��?組�?信息',
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

  // 空�?層�?角色
  'space_owner': {
    id: 'space_owner',
    name: '空�??��???,
    description: '空�??��??�控?��?,
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
    name: '空�?管�???,
    description: '?�管?�空?��??��??�容',
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
    name: '空�??�員',
    description: '?��??�空?�活??,
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
    name: '空�?檢�???,
    description: '?�能?��?空�??�容',
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

// 角色繼承?��?：�?織�???-> 空�?角色
export const ROLE_INHERITANCE_MAP: Record<OrganizationRole, SpaceRole> = {
  'super_admin': 'space_owner',
  'organization_admin': 'space_admin',
  'organization_member': 'space_member',
  'organization_viewer': 'space_viewer'
};

/**
 * 角色管�??��?�? */
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
   * ?��??�戶?�特定空?��??��?權�?
   */
  async getUserSpacePermissions(
    userId: string, 
    spaceId: string, 
    userRoleAssignment: UserRoleAssignment
  ): Promise<Permission[]> {
    const permissions = new Set<Permission>();

    // 1. 添�?組�?層�?權�?（�??��??�繼?��?
    if (this.config.enableInheritance) {
      for (const orgRole of userRoleAssignment.organizationRoles) {
        const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
        if (roleDef && roleDef.inheritable) {
          // 檢查?�否?��?
          if (orgRole.expiresAt && orgRole.expiresAt.toDate() < new Date()) {
            continue;
          }
          
          // 添�?繼承?�空?��??��???          const inheritedSpaceRole = ROLE_INHERITANCE_MAP[orgRole.roleId];
          if (inheritedSpaceRole) {
            const inheritedRoleDef = ROLE_DEFINITIONS[inheritedSpaceRole];
            inheritedRoleDef.permissions.forEach(permission => permissions.add(permission));
          }
        }
      }
    }

    // 2. 添�?空�?層�?權�?（可?��??��?織�??��?
    const spaceRole = userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      // 檢查?�否?��?
      if (spaceRole.expiresAt && spaceRole.expiresAt.toDate() < new Date()) {
        return Array.from(permissions);
      }

      const roleDef = ROLE_DEFINITIONS[spaceRole.roleId];
      if (roleDef) {
        // 如�??�用覆�?，空?��??��?覆�?組�?權�?
        if (this.config.enableOverride) {
          permissions.clear();
        }
        roleDef.permissions.forEach(permission => permissions.add(permission));
      }
    }

    return Array.from(permissions);
  }

  /**
   * 檢查?�戶?�否?��??��?權�?
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
   * ?��?組�?角色給用??   */
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

    // TODO: 保�??�數?�庫
    return assignment;
  }

  /**
   * ?��?空�?角色給用??   */
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

    // TODO: 保�??�數?�庫
    return assignment;
  }

  /**
   * ?��?權�?來�?
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
   * ?��?權�?對�??��???   */
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

    // 檢查組�?角色
    for (const orgRole of userRoleAssignment.organizationRoles) {
      const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
      if (roleDef && roleDef.permissions.includes(permission)) {
        return orgRole.roleId;
      }
    }

    return undefined;
  }

  /**
   * ?��??�?�可?��???   */
  getAvailableRoles(level: 'organization' | 'space'): RoleDefinition[] {
    return Object.values(ROLE_DEFINITIONS).filter(role => role.level === level);
  }

  /**
   * ?��?角色定義
   */
  getRoleDefinition(roleId: string): RoleDefinition | undefined {
    return ROLE_DEFINITIONS[roleId];
  }
}

// 導出?��?實�?
export const roleManagementService = new RoleManagementService();
