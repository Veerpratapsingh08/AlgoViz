'use client';

import { useState } from 'react';

interface CollapsiblePanelProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  initialOpen?: boolean;
  className?: string;
}

export default function CollapsiblePanel({ 
  title, 
  icon, 
  children, 
  initialOpen = true,
  className = ''
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={`sketch-box bg-stone-800 flex-col !items-stretch !gap-0 !p-0 overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3 text-stone-300 group-hover:text-stone-100 transition-colors text-xl font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-base text-stone-400 group-hover:text-stone-100 transition-colors">{icon}</span>
          {title}
        </div>
        <span className={`material-symbols-outlined text-sm text-stone-400 group-hover:text-stone-100 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 overflow-y-auto max-h-96 custom-scrollbar text-stone-300">
          {children}
        </div>
      </div>
    </div>
  );
}
