'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Users, AlertCircle } from 'lucide-react';
import { useParticipants, useParticipantFilters } from './hooks/use-participants';
import { VirtualizedTable } from './virtualized-table';
import { CardGrid } from './card-grid';
import { AdvancedFilters } from './advanced-filters';
import { ViewToggle } from './view-toggle';
import { InviteParticipantDialog } from './invite-participant-dialog';
import { ParticipantListProps, ParticipantsViewState, ViewMode } from './types';

export function ParticipantList({ 
  spaceId, 
  participants: initialParticipants, 
  currentUserId, 
  canManage = false,
  actions: propActions
}: ParticipantListProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [viewState, setViewState] = useState<ParticipantsViewState>({
    viewMode: 'table',
    selectedParticipants: [],
    isLoading: false,
  });

  const { participants, isLoading, error, loadParticipants, actions: hookActions } = useParticipants(spaceId);
  const { filters, updateFilters, clearFilters, filteredParticipants } = useParticipantFilters();

  // ?à‰Ωµ actions
  const actions = useMemo(() => ({
    ...hookActions,
    ...propActions,
  }), [hookActions, propActions]);

  // Use initial participants if provided, otherwise use loaded participants
  const displayParticipants = initialParticipants.length > 0 ? initialParticipants : participants;
  const filteredData = useMemo(() => 
    filteredParticipants(displayParticipants), 
    [displayParticipants, filteredParticipants]
  );

  // Load participants on mount if no initial data provided
  useEffect(() => {
    if (initialParticipants.length === 0) {
      loadParticipants();
    }
  }, [initialParticipants.length, loadParticipants]);

  const handleViewModeChange = useCallback((mode: ViewMode['type']) => {
    setViewState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const handleExport = useCallback(async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      await actions.onExport(format);
    } catch (error) {
      console.error('Â∞éÂá∫Â§±Ê?:', error);
    }
  }, [actions]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-600 mb-2">ËºâÂÖ•?êÂì°?ÇÁôº?üÈåØË™?/h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadParticipants} variant="outline">
          ?çË©¶
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2 duration-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">?êÂì°</h2>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            {filteredData.length} ?ãÊ???
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ViewToggle
            viewMode={viewState.viewMode}
            onViewModeChange={handleViewModeChange}
          />
          
          {canManage && (
            <Button onClick={() => setInviteDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              ?∞Â??êÂì°
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            ?ØÂá∫
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200 delay-100">
        <AdvancedFilters 
          filters={filters} 
          onFiltersChange={updateFilters}
          onReset={clearFilters}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 animate-in fade-in-0 duration-200">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>ËºâÂÖ•‰∏?..</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div key={viewState.viewMode} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
            {viewState.viewMode === 'table' && (
              <VirtualizedTable
                participants={filteredData}
                currentUserId={currentUserId}
                canManage={canManage}
                actions={actions}
                height={600}
              />
            )}
            
            {viewState.viewMode === 'card' && (
              <CardGrid
                participants={filteredData}
                currentUserId={currentUserId}
                canManage={canManage}
                actions={actions}
                height={600}
              />
            )}
            
            {viewState.viewMode === 'list' && (
              <VirtualizedTable
                participants={filteredData}
                currentUserId={currentUserId}
                canManage={canManage}
                actions={actions}
                height={600}
                itemHeight={60}
              />
            )}
        </div>
      )}

      {/* Invite Dialog */}
      <InviteParticipantDialog
        spaceId={spaceId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={actions.onInvite}
      />
    </div>
  );
}
