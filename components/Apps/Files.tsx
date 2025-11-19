import React, { useState, useEffect } from 'react';
import { Folder, FileText, ArrowLeft, Home, Search, ChevronRight, HardDrive, Plus } from 'lucide-react';
import { fsService } from '../../services/fileSystem';
import { FileSystemItem, AppID } from '../../types';
import { FILE_ICONS } from '../../constants';

interface FilesAppProps {
  onOpenApp: (id: AppID, data?: any) => void;
}

export const FilesApp: React.FC<FilesAppProps> = ({ onOpenApp }) => {
  const [currentPathId, setCurrentPathId] = useState('user');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [history, setHistory] = useState<string[]>(['user']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const refresh = () => {
    setItems(fsService.getItems(currentPathId));
  };

  useEffect(() => {
    refresh();
    // Basic polling for FS changes
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [currentPathId]);

  const handleNavigate = (id: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPathId(id);
    setSelectedId(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentPathId(history[historyIndex - 1]);
    }
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      handleNavigate(item.id);
    } else {
      // Logic to open file in correct app
      if (item.name.endsWith('.png') || item.name.endsWith('.jpg')) {
         // TODO: Image Viewer
         onOpenApp(AppID.BROWSER); // Fallback for now or implement basic viewer
      } else {
         // Assume text/code -> VS Code
         onOpenApp(AppID.VSCODE, { initialFileId: item.id });
      }
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Folder name:");
    if (name) {
      fsService.createItem(name, 'folder', currentPathId);
      refresh();
    }
  };

  const handleCreateFile = () => {
    const name = prompt("File name (e.g., note.txt):");
    if (name) {
      fsService.createItem(name, 'file', currentPathId);
      refresh();
    }
  };

  const handleDelete = () => {
      if(selectedId) {
          if(confirm("Are you sure you want to delete this item?")) {
              fsService.deleteItem(selectedId);
              refresh();
              setSelectedId(null);
          }
      }
  }

  const getBreadcrumbs = () => {
    const parts = [];
    let current = fsService.getItem(currentPathId);
    while (current) {
      parts.unshift(current);
      if (!current.parentId) break;
      current = fsService.getItem(current.parentId);
    }
    return parts;
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F7F7] text-[#333333] font-sans">
      {/* Toolbar */}
      <div className="h-12 bg-[#F7F7F7] border-b border-gray-300 flex items-center px-4 space-x-4 shrink-0">
        <div className="flex space-x-1">
            <button onClick={handleBack} disabled={historyIndex === 0} className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-colors">
                <ArrowLeft size={18} />
            </button>
        </div>
        
        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center bg-gray-200 rounded px-3 py-1.5 space-x-2 text-sm overflow-hidden whitespace-nowrap">
           <HardDrive size={14} className="text-gray-500 shrink-0" />
           {getBreadcrumbs().map((crumb, i) => (
               <React.Fragment key={crumb.id}>
                  {i > 0 && <ChevronRight size={12} className="text-gray-400 shrink-0" />}
                  <button 
                    onClick={() => handleNavigate(crumb.id)}
                    className={`hover:bg-gray-300 px-1 rounded truncate ${i === getBreadcrumbs().length - 1 ? 'font-bold text-ubuntu-dark' : 'text-gray-600'}`}
                  >
                      {crumb.name === 'ubuntu' ? 'Home' : crumb.name}
                  </button>
               </React.Fragment>
           ))}
        </div>
        
        <div className="flex items-center space-x-2">
            <button onClick={handleCreateFolder} title="New Folder" className="p-1.5 rounded hover:bg-gray-200"><Plus size={18} /></button>
            <div className="p-1.5 rounded hover:bg-gray-200 cursor-pointer">
                <Search size={18} className="text-gray-500" />
            </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#F2F2F2] border-r border-gray-300 py-4 flex flex-col space-y-1 text-sm shrink-0">
             <button onClick={() => handleNavigate('user')} className={`px-4 py-2 flex items-center space-x-3 hover:bg-gray-200 text-left ${currentPathId === 'user' ? 'bg-gray-300 font-medium' : ''}`}>
                 <Home size={16} className="text-gray-600" />
                 <span>Home</span>
             </button>
             <button onClick={() => handleNavigate('docs')} className="px-4 py-2 flex items-center space-x-3 hover:bg-gray-200 text-left">
                 <FileText size={16} className="text-gray-600" />
                 <span>Documents</span>
             </button>
             <button onClick={() => handleNavigate('downloads')} className="px-4 py-2 flex items-center space-x-3 hover:bg-gray-200 text-left">
                 <Folder size={16} className="text-gray-600" />
                 <span>Downloads</span>
             </button>
             <button onClick={() => handleNavigate('pics')} className="px-4 py-2 flex items-center space-x-3 hover:bg-gray-200 text-left">
                 <Folder size={16} className="text-gray-600" />
                 <span>Pictures</span>
             </button>
          </div>

          {/* Main Grid */}
          <div className="flex-1 p-4 overflow-y-auto" onClick={() => setSelectedId(null)} onKeyDown={(e) => e.key === 'Delete' && handleDelete()} tabIndex={0}>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                  {items.map(item => {
                      const Icon = item.type === 'folder' ? Folder : FILE_ICONS[item.name.split('.').pop() || 'txt'] || FileText;
                      const isSelected = selectedId === item.id;
                      
                      return (
                        <div 
                            key={item.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                            onDoubleClick={() => handleItemDoubleClick(item)}
                            className={`flex flex-col items-center justify-start p-2 rounded border border-transparent hover:bg-gray-200 cursor-pointer transition-colors group
                                ${isSelected ? 'bg-ubuntu-orange/10 border-ubuntu-orange/50' : ''}
                            `}
                        >
                            <div className={`mb-2 ${item.type === 'folder' ? 'text-ubuntu-orange' : 'text-gray-500'} transform group-hover:scale-105 transition-transform`}>
                                <Icon size={48} fill={item.type === 'folder' ? "currentColor" : "none"} className={item.type === 'folder' ? 'text-ubuntu-orange' : 'text-gray-500'} />
                            </div>
                            <span className={`text-xs text-center break-words w-full px-1 line-clamp-2 ${isSelected ? 'bg-ubuntu-orange text-white rounded px-1' : 'text-gray-700'}`}>
                                {item.name}
                            </span>
                        </div>
                      );
                  })}
                  {items.length === 0 && (
                      <div className="col-span-full text-center text-gray-400 mt-10 flex flex-col items-center">
                          <Folder size={48} className="mb-2 opacity-20" />
                          <span>Folder is empty</span>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};