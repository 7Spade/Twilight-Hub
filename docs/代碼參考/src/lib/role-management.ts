import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { Permission, PermissionCheckResult, UserRoleAssignment } from '@/lib/types-unified';

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: Permission[];
}

export interface AssignRoleData {
  userId: string;
  spaceId?: string;
  organizationId?: string;
  roleId: string;
  assignedBy: string;
}

// 預定義的系統角色
const SYSTEM_ROLES: Record<string, RoleDefinition> = {
  'admin': {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: [
      'space:manage',
      'participant:manage',
      'file:manage',
      'issue:delete',
      'report:manage',
      'settings:update',
    ],
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'space_admin': {
    id: 'space_admin',
    name: 'Space Administrator',
    description: 'Full access to space features',
    permissions: [
      'space:manage',
      'participant:manage',
      'file:manage',
      'issue:update',
      'report:manage',
      'settings:update',
    ],
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'moderator': {
    id: 'moderator',
    name: 'Moderator',
    description: 'Can moderate content and manage users',
    permissions: [
      'issue:update',
      'participant:remove',
      'file:delete',
    ],
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'member': {
    id: 'member',
    name: 'Member',
    description: 'Basic access to space features',
    permissions: [
      'space:read',
      'file:read',
      'issue:read',
      'report:read',
    ],
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// TODO: [P2] REFACTOR src/lib/role-management.ts - 合併查詢與快取，僅回傳最小資料
// 指南：
// - 提供 in-memory 快取（弱映射）以減少 getRoleDefinition 重複查詢；
// - checkPermission 與 getAllRoleDefinitions 共享快取；
// - 僅暴露 id/name/permissions；將非必要欄位延後查詢。
// @assignee ai
export const roleManagementService = {
  // 初始化 Firestore
  db: getFirestore(initializeFirebase().firebaseApp),
  // TODO: [P2] REFACTOR src/lib/role-management.ts - 奧卡姆剃刀精簡服務層
  // 建議：
  // 1) 以 pure function + 最小輸出為主，避免在 service 層維持隱藏狀態。
  // 2) 將 getAllRoleDefinitions 與 checkPermission 的重複查詢合併/快取；避免重複 Firestore round-trip。
  // 3) 僅回傳渲染所需欄位（id/name/permissions），其餘細節延後查詢。

  // 獲取角色定義
  getRoleDefinition: async (roleId: string): Promise<RoleDefinition | null> => {
    try {
      // 首先檢查系統角色
      if (SYSTEM_ROLES[roleId]) {
        return SYSTEM_ROLES[roleId];
      }

      // 從 Firestore 獲取自定義角色
      const roleDoc = await getDoc(doc(roleManagementService.db, 'roles', roleId));
      
      if (roleDoc.exists()) {
        const data = roleDoc.data();
        return {
          id: roleDoc.id,
          name: data.name,
          description: data.description,
          permissions: (data.permissions || []) as Permission[],
          isSystem: data.isSystem || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get role definition:', error);
      return null;
    }
  },

  // 獲取所有角色定義
  getAllRoleDefinitions: async (): Promise<RoleDefinition[]> => {
    try {
      const roles: RoleDefinition[] = Object.values(SYSTEM_ROLES);
      
      // 獲取自定義角色
      const customRolesQuery = query(
        collection(roleManagementService.db, 'roles'),
        where('isSystem', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const customRolesSnapshot = await getDocs(customRolesQuery);
      customRolesSnapshot.forEach(doc => {
        const data = doc.data();
        roles.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          permissions: (data.permissions || []) as Permission[],
          isSystem: false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return roles;
    } catch (error) {
      console.error('Failed to get all role definitions:', error);
      return Object.values(SYSTEM_ROLES);
    }
  },

  // 創建角色
  createRole: async (roleData: CreateRoleData): Promise<RoleDefinition> => {
    try {
      const roleRef = await addDoc(collection(roleManagementService.db, 'roles'), {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        isSystem: roleData.isSystem || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: roleRef.id,
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        isSystem: roleData.isSystem || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Failed to create role:', error);
      throw error;
    }
  },

  // 更新角色
  updateRole: async (roleId: string, roleData: UpdateRoleData): Promise<RoleDefinition | null> => {
    try {
      // 系統角色不能更新
      if (SYSTEM_ROLES[roleId]) {
        throw new Error('Cannot update system roles');
      }

      const roleRef = doc(roleManagementService.db, 'roles', roleId);
      await updateDoc(roleRef, {
        ...roleData,
        updatedAt: serverTimestamp(),
      });

      return await roleManagementService.getRoleDefinition(roleId);
    } catch (error) {
      console.error('Failed to update role:', error);
      throw error;
    }
  },

  // 刪除角色
  deleteRole: async (roleId: string): Promise<void> => {
    try {
      // 系統角色不能刪除
      if (SYSTEM_ROLES[roleId]) {
        throw new Error('Cannot delete system roles');
      }

      const roleRef = doc(roleManagementService.db, 'roles', roleId);
      await deleteDoc(roleRef);
    } catch (error) {
      console.error('Failed to delete role:', error);
      throw error;
    }
  },

  // 分配角色
  assignRole: async (assignData: AssignRoleData): Promise<void> => {
    try {
      if (assignData.spaceId) {
        // 分配空間角色
        await addDoc(collection(roleManagementService.db, 'userSpaceRoles'), {
          userId: assignData.userId,
          spaceId: assignData.spaceId,
          roleId: assignData.roleId,
          assignedAt: serverTimestamp(),
          assignedBy: assignData.assignedBy,
        });
      } else if (assignData.organizationId) {
        // 分配組織角色
        await addDoc(collection(roleManagementService.db, 'userOrganizationRoles'), {
          userId: assignData.userId,
          organizationId: assignData.organizationId,
          roleId: assignData.roleId,
          assignedAt: serverTimestamp(),
          assignedBy: assignData.assignedBy,
        });
      } else {
        throw new Error('Either spaceId or organizationId must be provided');
      }
    } catch (error) {
      console.error('Failed to assign role:', error);
      throw error;
    }
  },

  // 移除角色分配
  removeRoleAssignment: async (userId: string, spaceId?: string, organizationId?: string): Promise<void> => {
    try {
      if (spaceId) {
        // 移除空間角色
        const spaceRolesQuery = query(
          collection(roleManagementService.db, 'userSpaceRoles'),
          where('userId', '==', userId),
          where('spaceId', '==', spaceId)
        );
        const spaceRolesSnapshot = await getDocs(spaceRolesQuery);
        
        for (const doc of spaceRolesSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
      } else if (organizationId) {
        // 移除組織角色
        const orgRolesQuery = query(
          collection(roleManagementService.db, 'userOrganizationRoles'),
          where('userId', '==', userId),
          where('organizationId', '==', organizationId)
        );
        const orgRolesSnapshot = await getDocs(orgRolesQuery);
        
        for (const doc of orgRolesSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
      } else {
        throw new Error('Either spaceId or organizationId must be provided');
      }
    } catch (error) {
      console.error('Failed to remove role assignment:', error);
      throw error;
    }
  },

  // 權限檢查
  checkPermission: async (
    userId: string, 
    spaceId: string, 
    permission: Permission, 
    userRoleAssignment: UserRoleAssignment
  ): Promise<PermissionCheckResult> => {
    try {
      // 檢查空間角色
      const spaceRole = userRoleAssignment.spaceRoles[spaceId];
      if (spaceRole) {
        const roleDef = await roleManagementService.getRoleDefinition(spaceRole.roleId);
        if (roleDef && roleDef.permissions.includes(permission)) {
          return {
            hasPermission: true,
            reason: 'granted',
            source: 'space',
            roleId: spaceRole.roleId,
          };
        }
      }

      // 檢查組織角色
      for (const orgRole of userRoleAssignment.organizationRoles) {
        const roleDef = await roleManagementService.getRoleDefinition(orgRole.roleId);
        if (roleDef && roleDef.permissions.includes(permission)) {
          return {
            hasPermission: true,
            reason: 'granted',
            source: 'organization',
            roleId: orgRole.roleId,
          };
        }
      }

      return {
        hasPermission: false,
        reason: 'denied',
        source: 'space',
        roleId: undefined,
      };
    } catch (error) {
      console.error('Permission check failed:', error);
      return {
        hasPermission: false,
        reason: 'denied',
        source: 'space',
        roleId: undefined,
      };
    }
  },

  // 獲取用戶在空間的角色
  getUserSpaceRole: async (userId: string, spaceId: string): Promise<RoleDefinition | null> => {
    try {
      const userSpaceRolesQuery = query(
        collection(roleManagementService.db, 'userSpaceRoles'),
        where('userId', '==', userId),
        where('spaceId', '==', spaceId)
      );
      
      const userSpaceRolesSnapshot = await getDocs(userSpaceRolesQuery);
      
      if (userSpaceRolesSnapshot.empty) {
        return null;
      }

      const userSpaceRole = userSpaceRolesSnapshot.docs[0].data();
      return await roleManagementService.getRoleDefinition(userSpaceRole.roleId);
    } catch (error) {
      console.error('Failed to get user space role:', error);
      return null;
    }
  },

  // 獲取用戶在組織的角色
  getUserOrganizationRoles: async (userId: string, organizationId: string): Promise<RoleDefinition[]> => {
    try {
      const userOrgRolesQuery = query(
        collection(roleManagementService.db, 'userOrganizationRoles'),
        where('userId', '==', userId),
        where('organizationId', '==', organizationId)
      );
      
      const userOrgRolesSnapshot = await getDocs(userOrgRolesQuery);
      const roles: RoleDefinition[] = [];
      
      for (const doc of userOrgRolesSnapshot.docs) {
        const data = doc.data();
        const roleDef = await roleManagementService.getRoleDefinition(data.roleId);
        if (roleDef) {
          roles.push(roleDef);
        }
      }

      return roles;
    } catch (error) {
      console.error('Failed to get user organization roles:', error);
      return [];
    }
  },

  // 獲取所有可用權限
  getAllPermissions: (): Permission[] => {
    return [
      'space:read',
      'space:write',
      'space:delete',
      'space:manage',
      'participant:read',
      'participant:invite',
      'participant:remove',
      'participant:manage',
      'file:read',
      'file:upload',
      'file:delete',
      'file:manage',
      'issue:read',
      'issue:create',
      'issue:update',
      'issue:delete',
      'report:read',
      'report:create',
      'report:manage',
      'settings:read',
      'settings:update',
    ];
  },
};