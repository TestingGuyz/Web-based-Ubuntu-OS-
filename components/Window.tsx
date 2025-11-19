import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  id, title, icon: Icon, isOpen, isMinimized, isMaximized, zIndex, position, size,
  onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove]);

  if (!isOpen) return null;

  const currentStyle = isMaximized
    ? { top: 32, left: 64, width: 'calc(100vw - 64px)', height: 'calc(100vh - 32px)', transform: 'none' } // Adjust for dock/topbar
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[#333333] rounded-lg shadow-2xl border border-gray-700 overflow-hidden transition-opacity duration-200 ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{
        ...currentStyle,
        zIndex,
        transition: isDragging ? 'none' : 'width 0.2s, height 0.2s, top 0.2s, left 0.2s',
        display: isMinimized ? 'none' : 'flex'
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-9 bg-[#2c2c2c] border-b border-gray-800 flex items-center justify-between px-3 select-none cursor-default"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center space-x-2 text-gray-300 text-sm font-medium">
          <Icon size={16} className="text-ubuntu-orange" />
          <span>{title}</span>
        </div>
        <div className="window-controls flex items-center space-x-2">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            {isMaximized ? <MinimizeIcon /> : <Square size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-red-500 rounded-full text-gray-400 hover:text-white transition-colors group">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-[#1E1E1E]">
        {children}
      </div>
      
      {/* Resize Handle (Simple corner) */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onFocus();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = size.width;
            const startHeight = size.height;

            const handleResizeMove = (moveEvent: MouseEvent) => {
              onResize(
                Math.max(300, startWidth + (moveEvent.clientX - startX)),
                Math.max(200, startHeight + (moveEvent.clientY - startY))
              );
            };

            const handleResizeUp = () => {
              window.removeEventListener('mousemove', handleResizeMove);
              window.removeEventListener('mouseup', handleResizeUp);
            };

            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeUp);
          }}
        />
      )}
    </div>
  );
};

const MinimizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);