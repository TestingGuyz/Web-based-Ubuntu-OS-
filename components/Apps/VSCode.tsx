import React, { useState, useEffect } from 'react';
import { Files, Search, GitBranch, Bug, Grip, Settings, X, Circle, Save } from 'lucide-react';
import { fsService } from '../../services/fileSystem';
import { FileSystemItem } from '../../types';

interface VSCodeProps {
  initialFileId?: string;
}

export const VSCodeApp: React.FC<VSCodeProps> = ({ initialFileId }) => {
  const [activeFileId, setActiveFileId] = useState<string | null>(initialFileId || null);
  const [files, setFiles] = useState<FileSystemItem[]>([]);
  const [openFiles, setOpenFiles] = useState<FileSystemItem[]>([]);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('explorer');

  useEffect(() => {
    // Load all files for explorer
    const loadFiles = () => {
      // Flatten file structure for simplicity in this view or just get all files recursively
      // For this demo, we just grab everything from FS
      // In a real app we would need a tree component. 
      // We'll just get 'user', 'docs', 'script' folder contents.
      const allItems: FileSystemItem[] = [];
      const traverse = (parentId: string) => {
          const items = fsService.getItems(parentId);
          allItems.push(...items);
          items.filter(i => i.type === 'folder').forEach(f => traverse(f.id));
      }
      traverse('user');
      setFiles(allItems);
    };
    loadFiles();

    if (initialFileId) {
      const file = fsService.getItem(initialFileId);
      if (file && file.type === 'file') {
        handleOpenFile(file);
      }
    }
  }, [initialFileId]);

  const handleOpenFile = (file: FileSystemItem) => {
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFileId(file.id);
    setContent(file.content || '');
    setIsDirty(false);
  };

  const handleCloseFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const newOpen = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(newOpen);
    if (activeFileId === fileId) {
      setActiveFileId(newOpen.length > 0 ? newOpen[newOpen.length - 1].id : null);
      setContent(newOpen.length > 0 ? newOpen[newOpen.length - 1].content || '' : '');
    }
  };

  const handleSave = () => {
    if (activeFileId) {
      fsService.updateFileContent(activeFileId, content);
      setIsDirty(false);
      // Update local file ref
      setOpenFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content } : f));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="h-full flex bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
      {/* Activity Bar */}
      <div className="w-12 flex flex-col items-center py-2 space-y-4 bg-[#333333] text-[#858585]">
        <div className={`p-2 cursor-pointer hover:text-white ${sidebarTab === 'explorer' ? 'text-white border-l-2 border-white' : ''}`} onClick={() => setSidebarTab('explorer')}><Files size={24} /></div>
        <div className="p-2 cursor-pointer hover:text-white"><Search size={24} /></div>
        <div className="p-2 cursor-pointer hover:text-white"><GitBranch size={24} /></div>
        <div className="p-2 cursor-pointer hover:text-white"><Bug size={24} /></div>
        <div className="p-2 cursor-pointer hover:text-white"><Grip size={24} /></div>
        <div className="flex-1" />
        <div className="p-2 cursor-pointer hover:text-white"><Settings size={24} /></div>
      </div>

      {/* Sidebar */}
      <div className="w-60 bg-[#252526] flex flex-col border-r border-black/20">
        <div className="h-8 px-4 flex items-center text-xs font-bold tracking-wide text-[#bbbbbb]">EXPLORER</div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-1 text-xs font-bold text-blue-400 cursor-pointer hover:bg-[#2a2d2e]">UBUNTU WORKSPACE</div>
          {files.map(file => (
            <div 
              key={file.id}
              className={`px-4 py-1 text-sm cursor-pointer flex items-center space-x-2 hover:bg-[#2a2d2e] ${activeFileId === file.id ? 'bg-[#37373d] text-white' : ''}`}
              onClick={() => file.type === 'file' && handleOpenFile(file)}
            >
              <span className={file.type === 'folder' ? "text-yellow-400" : "text-blue-300"}>
                {file.type === 'folder' ? '▸' : '≡'}
              </span>
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        {/* Tab Bar */}
        <div className="h-9 bg-[#2d2d2d] flex overflow-x-auto scrollbar-hide">
          {openFiles.map(file => (
            <div 
              key={file.id}
              onClick={() => handleOpenFile(file)}
              className={`group min-w-[120px] max-w-[200px] px-3 flex items-center justify-between text-sm border-r border-black/20 cursor-pointer select-none ${activeFileId === file.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2d2d2d]'}`}
            >
              <span className="truncate mr-2 flex items-center">
                {file.name} 
                {activeFileId === file.id && isDirty && <Circle size={8} className="ml-2 fill-white text-white" />}
              </span>
              <div 
                onClick={(e) => handleCloseFile(e, file.id)}
                className={`p-0.5 rounded-md hover:bg-gray-600 opacity-0 group-hover:opacity-100 ${activeFileId === file.id ? 'opacity-100' : ''}`}
              >
                <X size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Editor */}
        {activeFileId ? (
          <div className="flex-1 relative flex">
             {/* Line Numbers (Static Mock) */}
             <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-3 py-4 font-mono text-sm leading-6 select-none">
               {Array.from({ length: 50 }).map((_, i) => (
                 <div key={i}>{i + 1}</div>
               ))}
             </div>
             
             {/* Text Area */}
             <textarea
               value={content}
               onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
               onKeyDown={handleKeyDown}
               className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-6 p-4 outline-none resize-none border-none whitespace-pre"
               spellCheck={false}
             />
             
             {/* Floating Save Button */}
             {isDirty && (
                 <button 
                    onClick={handleSave}
                    className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95"
                 >
                     <Save size={20} />
                 </button>
             )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#3b3b3b]">
            <div className="text-6xl font-bold mb-4">VS Code</div>
            <p>Select a file to start editing</p>
            <div className="mt-8 text-sm space-y-2">
                <p>Show All Commands <span className="bg-[#333] px-1 rounded">Ctrl+Shift+P</span></p>
                <p>Go to File <span className="bg-[#333] px-1 rounded">Ctrl+P</span></p>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1"><GitBranch size={10} /> <span>main</span></div>
            <div className="flex items-center space-x-1"><Circle size={10} className="text-white" /> <span>0</span> <Bug size={10} /> <span>0</span></div>
          </div>
          <div className="flex items-center space-x-4">
             <span>Ln {content.split('\n').length}, Col 1</span>
             <span>UTF-8</span>
             <span>{openFiles.find(f => f.id === activeFileId)?.name.endsWith('py') ? 'Python' : 'TypeScript React'}</span>
             <span>Prettier</span>
          </div>
        </div>
      </div>
    </div>
  );
};