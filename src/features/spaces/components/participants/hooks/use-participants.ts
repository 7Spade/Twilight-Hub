'use client';

import { useState, useCallback, useMemo } from 'react';
import { Participant, ParticipantFilters, ParticipantActions } from '../types';
import { ParticipantDataService } from '../data';

export function useParticipants(spaceId: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ParticipantDataService.getParticipants(spaceId);
      setParticipants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load participants');
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  const actions: ParticipantActions = useMemo(() => ({
    onInvite: async (email: string, role: Participant['role'], message?: string) => {
      try {
        const newParticipant = await ParticipantDataService.inviteParticipant(spaceId, email, role, message);
        setParticipants(prev => [...prev, newParticipant]);
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to invite participant');
      }
    },
    onUpdateRole: async (participantId: string, role: Participant['role']) => {
      try {
        const updatedParticipant = await ParticipantDataService.updateParticipantRole(participantId, role);
        setParticipants(prev => 
          prev.map(p => p.id === participantId ? updatedParticipant : p)
        );
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to update role');
      }
    },
    onUpdatePermissions: async (participantId: string, permissions: Partial<Participant['permissions']>) => {
      try {
        const updatedParticipant = await ParticipantDataService.updateParticipantPermissions(participantId, permissions);
        setParticipants(prev => 
          prev.map(p => p.id === participantId ? updatedParticipant : p)
        );
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to update permissions');
      }
    },
    onRemove: async (participantId: string) => {
      try {
        await ParticipantDataService.removeParticipant(participantId);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to remove participant');
      }
    },
  }), [spaceId]);

  return {
    participants,
    isLoading,
    error,
    loadParticipants,
    actions,
  };
}

export function useParticipantFilters() {
  const [filters, setFilters] = useState<ParticipantFilters>({
    searchTerm: '',
    company: '',
    role: '',
    status: '',
    productAccess: '',
  });

  const updateFilters = useCallback((newFilters: Partial<ParticipantFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      company: '',
      role: '',
      status: '',
      productAccess: '',
    });
  }, []);

  const filteredParticipants = useCallback((participants: Participant[]) => {
    return participants.filter(participant => {
      const matchesSearch = !filters.searchTerm || 
        participant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesCompany = !filters.company || 
        participant.company?.includes(filters.company);
      
      const matchesRole = !filters.role || 
        participant.role === filters.role;
      
      const matchesStatus = !filters.status || 
        participant.status === filters.status;
      
      const matchesProductAccess = !filters.productAccess || 
        participant.permissions[filters.productAccess as keyof Participant['permissions']];

      return matchesSearch && matchesCompany && matchesRole && matchesStatus && matchesProductAccess;
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    filteredParticipants,
  };
}
