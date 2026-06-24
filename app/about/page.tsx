import Link from "next/link";

export const metadata = {
  title: 'The Algorithm Sketchbook - About',
  description: 'About the project and why it was built.',
};

export default function AboutPage() {
  return (
    <div className="w-full h-full flex flex-col pt-32 md:pt-40 px-6 md:px-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto pb-32">
        <h1 className="text-5xl md:text-7xl font-black text-stone-100 tracking-tight transform -rotate-1 mb-12">
          About The Sketchbook
        </h1>

        <div className="sketch-box bg-stone-800 p-8 md:p-12 transform rotate-1 mb-12">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">lightbulb</span>
            Why I Built This
          </h2>
          
          <div className="space-y-6 text-xl text-stone-300 leading-relaxed font-inter">
            <p>
              I've always felt that traditional computer science resources get it backwards. They bury you in dry theory, mathematical proofs, and dense textbook paragraphs before you ever get to see the algorithm actually <em>run</em>.
            </p>
            <p>
              Learning algorithms shouldn't feel like deciphering an ancient manuscript. It should feel like playing with Lego blocks. You should be able to poke at it, change the speed, swap the data, and watch the mechanics unfold right in front of your eyes.
            </p>
            <p>
              I built <strong>The Algorithm Sketchbook</strong> to be the tool I wish I had when I was first learning Data Structures and Algorithms. I wanted a messy, hands-on, highly visual playground where you can literally see an $O(n^2)$ algorithm struggle, or watch Dijkstra's algorithm organically explore a maze.
            </p>
            <p>
              No corporate fluff. No rigid grids. Just raw logic, visual intuition, and a chalkboard aesthetic to make it feel like you're sketching out ideas in a notebook.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="sketch-box bg-stone-800 p-8 transform -rotate-1">
                <h3 className="text-2xl font-bold text-sky-400 mb-4">The Tech Stack</h3>
                <ul className="space-y-3 text-stone-300 text-lg">
                    <li><strong className="text-stone-100">Next.js & React:</strong> The core framework powering the UI and state logic.</li>
                    <li><strong className="text-stone-100">TypeScript:</strong> Ensuring type-safety across all algorithm implementations.</li>
                    <li><strong className="text-stone-100">Tailwind CSS:</strong> For the raw, custom styling and chalkboard aesthetics.</li>
                    <li><strong className="text-stone-100">Vercel:</strong> For fast, reliable deployment.</li>
                </ul>
            </div>
            
            <div className="sketch-box bg-stone-800 p-8 transform rotate-2 flex flex-col justify-center items-center text-center">
                <h3 className="text-2xl font-bold text-rose-400 mb-4">Open Source</h3>
                <p className="text-stone-300 text-lg mb-6">
                    This entire project is open source. Feel free to explore the code, report issues, or contribute new algorithms!
                </p>
                <a 
                    href="https://github.com/Veerpratapsingh08/AlgoViz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary px-6 py-2 bg-stone-700 hover:bg-stone-600 border-stone-500 text-stone-100"
                >
                    View on GitHub
                </a>
            </div>
        </div>

        <div className="mt-16 sketch-box bg-stone-900 border-stone-700 p-8 md:p-12 transform -rotate-1">
            <h2 className="text-3xl font-bold text-stone-100 mb-6 font-editorial italic tracking-wide">
                Building Log: Mistakes & Discoveries
            </h2>
            <div className="space-y-6 font-mono text-sm text-stone-400">
                <div className="border-l-2 border-stone-600 pl-4 py-1">
                    <span className="text-amber-500 font-bold block mb-1">Day 1:</span>
                    Attempted to build Quick Sort using React State. Instantly hit maximum update depth exceeded. Turns out `setArray` inside a recursive loop is a remarkably efficient way to crash Chrome.
                </div>
                <div className="border-l-2 border-stone-600 pl-4 py-1">
                    <span className="text-amber-500 font-bold block mb-1">Day 4:</span>
                    Trying to animate CSS bars swapping. Discovered that React state batching and `setTimeout` are mortal enemies. Refactored the entire sorting engine to use a generator-like `Step` queue. Finally, it looks like sorting and not just a flickering glitch-fest.
                </div>
                <div className="border-l-2 border-stone-600 pl-4 py-1">
                    <span className="text-amber-500 font-bold block mb-1">Day 12:</span>
                    Accidentally animated 5,000 DOM updates per frame on a 100x100 pathfinding grid. My laptop fan sounded like a jet engine. Re-learned that $O(n^2)$ isn't just theory—it actually burns CPU cycles in the real world.
                </div>
                <div className="border-l-2 border-stone-600 pl-4 py-1">
                    <span className="text-amber-500 font-bold block mb-1">Day 18:</span>
                    Dijkstra's algorithm kept exploring the entire grid even when the target was right next to it. Realized my priority queue was a standard array and I was doing `arr.sort()` on every single insertion. Big O strikes again.
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
