'use client';

import { create } from 'zustand';

export type DialogType = 'createOrganization' | 'createSpace' | 'createGroup' | 'inviteMember' | 'useModule';

interface DialogData {
  module?: {
    id: string;
    name: string;
    type: string;
  };
}

interface DialogStore {
  type: DialogType | null;
  data: DialogData;
  isOpen: boolean;
  open: (type: DialogType, data?: DialogData) => void;
  close: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  open: (type, data = {}) => set({ isOpen: true, type, data }),
  close: () => set({ type: null, isOpen: false, data: {} }),
}));
