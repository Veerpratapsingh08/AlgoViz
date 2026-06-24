'use client';

import { useState } from 'react';

interface CollapsiblePanelProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  initialOpen?: boolean;
  className?: string;
  variant?: 'editorial' | 'mono';
}

export default function CollapsiblePanel({ 
  title, 
  icon, 
  children, 
  initialOpen = true,
  className = '',
  variant = 'editorial'
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className={`sketch-box bg-stone-800 flex-col !items-stretch !gap-0 !p-0 overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <div className={`flex items-center gap-3 transition-colors ${
          variant === 'editorial' 
            ? 'font-editorial italic text-3xl capitalize text-stone-200 group-hover:text-stone-100 tracking-normal' 
            : 'font-mono text-sm uppercase tracking-widest text-stone-400 group-hover:text-stone-300 font-bold'
        }`}>
          <span className={`material-symbols-outlined transition-colors ${
            variant === 'editorial' ? 'text-2xl text-stone-400 group-hover:text-stone-200' : 'text-base text-stone-500 group-hover:text-stone-400'
          }`}>{icon}</span>
          {title}
        </div>
        <span className={`material-symbols-outlined text-sm text-stone-500 group-hover:text-stone-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Content */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 overflow-y-auto max-h-[500px] custom-scrollbar text-stone-300">
          {children}
        </div>
      </div>
    </div>
  );
}
