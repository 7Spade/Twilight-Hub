/**
 * @fileoverview 角色管理 UI 組件
 * 提供角色分配和管理的用戶界面
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Shield, Users } from 'lucide-react';
import { 
  OrganizationRole, 
  SpaceRole, 
  Permission, 
  UserRoleAssignment 
} from '@/lib/types';
import { roleManagementService } from '@/lib/role-management';
import { useRoleManagement } from '@/hooks/use-permissions';

interface RoleManagerProps {
  userId: string;
  spaceId?: string;
  currentUserRoleAssignment: UserRoleAssignment;
  onRoleChange?: () => void;
}

/**
 * 角色管理對話框
 */
export function RoleManager({
  userId,
  spaceId,
  currentUserRoleAssignment,
  onRoleChange
}: RoleManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrgRole, setSelectedOrgRole] = useState<OrganizationRole | ''>('');
  const [selectedSpaceRole, setSelectedSpaceRole] = useState<SpaceRole | ''>('');
  const { assignOrganizationRole, assignSpaceRole, loading, error } = useRoleManagement(userId);

  const handleOrgRoleAssign = async () => {
    if (!selectedOrgRole) return;
    
    try {
      await assignOrganizationRole(userId, selectedOrgRole as OrganizationRole);
      setSelectedOrgRole('');
      onRoleChange?.();
    } catch (err) {
      console.error('分配組織角色失敗:', err);
    }
  };

  const handleSpaceRoleAssign = async () => {
    if (!selectedSpaceRole || !spaceId) return;
    
    try {
      await assignSpaceRole(userId, spaceId, selectedSpaceRole as SpaceRole);
      setSelectedSpaceRole('');
      onRoleChange?.();
    } catch (err) {
      console.error('分配空間角色失敗:', err);
    }
  };

  const getRoleBadgeVariant = (roleId: string) => {
    if (roleId.includes('admin') || roleId.includes('owner')) return 'destructive';
    if (roleId.includes('member')) return 'default';
    return 'secondary';
  };

  const formatRoleName = (roleId: string) => {
    const roleDef = roleManagementService.getRoleDefinition(roleId);
    return roleDef?.name || roleId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          管理角色
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            角色管理
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 當前角色顯示 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">當前角色</h3>
            
            {/* 組織角色 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  組織角色
                </CardTitle>
                <CardDescription>
                  用戶在組織層級的權限角色
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUserRoleAssignment.organizationRoles.map((role, index) => (
                    <Badge 
                      key={index} 
                      variant={getRoleBadgeVariant(role.roleId)}
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {formatRoleName(role.roleId)}
                      {role.expiresAt && (
                        <Clock className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 空間角色 */}
            {spaceId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    空間角色
                  </CardTitle>
                  <CardDescription>
                    用戶在此空間的權限角色
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentUserRoleAssignment.spaceRoles[spaceId] ? (
                      <Badge 
                        variant={getRoleBadgeVariant(currentUserRoleAssignment.spaceRoles[spaceId].roleId)}
                        className="flex items-center gap-1"
                      >
                        <Shield className="h-3 w-3" />
                        {formatRoleName(currentUserRoleAssignment.spaceRoles[spaceId].roleId)}
                        {currentUserRoleAssignment.spaceRoles[spaceId].inheritedFrom && (
                          <span className="text-xs opacity-70">
                            (繼承自 {formatRoleName(currentUserRoleAssignment.spaceRoles[spaceId].inheritedFrom!)})
                          </span>
                        )}
                      </Badge>
                    ) : (
                      <Badge variant="outline">未分配</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* 角色分配 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">分配新角色</h3>
            
            {/* 組織角色分配 */}
            <Card>
              <CardHeader>
                <CardTitle>分配組織角色</CardTitle>
                <CardDescription>
                  為用戶分配組織層級的角色
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedOrgRole} onValueChange={setSelectedOrgRole}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="選擇組織角色" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleManagementService.getAvailableRoles('organization').map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleOrgRoleAssign}
                    disabled={!selectedOrgRole || loading}
                  >
                    分配
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 空間角色分配 */}
            {spaceId && (
              <Card>
                <CardHeader>
                  <CardTitle>分配空間角色</CardTitle>
                  <CardDescription>
                    為用戶分配此空間的角色
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedSpaceRole} onValueChange={setSelectedSpaceRole}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="選擇空間角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleManagementService.getAvailableRoles('space').map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{role.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSpaceRoleAssign}
                      disabled={!selectedSpaceRole || loading}
                    >
                      分配
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 錯誤顯示 */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 權限顯示組件
 */
interface PermissionDisplayProps {
  permissions: Permission[];
  title?: string;
}

export function PermissionDisplay({ permissions, title = "權限" }: PermissionDisplayProps) {
  const formatPermission = (permission: Permission) => {
    const [resource, action] = permission.split(':');
    return `${resource} - ${action}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {permissions.map(permission => (
            <Badge key={permission} variant="outline" className="text-xs">
              {formatPermission(permission)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

