import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full h-full flex flex-col pt-32 px-6 md:px-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl w-full mx-auto pb-32">
        
        {/* Hero Section */}
        <div className="space-y-6 text-center max-w-3xl mx-auto mt-12 mb-24 relative">
          {/* A sketchy little decorative element */}
          <div className="absolute -top-12 -left-12 text-6xl opacity-20 transform -rotate-12">✨</div>
          <div className="absolute top-10 -right-12 text-5xl opacity-20 transform rotate-12">🚀</div>

          <h1 className="text-6xl md:text-8xl font-bold text-stone-100 tracking-tight transform -rotate-1">
            AlgoViz
          </h1>
          <h2 className="text-2xl md:text-3xl text-stone-400 font-medium transform rotate-1">
            (The Algorithm Sketchbook)
          </h2>
          <p className="text-2xl text-stone-300 leading-relaxed max-w-2xl mx-auto pt-4">
            A messy, hands-on place to figure out how algorithms actually work under the hood. 
            No corporate fluff, just code, logic, and a whole lot of scribbles.
          </p>
          <div className="pt-8">
              <Link href="/sorting" className="btn btn-primary text-2xl px-8 py-3 transform rotate-1">
                  Let's draw some algorithms! 🖍️
              </Link>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          
          <div className="sketch-box p-6 group hover:-translate-y-1 hover:-rotate-1 transition-transform bg-stone-800">
            <Link href="/sorting" className="block">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-stone-100 mb-3 group-hover:underline decoration-4 decoration-yellow-400 underline-offset-4">Sorting</h2>
              <p className="text-stone-400 text-xl leading-relaxed">
                Watch arrays get sorted in real-time. Bubble, Quick, Merge, and Heap. Mess with the speed and size to see how it scales.
              </p>
            </Link>
          </div>

          <div className="sketch-box p-6 group hover:-translate-y-1 hover:rotate-1 transition-transform bg-stone-800">
            <Link href="/pathfinding" className="block">
              <div className="text-4xl mb-4">🗺️</div>
              <h2 className="text-3xl font-bold text-stone-100 mb-3 group-hover:underline decoration-4 decoration-blue-400 underline-offset-4">Pathfinding</h2>
              <p className="text-stone-400 text-xl leading-relaxed">
                Find the shortest path without blowing up the call stack. Draw your own walls and let Dijkstra or A* figure it out.
              </p>
            </Link>
          </div>

          <div className="sketch-box p-6 group hover:-translate-y-1 hover:-rotate-2 transition-transform bg-stone-800">
            <Link href="/datastructures" className="block">
              <div className="text-4xl mb-4">🌳</div>
              <h2 className="text-3xl font-bold text-stone-100 mb-3 group-hover:underline decoration-4 decoration-green-400 underline-offset-4">Structures</h2>
              <p className="text-stone-400 text-xl leading-relaxed">
                Trees, Stacks, and Queues. Throw data in, pull it out, and see how memory pointers actually connect everything together.
              </p>
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-32 pt-10 text-center text-xl text-stone-500 sketch-box bg-stone-800/50 border-none shadow-none transform rotate-1">
          <p>Scribbled together by <a href="https://veerpratapsingh.vercel.app" target="_blank" rel="noopener noreferrer" className="text-stone-300 underline decoration-2 decoration-stone-500 font-bold hover:text-white">Veer Pratap Singh</a></p>
          <p className="mt-2 opacity-50">v2.0 (Dark Sketch Edition)</p>
        </div>

      </div>
    </section>
  );
}
