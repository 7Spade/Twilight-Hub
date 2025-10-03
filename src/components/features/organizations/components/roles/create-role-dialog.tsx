'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

interface RoleFormData {
  name: string;
  description: string;
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

export function CreateRoleDialog({ open, onOpenChange, organizationId }: CreateRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<RoleFormData>({
    defaultValues: {
      name: '',
      description: '',
      accessLevel: 'organization-member',
      permissions: {
        docs: true,
        designCollaboration: false,
        modelCoordination: false,
        takeoff: false,
        autoSpecs: false,
        build: false,
        costManagement: false,
        insight: false,
        forma: false,
      }
    }
  });

  const watchedPermissions = watch('permissions');

  const onSubmit = async (data: RoleFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement role creation API call
      console.log('Creating role for organization:', organizationId, data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permission: keyof RoleFormData['permissions'], checked: boolean) => {
    setValue(`permissions.${permission}`, checked);
  };

  const permissionLabels: Record<keyof RoleFormData['permissions'], string> = {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>?��?角色</DialogTitle>
          <DialogDescription>
            建�?一?�新?��?織�??�並設�??��??��?存�?層�???
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">角色?�稱 *</Label>
              <Input
                id="name"
                {...register('name', { required: '角色?�稱?��?填�??? })}
                placeholder="例�?：�?案�?調員"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">?�述</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="?�述此�??��??�責?�用??
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="accessLevel">?�設存�?層�?</Label>
              <Select
                value={watch('accessLevel')}
                onValueChange={(value: RoleFormData['accessLevel']) => setValue('accessLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization-member">組�??�員</SelectItem>
                  <SelectItem value="organization-admin">組�?管�???/SelectItem>
                  <SelectItem value="organization-owner">組�??��???/SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">?��?權�?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                ?��?此�??�可以�??�哪些產?��??�能
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(permissionLabels).map(([key, label]) => {
                const permission = key as keyof RoleFormData['permissions'];
                const isDisabled = (permission === 'docs' || permission === 'insight') && watchedPermissions[permission];

                return (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                      {(permission === 'docs' || permission === 'insight') && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission === 'docs' ? '已購買�??��?' : '?�設?�用'}
                        </p>
                      )}
                    </div>
                    <Switch
                      id={key}
                      checked={watchedPermissions[permission]}
                      disabled={isDisabled}
                      onCheckedChange={(checked) => handlePermissionToggle(permission, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              ?��?
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '建�?�?..' : '建�?角色'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
