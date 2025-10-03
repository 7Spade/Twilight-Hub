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
          <DialogTitle>?∞Â?ËßíËâ≤</DialogTitle>
          <DialogDescription>
            Âª∫Á?‰∏Ä?ãÊñ∞?ÑÁ?ÁπîË??≤‰∏¶Ë®≠Â??∂Ê??êÂ?Â≠òÂ?Â±§Á???
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">ËßíËâ≤?çÁ®± *</Label>
              <Input
                id="name"
                {...register('name', { required: 'ËßíËâ≤?çÁ®±?∫Â?Â°´È??? })}
                placeholder="‰æãÂ?ÔºöÂ?Ê°àÂ?Ë™øÂì°"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">?èËø∞</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="?èËø∞Ê≠§Ë??≤Á??∑Ë≤¨?åÁî®??
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="accessLevel">?êË®≠Â≠òÂ?Â±§Á?</Label>
              <Select
                value={watch('accessLevel')}
                onValueChange={(value: RoleFormData['accessLevel']) => setValue('accessLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization-member">ÁµÑÁ??êÂì°</SelectItem>
                  <SelectItem value="organization-admin">ÁµÑÁ?ÁÆ°Á???/SelectItem>
                  <SelectItem value="organization-owner">ÁµÑÁ??ÅÊ???/SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">?¢Â?Ê¨äÈ?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                ?∏Ê?Ê≠§Ë??≤ÂèØ‰ª•Â??ñÂì™‰∫õÁî¢?ÅÂ??üËÉΩ
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
                          {permission === 'docs' ? 'Â∑≤Ë≥ºË≤∑Á??¢Â?' : '?êË®≠?üÁî®'}
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
              ?ñÊ?
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Âª∫Á?‰∏?..' : 'Âª∫Á?ËßíËâ≤'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
