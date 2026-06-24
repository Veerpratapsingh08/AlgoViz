'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import StudyDrawer from './StudyDrawer';
import { Sort, Step } from '@/lib/algorithms/sorting';

const ALGORITHMS = {
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
};

const ALGO_INFO: Record<string, { desc: string; time: string; space: string; stable: string }> = {
  merge:     { desc: 'Divide-and-conquer. Splits the array in half recursively, then merges sorted halves back together. Always O(n log n) — fast and predictable.', time: 'O(n log n)', space: 'O(n)', stable: 'Yes' },
  quick:     { desc: "Picks a 'pivot', partitions elements smaller/larger around it, then recurses. Very fast in practice but worst-case O(n²) on sorted input.", time: 'O(n log n) avg', space: 'O(log n)', stable: 'No' },
  heap:      { desc: 'Builds a max-heap, then extracts the maximum one-by-one. Guaranteed O(n log n), in-place. Less cache-friendly than quicksort.', time: 'O(n log n)', space: 'O(1)', stable: 'No' },
  bubble:    { desc: 'Repeatedly swaps adjacent elements that are out of order. Simple to understand but very slow — O(n²) in the worst case. Good for teaching only.', time: 'O(n²)', space: 'O(1)', stable: 'Yes' },
  selection: { desc: 'Finds the minimum element and places it at the front, repeating for the rest. Always O(n²) comparisons but minimal swaps.', time: 'O(n²)', space: 'O(1)', stable: 'No' },
  insertion: { desc: 'Builds the sorted array one element at a time, inserting each into its correct position. Excellent for small or nearly-sorted arrays.', time: 'O(n²) / O(n) best', space: 'O(1)', stable: 'Yes' },
};

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [algo, setAlgo] = useState<string>('merge');
  const [size, setSize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const [running, setRunning] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [stats, setStats] = useState({ comparisons: 0, writes: 0 });
  const [colors, setColors] = useState<{[key: number]: string}>({});
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  const timers = useRef<NodeJS.Timeout[]>([]);
  const runningRef = useRef(running);

  useEffect(() => { runningRef.current = running; }, [running]);

  const clearTimers = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
  };

  const reset = useCallback(() => {
    if (runningRef.current) return;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setArray(arr);
    setColors({});
    setStats({ comparisons: 0, writes: 0 });
    setDone(false);
  }, [size]);

  const stop = () => {
    clearTimers();
    setRunning(false);
    setColors({});
    setDone(false);
  };

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { return () => clearTimers(); }, []);

  const handleSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (running) return;
    const val = parseInt(e.target.value);
    setSize(val);
    setArray(Array.from({ length: val }, () => Math.floor(Math.random() * 95) + 5));
    setColors({});
    setDone(false);
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setStats({ comparisons: 0, writes: 0 });
    clearTimers();

    let steps: Step[] = [];
    switch (algo) {
      case 'bubble':    steps = Sort.bubble(array);    break;
      case 'selection': steps = Sort.selection(array); break;
      case 'insertion': steps = Sort.insertion(array); break;
      case 'merge':     steps = Sort.merge(array);     break;
      case 'quick':     steps = Sort.quick(array);     break;
      case 'heap':      steps = Sort.heap(array);      break;
    }
    animate(steps);
  };

  const animate = (steps: Step[]) => {
    if (steps.length === 0) { setRunning(false); return; }

    const delay = Math.max(1, 101 - speed);
    const arrCopy = [...array];
    let cmp = 0;
    let wrt = 0;

    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        if (step.type === 'swap') {
          wrt++;
          const [a, b] = step.idx;
          if (step.val) {
            arrCopy[a] = step.val[0];
            arrCopy[b] = step.val[1];
          } else {
            [arrCopy[a], arrCopy[b]] = [arrCopy[b], arrCopy[a]];
          }
          setArray([...arrCopy]);
        } else if (step.type === 'overwrite') {
          wrt++;
          arrCopy[step.idx] = step.val;
          setArray([...arrCopy]);
        } else if (step.type === 'compare') {
          cmp++;
        }

        setStats({ comparisons: cmp, writes: wrt });

        setColors(prev => {
          const next: {[key: number]: string} = {};
          Object.keys(prev).forEach(k => {
            if (prev[parseInt(k)] === 'sorted') next[parseInt(k)] = 'sorted';
          });
          if (step.type === 'compare')        step.idx.forEach(idx => next[idx] = 'comparing');
          else if (step.type === 'swap')      step.idx.forEach(idx => next[idx] = 'swapping');
          else if (step.type === 'overwrite') next[step.idx] = 'swapping';
          else if (step.type === 'sorted')    next[step.idx] = 'sorted';
          return next;
        });

        if (i === steps.length - 1) {
          setRunning(false);
          setDone(true);
          setColors(() => {
            const final: {[key: number]: string} = {};
            arrCopy.forEach((_, k) => final[k] = 'sorted');
            return final;
          });
        }
      }, i * delay);

      timers.current.push(t);
    });
  };

  const info = ALGO_INFO[algo];

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 relative p-4 pt-40 md:pt-48 flex flex-col items-center justify-end overflow-hidden custom-scrollbar">

        {/* Floating Controls Dock */}
        <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-[98%] max-w-7xl z-30">
            <div className="sketch-box bg-stone-800 flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 xl:gap-6 p-4 xl:px-8 xl:py-4 -rotate-1">

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full xl:w-56 shrink-0">
                        <select
                            value={algo}
                            onChange={(e) => { setAlgo(e.target.value); }}
                            disabled={running}
                            className="sketch-box bg-stone-700 text-stone-100 font-semibold px-4 pr-10 py-2 outline-none cursor-pointer w-full text-base appearance-none hover:bg-stone-600 transition-colors shrink-0"
                        >
                            {Object.entries(ALGORITHMS).map(([key, name]) => (
                                <option key={key} value={key} className="bg-stone-800 text-stone-100">{name}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400 text-sm">expand_more</span>
                    </div>
                </div>

                <div className="hidden xl:block w-px h-8 bg-white/10"></div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 xl:gap-8 w-full xl:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-sm text-stone-400 font-bold uppercase tracking-widest whitespace-nowrap min-w-[80px]">Size: {size}</label>
                        <input
                            type="range"
                            min="10" max="120"
                            value={size}
                            onChange={handleSize}
                            disabled={running}
                            className="w-full sm:w-32 xl:w-40 accent-stone-300 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-sm text-stone-400 font-bold uppercase tracking-widest whitespace-nowrap min-w-[80px]">Speed: {speed}</label>
                        <input
                            type="range"
                            min="1" max="100"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            className="w-full sm:w-32 xl:w-40 accent-stone-300 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="hidden xl:block w-px h-8 bg-white/10"></div>

                <div className="flex items-center gap-3 justify-end mt-2 xl:mt-0 w-full xl:w-auto">
                    {running ? (
                      <button
                          onClick={stop}
                          className="btn btn-surface flex-1 xl:flex-none justify-center px-4 sketch-box bg-rose-900 hover:bg-rose-800 border-rose-700"
                          title="Stop"
                      >
                          <span className="material-symbols-outlined text-lg text-rose-300">stop</span>
                          <span className="text-rose-300 tracking-wide">Stop</span>
                      </button>
                    ) : (
                      <button
                          onClick={reset}
                          className="btn btn-surface flex-1 xl:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600"
                          title="Reset Array"
                      >
                          <span className="material-symbols-outlined text-lg text-stone-300">restart_alt</span>
                      </button>
                    )}
                    <button
                        onClick={run}
                        disabled={running}
                        className="btn btn-primary flex-1 xl:flex-none justify-center px-8"
                    >
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                        <span className="tracking-wide text-xl">Sort</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Done Banner */}
        {done && (
          <div className="absolute top-36 md:top-40 left-1/2 -translate-x-1/2 z-40 sketch-box bg-emerald-900 border-emerald-600 px-6 py-2 text-emerald-300 font-bold text-lg tracking-wide animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
            ✓ Sorted in {stats.comparisons} comparisons &amp; {stats.writes} writes
          </div>
        )}

        {/* Bars Container */}
        <div className="flex-1 w-full h-[60vh] md:h-full mt-32 md:mt-0 flex items-end justify-center gap-[2px] md:gap-1 max-w-7xl mx-auto pb-4 px-2 md:pl-8 md:pr-[22rem] z-10">
            {array.map((val, idx) => (
                <div
                    key={idx}
                    className={`bar ${colors[idx] || ''}`}
                    style={{ height: `${val}%` }}
                ></div>
            ))}
        </div>

        {/* Stats Sidebar */}
        <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-auto md:top-64 md:left-auto md:right-8 md:w-72 z-20 flex flex-col gap-2 md:gap-4 rotate-1">
             <button 
                onClick={() => setShowStudyGuide(true)}
                className="w-full sketch-box bg-stone-800 hover:bg-stone-700 text-stone-100 py-3 px-4 font-bold text-xl flex items-center justify-between transition-colors border-stone-500 shadow-lg group"
             >
                <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-400 group-hover:scale-110 transition-transform">menu_book</span>
                    Study Guide
                </span>
                <span className="material-symbols-outlined text-stone-500 text-sm">open_in_new</span>
             </button>

             <CollapsiblePanel title="Live Statistics" icon="monitoring" initialOpen={true} variant="mono">
                <div className="grid grid-cols-2 gap-4 w-full mb-2">
                    <div className="sketch-box bg-stone-700 p-3 text-center -rotate-1">
                        <div className="text-3xl font-black text-stone-100 mb-1">{stats.comparisons}</div>
                        <div className="text-sm text-stone-400 uppercase tracking-wider font-semibold">Compares</div>
                    </div>
                    <div className="sketch-box bg-stone-700 p-3 text-center rotate-1">
                        <div className="text-3xl font-black text-stone-100 mb-1">{stats.writes}</div>
                        <div className="text-sm text-stone-400 uppercase tracking-wider font-semibold">
                          {algo === 'merge' || algo === 'insertion' ? 'Writes' : 'Swaps'}
                        </div>
                    </div>
                </div>
             </CollapsiblePanel>

             <div className="hidden md:block">
                <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false} variant="editorial">
                    <div className="text-lg text-stone-300 leading-relaxed space-y-4 font-inter">
                        <div>
                            <strong className="text-stone-100 block text-4xl font-editorial italic mb-2 tracking-wide font-normal">{ALGORITHMS[algo as keyof typeof ALGORITHMS]}</strong>
                            <p className="mb-2 text-stone-400">{info?.desc}</p>
                        </div>

                        <div className="space-y-3 border-t border-stone-600 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-stone-400 font-medium">Time</span>
                                <span className="font-mono text-stone-100 bg-stone-700 px-2 py-0.5 rounded text-base border border-stone-600">{info?.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-400 font-medium">Space</span>
                                <span className="font-mono text-stone-100 bg-stone-700 px-2 py-0.5 rounded text-base border border-stone-600">{info?.space}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-400 font-medium">Stable?</span>
                                <span className={`font-mono px-2 py-0.5 rounded text-base border ${info?.stable === 'Yes' ? 'bg-emerald-900 text-emerald-300 border-emerald-700' : 'bg-rose-900 text-rose-300 border-rose-700'}`}>{info?.stable}</span>
                            </div>
                        </div>
                    </div>
                </CollapsiblePanel>
             </div>
        </div>

      </div>

      <StudyDrawer 
        isOpen={showStudyGuide} 
        onClose={() => setShowStudyGuide(false)} 
        contentKey={algo} 
      />
    </div>
  );
}
