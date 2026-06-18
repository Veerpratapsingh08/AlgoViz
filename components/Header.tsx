'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full glass-panel border border-white/10 shadow-2xl px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 relative z-50">
        <div className="flex items-center justify-center p-2 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Image 
            src="/assets/logo/algoviz-icon.svg" 
            alt="AlgoViz" 
            width={24} 
            height={24}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 tracking-tight drop-shadow-md">
          AlgoViz
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        <NavLink href="/sorting" active={pathname?.startsWith('/sorting')}>Sorting</NavLink>
        <NavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')}>Pathfinding</NavLink>
        <NavLink href="/datastructures" active={pathname?.startsWith('/datastructures')}>Structures</NavLink>
        <div className="w-px h-6 bg-white/10 mx-2"></div>
        <NavLink href="/" active={pathname === '/'}>About</NavLink>
      </nav>

      {/* Actions & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 z-50">
        <a 
          href="https://github.com/Veerpratapsingh08/AlgoViz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="hidden lg:inline">GitHub</span>
        </a>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-[120%] left-0 right-0 glass-panel !p-4 flex flex-col gap-3 md:hidden shadow-2xl animate-[slideUp_0.2s_ease-out] border border-white/10 rounded-2xl">
            <MobileNavLink href="/" active={pathname === '/'} onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/sorting" active={pathname?.startsWith('/sorting')} onClick={() => setIsMenuOpen(false)}>Sorting</MobileNavLink>
            <MobileNavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')} onClick={() => setIsMenuOpen(false)}>Pathfinding</MobileNavLink>
            <MobileNavLink href="/datastructures" active={pathname?.startsWith('/datastructures')} onClick={() => setIsMenuOpen(false)}>Structures</MobileNavLink>
            
            <a 
              href="https://github.com/Veerpratapsingh08/AlgoViz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors mt-2 border-t border-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
        active 
          ? 'bg-indigo-500/20 text-indigo-300 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/30' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
      <Link 
        href={href} 
        onClick={onClick}
        className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 block ${
          active 
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {children}
      </Link>
  );
}
