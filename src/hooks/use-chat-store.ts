'use client';

import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  isMinimized: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleMinimize: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  isMinimized: false,
  open: () => set({ isOpen: true, isMinimized: false }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: state.isOpen ? state.isMinimized : false })),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
}));
