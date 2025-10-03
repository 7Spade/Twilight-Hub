/**
 * @fileoverview ËßíËâ≤ÁÆ°Á? UI ÁµÑ‰ª∂
 * ?ê‰?ËßíËâ≤?ÜÈ??åÁÆ°?ÜÁ??®Êà∂?åÈù¢
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
} from '@/lib/types-unified';
import { roleManagementService } from '@/lib/role-management';
import { useRoleManagement } from '@/hooks/use-permissions';

interface RoleManagerProps {
  userId: string;
  spaceId?: string;
  currentUserRoleAssignment: UserRoleAssignment;
  onRoleChange?: () => void;
}

/**
 * ËßíËâ≤ÁÆ°Á?Â∞çË©±Ê°? */
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
      console.error('?ÜÈ?ÁµÑÁ?ËßíËâ≤Â§±Ê?:', err);
    }
  };

  const handleSpaceRoleAssign = async () => {
    if (!selectedSpaceRole || !spaceId) return;
    
    try {
      await assignSpaceRole(userId, spaceId, selectedSpaceRole as SpaceRole);
      setSelectedSpaceRole('');
      onRoleChange?.();
    } catch (err) {
      console.error('?ÜÈ?Á©∫È?ËßíËâ≤Â§±Ê?:', err);
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
          ÁÆ°Á?ËßíËâ≤
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ËßíËâ≤ÁÆ°Á?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ?∂Â?ËßíËâ≤È°ØÁ§∫ */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">?∂Â?ËßíËâ≤</h3>
            
            {/* ÁµÑÁ?ËßíËâ≤ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  ÁµÑÁ?ËßíËâ≤
                </CardTitle>
                <CardDescription>
                  ?®Êà∂?®Á?ÁπîÂ±§Á¥öÁ?Ê¨äÈ?ËßíËâ≤
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

            {/* Á©∫È?ËßíËâ≤ */}
            {spaceId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Á©∫È?ËßíËâ≤
                  </CardTitle>
                  <CardDescription>
                    ?®Êà∂?®Ê≠§Á©∫È??ÑÊ??êË???                  </CardDescription>
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
                            (ÁπºÊâø??{formatRoleName(currentUserRoleAssignment.spaceRoles[spaceId].inheritedFrom!)})
                          </span>
                        )}
                      </Badge>
                    ) : (
                      <Badge variant="outline">?™Â???/Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* ËßíËâ≤?ÜÈ? */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">?ÜÈ??∞Ë???/h3>
            
            {/* ÁµÑÁ?ËßíËâ≤?ÜÈ? */}
            <Card>
              <CardHeader>
                <CardTitle>?ÜÈ?ÁµÑÁ?ËßíËâ≤</CardTitle>
                <CardDescription>
                  ?∫Áî®?∂Â??çÁ?ÁπîÂ±§Á¥öÁ?ËßíËâ≤
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedOrgRole} onValueChange={setSelectedOrgRole}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="?∏Ê?ÁµÑÁ?ËßíËâ≤" />
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
                    ?ÜÈ?
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Á©∫È?ËßíËâ≤?ÜÈ? */}
            {spaceId && (
              <Card>
                <CardHeader>
                  <CardTitle>?ÜÈ?Á©∫È?ËßíËâ≤</CardTitle>
                  <CardDescription>
                    ?∫Áî®?∂Â??çÊ≠§Á©∫È??ÑË???                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedSpaceRole} onValueChange={setSelectedSpaceRole}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="?∏Ê?Á©∫È?ËßíËâ≤" />
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
                      ?ÜÈ?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ?ØË™§È°ØÁ§∫ */}
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
 * Ê¨äÈ?È°ØÁ§∫ÁµÑ‰ª∂
 */
interface PermissionDisplayProps {
  permissions: Permission[];
  title?: string;
}

export function PermissionDisplay({ permissions, title = "Ê¨äÈ?" }: PermissionDisplayProps) {
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

