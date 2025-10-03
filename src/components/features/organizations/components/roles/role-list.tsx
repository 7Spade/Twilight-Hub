'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MoreVertical, Plus, Search, Settings } from 'lucide-react';
import { useState } from 'react';
import { CreateRoleDialog } from './create-role-dialog';

interface Role {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  memberCount: number;
  accessLevel: 'organization-member' | 'organization-admin' | 'organization-owner';
  permissions: {
    docs: boolean;
    designCollaboration: boolean;
    modelCoordination: boolean;
    takeoff: boolean;
    autoSpecs: boolean;
    build: boolean;
    costManagement: boolean;
    insight: boolean;
    forma: boolean;
  };
}

interface RoleListProps {
  organizationId: string;
  roles?: Role[];
  canManage?: boolean;
}

const defaultRoles: Role[] = [
  {
    id: '1',
    name: '組織管理員',
    description: '負責組織整體管理和決策',
    isDefault: true,
    memberCount: 2,
    accessLevel: 'organization-admin',
    permissions: {
      docs: true,
      designCollaboration: true,
      modelCoordination: true,
      takeoff: true,
      autoSpecs: true,
      build: true,
      costManagement: true,
      insight: true,
      forma: true,
    }
  },
  {
    id: '2',
    name: 'BIM 經理',
    description: '負責 BIM 專案管理和協調',
    isDefault: true,
    memberCount: 3,
    accessLevel: 'organization-member',
    permissions: {
      docs: true,
      designCollaboration: true,
      modelCoordination: true,
      takeoff: true,
      autoSpecs: true,
      build: true,
      costManagement: true,
      insight: true,
      forma: true,
    }
  },
  {
    id: '3',
    name: '專案經理',
    description: '專案整體管理和決策',
    isDefault: true,
    memberCount: 2,
    accessLevel: 'organization-member',
    permissions: {
      docs: true,
      designCollaboration: true,
      modelCoordination: false,
      takeoff: true,
      autoSpecs: false,
      build: true,
      costManagement: true,
      insight: true,
      forma: false,
    }
  },
  {
    id: '4',
    name: '工程師',
    description: '技術實作和設計',
    isDefault: true,
    memberCount: 5,
    accessLevel: 'organization-member',
    permissions: {
      docs: true,
      designCollaboration: true,
      modelCoordination: true,
      takeoff: false,
      autoSpecs: false,
      build: false,
      costManagement: false,
      insight: false,
      forma: true,
    }
  },
  {
    id: '5',
    name: '估價師',
    description: '成本估算和預算管理',
    isDefault: true,
    memberCount: 2,
    accessLevel: 'organization-member',
    permissions: {
      docs: true,
      designCollaboration: false,
      modelCoordination: false,
      takeoff: true,
      autoSpecs: false,
      build: false,
      costManagement: true,
      insight: true,
      forma: false,
    }
  },
  {
    id: '6',
    name: '建築師',
    description: '建築設計和規劃',
    isDefault: true,
    memberCount: 4,
    accessLevel: 'organization-member',
    permissions: {
      docs: true,
      designCollaboration: true,
      modelCoordination: true,
      takeoff: false,
      autoSpecs: true,
      build: false,
      costManagement: false,
      insight: false,
      forma: true,
    }
  }
];

export function RoleList({ organizationId, roles = defaultRoles, canManage = false }: RoleListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionToggle = (roleId: string, permission: keyof Role['permissions']) => {
    // TODO: Implement permission update logic
    console.log(`Toggle ${permission} for role ${roleId}`);
  };

  const handleAccessLevelChange = (roleId: string, accessLevel: string) => {
    // TODO: Implement access level update logic
    console.log(`Change access level to ${accessLevel} for role ${roleId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">組織角色</h2>
          <p className="text-muted-foreground">管理組織中的角色及其設定</p>
        </div>
        {canManage && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            創建角色
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋角色"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Roles List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Role List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                共顯示 {filteredRoles.length} 個角色 (共 {roles.length} 個)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 cursor-pointer border-l-4 transition-colors ${
                      selectedRole?.id === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{role.name}</h4>
                          {role.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              預設
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {role.memberCount} 位成員
                        </p>
                      </div>
                      {canManage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              編輯角色
                            </DropdownMenuItem>
                            {!role.isDefault && (
                              <DropdownMenuItem className="text-destructive">
                                刪除角色
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Role Details */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedRole.name}
                      {selectedRole.isDefault && (
                        <Badge variant="secondary">預設</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{selectedRole.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabs */}
                <Tabs defaultValue="access">
                  <TabsList>
                    <TabsTrigger value="access">權限</TabsTrigger>
                    <TabsTrigger value="members">成員</TabsTrigger>
                  </TabsList>

                  <TabsContent value="access" className="space-y-6">
                    {/* Default Access Level */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">預設權限層級</h4>
                      <Select
                        value={selectedRole.accessLevel}
                        onValueChange={(value) => handleAccessLevelChange(selectedRole.id, value)}
                        disabled={!canManage}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organization-member">組織成員</SelectItem>
                          <SelectItem value="organization-admin">組織管理員</SelectItem>
                          <SelectItem value="organization-owner">組織擁有者</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Purchased Products */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Purchased products</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        此帳戶尚未購買任何產品
                      </p>
                    </div>

                    {/* Unpurchased Products */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Unpurchased products</h4>
                      <div className="space-y-4">
                        {Object.entries(selectedRole.permissions).map(([key, value]) => {
                          const labels: Record<string, string> = {
                            docs: 'Docs',
                            designCollaboration: 'Design Collaboration',
                            modelCoordination: 'Model Coordination',
                            takeoff: 'Takeoff',
                            autoSpecs: 'AutoSpecs',
                            build: 'Build',
                            costManagement: 'Cost Management',
                            insight: 'Insight',
                            forma: 'Forma',
                          };

                          const isDisabled = (key === 'docs' || key === 'insight') && value;

                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm">{labels[key]}</span>
                              <Switch
                                checked={value}
                                disabled={!canManage || isDisabled}
                                onCheckedChange={() => handlePermissionToggle(selectedRole.id, key as keyof Role['permissions'])}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="members">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        此角色目前有 {selectedRole.memberCount} 位成員
                      </p>
                      {/* TODO: Add member list component */}
                      <div className="text-center py-8 text-muted-foreground">
                        成員列表功能開發中...
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">選擇角色</h3>
                  <p className="text-muted-foreground">
                    從左側列表選擇一個角色以查看其詳細資料
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Role Dialog */}
      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        organizationId={organizationId}
      />
    </div>
  );
}