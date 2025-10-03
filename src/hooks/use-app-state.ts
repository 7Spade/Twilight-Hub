'use client';

import { createContext, useContext, useState, useCallback, ReactNode, createElement } from 'react';

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface DialogState {
  type: string | null;
  // TODO: [P2] FIX src/hooks/use-app-state.ts - 修正 unknown/any 類型
  // 說明：以具名型別替代 unknown，為 dialog data 建立明確型別
  data: unknown;
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
  // TODO: [P2] FIX src/hooks/use-app-state.ts - 修正 unknown/any 類型
  // 說明：替換為具名型別或泛型參數，避免使用 unknown
  openDialog: (type: string, data?: unknown) => void;
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

  // TODO: [P2] FIX src/hooks/use-app-state.ts - 修正 unknown/any 類型
  // 說明：為 data 提供具名型別或受限泛型，避免使用 unknown
  const openDialog = useCallback((type: string, data: unknown = {}) => {
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
