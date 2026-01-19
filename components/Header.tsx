'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between backdrop-blur-md bg-opacity-80 border-b border-[var(--border-light)] bg-[#09090b]">
      {/* Brand */}
      <div className="flex items-center gap-3 relative z-50">
        <div className="flex items-center justify-center p-1.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-light)] shadow-lg shadow-indigo-500/10">
          <Image 
            src="/assets/logo/algoviz-icon.svg" 
            alt="AlgoViz" 
            width={28} 
            height={28}
          />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
          AlgoViz
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center p-1 bg-[var(--bg-surface)] rounded-full border border-[var(--border-light)] shadow-xl">
        <NavLink href="/sorting" active={pathname?.startsWith('/sorting')}>Sorting</NavLink>
        <NavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')}>Pathfinding</NavLink>
        <NavLink href="/datastructures" active={pathname?.startsWith('/datastructures')}>Structures</NavLink>
        <NavLink href="/" active={pathname === '/'}>About</NavLink>
      </nav>

      {/* Actions & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 z-50">
        <a 
          href="https://github.com/Veerpratapsingh08/AlgoViz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex btn btn-surface text-xs gap-2 hover:bg-[#24292e] hover:border-[#24292e] group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text-muted)] group-hover:text-white transition-colors">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>View on GitHub</span>
        </a>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#09090b] border-b border-[var(--border-light)] p-4 flex flex-col gap-4 md:hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <MobileNavLink href="/" active={pathname === '/'} onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/sorting" active={pathname?.startsWith('/sorting')} onClick={() => setIsMenuOpen(false)}>Sorting</MobileNavLink>
            <MobileNavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')} onClick={() => setIsMenuOpen(false)}>Pathfinding</MobileNavLink>
            <MobileNavLink href="/datastructures" active={pathname?.startsWith('/datastructures')} onClick={() => setIsMenuOpen(false)}>Structures</MobileNavLink>
            
            <a 
              href="https://github.com/Veerpratapsingh08/AlgoViz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-white transition-colors mt-2 border-t border-[var(--border-light)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        active 
          ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/25' 
          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
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
        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 block ${
          active 
            ? 'bg-[var(--bg-surface-light)] text-white border border-indigo-500/30' 
            : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-surface)]'
        }`}
      >
        {children}
      </Link>
  );
}
