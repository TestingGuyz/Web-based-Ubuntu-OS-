import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, Volume2, Battery, Power, Search, Calendar, ChevronDown, Menu, Globe } from 'lucide-react';
import { APP_CONFIG, WALLPAPERS } from './constants';
import { AppID, WindowState } from './types';
import { Window } from './components/Window';
import { TerminalApp } from './components/Apps/Terminal';
import { BrowserApp } from './components/Apps/Browser';
import { GeminiChatApp } from './components/Apps/GeminiChat';

// ---- Sub-components (Internal for App.tsx) ----

// Top Bar Component
const TopBar = ({ date, onOpenMenu }: { date: Date, onOpenMenu: () => void }) => (
  <div className="h-8 bg-[#1d1d1d] flex items-center justify-between px-4 select-none z-50 relative shadow-md">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors">
        <span className="font-bold text-sm text-gray-100">Activities</span>
      </div>
      <div className="hidden md:flex text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
        {Object.values(APP_CONFIG).find(a => a.title === 'Terminal')?.title} 
        {/* Dynamic App Name logic could go here, kept static for demo */}
      </div>
    </div>

    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 cursor-pointer px-3 py-1 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-gray-700">
      <Calendar size={14} className="text-gray-400" />
      <span className="text-sm font-medium text-gray-200">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp;
        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
    </div>

    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-white/10 cursor-pointer transition-colors" onClick={onOpenMenu}>
        <Wifi size={16} className="text-gray-300" />
        <Volume2 size={16} className="text-gray-300" />
        <Battery size={16} className="text-gray-300" />
        <ChevronDown size={14} className="text-gray-300" />
      </div>
    </div>
  </div>
);

// System Menu (Volume, Wifi, Power)
const SystemMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-9 right-2 w-64 bg-[#2c2c2c] border border-gray-700 rounded-xl shadow-2xl p-4 z-[60] text-gray-200">
        <div className="flex items-center justify-between mb-4">
            <span className="font-medium">System</span>
            <Power size={18} className="cursor-pointer hover:text-red-400" onClick={() => window.location.reload()} />
        </div>
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <Volume2 size={18} />
                <input type="range" className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-ubuntu-orange" />
            </div>
            <div className="flex items-center space-x-3">
                <div className="bg-gray-600 h-1 flex-1 rounded relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-3/4 bg-ubuntu-orange"></div>
                </div>
                <span className="text-xs">75%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center mt-4">
                <div className="bg-ubuntu-orange p-2 rounded-md text-white">Wired</div>
                <div className="bg-[#3e3e3e] p-2 rounded-md">Bluetooth</div>
                <div className="bg-[#3e3e3e] p-2 rounded-md">Settings</div>
            </div>
        </div>
        {/* Click outside listener simulated by invisible backdrop in parent if needed, or just simple here */}
    </div>
  )
};


// Dock Component
const Dock = ({ apps, activeApps, onAppClick }: { apps: typeof APP_CONFIG, activeApps: WindowState[], onAppClick: (id: AppID) => void }) => (
  <div className="absolute left-0 top-8 bottom-0 w-16 bg-[#1d1d1d]/90 backdrop-blur-md flex flex-col items-center py-2 space-y-2 z-50 border-r border-white/5">
    {Object.entries(apps).map(([id, config]) => {
      const isOpen = activeApps.some(w => w.id === id && w.isOpen);
      const isFocused = activeApps.some(w => w.id === id && w.isOpen && w.zIndex === Math.max(...activeApps.map(a => a.zIndex)));
      
      return (
        <div key={id} className="relative group w-full flex justify-center">
          {isOpen && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full bg-ubuntu-orange"></div>
          )}
          <button
            onClick={() => onAppClick(id as AppID)}
            className={`p-2 rounded-lg transition-all duration-200 relative ${isOpen ? 'bg-white/10' : 'hover:bg-white/5'} group-hover:scale-110`}
          >
            <config.icon size={28} className={id === AppID.AI_CHAT ? "text-purple-400" : "text-gray-200"} />
          </button>
          
          {/* Tooltip */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[70]">
            {config.title}
          </div>
        </div>
      );
    })}
    <div className="flex-1" />
    <button className="p-3 mb-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
      <Menu size={24} />
    </button>
  </div>
);

// Boot Screen
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
            <div className="mb-8">
                 <svg className="w-24 h-24 text-white animate-pulse" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M50 25a25 25 0 1 0 25 25" fill="none" stroke="white" strokeWidth="4" strokeDasharray="40 100" className="animate-spin origin-center" />
                 </svg>
            </div>
            <h1 className="text-3xl text-white font-light tracking-widest mb-2">ubuntu<span className="font-bold">web</span></h1>
            <div className="flex space-x-2 mt-4">
                 <div className="w-2 h-2 bg-ubuntu-orange rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '450ms'}}></div>
                 <div className="w-2 h-2 bg-ubuntu-orange rounded-full animate-bounce" style={{animationDelay: '600ms'}}></div>
            </div>
        </div>
    )
}

// Main App
export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [date, setDate] = useState(new Date());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [sysMenuOpen, setSysMenuOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Window Management Logic
  const openApp = (id: AppID) => {
    // Check if already open
    const existing = windows.find(w => w.id === id);
    if (existing) {
        if (existing.isMinimized) {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
            setNextZIndex(n => n + 1);
        } else {
            // Just focus
            focusWindow(id);
        }
        return;
    }

    const config = APP_CONFIG[id];
    const newWindow: WindowState = {
        id,
        title: config.title,
        icon: config.icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        position: { x: 100 + (windows.length * 30), y: 100 + (windows.length * 30) },
        size: config.defaultSize,
        component: null // Rendered dynamically
    };
    
    setWindows([...windows, newWindow]);
    setNextZIndex(n => n + 1);
  };

  const closeWindow = (id: AppID) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const maximizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(n => n + 1);
  };

  const moveWindow = (id: AppID, x: number, y: number) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const resizeWindow = (id: AppID, width: number, height: number) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  };

  // Content Rendering Switch
  const renderWindowContent = (id: AppID) => {
    switch (id) {
        case AppID.TERMINAL: return <TerminalApp />;
        case AppID.BROWSER: return <BrowserApp />;
        case AppID.AI_CHAT: return <GeminiChatApp />;
        case AppID.SETTINGS: 
            return (
                <div className="p-6 text-gray-200">
                    <h2 className="text-2xl font-bold mb-6">Settings</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Appearance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {WALLPAPERS.map((bg, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setBgIndex(idx)}
                                        className={`h-24 rounded-lg cursor-pointer border-2 overflow-hidden ${bgIndex === idx ? 'border-ubuntu-orange' : 'border-transparent'}`}
                                    >
                                        <img src={bg} alt="wallpaper" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-2">System</h3>
                            <p className="text-gray-400 text-sm">Ubuntu Web 24.04 LTS</p>
                            <p className="text-gray-400 text-sm">React Kernel 18.2</p>
                        </div>
                    </div>
                </div>
            );
        default: return <div className="flex items-center justify-center h-full text-gray-400">Application not implemented yet.</div>;
    }
  };

  if (isBooting) return <BootScreen onComplete={() => setIsBooting(false)} />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative select-none font-sans" 
         onContextMenu={(e) => e.preventDefault()}>
      
      {/* Desktop Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000"
        style={{ backgroundImage: `url(${WALLPAPERS[bgIndex]})` }}
      />
      
      {/* Overlay for darker aesthetic */}
      <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

      {/* UI Layers */}
      <TopBar date={date} onOpenMenu={() => setSysMenuOpen(!sysMenuOpen)} />
      <Dock apps={APP_CONFIG} activeApps={windows} onAppClick={openApp} />
      
      {/* Desktop Icons Area (Clickable) */}
      <div className="absolute top-8 left-16 bottom-0 right-0 z-0 p-8 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-4 pointer-events-none">
          {/* Simulated Desktop Icons */}
          <div className="pointer-events-auto w-24 h-24 flex flex-col items-center justify-center rounded hover:bg-white/10 cursor-pointer transition-colors group" onDoubleClick={() => openApp(AppID.FILES)}>
              <div className="text-ubuntu-orange mb-1 drop-shadow-lg"><div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg"><span className="text-white text-xs font-bold">HOME</span></div></div>
              <span className="text-white text-sm font-medium shadow-black drop-shadow-md">Home</span>
          </div>
          <div className="pointer-events-auto w-24 h-24 flex flex-col items-center justify-center rounded hover:bg-white/10 cursor-pointer transition-colors group" onDoubleClick={() => openApp(AppID.BROWSER)}>
             <div className="text-blue-400 mb-1 drop-shadow-lg"><Globe size={48} /></div>
             <span className="text-white text-sm font-medium shadow-black drop-shadow-md">Chrome</span>
          </div>
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {windows.map(win => (
            <div key={win.id} className="pointer-events-auto">
                <Window
                    {...win}
                    onClose={() => closeWindow(win.id)}
                    onMinimize={() => minimizeWindow(win.id)}
                    onMaximize={() => maximizeWindow(win.id)}
                    onFocus={() => focusWindow(win.id)}
                    onMove={(x, y) => moveWindow(win.id, x, y)}
                    onResize={(w, h) => resizeWindow(win.id, w, h)}
                >
                    {renderWindowContent(win.id)}
                </Window>
            </div>
        ))}
      </div>

      {/* System Menu */}
      <SystemMenu isOpen={sysMenuOpen} onClose={() => setSysMenuOpen(false)} />
      
      {/* Click handler to close menus */}
      {sysMenuOpen && <div className="absolute inset-0 z-50 bg-transparent" onClick={() => setSysMenuOpen(false)} />}

    </div>
  );
}