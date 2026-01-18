'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-opacity-80 border-b border-[var(--border-light)] bg-[#09090b]">
      {/* Brand */}
      <div className="flex items-center gap-3">
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

      {/* Navigation */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center p-1 bg-[var(--bg-surface)] rounded-full border border-[var(--border-light)] shadow-xl">
        <NavLink href="/sorting" active={pathname?.startsWith('/sorting')}>Sorting</NavLink>
        <NavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')}>Pathfinding</NavLink>
        <NavLink href="/datastructures" active={pathname?.startsWith('/datastructures')}>Structures</NavLink>
        <NavLink href="/" active={pathname === '/'}>About</NavLink>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">


      </div>
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
