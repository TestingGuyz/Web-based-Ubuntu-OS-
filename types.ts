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
}

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: ReactNode;
  icon: any; 
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemItem[];
}

export interface Theme {
  background: string;
  mode: 'dark' | 'light';
}