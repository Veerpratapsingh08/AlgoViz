'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl px-6 py-3 flex items-center justify-between sketch-box bg-stone-800 rotate-1">
      {/* Brand */}
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-bold text-stone-100 tracking-tight transform -rotate-2 hover:scale-105 transition-transform">
          AlgoViz ✏️
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <NavLink href="/sorting" active={pathname?.startsWith('/sorting')}>Sorting</NavLink>
        <NavLink href="/race" active={pathname?.startsWith('/race')}>Race</NavLink>
        <NavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')}>Pathfinding</NavLink>
        <NavLink href="/graphs" active={pathname?.startsWith('/graphs')}>Graphs</NavLink>
        <NavLink href="/datastructures" active={pathname?.startsWith('/datastructures')}>Structures</NavLink>
        <div className="w-0.5 h-6 bg-stone-400/30 hidden md:block rounded-full"></div>
        <a 
          href="https://github.com/Veerpratapsingh08/AlgoViz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl font-medium text-stone-400 hover:text-stone-100 transition-colors transform hover:rotate-2"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`text-xl font-medium transition-transform transform hover:-translate-y-0.5 ${
        active 
          ? 'text-stone-100 underline decoration-2 underline-offset-4 decoration-stone-100' 
          : 'text-stone-400 hover:text-stone-100'
      }`}
    >
      {children}
    </Link>
  );
}
