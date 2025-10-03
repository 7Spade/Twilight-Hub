/**
 * @fileoverview ?¾ä»£?–å??‡è€…å¡?‡ç?ä»?
 * ?¿æ?å¼è¨­è¨ˆï??¯æ??•ç•«?Œäº¤äº’æ???
 */

'use client';

import React, { useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Crown, 
  Shield, 
  Users, 
  Eye, 
  Mail, 
  Phone, 
  Building,
  Clock,
  Globe
} from 'lucide-react';
import { ParticipantCardProps } from './types';

// è§’è‰²?–æ?? å?
const ROLE_ICONS = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
} as const;

// è§’è‰²é¡è‰²? å?
const ROLE_COLORS = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  member: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

// ?€?‹é??²æ?å°?
const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
} as const;

export function ParticipantCard({
  participant,
  currentUserId,
  canManage,
  isSelected = false,
  onSelect,
  onAction,
}: ParticipantCardProps) {
  const RoleIcon = ROLE_ICONS[participant.role];
  const isCurrentUser = participant.id === currentUserId;

  const handleSelect = useCallback((checked: boolean) => {
    onSelect?.(participant.id, checked);
  }, [participant.id, onSelect]);

  const handleAction = useCallback((action: string) => {
    onAction?.(action, participant.id);
  }, [participant.id, onAction]);

  return (
    <div className="group animate-in fade-in-0 slide-in-from-bottom-2 duration-200 hover:scale-105 hover:-translate-y-1 transition-all">
      <Card className={`relative overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${isCurrentUser ? 'bg-primary/5' : ''}`}>
        <CardContent className="p-4">
          {/* ?¸æ?æ¡?*/}
          {onSelect && (
            <div className="absolute top-3 right-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleSelect}
                disabled={isCurrentUser}
                aria-label={`?¸æ? ${participant.name}`}
              />
            </div>
          )}

          {/* ?­å??ŒåŸº?¬ä¿¡??*/}
          <div className="flex items-start gap-3 mb-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback className="text-sm font-medium">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {participant.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base truncate">{participant.name}</h3>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">ä½?/Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{participant.email}</span>
                </div>
                {participant.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{participant.phone}</span>
                  </div>
                )}
              </div>

              {participant.company && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{participant.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* è§’è‰²?Œç???*/}
          <div className="flex items-center gap-2 mb-3">
            <Badge 
              variant="outline" 
              className={`${ROLE_COLORS[participant.role]} text-xs flex items-center gap-1`}
            >
              <RoleIcon className="h-3 w-3" />
              {participant.role === 'member' ? '?å“¡' : participant.role}
            </Badge>
            
            <Badge 
              variant="outline" 
              className={`${STATUS_COLORS[participant.status]} text-xs`}
            >
              {participant.status === 'active' ? 'ä½¿ç”¨ä¸? : participant.status}
            </Badge>

            <Badge variant="outline" className="text-xs">
              {participant.accessLevel}
            </Badge>
          </div>

          {/* æ¨™ç±¤ */}
          {participant.tags && participant.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {participant.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {participant.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{participant.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* ?‚é?ä¿¡æ¯ */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>? å…¥??{participant.joinedAt.toLocaleDateString('zh-TW')}</span>
            </div>
            {participant.lastActive && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>?€å¾Œæ´»??{participant.lastActive.toLocaleDateString('zh-TW')}</span>
              </div>
            )}
          </div>

          {/* ?ä??‰é? */}
          {canManage && !isCurrentUser && (
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleAction('edit')}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    ç·¨è¼¯?å“¡
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('role')}>
                    <Shield className="h-4 w-4 mr-2" />
                    è®Šæ›´è§’è‰²
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('permissions')}>
                    <Shield className="h-4 w-4 mr-2" />
                    ç®¡ç?æ¬Šé?
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleAction('remove')}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    ç§»é™¤?å“¡
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
