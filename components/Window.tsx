import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  instanceId: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  id, instanceId, title, icon: Icon, isOpen, isMinimized, isMaximized, zIndex, position, size, isActive,
  onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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
        // Basic boundary check
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(newX, newY);
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

  const style: React.CSSProperties = isMaximized
    ? { top: 0, left: 70, width: 'calc(100vw - 70px)', height: '100vh', transform: 'none', borderRadius: 0 }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  return (
    <div
      className={`absolute flex flex-col bg-[#333] shadow-2xl border border-black/20 overflow-hidden window-enter
        ${isMinimized ? 'opacity-0 pointer-events-none scale-75 transition-all duration-300 ease-in-out origin-bottom-left' : 'opacity-100'}
        ${!isMaximized ? 'rounded-xl' : ''}
      `}
      style={{
        ...style,
        zIndex,
        transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        display: isMinimized ? 'none' : 'flex',
        boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`h-10 flex items-center justify-between px-3 select-none
          ${isActive ? 'bg-[#2c2c2c]' : 'bg-[#252525]'}
          border-b border-black/30
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center space-x-3">
           <div className="window-controls flex items-center space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-5 h-5 rounded-full bg-[#E95420] hover:bg-[#D84315] flex items-center justify-center text-transparent hover:text-white transition-colors shadow-sm">
              <X size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-5 h-5 rounded-full bg-[#77216F] hover:bg-[#5E1A57] flex items-center justify-center text-transparent hover:text-white transition-colors shadow-sm">
              <Minus size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-5 h-5 rounded-full bg-[#AEA79F] hover:bg-[#969089] flex items-center justify-center text-transparent hover:text-white transition-colors shadow-sm">
              {isMaximized ? <MinimizeIcon /> : <Square size={10} />}
            </button>
          </div>
          <span className={`text-sm font-medium transition-opacity ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
             {title}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-[#1E1E1E] flex flex-col">
        {children}
      </div>
      
      {/* Resize Handle */}
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-50 flex items-end justify-end p-1"
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
                Math.max(320, startWidth + (moveEvent.clientX - startX)),
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
        >
        </div>
      )}
    </div>
  );
};

const MinimizeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);