'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import { Sort, Step } from '@/lib/algorithms/sorting';

const ALGORITHMS = {
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
};

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [algo, setAlgo] = useState<string>('merge');
  const [size, setSize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const [running, setRunning] = useState<boolean>(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [colors, setColors] = useState<{[key: number]: string}>({});
  
  const timers = useRef<NodeJS.Timeout[]>([]);
  const runningRef = useRef(running);
  
  // Keep ref in sync with state
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const clearTimers = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
  };

  const reset = useCallback(() => {
    if (runningRef.current) return;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setArray(arr);
    setColors({});
    setStats({ comparisons: 0, swaps: 0 });
  }, [size]);

  // Initialize on mount and when size changes
  useEffect(() => {
    reset();
  }, [reset]);
  
  // Cleanup timers on unmount only
  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (running) return;
    const val = parseInt(e.target.value);
    setSize(val);
    setArray(Array.from({ length: val }, () => Math.floor(Math.random() * 95) + 5));
    setColors({});
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    setStats({ comparisons: 0, swaps: 0 });
    clearTimers();

    let steps: Step[] = [];
    switch (algo) {
      case 'bubble': steps = Sort.bubble(array); break;
      case 'selection': steps = Sort.selection(array); break;
      case 'insertion': steps = Sort.insertion(array); break;
      case 'merge': steps = Sort.merge(array); break;
      case 'quick': steps = Sort.quick(array); break;
      case 'heap': steps = Sort.heap(array); break;
    }

    animate(steps);
  };

  const animate = (steps: Step[]) => {
    if (steps.length === 0) {
        setRunning(false);
        return;
    }

    const delay = Math.max(1, 100 - speed);
    const arrCopy = [...array];
    let cmp = 0;
    let swp = 0;

    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        // Handle array mutations first
        if (step.type === 'swap') {
          swp++;
          const [a, b] = step.idx;
          if (step.val) {
            arrCopy[a] = step.val[0];
            arrCopy[b] = step.val[1];
          } else {
            [arrCopy[a], arrCopy[b]] = [arrCopy[b], arrCopy[a]];
          }
          setArray([...arrCopy]);
        } else if (step.type === 'overwrite') {
          swp++;
          arrCopy[step.idx] = step.val;
          setArray([...arrCopy]);
        } else if (step.type === 'compare') {
          cmp++;
        }
        
        // Update stats
        setStats({ comparisons: cmp, swaps: swp });
        
        // Update colors
        setColors(prev => {
          const next: {[key: number]: string} = {};
          
          // Persist sorted state
          Object.keys(prev).forEach(k => {
            if (prev[parseInt(k)] === 'sorted') next[parseInt(k)] = 'sorted';
          });

          if (step.type === 'compare') {
            step.idx.forEach(idx => next[idx] = 'comparing');
          } else if (step.type === 'swap') {
            step.idx.forEach(idx => next[idx] = 'swapping');
          } else if (step.type === 'overwrite') {
            next[step.idx] = 'swapping';
          } else if (step.type === 'sorted') {
            next[step.idx] = 'sorted';
          }
          
          return next;
        });

        // Handle completion
        if (i === steps.length - 1) {
          setRunning(false);
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

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Sorting Canvas */}
      <div className="flex-1 relative p-4 pt-40 md:pt-48 flex flex-col items-center justify-end overflow-hidden custom-scrollbar">
        
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute bottom-[0%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-500/5 blur-[150px]"></div>
        </div>

        {/* Floating Controls Dock */}
        <div className="absolute top-24 md:top-28 left-1/2 transform -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-30 animate-[slideUp_0.5s_ease-out]">
            <div className="glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 p-4 md:px-8 md:py-4 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] bg-slate-900/60 backdrop-blur-2xl">
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select 
                            value={algo} 
                            onChange={(e) => setAlgo(e.target.value)}
                            disabled={running}
                            className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl px-4 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-white/10 transition-colors"
                        >
                            {Object.entries(ALGORITHMS).map(([key, name]) => (
                                <option key={key} value={key} className="bg-slate-900 text-white">{name}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 text-sm">expand_more</span>
                    </div>
                </div>
                
                <div className="hidden md:block w-px h-8 bg-white/10"></div>
                
                <div className="flex items-center justify-between gap-6 w-full md:w-auto">
                    <div className="flex items-center gap-3 flex-1 md:flex-none">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden lg:block">Size</label>
                        <input 
                            type="range" 
                            min="10" max="100" 
                            value={size} 
                            onChange={handleSize}
                            disabled={running}
                            className="w-full md:w-28 accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 flex-1 md:flex-none">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden lg:block">Speed</label>
                        <input 
                            type="range" 
                            min="1" max="100" 
                            value={speed} 
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            disabled={running}
                            className="w-full md:w-28 accent-indigo-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="hidden md:block w-px h-8 bg-white/10"></div>

                <div className="flex items-center gap-3 justify-end mt-2 md:mt-0">
                    <button 
                        onClick={reset} 
                        disabled={running}
                        className="btn btn-surface flex-1 md:flex-none justify-center px-4"
                        title="Reset Array"
                    >
                        <span className="material-symbols-outlined text-lg">restart_alt</span>
                    </button>
                    <button 
                        onClick={run}
                        disabled={running}
                        className="btn btn-primary flex-1 md:flex-none justify-center px-8 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                        <span className="tracking-wide">Sort</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Bars Container */}
        <div className="w-full h-full flex items-end justify-center gap-[2px] md:gap-1 max-w-7xl mx-auto pb-4 px-2 md:px-8 z-10">
            {array.map((val, idx) => (
                <div 
                    key={idx}
                    className={`bar ${colors[idx] || ''}`}
                    style={{ height: `${val}%` }}
                ></div>
            ))}
        </div>

        {/* Stats Sidebar (Collapsible) - Bottom on Mobile, Right on Desktop */}
        <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-auto md:top-48 md:left-auto md:right-8 md:w-72 z-20 flex flex-col gap-2 md:gap-4 animate-[fadeIn_0.8s_ease-out]">
             <CollapsiblePanel title="Live Statistics" icon="monitoring" initialOpen={true}>
                <div className="grid grid-cols-2 gap-4 w-full mb-2">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center shadow-inner">
                        <div className="text-2xl font-black font-mono text-indigo-300 mb-1 drop-shadow-md">{stats.comparisons}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Comparisons</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center shadow-inner">
                        <div className="text-2xl font-black font-mono text-cyan-300 mb-1 drop-shadow-md">{stats.swaps}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Swaps</div>
                    </div>
                </div>
             </CollapsiblePanel>

             <div className="hidden md:block">
                <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false}>
                    <div className="text-xs text-slate-300 leading-relaxed space-y-4">
                        <div>
                            <strong className="text-indigo-400 block text-sm mb-2 font-bold tracking-wide">{ALGORITHMS[algo as keyof typeof ALGORITHMS]}</strong>
                            <p className="mb-2 font-light">
                                {algo === 'quick' && "A divide-and-conquer algorithm that selects a 'pivot' element and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot."}
                                {algo === 'merge' && "A specific type of divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves."}
                                {algo === 'heap' && "A comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end."}
                                {algo === 'bubble' && "The simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order."}
                                {algo === 'insertion' && "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."}
                                {algo === 'selection' && "Sorts an array by repeatedly finding the minimum element (considering ascending order) from unsorted part and putting it at the beginning."}
                            </p>
                        </div>
                        
                        <div className="space-y-3 border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Time Complexity</span>
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                    {algo === 'quick' || algo === 'merge' || algo === 'heap' ? 'O(n log n)' : 'O(n²)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Space Complexity</span>
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                    {algo === 'merge' ? 'O(n)' : algo === 'quick' ? 'O(log n)' : 'O(1)'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CollapsiblePanel>
             </div>
        </div>

      </div>
    </div>
  );
}
