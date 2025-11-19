import { FileSystemItem } from '../types';

// Simulated persistence key
const FS_STORAGE_KEY = 'ubuntu_web_fs_v1';

const INITIAL_FS: FileSystemItem[] = [
  { id: 'root', name: 'root', type: 'folder', parentId: null, createdAt: Date.now() },
  { id: 'home', name: 'home', type: 'folder', parentId: 'root', createdAt: Date.now() },
  { id: 'user', name: 'ubuntu', type: 'folder', parentId: 'home', createdAt: Date.now() },
  { id: 'docs', name: 'Documents', type: 'folder', parentId: 'user', createdAt: Date.now() },
  { id: 'pics', name: 'Pictures', type: 'folder', parentId: 'user', createdAt: Date.now() },
  { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'user', createdAt: Date.now() },
  { id: 'music', name: 'Music', type: 'folder', parentId: 'user', createdAt: Date.now() },
  { id: 'welcome', name: 'welcome.txt', type: 'file', content: 'Welcome to Ubuntu Web OS!\n\nThis is a fully functional simulation running in your browser.\nYou can create files, folders, and even use a terminal.', parentId: 'user', createdAt: Date.now() },
  { id: 'secret', name: 'gemini_plans.txt', type: 'file', content: 'Top Secret:\n1. Be helpful.\n2. Be harmless.\n3. Be honest.', parentId: 'docs', createdAt: Date.now() },
  { id: 'script', name: 'hello.py', type: 'file', content: 'print("Hello from the web!")', parentId: 'docs', createdAt: Date.now() },
];

class FileSystemService {
  private items: FileSystemItem[];

  constructor() {
    const stored = localStorage.getItem(FS_STORAGE_KEY);
    this.items = stored ? JSON.parse(stored) : INITIAL_FS;
  }

  private save() {
    localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(this.items));
  }

  getItems(parentId: string): FileSystemItem[] {
    return this.items.filter(item => item.parentId === parentId);
  }

  getItem(id: string): FileSystemItem | undefined {
    return this.items.find(i => i.id === id);
  }

  createItem(name: string, type: 'file' | 'folder', parentId: string, content: string = ''): FileSystemItem {
    const newItem: FileSystemItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      parentId,
      content,
      createdAt: Date.now(),
    };
    this.items.push(newItem);
    this.save();
    return newItem;
  }

  deleteItem(id: string) {
    // Recursive delete
    const toDelete = [id];
    let i = 0;
    while (i < toDelete.length) {
      const currentId = toDelete[i];
      const children = this.items.filter(item => item.parentId === currentId);
      toDelete.push(...children.map(c => c.id));
      i++;
    }
    this.items = this.items.filter(item => !toDelete.includes(item.id));
    this.save();
  }

  updateFileContent(id: string, content: string) {
    const item = this.items.find(i => i.id === id);
    if (item && item.type === 'file') {
      item.content = content;
      this.save();
    }
  }

  // Helper for Terminal
  resolvePath(currentPathId: string, pathStr: string): string | null {
    if (pathStr === '/') return 'root';
    if (pathStr === '~') return 'user';
    
    const parts = pathStr.split('/').filter(p => p && p !== '.');
    let currentId = currentPathId;

    for (const part of parts) {
      if (part === '..') {
        const current = this.getItem(currentId);
        if (current?.parentId) currentId = current.parentId;
      } else {
        const children = this.getItems(currentId);
        const target = children.find(c => c.name === part);
        if (!target) return null;
        if (target.type === 'file') return null; // Cannot cd into file
        currentId = target.id;
      }
    }
    return currentId;
  }

  getPathString(id: string): string {
    let path = '';
    let current = this.getItem(id);
    while (current && current.parentId) {
      path = '/' + current.name + path;
      current = this.getItem(current.parentId);
    }
    return path || '/';
  }
}

export const fsService = new FileSystemService();