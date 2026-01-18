import Image from "next/image";

export default function Home() {
  return (
    <section className="dashboard-view w-full h-full flex flex-col items-center justify-start overflow-y-auto p-8 pb-32">
      <div className="about-container max-w-6xl w-full flex flex-col gap-16 mt-12">
        
        {/* Hero Section */}
        <div className="about-hero text-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="relative w-64 h-16 mx-auto mb-8">
            <Image 
              src="/assets/logo/algoviz.svg" 
              alt="AlgoViz" 
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            />
          </div>
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 leading-tight">
            Visualize Algorithms<br/>in Real-Time
          </h1>
          <p className="about-subtitle text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            An interactive platform to understand sorting algorithms, pathfinding techniques, 
            and data structures through stunning visual animations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="about-features grid grid-cols-1 md:grid-cols-3 gap-8 animate-[slideUp_0.8s_ease-out_0.2s_both]">
          <FeatureCard 
            icon="swap_vert" 
            title="Sorting Algorithms" 
            description="Watch Bubble, Quick, Merge, and Heap Sort come to life with colorful animations. Adjust speed and array size to see how efficiency changes."
          />
          <FeatureCard 
            icon="route" 
            title="Pathfinding Visualizer" 
            description="Explore Dijkstra's, A*, BFS, and DFS algorithms. Draw mazes, set start and target points, and visualize how each algorithm finds the optimal path."
          />
          <FeatureCard 
            icon="account_tree" 
            title="Data Structures" 
            description="Interact with Binary Search Trees, Stacks, and Queues. Insert, remove, and search elements while watching the structure update in real-time."
          />
        </div>

        {/* Technology Stack */}
        <div className="about-tech text-center space-y-8 animate-[slideUp_0.8s_ease-out_0.4s_both]">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            Built With Modern Tech
          </h2>
          <div className="tech-grid flex flex-wrap justify-center gap-4">
            <TechBadge icon="bolt" name="Next.js 15" />
            <TechBadge icon="code" name="TypeScript" />
            <TechBadge icon="palette" name="Tailwind CSS" />
            <TechBadge icon="dns" name="React Server Components" />
          </div>
        </div>

        {/* Footer */}
        <div className="about-footer text-center pt-12 border-t border-[var(--border-light)] text-[var(--text-muted)] animate-[fadeIn_1s_ease-out_0.6s_both]">
          <p className="mb-2">Created with ❤️ by <a href="https://veerpratapsingh.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Veer Pratap Singh</a></p>
          <div className="text-xs font-mono opacity-50">version 1.0</div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="feature-card bg-[var(--bg-surface-dark)] border border-[var(--border-light)] rounded-2xl p-8 hover:border-indigo-500/30 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <span className="material-symbols-outlined text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-[var(--text-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

function TechBadge({ icon, name }: { icon: string, name: string }) {
  return (
    <div className="px-6 py-3 rounded-full bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-3 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 cursor-default">
      <span className="material-symbols-outlined text-indigo-400">{icon}</span>
      <span className="font-medium text-white">{name}</span>
    </div>
  );
}
