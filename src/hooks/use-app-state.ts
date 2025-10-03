/**
 * @fileoverview 應用級狀態管理 hooks
 * 整合聊天、對話框等 UI 狀態管理
 * 遵循奧卡姆剃刀原則，提供最簡潔的實現
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 聊天狀態接口
interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
}

// 對話框狀態接口
interface DialogState {
  type: string | null;
  data: any;
  isOpen: boolean;
}

// 應用狀態接口
interface AppState {
  chat: ChatState;
  dialog: DialogState;
}

// 應用狀態操作接口
interface AppStateActions {
  // 聊天操作
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleMinimizeChat: () => void;
  
  // 對話框操作
  openDialog: (type: string, data?: any) => void;
  closeDialog: () => void;
}

// 完整的應用狀態上下文
interface AppStateContext extends AppState, AppStateActions {}

const AppStateContext = createContext<AppStateContext | undefined>(undefined);

// 應用狀態提供者
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

  // 聊天操作
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

  // 對話框操作
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

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// 使用應用狀態的 hook
export function useAppState(): AppStateContext {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// 專門的聊天狀態 hook
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

// 專門的對話框狀態 hook
export function useDialogState() {
  const { dialog, openDialog, closeDialog } = useAppState();
  return {
    ...dialog,
    open: openDialog,
    close: closeDialog,
  };
}
