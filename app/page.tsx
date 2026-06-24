import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full h-full flex flex-col pt-32 px-6 md:px-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl w-full mx-auto pb-32">
        
        {/* Hero Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto mt-12 mb-24 relative">

          <h1 className="text-6xl md:text-8xl font-editorial italic font-normal text-stone-100 tracking-tight transform -rotate-1">
            The Algorithm Sketchbook
          </h1>
          <h2 className="text-xl md:text-2xl text-stone-500 font-mono tracking-wide transform rotate-1">
            (Interactive Visualizer)
          </h2>
          <p className="text-2xl text-stone-300 leading-relaxed max-w-2xl mx-auto pt-4 font-inter">
            Built by a CS student who got tired of memorizing algorithms. This is where I break them, race them, visualize them, and finally understand them.
          </p>
          <div className="pt-8">
              <Link href="/sorting" className="btn btn-primary text-2xl px-8 py-3 transform rotate-1">
                  Let&apos;s draw some algorithms!
              </Link>
          </div>
        </div>

        {/* Modules Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 auto-rows-[minmax(180px,auto)]">
          
          {/* Sorting: Large Featured */}
          <div className="md:col-span-2 md:row-span-2 sketch-box p-8 md:p-12 group hover:-translate-y-1 hover:-rotate-1 transition-transform bg-stone-800 flex flex-col justify-between">
            <Link href="/sorting" className="block h-full flex flex-col">
              <svg className="w-16 h-16 mb-8 text-yellow-400 group-hover:scale-110 transition-transform origin-bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <div className="mt-auto">
                <h2 className="text-4xl md:text-5xl font-editorial italic text-stone-100 mb-4 group-hover:underline decoration-2 decoration-yellow-400 underline-offset-4 tracking-tight">Sorting Algorithms</h2>
                <p className="text-stone-400 font-inter text-xl leading-relaxed max-w-lg">
                  Watch arrays get sorted in real-time. Bubble, Quick, Merge, and Heap. Mess with the speed and size to see exactly how each algorithm scales under pressure.
                </p>
              </div>
            </Link>
          </div>

          {/* Pathfinding */}
          <div className="sketch-box p-6 group hover:-translate-y-1 hover:rotate-1 transition-transform bg-stone-800">
            <Link href="/pathfinding" className="block h-full flex flex-col">
              <svg className="w-10 h-10 mb-4 text-blue-400 group-hover:scale-110 transition-transform origin-bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              <h2 className="text-3xl font-editorial italic text-stone-100 mb-2 group-hover:underline decoration-2 decoration-blue-400 underline-offset-4 tracking-tight">Pathfinding</h2>
              <p className="text-stone-400 font-inter text-base leading-relaxed">
                Find the shortest path. Draw your own walls and let Dijkstra or A* figure it out.
              </p>
            </Link>
          </div>

          {/* Structures */}
          <div className="sketch-box p-6 group hover:-translate-y-1 hover:-rotate-1 transition-transform bg-stone-800">
            <Link href="/datastructures" className="block h-full flex flex-col">
              <svg className="w-10 h-10 mb-4 text-green-400 group-hover:scale-110 transition-transform origin-bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"></circle>
                <circle cx="6" cy="16" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
                <line x1="10.5" y1="7.5" x2="7.5" y2="13.5"></line>
                <line x1="13.5" y1="7.5" x2="16.5" y2="13.5"></line>
              </svg>
              <h2 className="text-3xl font-editorial italic text-stone-100 mb-2 group-hover:underline decoration-2 decoration-green-400 underline-offset-4 tracking-tight">Data Structures</h2>
              <p className="text-stone-400 font-inter text-base leading-relaxed">
                Trees, Stacks, and Queues. See how memory pointers actually connect.
              </p>
            </Link>
          </div>
          
          {/* Race Mode */}
          <div className="sketch-box p-6 group hover:-translate-y-1 hover:-rotate-2 transition-transform bg-stone-800">
            <Link href="/race" className="block h-full flex flex-col">
              <svg className="w-10 h-10 mb-4 text-rose-400 group-hover:scale-110 transition-transform origin-bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <h2 className="text-3xl font-editorial italic text-stone-100 mb-2 group-hover:underline decoration-2 decoration-rose-400 underline-offset-4 tracking-tight">Race Mode</h2>
              <p className="text-stone-400 font-inter text-base leading-relaxed">
                Pit $O(n^2)$ against $O(n \log n)$ side-by-side.
              </p>
            </Link>
          </div>

          {/* Graphs */}
          <div className="md:col-span-2 sketch-box p-6 group hover:-translate-y-1 hover:rotate-1 transition-transform bg-stone-800">
            <Link href="/graphs" className="block h-full flex flex-col">
              <svg className="w-10 h-10 mb-4 text-purple-400 group-hover:scale-110 transition-transform origin-bottom-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5" cy="5" r="3"></circle>
                <circle cx="19" cy="5" r="3"></circle>
                <circle cx="12" cy="19" r="3"></circle>
                <line x1="7.5" y1="6.5" x2="17" y2="6.5"></line>
                <line x1="6.5" y1="7.5" x2="10.5" y2="16.5"></line>
                <line x1="17.5" y1="7.5" x2="13.5" y2="16.5"></line>
              </svg>
              <h2 className="text-4xl font-editorial italic text-stone-100 mb-2 group-hover:underline decoration-2 decoration-purple-400 underline-offset-4 tracking-tight">Freeform Graphs</h2>
              <p className="text-stone-400 font-inter text-lg leading-relaxed">
                Draw your own freeform graph networks, connect edges, and run Kruskal&apos;s MST or Dijkstra&apos;s Shortest Path right on top of your sketches.
              </p>
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-32 pt-10 text-center text-xl text-stone-500 sketch-box bg-stone-800/50 border-none shadow-none transform rotate-1">
          <p>Scribbled together by <a href="https://veerpratapsingh.vercel.app" target="_blank" rel="noopener noreferrer" className="text-stone-300 underline decoration-2 decoration-stone-500 font-bold hover:text-white">Veer Pratap Singh</a></p>
          <div className="mt-4 flex items-center justify-center gap-4 text-base opacity-75">
             <span className="sr-only">The Algorithm Sketchbook</span>
             <span>v2.0 (Dark Sketch Edition)</span>
             <span className="text-stone-600">|</span>
             <Link href="/privacy" className="hover:text-stone-300 hover:underline">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
