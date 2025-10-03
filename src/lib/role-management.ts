/**
 * @fileoverview è§’è‰²ç®¡ç??¸å??å?
 * å¯¦ç¾æ··å?è§’è‰²ç®¡ç??¶æ?ï¼šç?ç¹”å±¤ç´?+ ç©ºé?å±¤ç?
 * ?¯æ?æ¬Šé?ç¹¼æ‰¿?Œè??‹æ??? */

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

// ?å?ç¾©è??²é?ç½?export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  // çµ„ç?å±¤ç?è§’è‰²
  'super_admin': {
    id: 'super_admin',
    name: 'è¶…ç?ç®¡ç???,
    description: '?æ??€?‰æ??ï??¯ç®¡?†æ•´?‹ç³»çµ?,
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
    name: 'çµ„ç?ç®¡ç???,
    description: '?¯ç®¡?†ç?ç¹”å??ˆæ??„ç©º??,
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
    name: 'çµ„ç??å“¡',
    description: 'çµ„ç??å“¡ï¼Œå¯?ƒè??ˆæ??„ç©º??,
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
    name: 'çµ„ç?æª¢è???,
    description: '?ªèƒ½?¥ç?çµ„ç?ä¿¡æ¯',
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

  // ç©ºé?å±¤ç?è§’è‰²
  'space_owner': {
    id: 'space_owner',
    name: 'ç©ºé??æ???,
    description: 'ç©ºé??„å??¨æ§?¶è€?,
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
    name: 'ç©ºé?ç®¡ç???,
    description: '?¯ç®¡?†ç©º?“æ??¡å??§å®¹',
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
    name: 'ç©ºé??å“¡',
    description: '?¯å??‡ç©º?“æ´»??,
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
    name: 'ç©ºé?æª¢è???,
    description: '?ªèƒ½?¥ç?ç©ºé??§å®¹',
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

// è§’è‰²ç¹¼æ‰¿? å?ï¼šç?ç¹”è???-> ç©ºé?è§’è‰²
export const ROLE_INHERITANCE_MAP: Record<OrganizationRole, SpaceRole> = {
  'super_admin': 'space_owner',
  'organization_admin': 'space_admin',
  'organization_member': 'space_member',
  'organization_viewer': 'space_viewer'
};

/**
 * è§’è‰²ç®¡ç??å?é¡? */
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
   * ?²å??¨æˆ¶?¨ç‰¹å®šç©º?“ç??‰æ?æ¬Šé?
   */
  async getUserSpacePermissions(
    userId: string, 
    spaceId: string, 
    userRoleAssignment: UserRoleAssignment
  ): Promise<Permission[]> {
    const permissions = new Set<Permission>();

    // 1. æ·»å?çµ„ç?å±¤ç?æ¬Šé?ï¼ˆå??œå??¨ç¹¼?¿ï?
    if (this.config.enableInheritance) {
      for (const orgRole of userRoleAssignment.organizationRoles) {
        const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
        if (roleDef && roleDef.inheritable) {
          // æª¢æŸ¥?¯å¦?æ?
          if (orgRole.expiresAt && orgRole.expiresAt.toDate() < new Date()) {
            continue;
          }
          
          // æ·»å?ç¹¼æ‰¿?„ç©º?“è??²æ???          const inheritedSpaceRole = ROLE_INHERITANCE_MAP[orgRole.roleId];
          if (inheritedSpaceRole) {
            const inheritedRoleDef = ROLE_DEFINITIONS[inheritedSpaceRole];
            inheritedRoleDef.permissions.forEach(permission => permissions.add(permission));
          }
        }
      }
    }

    // 2. æ·»å?ç©ºé?å±¤ç?æ¬Šé?ï¼ˆå¯?½è??‹ç?ç¹”æ??ï?
    const spaceRole = userRoleAssignment.spaceRoles[spaceId];
    if (spaceRole) {
      // æª¢æŸ¥?¯å¦?æ?
      if (spaceRole.expiresAt && spaceRole.expiresAt.toDate() < new Date()) {
        return Array.from(permissions);
      }

      const roleDef = ROLE_DEFINITIONS[spaceRole.roleId];
      if (roleDef) {
        // å¦‚æ??Ÿç”¨è¦†è?ï¼Œç©º?“æ??æ?è¦†è?çµ„ç?æ¬Šé?
        if (this.config.enableOverride) {
          permissions.clear();
        }
        roleDef.permissions.forEach(permission => permissions.add(permission));
      }
    }

    return Array.from(permissions);
  }

  /**
   * æª¢æŸ¥?¨æˆ¶?¯å¦?·æ??¹å?æ¬Šé?
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
   * ?†é?çµ„ç?è§’è‰²çµ¦ç”¨??   */
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

    // TODO: ä¿å??°æ•¸?šåº«
    return assignment;
  }

  /**
   * ?†é?ç©ºé?è§’è‰²çµ¦ç”¨??   */
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

    // TODO: ä¿å??°æ•¸?šåº«
    return assignment;
  }

  /**
   * ?²å?æ¬Šé?ä¾†æ?
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
   * ?²å?æ¬Šé?å°æ??„è???   */
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

    // æª¢æŸ¥çµ„ç?è§’è‰²
    for (const orgRole of userRoleAssignment.organizationRoles) {
      const roleDef = ROLE_DEFINITIONS[orgRole.roleId];
      if (roleDef && roleDef.permissions.includes(permission)) {
        return orgRole.roleId;
      }
    }

    return undefined;
  }

  /**
   * ?²å??€?‰å¯?¨è???   */
  getAvailableRoles(level: 'organization' | 'space'): RoleDefinition[] {
    return Object.values(ROLE_DEFINITIONS).filter(role => role.level === level);
  }

  /**
   * ?²å?è§’è‰²å®šç¾©
   */
  getRoleDefinition(roleId: string): RoleDefinition | undefined {
    return ROLE_DEFINITIONS[roleId];
  }
}

// å°å‡º?®ä?å¯¦ä?
export const roleManagementService = new RoleManagementService();
