'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatStore {
  isOpen: boolean;
  isMinimized: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleMinimize: () => void;
}

const ChatContext = createContext<ChatStore | undefined>(undefined);

export interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        // 如果當前是打開的，關閉時保持最小化狀態
        return false;
      } else {
        // 如果當前是關閉的，打開時取消最小化
        setIsMinimized(false);
        return true;
      }
    });
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const value: ChatStore = {
    isOpen,
    isMinimized,
    open,
    close,
    toggle,
    toggleMinimize,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatStore(): ChatStore {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatStore must be used within a ChatProvider');
  }
  return context;
}
