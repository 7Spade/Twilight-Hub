// Modern TypeScript types for Participants system
export interface Participant {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly avatar?: string;
  readonly role: ParticipantRole;
  readonly company?: string;
  readonly accessLevel: AccessLevel;
  readonly joinedAt: Date;
  readonly lastActive?: Date;
  readonly status: ParticipantStatus;
  readonly permissions: ParticipantPermissions;
  readonly isOnline?: boolean;
  readonly timezone?: string;
  readonly department?: string;
  readonly tags?: string[];
}

export type ParticipantRole = 'owner' | 'admin' | 'member' | 'viewer';

export type AccessLevel = 'full' | 'limited' | 'view-only';

export type ParticipantStatus = 'active' | 'inactive' | 'pending';

export interface ParticipantPermissions {
  readonly docs: boolean;
  readonly designCollaboration: boolean;
  readonly modelCoordination: boolean;
  readonly takeoff: boolean;
  readonly autoSpecs: boolean;
  readonly build: boolean;
  readonly costManagement: boolean;
  readonly insight: boolean;
  readonly forma: boolean;
}

export interface ParticipantFilters {
  readonly searchTerm: string;
  readonly company: string;
  readonly role: ParticipantRole | '';
  readonly status: ParticipantStatus | '';
  readonly productAccess: string;
  readonly department?: string;
  readonly tags?: string[];
  readonly isOnline?: boolean;
  readonly sortBy?: 'name' | 'role' | 'joinedAt' | 'lastActive';
  readonly sortOrder?: 'asc' | 'desc';
}

export interface ParticipantActions {
  readonly onInvite: (email: string, role: ParticipantRole, message?: string) => Promise<void>;
  readonly onUpdateRole: (participantId: string, role: ParticipantRole) => Promise<void>;
  readonly onUpdatePermissions: (participantId: string, permissions: Partial<ParticipantPermissions>) => Promise<void>;
  readonly onRemove: (participantId: string) => Promise<void>;
  readonly onBulkUpdate: (participantIds: string[], updates: Partial<Participant>) => Promise<void>;
  readonly onBulkRemove: (participantIds: string[]) => Promise<void>;
  readonly onExport: (format: 'csv' | 'xlsx' | 'pdf') => Promise<void>;
}

export interface ParticipantListProps {
  readonly spaceId: string;
  readonly participants: readonly Participant[];
  readonly currentUserId?: string;
  readonly canManage: boolean;
  readonly isLoading?: boolean;
  readonly error?: string;
  readonly actions: ParticipantActions;
}

export interface ParticipantTableProps {
  readonly participants: readonly Participant[];
  readonly currentUserId?: string;
  readonly canManage: boolean;
  readonly actions: ParticipantActions;
}

export interface ParticipantFiltersProps {
  readonly filters: ParticipantFilters;
  readonly onFiltersChange: (filters: ParticipantFilters) => void;
}

export interface ParticipantInviteFormData {
  readonly email: string;
  readonly role: ParticipantRole;
  readonly message?: string;
}

export interface ParticipantRoleUpdateData {
  readonly participantId: string;
  readonly role: ParticipantRole;
}

export interface ParticipantPermissionsUpdateData {
  readonly participantId: string;
  readonly permissions: Partial<ParticipantPermissions>;
}

// Modern component types
export interface VirtualizedTableProps {
  readonly participants: readonly Participant[];
  readonly currentUserId?: string;
  readonly canManage: boolean;
  readonly actions: ParticipantActions;
  readonly height?: number;
  readonly itemHeight?: number;
}

export interface ParticipantCardProps {
  readonly participant: Participant;
  readonly currentUserId?: string;
  readonly canManage: boolean;
  readonly isSelected?: boolean;
  readonly onSelect?: (participantId: string, selected: boolean) => void;
  readonly onAction?: (action: string, participantId: string) => void;
}

export interface BulkActionsProps {
  readonly selectedCount: number;
  readonly onBulkAction: (action: string, participantIds: string[]) => void;
  readonly onClearSelection: () => void;
}

export interface AdvancedFiltersProps {
  readonly filters: ParticipantFilters;
  readonly onFiltersChange: (filters: ParticipantFilters) => void;
  readonly onReset: () => void;
}

export interface ViewMode {
  readonly type: 'table' | 'card' | 'list';
  readonly label: string;
  readonly icon: string;
}

export interface ParticipantsViewState {
  readonly viewMode: ViewMode['type'];
  readonly selectedParticipants: string[];
  readonly isLoading: boolean;
  readonly error?: string;
}
