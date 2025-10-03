// Server-side data management for Participants
import { Participant, ParticipantPermissions } from './types';

// Mock data service - replace with real API calls
export class ParticipantDataService {
  private static participants: Participant[] = [
    {
      id: '1',
      name: 'YL Yu Lin',
      email: '7s.i@pm.me',
      phone: '-',
      avatar: '/avatars/yl.jpg',
      role: 'member',
      company: 'Trial account 7s.i@pm.me',
      accessLevel: 'limited',
      joinedAt: new Date('2025-10-03'),
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
      permissions: {
        docs: true,
        designCollaboration: false,
        modelCoordination: false,
        takeoff: false,
        autoSpecs: false,
        build: false,
        costManagement: false,
        insight: true,
        forma: false,
      },
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      avatar: '/avatars/john.jpg',
      role: 'admin',
      company: 'ACME Construction',
      accessLevel: 'full',
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
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
      },
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0124',
      avatar: '/avatars/jane.jpg',
      role: 'member',
      company: 'Design Studio Inc',
      accessLevel: 'limited',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'active',
      permissions: {
        docs: true,
        designCollaboration: true,
        modelCoordination: false,
        takeoff: false,
        autoSpecs: false,
        build: false,
        costManagement: false,
        insight: false,
        forma: false,
      },
    },
  ];

  // TODO: [P0] FIX Typo/Parsing (L81) [低認知]
  // - 指引：修正參數型別宣告錯字 `_spaceId:`
  static async getParticipants(spaceId: _spaceId: string): Promise<Participant[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.participants];
  }

  // TODO: [P0] FIX Typo/Parsing (L91) [低認知]
  // - 指引：修正可選參數宣告 `message?: _message: string` => `message?: string`
  static async inviteParticipant(
    spaceId: string,
    email: string,
    role: Participant['role'],
    message?: _message: string
  ): Promise<Participant> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role,
      company: 'Pending',
      accessLevel: 'limited',
      joinedAt: new Date(),
      status: 'pending',
      permissions: {
        docs: role === 'admin' || role === 'owner',
        designCollaboration: role === 'admin' || role === 'owner',
        modelCoordination: role === 'admin' || role === 'owner',
        takeoff: role === 'admin' || role === 'owner',
        autoSpecs: role === 'admin' || role === 'owner',
        build: role === 'admin' || role === 'owner',
        costManagement: role === 'admin' || role === 'owner',
        insight: role === 'admin' || role === 'owner',
        forma: role === 'admin' || role === 'owner',
      },
    };

    this.participants.push(newParticipant);
    return newParticipant;
  }

  static async updateParticipantRole(
    participantId: string,
    role: Participant['role']
  ): Promise<Participant> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const participant = this.participants.find(p => p.id === participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    const updatedParticipant: Participant = {
      ...participant,
      role,
    };

    const index = this.participants.findIndex(p => p.id === participantId);
    this.participants[index] = updatedParticipant;
    
    return updatedParticipant;
  }

  static async updateParticipantPermissions(
    participantId: string,
    permissions: Partial<ParticipantPermissions>
  ): Promise<Participant> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const participant = this.participants.find(p => p.id === participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    const updatedParticipant: Participant = {
      ...participant,
      permissions: {
        ...participant.permissions,
        ...permissions,
      },
    };

    const index = this.participants.findIndex(p => p.id === participantId);
    this.participants[index] = updatedParticipant;
    
    return updatedParticipant;
  }

  static async removeParticipant(participantId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.participants.findIndex(p => p.id === participantId);
    if (index === -1) {
      throw new Error('Participant not found');
    }

    this.participants.splice(index, 1);
  }
}
