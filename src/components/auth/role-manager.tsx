/**
 * @fileoverview Role Management Component
 * Provides comprehensive role management functionality
 * Follows Next.js 15 + Firebase best practices
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  Settings,
  Search
} from 'lucide-react';
import { useAuth } from './auth-provider';
import { roleManagementService } from '@/lib/role-management';
import { Permission, UserRoleAssignment } from '@/lib/types-unified';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  currentRoles: string[];
}

interface RoleManagerProps {
  spaceId: string;
  organizationId?: string;
}

export function RoleManager({ spaceId, organizationId }: RoleManagerProps) {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Check permissions
  const canManageRoles = hasPermission({ id: 'manage_roles', name: 'Manage Roles' }, spaceId);
  const canAssignRoles = hasPermission({ id: 'assign_roles', name: 'Assign Roles' }, spaceId);

  // Load roles and users
  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [spaceId]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual API call
      // const rolesData = await fetchRoles(spaceId);
      // setRoles(rolesData);
      
      // Mock data for now
      setRoles([
        {
          id: 'admin',
          name: 'Administrator',
          description: 'Full access to all features',
          permissions: [
            { id: 'manage_roles', name: 'Manage Roles' },
            { id: 'assign_roles', name: 'Assign Roles' },
            { id: 'manage_users', name: 'Manage Users' },
            { id: 'manage_content', name: 'Manage Content' }
          ],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'moderator',
          name: 'Moderator',
          description: 'Can moderate content and manage users',
          permissions: [
            { id: 'assign_roles', name: 'Assign Roles' },
            { id: 'manage_users', name: 'Manage Users' },
            { id: 'manage_content', name: 'Manage Content' }
          ],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // TODO: Implement actual API call
      // const usersData = await fetchUsers(spaceId);
      // setUsers(usersData);
      
      // Mock data for now
      setUsers([
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          currentRoles: ['admin']
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          currentRoles: ['moderator']
        }
      ]);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Implement actual API call
      // const newRole = await createRole(spaceId, roleData);
      // setRoles(prev => [...prev, newRole]);
      
      console.log('Creating role:', roleData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handleUpdateRole = async (roleId: string, roleData: Partial<Role>) => {
    try {
      // TODO: Implement actual API call
      // const updatedRole = await updateRole(spaceId, roleId, roleData);
      // setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
      
      console.log('Updating role:', roleId, roleData);
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      // TODO: Implement actual API call
      // await deleteRole(spaceId, roleId);
      // setRoles(prev => prev.filter(role => role.id !== roleId));
      
      console.log('Deleting role:', roleId);
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      // TODO: Implement actual API call
      // await assignRole(spaceId, userId, roleId);
      // loadUsers(); // Reload users to reflect changes
      
      console.log('Assigning role:', userId, roleId);
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!canManageRoles) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to manage roles in this space.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage roles and permissions for this space
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!canManageRoles}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAssignDialogOpen(true)}
            disabled={!canAssignRoles}
          >
            <Users className="h-4 w-4 mr-2" />
            Assign Roles
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission.id} variant="secondary">
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "default" : "outline"}>
                      {role.isSystem ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isSystem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <CreateRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRole}
      />

      {/* Edit Role Dialog */}
      <EditRoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        role={selectedRole}
        onSubmit={handleUpdateRole}
      />

      {/* Assign Role Dialog */}
      <AssignRoleDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        users={users}
        roles={roles}
        onSubmit={handleAssignRole}
      />
    </div>
  );
}

// Create Role Dialog Component
interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function CreateRoleDialog({ open, onOpenChange, onSubmit }: CreateRoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      isSystem: false
    });
    setFormData({ name: '', description: '', permissions: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Role</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Role Dialog Component
interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSubmit: (roleId: string, roleData: Partial<Role>) => void;
}

function EditRoleDialog({ open, onOpenChange, role, onSubmit }: EditRoleDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[]
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      onSubmit(role.id, formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Role</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Assign Role Dialog Component
interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  roles: Role[];
  onSubmit: (userId: string, roleId: string) => void;
}

function AssignRoleDialog({ open, onOpenChange, users, roles, onSubmit }: AssignRoleDialogProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedRole) {
      onSubmit(selectedUser, selectedRole);
      setSelectedUser('');
      setSelectedRole('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user">User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUser || !selectedRole}>
              Assign Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}