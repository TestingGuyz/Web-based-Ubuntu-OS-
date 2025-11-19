import { ReactNode } from 'react';

export enum AppID {
  TERMINAL = 'terminal',
  BROWSER = 'browser',
  SETTINGS = 'settings',
  FILES = 'files',
  CALCULATOR = 'calculator',
  VSCODE = 'vscode',
  AI_CHAT = 'ai_chat',
  ABOUT = 'about',
  TRASH = 'trash'
}

export interface WindowState {
  id: AppID;
  instanceId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: ReactNode;
  icon: any; 
  data?: any; // For passing initial file path etc.
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string; // For files
  parentId: string | null;
  createdAt: number;
}

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  icon?: any;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
}