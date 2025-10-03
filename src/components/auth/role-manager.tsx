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
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

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
  const { hasPermission, userId } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firestore
  const db = getFirestore(initializeFirebase().firebaseApp);

  // Check permissions
  const canManageRoles = hasPermission('space:manage', spaceId);
  const canAssignRoles = hasPermission('space:manage', spaceId);

  // Load roles and users
  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [spaceId]);

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch roles from Firestore
      const rolesQuery = query(
        collection(db, 'spaces', spaceId, 'roles'),
        orderBy('createdAt', 'desc')
      );
      const rolesSnapshot = await getDocs(rolesQuery);
      
      const rolesData: Role[] = [];
      rolesSnapshot.forEach((doc) => {
        const data = doc.data();
        rolesData.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          permissions: data.permissions || [],
          isSystem: data.isSystem || false,
          createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
        });
      });
      
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
      setError(error instanceof Error ? error.message : 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Fetch users from Firestore
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('name', 'asc')
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      const usersData: User[] = [];
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Get user's roles in this space
        const userRolesQuery = query(
          collection(db, 'userSpaceRoles'),
          where('userId', '==', userDoc.id),
          where('spaceId', '==', spaceId)
        );
        const userRolesSnapshot = await getDocs(userRolesQuery);
        const currentRoles = userRolesSnapshot.docs.map(doc => doc.data().roleId);
        
        usersData.push({
          id: userDoc.id,
          name: userData.displayName || userData.name || 'Unknown User',
          email: userData.email || '',
          currentRoles,
        });
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    }
  };

  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      
      // Create role in Firestore
      const roleRef = await addDoc(collection(db, 'spaces', spaceId, 'roles'), {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions,
        isSystem: roleData.isSystem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Add to local state
      const newRole: Role = {
        ...roleData,
        id: roleRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setRoles(prev => [newRole, ...prev]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create role:', error);
      setError(error instanceof Error ? error.message : 'Failed to create role');
    }
  };

  const handleUpdateRole = async (roleId: string, roleData: Partial<Role>) => {
    try {
      setError(null);
      
      // Update role in Firestore
      const roleRef = doc(db, 'spaces', spaceId, 'roles', roleId);
      await updateDoc(roleRef, {
        ...roleData,
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      setRoles(prev => prev.map(role => 
        role.id === roleId 
          ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
          : role
      ));
      
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Failed to update role:', error);
      setError(error instanceof Error ? error.message : 'Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setError(null);
      
      // Delete role from Firestore
      const roleRef = doc(db, 'spaces', spaceId, 'roles', roleId);
      await deleteDoc(roleRef);
      
      // Remove from local state
      setRoles(prev => prev.filter(role => role.id !== roleId));
    } catch (error) {
      console.error('Failed to delete role:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete role');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      setError(null);
      
      // Assign role in Firestore
      await addDoc(collection(db, 'userSpaceRoles'), {
        userId,
        spaceId,
        roleId,
        assignedAt: serverTimestamp(),
        assignedBy: userId || 'system',
      });
      
      // Reload users to reflect changes
      await loadUsers();
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error('Failed to assign role:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign role');
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
      {/* Error Display */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

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
            disabled={!canManageRoles || loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAssignDialogOpen(true)}
            disabled={!canAssignRoles || loading}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                        <Badge key={permission} variant="secondary">
                          {permission}
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
          )}
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