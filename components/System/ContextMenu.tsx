import React, { useEffect, useRef } from 'react';
import { ContextMenuItem } from '../../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust position if close to edge
  const style: React.CSSProperties = {
    top: y,
    left: x,
  };
  
  if (x + 200 > window.innerWidth) style.left = x - 200;
  if (y + (items.length * 30) > window.innerHeight) style.top = y - (items.length * 30);

  return (
    <div 
        ref={menuRef}
        style={style}
        className="fixed z-[9999] w-52 bg-[#2c2c2c] rounded-lg shadow-xl border border-black/40 py-1 flex flex-col"
    >
        {items.map((item, idx) => (
            item.divider ? (
                <div key={idx} className="h-px bg-gray-700 my-1 mx-2"></div>
            ) : (
                <button
                    key={idx}
                    onClick={() => { item.action?.(); onClose(); }}
                    disabled={item.disabled}
                    className="flex items-center justify-between px-3 py-1.5 hover:bg-ubuntu-orange text-gray-200 hover:text-white text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
                >
                    <div className="flex items-center space-x-2">
                        {item.icon && <item.icon size={14} className="text-gray-400 group-hover:text-white" />}
                        <span>{item.label}</span>
                    </div>
                    {item.shortcut && <span className="text-xs text-gray-500 group-hover:text-white/80">{item.shortcut}</span>}
                </button>
            )
        ))}
    </div>
  );
};