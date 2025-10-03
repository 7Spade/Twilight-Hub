// Modern barrel file for participants components
export { ParticipantList } from './participant-list';
export { VirtualizedTable } from './virtualized-table';
export { ParticipantCard } from './participant-card';
export { CardGrid } from './card-grid';
export { AdvancedFilters } from './advanced-filters';
export { ViewToggle } from './view-toggle';
export { InviteParticipantDialog } from './invite-participant-dialog';
export { ParticipantRoleEditor } from './participant-role-editor';

// Legacy components (deprecated)
export { ParticipantTable } from './participant-table';
export { ParticipantFilters } from './participant-filters';

// Hooks
export { useParticipants, useParticipantFilters } from './hooks/use-participants';

// Types
export type {
  Participant,
  ParticipantRole,
  AccessLevel,
  ParticipantStatus,
  ParticipantPermissions,
  ParticipantFilters as ParticipantFiltersType,
  ParticipantActions,
  ParticipantListProps,
  ParticipantTableProps,
  ParticipantFiltersProps,
  ParticipantInviteFormData,
  ParticipantRoleUpdateData,
  ParticipantPermissionsUpdateData,
  VirtualizedTableProps,
  ParticipantCardProps,
  BulkActionsProps,
  AdvancedFiltersProps,
  ViewMode,
  ParticipantsViewState,
} from './types';

// Data service
export { ParticipantDataService } from './data';
