import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 custom-scrollbar">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-[pulseGlow_8s_ease-in-out_infinite_alternate]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[150px] animate-[pulseGlow_10s_ease-in-out_infinite_alternate_reverse]"></div>
      </div>

      <div className="max-w-6xl w-full flex flex-col gap-16 md:gap-24 mt-12 md:mt-20 relative z-10">
        
        {/* Hero Section */}
        <div className="about-hero space-y-8 animate-[popIn_0.8s_ease-out]">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 animate-[float_6s_ease-in-out_infinite]">
            <Image 
              src="/assets/logo/algoviz-icon.svg" 
              alt="AlgoViz Logo" 
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]"
            />
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-indigo-300 mb-4 tracking-widest uppercase">
            Interactive Learning Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300 leading-tight tracking-tight drop-shadow-lg">
            Master Algorithms <br/> Visually.
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            AlgoViz transforms abstract code into stunning, real-time animations.
            Understand sorting, pathfinding, and data structures like never before.
          </p>
          <div className="pt-8 flex items-center justify-center gap-6">
              <Link href="/sorting" className="btn btn-primary text-lg px-8 py-4 rounded-xl font-bold tracking-wide">
                  Start Visualizing <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
              </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-[slideUp_1s_ease-out_0.3s_both]">
          <FeatureCard 
            icon="swap_vert" 
            title="Sorting" 
            description="Watch Bubble, Quick, Merge, and Heap Sort come to life with colorful animations. Adjust speed and array size to see how efficiency changes."
            href="/sorting"
            color="from-purple-500 to-indigo-600"
          />
          <FeatureCard 
            icon="route" 
            title="Pathfinding" 
            description="Explore Dijkstra's, A*, BFS, and DFS algorithms. Draw mazes, set start and target points, and visualize how each algorithm finds the optimal path."
            href="/pathfinding"
            color="from-cyan-500 to-blue-600"
          />
          <FeatureCard 
            icon="account_tree" 
            title="Data Structures" 
            description="Interact with Binary Search Trees, Stacks, and Queues. Insert, remove, and search elements while watching the structure update in real-time."
            href="/datastructures"
            color="from-emerald-400 to-teal-600"
          />
        </div>

        {/* Technology Stack */}
        <div className="text-center space-y-10 animate-[slideUp_1s_ease-out_0.5s_both]">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Powered by Modern Tech
          </h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <TechBadge icon="bolt" name="Next.js 15" />
            <TechBadge icon="code" name="TypeScript" />
            <TechBadge icon="palette" name="Tailwind CSS v4" />
            <TechBadge icon="animation" name="Framer Motion Concepts" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-16 pb-8 border-t border-white/10 text-slate-500 animate-[fadeIn_1.5s_ease-out_0.8s_both]">
          <p className="mb-2">Created with ❤️ by <a href="https://veerpratapsingh.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors font-semibold">Veer Pratap Singh</a></p>
          <div className="text-xs font-mono opacity-40">AlgoViz v2.0</div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, href, color }: { icon: string, title: string, description: string, href: string, color: string }) {
  return (
    <Link href={href} className="feature-card group block">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} bg-opacity-20 flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        <span className="material-symbols-outlined text-4xl text-white drop-shadow-md">
          {icon}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-indigo-300 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">{description}</p>
      
      <div className="mt-8 flex items-center text-indigo-400 font-semibold text-sm tracking-wide opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Explore Module <span className="material-symbols-outlined ml-1 text-base">east</span>
      </div>
    </Link>
  );
}

function TechBadge({ icon, name }: { icon: string, name: string }) {
  return (
    <div className="tech-badge cursor-default">
      <span className="material-symbols-outlined text-indigo-400">{icon}</span>
      <span className="font-semibold text-slate-200 tracking-wide">{name}</span>
    </div>
  );
}
