'use client';

import { createContext, useContext, useState, useCallback, ReactNode, createElement } from 'react';

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface DialogState {
  type: string | null;
  data: any;
  isOpen: boolean;
}

interface AppState {
  chat: ChatState;
  dialog: DialogState;
}

interface AppStateActions {
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleMinimizeChat: () => void;
  openDialog: (type: string, data?: any) => void;
  closeDialog: () => void;
}

interface AppStateContext extends AppState, AppStateActions {}

const AppStateContext = createContext<AppStateContext | undefined>(undefined);

export interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [chat, setChat] = useState<ChatState>({
    isOpen: false,
    isMinimized: false,
  });

  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    data: {},
    isOpen: false,
  });

  const openChat = useCallback(() => {
    setChat(prev => ({ ...prev, isOpen: true, isMinimized: false }));
  }, []);

  const closeChat = useCallback(() => {
    setChat(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleChat = useCallback(() => {
    setChat(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      isMinimized: prev.isOpen ? false : prev.isMinimized
    }));
  }, []);

  const toggleMinimizeChat = useCallback(() => {
    setChat(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const openDialog = useCallback((type: string, data: any = {}) => {
    setDialog({ type, data, isOpen: true });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog({ type: null, data: {}, isOpen: false });
  }, []);

  const value: AppStateContext = {
    chat,
    dialog,
    openChat,
    closeChat,
    toggleChat,
    toggleMinimizeChat,
    openDialog,
    closeDialog,
  };

  return createElement(AppStateContext.Provider, { value }, children);
}

export function useAppState(): AppStateContext {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export function useChatState() {
  const { chat, openChat, closeChat, toggleChat, toggleMinimizeChat } = useAppState();
  return {
    ...chat,
    open: openChat,
    close: closeChat,
    toggle: toggleChat,
    toggleMinimize: toggleMinimizeChat,
  };
}

export function useDialogState() {
  const { dialog, openDialog, closeDialog } = useAppState();
  return {
    ...dialog,
    open: openDialog,
    close: closeDialog,
  };
}
