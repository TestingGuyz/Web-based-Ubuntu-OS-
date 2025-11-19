import React from 'react';
import { Terminal, Globe, Settings, Folder, Calculator, Code, Cpu, MessageSquare, Trash2, FileText, Image as ImageIcon, Music } from 'lucide-react';
import { AppID } from './types';

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // Abstract Purple
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop", // Nature
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop", // Tech
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop", // Space
  "https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=2670&auto=format&fit=crop", // Gradient
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop", // Cyberpunk
];

export const APP_CONFIG = {
  [AppID.TERMINAL]: { title: 'Terminal', icon: Terminal, defaultSize: { width: 700, height: 480 } },
  [AppID.BROWSER]: { title: 'Firefox', icon: Globe, defaultSize: { width: 900, height: 600 } },
  [AppID.FILES]: { title: 'Files', icon: Folder, defaultSize: { width: 800, height: 550 } },
  [AppID.AI_CHAT]: { title: 'Gemini AI', icon: MessageSquare, defaultSize: { width: 400, height: 650 } },
  [AppID.VSCODE]: { title: 'Code', icon: Code, defaultSize: { width: 1000, height: 700 } },
  [AppID.CALCULATOR]: { title: 'Calculator', icon: Calculator, defaultSize: { width: 320, height: 460 } },
  [AppID.SETTINGS]: { title: 'Settings', icon: Settings, defaultSize: { width: 700, height: 500 } },
  [AppID.TRASH]: { title: 'Trash', icon: Trash2, defaultSize: { width: 700, height: 500 } },
  [AppID.ABOUT]: { title: 'About', icon: Cpu, defaultSize: { width: 400, height: 350 } },
};

export const FILE_ICONS: Record<string, any> = {
  folder: Folder,
  txt: FileText,
  py: Code,
  js: Code,
  tsx: Code,
  png: ImageIcon,
  jpg: ImageIcon,
  mp3: Music
};