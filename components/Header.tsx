'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit min-w-[90%] max-w-[98%] px-4 md:px-6 py-3 flex items-center justify-between gap-4 md:gap-8 sketch-box bg-stone-800 rotate-1">
      {/* Brand */}
      <div className="flex items-center shrink-0">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-stone-100 tracking-tight transform -rotate-2 hover:scale-105 transition-transform whitespace-nowrap">
          The Algorithm Sketchbook
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-4 md:gap-6 overflow-x-auto custom-scrollbar max-w-full pb-1 -mb-1">
        <NavLink href="/sorting" active={pathname?.startsWith('/sorting')}>Sorting</NavLink>
        <NavLink href="/race" active={pathname?.startsWith('/race')}>Race</NavLink>
        <NavLink href="/pathfinding" active={pathname?.startsWith('/pathfinding')}>Pathfinding</NavLink>
        <NavLink href="/graphs" active={pathname?.startsWith('/graphs')}>Graphs</NavLink>
        <NavLink href="/datastructures" active={pathname?.startsWith('/datastructures')}>Structures</NavLink>
        <NavLink href="/about" active={pathname?.startsWith('/about')}>About</NavLink>
        <div className="w-0.5 h-6 bg-stone-400/30 hidden md:block rounded-full shrink-0"></div>
        <a 
          href="https://github.com/Veerpratapsingh08/AlgoViz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl font-medium text-stone-400 hover:text-stone-100 transition-colors transform hover:rotate-2 shrink-0 pr-2"
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
      className={`font-editorial italic tracking-wide text-xl md:text-2xl transition-all shrink-0 ${
        active 
          ? 'text-amber-400 decoration-amber-400 decoration-2 underline underline-offset-4' 
          : 'text-stone-400 hover:text-stone-200'
      }`}
    >
      {children}
    </Link>
  );
}
