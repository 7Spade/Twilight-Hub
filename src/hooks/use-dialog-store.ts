'use client';

import { create } from 'zustand';

export type DialogType = 'createOrganization' | 'createSpace' | 'createGroup';

interface DialogStore {
  type: DialogType | null;
  isOpen: boolean;
  open: (type: DialogType) => void;
  close: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  type: null,
  isOpen: false,
  open: (type) => set({ isOpen: true, type }),
  close: () => set({ type: null, isOpen: false }),
}));
