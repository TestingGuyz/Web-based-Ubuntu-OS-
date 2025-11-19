import React, { useState, useEffect } from 'react';
import { Wifi, Volume2, Battery, Power, Calendar, ChevronDown, Menu, Monitor, Terminal as TerminalIcon, FolderPlus, Image as ImageIcon, Settings, Moon, Sun } from 'lucide-react';
import { APP_CONFIG, WALLPAPERS } from './constants';
import { AppID, WindowState, ContextMenuItem } from './types';
import { Window } from './components/Window';
import { TerminalApp } from './components/Apps/Terminal';
import { BrowserApp } from './components/Apps/Browser';
import { GeminiChatApp } from './components/Apps/GeminiChat';
import { FilesApp } from './components/Apps/Files';
import { VSCodeApp } from './components/Apps/VSCode';
import { CalculatorApp } from './components/Apps/Calculator';
import { LoginScreen } from './components/System/LoginScreen';
import { ContextMenu } from './components/System/ContextMenu';

// ---- Sub-components ----

const TopBar = ({ date, onOpenMenu }: { date: Date, onOpenMenu: () => void }) => (
  <div className="h-7 bg-[#1d1d1d] flex items-center justify-between px-3 select-none z-50 relative shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="text-sm font-bold text-gray-100 hover:bg-white/10 px-3 rounded-full py-0.5 transition-colors cursor-pointer">
        Activities
      </div>
      <div className="hidden md:block text-sm text-gray-300 hover:text-white transition-colors cursor-default">
        Ubuntu Web
      </div>
    </div>

    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 cursor-pointer px-3 py-0.5 rounded-full hover:bg-white/10 transition-colors">
      <span className="text-sm font-medium text-gray-200">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp;
        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>

    <div className="flex items-center">
      <div className="flex items-center space-x-3 px-2 py-0.5 rounded-full hover:bg-white/10 cursor-pointer transition-colors" onClick={onOpenMenu}>
        <Wifi size={14} className="text-gray-300" />
        <Volume2 size={14} className="text-gray-300" />
        <Battery size={14} className="text-gray-300" />
        <ChevronDown size={12} className="text-gray-300" />
      </div>
    </div>
  </div>
);

const SystemMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-9 right-2 w-72 bg-[#2c2c2c] border border-gray-600/50 rounded-2xl shadow-2xl p-4 z-[60] text-gray-200 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between mb-4 px-1">
            <span className="font-bold text-sm">System Controls</span>
            <button onClick={() => window.location.reload()} className="p-2 hover:bg-red-500/20 rounded-full hover:text-red-400 transition-colors">
               <Power size={18} />
            </button>
        </div>
        
        <div className="space-y-5 bg-[#363636] p-4 rounded-xl">
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 px-1"><span>Volume</span><span>75%</span></div>
                <div className="flex items-center space-x-3">
                    <Volume2 size={16} />
                    <input type="range" className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-ubuntu-orange" />
                </div>
            </div>
             <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 px-1"><span>Brightness</span><span>80%</span></div>
                <div className="flex items-center space-x-3">
                    <Monitor size={16} />
                    <input type="range" className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-ubuntu-orange" defaultValue={80} />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
             <button className="flex flex-col items-center justify-center p-2 bg-ubuntu-orange text-white rounded-xl transition-transform active:scale-95">
                <Wifi size={20} className="mb-1" />
                <span className="text-[10px]">Wired</span>
             </button>
             <button className="flex flex-col items-center justify-center p-2 bg-[#3e3e3e] hover:bg-[#4a4a4a] rounded-xl transition-colors">
                <div className="mb-1"><Moon size={20} /></div>
                <span className="text-[10px]">Dark</span>
             </button>
             <button className="flex flex-col items-center justify-center p-2 bg-[#3e3e3e] hover:bg-[#4a4a4a] rounded-xl transition-colors">
                <Settings size={20} className="mb-1" />
                <span className="text-[10px]">Settings</span>
             </button>
        </div>
    </div>
  )
};

const Dock = ({ apps, activeApps, onAppClick }: { apps: typeof APP_CONFIG, activeApps: WindowState[], onAppClick: (id: AppID) => void }) => (
  <div className="absolute left-2 top-1/2 -translate-y-1/2 py-2 px-1 bg-[#1d1d1d]/80 backdrop-blur-md rounded-2xl flex flex-col items-center space-y-2 z-50 border border-white/5 shadow-2xl">
    {Object.entries(apps).map(([id, config]) => {
      const instances = activeApps.filter(w => w.id === id);
      const isOpen = instances.length > 0;
      const isActive = activeApps.some(w => w.id === id && !w.isMinimized && w.zIndex === Math.max(...activeApps.map(a => a.zIndex)));

      return (
        <div key={id} className="relative group w-full flex justify-center">
          {isOpen && (
            <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 flex flex-col space-y-0.5">
               {instances.slice(0, 3).map((_, i) => (
                   <div key={i} className="w-1 h-1 rounded-full bg-ubuntu-orange"></div>
               ))}
            </div>
          )}
          
          <button
            onClick={() => onAppClick(id as AppID)}
            className={`p-2.5 rounded-xl transition-all duration-300 relative 
               ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5 hover:scale-110'} 
               active:scale-95
            `}
          >
            <config.icon size={28} className={id === AppID.AI_CHAT ? "text-purple-400" : "text-gray-200"} />
          </button>
          
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-[70] shadow-lg translate-x-2 group-hover:translate-x-0">
            {config.title}
          </div>
        </div>
      );
    })}
    
    <div className="w-8 h-px bg-white/10 my-1" />
    
    <button className="p-3 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300">
      <Menu size={24} />
    </button>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [date, setDate] = useState(new Date());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [sysMenuOpen, setSysMenuOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, items: ContextMenuItem[] } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Window Actions
  const openApp = (id: AppID, data?: any) => {
    const existing = windows.find(w => w.id === id);
    
    // For standard single-instance apps, focus them.
    // For file-based apps (VS Code), if specific file is requested, maybe open new window or update existing?
    // For this demo, VS Code is single instance for simplicity, updating content if data provided.
    
    if (existing && id !== AppID.TERMINAL && id !== AppID.FILES) { // Terminal/Files allow multiple
        if (existing.isMinimized) {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex, data: data || w.data } : w));
            setNextZIndex(n => n + 1);
        } else {
            focusWindow(existing.instanceId);
            // If data provided (e.g. opening new file in VS Code), update it
            if (data) {
                 setWindows(prev => prev.map(w => w.id === id ? { ...w, data } : w));
            }
        }
    } else {
        const config = APP_CONFIG[id];
        const instanceId = Math.random().toString(36).substr(2, 9);
        const newWindow: WindowState = {
            id,
            instanceId,
            title: config.title,
            icon: config.icon,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex,
            position: { 
                x: window.innerWidth / 2 - config.defaultSize.width / 2 + (windows.length * 20), 
                y: window.innerHeight / 2 - config.defaultSize.height / 2 + (windows.length * 20)
            },
            size: config.defaultSize,
            component: null,
            data
        };
        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(n => n + 1);
    }
  };

  const closeWindow = (instanceId: string) => {
    setWindows(prev => prev.filter(w => w.instanceId !== instanceId));
  };

  const minimizeWindow = (instanceId: string) => {
    setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, isMinimized: true } : w));
  };

  const maximizeWindow = (instanceId: string) => {
    setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w));
    setNextZIndex(n => n + 1);
  };

  const focusWindow = (instanceId: string) => {
    setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(n => n + 1);
  };

  const moveWindow = (instanceId: string, x: number, y: number) => {
      setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, position: { x, y } } : w));
  };

  const resizeWindow = (instanceId: string, width: number, height: number) => {
      setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, size: { width, height } } : w));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
        x: e.clientX,
        y: e.clientY,
        items: [
            { label: 'New Folder', icon: FolderPlus, action: () => openApp(AppID.FILES) },
            { label: 'Open Terminal', icon: TerminalIcon, action: () => openApp(AppID.TERMINAL), shortcut: 'Ctrl+Alt+T' },
            { divider: true },
            { label: 'Change Background', icon: ImageIcon, action: () => setBgIndex((bgIndex + 1) % WALLPAPERS.length) },
            { label: 'Display Settings', icon: Monitor, disabled: true },
            { label: 'Settings', icon: Settings, action: () => openApp(AppID.SETTINGS) },
        ]
    });
  };

  const renderWindowContent = (win: WindowState) => {
    switch (win.id) {
        case AppID.TERMINAL: return <TerminalApp />;
        case AppID.BROWSER: return <BrowserApp />;
        case AppID.AI_CHAT: return <GeminiChatApp />;
        case AppID.FILES: return <FilesApp onOpenApp={openApp} />;
        case AppID.VSCODE: return <VSCodeApp initialFileId={win.data?.initialFileId} />;
        case AppID.CALCULATOR: return <CalculatorApp />;
        case AppID.TRASH: return <div className="p-10 text-center text-gray-400">Trash is empty.</div>;
        case AppID.SETTINGS: 
            return (
                <div className="p-6 text-gray-200 h-full overflow-y-auto bg-[#1c1c1c]">
                    <h2 className="text-2xl font-light mb-8 border-b border-gray-700 pb-4">Settings</h2>
                    <div className="space-y-8">
                        <div className="bg-[#2c2c2c] p-4 rounded-xl">
                            <h3 className="text-lg font-medium mb-4 flex items-center"><ImageIcon size={20} className="mr-2" /> Background</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {WALLPAPERS.map((bg, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setBgIndex(idx)}
                                        className={`aspect-video rounded-lg cursor-pointer border-2 overflow-hidden transition-all hover:scale-105 ${bgIndex === idx ? 'border-ubuntu-orange shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={bg} alt="wallpaper" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#2c2c2c] p-4 rounded-xl">
                             <h3 className="text-lg font-medium mb-4">About</h3>
                             <div className="flex items-center space-x-4">
                                 <div className="w-16 h-16 bg-ubuntu-orange rounded-full flex items-center justify-center text-3xl font-bold text-white">U</div>
                                 <div>
                                     <p className="text-xl font-medium">Ubuntu Web</p>
                                     <p className="text-gray-400">24.04 LTS (Noble Numbat)</p>
                                     <p className="text-gray-500 text-sm mt-1">Powered by React & Gemini</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            );
        default: return <div className="flex items-center justify-center h-full text-gray-400">Application under construction.</div>;
    }
  };

  if (!isLoggedIn) {
      return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative select-none font-sans" 
         onContextMenu={handleContextMenu}
         onClick={() => {
             setSysMenuOpen(false);
             setContextMenu(null);
         }}
    >
      
      {/* Desktop Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 ease-in-out scale-105"
        style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}
      />
      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

      {/* UI Layers */}
      <TopBar date={date} onOpenMenu={() => setSysMenuOpen(!sysMenuOpen)} />
      <Dock apps={APP_CONFIG} activeApps={windows} onAppClick={openApp} />
      
      {/* Desktop Icons */}
      <div className="absolute top-10 left-20 right-0 bottom-0 z-0 p-6 flex flex-col flex-wrap content-start gap-6 pointer-events-none">
          <div className="pointer-events-auto w-24 flex flex-col items-center group cursor-pointer" onDoubleClick={() => openApp(AppID.FILES)}>
             <div className="w-14 h-14 bg-ubuntu-orange/90 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-ubuntu-orange transition-colors mb-1">
                 <FolderPlus className="text-white" size={28} />
             </div>
             <span className="text-white text-xs font-medium drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full">Home</span>
          </div>
           <div className="pointer-events-auto w-24 flex flex-col items-center group cursor-pointer" onDoubleClick={() => openApp(AppID.TRASH)}>
             <div className="w-14 h-14 bg-gray-700/90 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-gray-600 transition-colors mb-1">
                 <ImageIcon className="text-white" size={28} />
             </div>
             <span className="text-white text-xs font-medium drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full">Trash</span>
          </div>
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {windows.map(win => (
            <div key={win.instanceId} className="pointer-events-auto">
                <Window
                    {...win}
                    isActive={win.zIndex === Math.max(...windows.map(w => w.zIndex))}
                    onClose={() => closeWindow(win.instanceId)}
                    onMinimize={() => minimizeWindow(win.instanceId)}
                    onMaximize={() => maximizeWindow(win.instanceId)}
                    onFocus={() => focusWindow(win.instanceId)}
                    onMove={(x, y) => moveWindow(win.instanceId, x, y)}
                    onResize={(w, h) => resizeWindow(win.instanceId, w, h)}
                >
                    {renderWindowContent(win)}
                </Window>
            </div>
        ))}
      </div>

      {/* System Menu */}
      <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <SystemMenu isOpen={sysMenuOpen} onClose={() => setSysMenuOpen(false)} />
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
          <div className="pointer-events-auto">
              <ContextMenu {...contextMenu} onClose={() => setContextMenu(null)} />
          </div>
      )}

    </div>
  );
}