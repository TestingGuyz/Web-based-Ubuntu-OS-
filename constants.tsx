import React from 'react';
import { Terminal, Globe, Settings, Folder, Calculator, Code, Cpu, MessageSquare } from 'lucide-react';
import { AppID } from './types';

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract Purple
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop", // Nature
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop", // Tech
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop", // Space
];

export const APP_CONFIG = {
  [AppID.TERMINAL]: { title: 'Terminal', icon: Terminal, defaultSize: { width: 600, height: 400 } },
  [AppID.BROWSER]: { title: 'Chromium', icon: Globe, defaultSize: { width: 800, height: 600 } },
  [AppID.FILES]: { title: 'Files', icon: Folder, defaultSize: { width: 700, height: 500 } },
  [AppID.SETTINGS]: { title: 'Settings', icon: Settings, defaultSize: { width: 500, height: 400 } },
  [AppID.CALCULATOR]: { title: 'Calculator', icon: Calculator, defaultSize: { width: 300, height: 400 } },
  [AppID.VSCODE]: { title: 'Code', icon: Code, defaultSize: { width: 900, height: 600 } },
  [AppID.AI_CHAT]: { title: 'Gemini Assistant', icon: MessageSquare, defaultSize: { width: 400, height: 600 } },
  [AppID.ABOUT]: { title: 'About', icon: Cpu, defaultSize: { width: 400, height: 300 } },
};

export const INITIAL_FILES = [
  {
    name: 'Home',
    type: 'folder',
    children: [
      { name: 'Documents', type: 'folder', children: [{ name: 'project_notes.txt', type: 'file', content: 'Project Alpha\nStatus: Classified' }] },
      { name: 'Pictures', type: 'folder', children: [] },
      { name: 'Downloads', type: 'folder', children: [] },
      { name: 'hello.py', type: 'file', content: 'print("Hello Ubuntu Web!")' },
    ]
  }
];