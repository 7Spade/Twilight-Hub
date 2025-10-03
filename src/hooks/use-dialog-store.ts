'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type DialogType =
  | 'createOrganization'
  | 'createSpace'
  | 'createGroup'
  | 'inviteMember'
  | 'useModule'
  | 'createItem'
  | 'createWarehouse'
  | 'adjustStock';

interface DialogData {
  module?: {
    id: string;
    name: string;
    type: string;
  };
  item?: any;
}

interface DialogStore {
  type: DialogType | null;
  data: DialogData;
  isOpen: boolean;
  open: (type: DialogType, data?: DialogData) => void;
  close: () => void;
}

const DialogContext = createContext<DialogStore | undefined>(undefined);

export interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [type, setType] = useState<DialogType | null>(null);
  const [data, setData] = useState<DialogData>({});
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((newType: DialogType, newData: DialogData = {}) => {
    setType(newType);
    setData(newData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setType(null);
    setData({});
    setIsOpen(false);
  }, []);

  const value: DialogStore = {
    type,
    data,
    isOpen,
    open,
    close,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogStore(): DialogStore {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialogStore must be used within a DialogProvider');
  }
  return context;
}
