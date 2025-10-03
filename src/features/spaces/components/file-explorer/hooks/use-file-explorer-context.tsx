/**
 * @fileoverview Context and hooks for file explorer state management.
 * Provides centralized state management for view modes, selection, and detail view.
 */
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type FileItem } from '../folder-tree';

export type ViewMode = 'grid' | 'list';

export interface FileExplorerState {
  // View mode
  currentView: ViewMode;
  
  // Selection
  selectedItems: string[];
  
  // Detail view
  detailViewFile: FileItem | null;
  isDetailViewOpen: boolean;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

export interface FileExplorerActions {
  // View mode actions
  setCurrentView: (view: ViewMode) => void;
  
  // Selection actions
  setSelectedItems: (items: string[]) => void;
  selectItem: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  toggleItemSelection: (itemId: string) => void;
  selectAll: (items: FileItem[]) => void;
  deselectAll: () => void;
  
  // Detail view actions
  openDetailView: (file: FileItem) => void;
  closeDetailView: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface FileExplorerContextValue extends FileExplorerState, FileExplorerActions {}

const FileExplorerContext = createContext<FileExplorerContextValue | undefined>(undefined);

export interface FileExplorerProviderProps {
  children: ReactNode;
  initialView?: ViewMode;
}

export function FileExplorerProvider({ 
  children, 
  initialView = 'list' 
}: FileExplorerProviderProps) {
  // State
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailViewFile, setDetailViewFile] = useState<FileItem | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection actions
  const selectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev : [...prev, itemId]
    );
  }, []);

  const deselectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  }, []);

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const selectAll = useCallback((items: FileItem[]) => {
    setSelectedItems(items.map(item => item.id));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Detail view actions
  const openDetailView = useCallback((file: FileItem) => {
    setDetailViewFile(file);
    setIsDetailViewOpen(true);
  }, []);

  const closeDetailView = useCallback(() => {
    setIsDetailViewOpen(false);
    setDetailViewFile(null);
  }, []);

  // UI actions
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const contextValue: FileExplorerContextValue = {
    // State
    currentView,
    selectedItems,
    detailViewFile,
    isDetailViewOpen,
    isLoading,
    error,
    
    // Actions
    setCurrentView,
    setSelectedItems,
    selectItem,
    deselectItem,
    toggleItemSelection,
    selectAll,
    deselectAll,
    openDetailView,
    closeDetailView,
    setLoading,
    setError,
    clearError,
  };

  return (
    <FileExplorerContext.Provider value={contextValue}>
      {children}
    </FileExplorerContext.Provider>
  );
}

// Hook to use the context
export function useFileExplorerContext(): FileExplorerContextValue {
  const context = useContext(FileExplorerContext);
  if (context === undefined) {
    throw new Error('useFileExplorerContext must be used within a FileExplorerProvider');
  }
  return context;
}

// Convenience hooks for specific functionality
export function useViewMode() {
  const { currentView, setCurrentView } = useFileExplorerContext();
  return { currentView, setCurrentView };
}

export function useSelection() {
  const { 
    selectedItems, 
    setSelectedItems, 
    selectItem, 
    deselectItem, 
    toggleItemSelection, 
    selectAll, 
    deselectAll 
  } = useFileExplorerContext();
  
  return {
    selectedItems,
    setSelectedItems,
    selectItem,
    deselectItem,
    toggleItemSelection,
    selectAll,
    deselectAll,
  };
}

export function useDetailView() {
  const { 
    detailViewFile, 
    isDetailViewOpen, 
    openDetailView, 
    closeDetailView 
  } = useFileExplorerContext();
  
  return {
    detailViewFile,
    isDetailViewOpen,
    openDetailView,
    closeDetailView,
  };
}

export function useFileExplorerUI() {
  const { isLoading, error, setLoading, setError, clearError } = useFileExplorerContext();
  
  return {
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
  };
}

export default FileExplorerContext;
