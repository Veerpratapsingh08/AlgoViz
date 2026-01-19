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
  }, [size]); // No longer depends on running!

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
      <div className="flex-1 bg-[var(--bg-main)] relative p-4 pt-24 md:p-8 md:pt-32 flex flex-col items-center justify-end overflow-hidden">
        
        {/* Bars Container */}
        <div className="w-full h-full flex items-end justify-center gap-[1px] md:gap-[2px] max-w-7xl mx-auto pb-4 md:pb-8">
            {array.map((val, idx) => (
                <div 
                    key={idx}
                    className={`bar ${colors[idx] || ''}`}
                    style={{ height: `${val}%` }}
                ></div>
            ))}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl z-30">
            <div className="glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 p-4">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="relative w-full md:w-auto md:min-w-[140px]">
                        <select 
                            value={algo} 
                            onChange={(e) => setAlgo(e.target.value)}
                            disabled={running}
                            className="bg-transparent border-none text-[var(--text-white)] font-medium outline-none cursor-pointer w-full text-sm"
                        >
                            {Object.entries(ALGORITHMS).map(([key, name]) => (
                                <option key={key} value={key} className="bg-[var(--bg-surface)] text-white">{name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="hidden md:block w-px h-8 bg-white/10"></div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-xs text-[var(--text-muted)] font-bold uppercase hidden sm:block">Size</label>
                            <input 
                                type="range" 
                                min="10" max="100" 
                                value={size} 
                                onChange={handleSize}
                                disabled={running}
                                className="w-full md:w-32 accent-indigo-500"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <label className="text-xs text-[var(--text-muted)] font-bold uppercase hidden sm:block">Speed</label>
                            <input 
                                type="range" 
                                min="1" max="100" 
                                value={speed} 
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                disabled={running}
                                className="w-full md:w-32 accent-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-end border-t border-white/5 pt-3 md:border-0 md:pt-0">
                    <button 
                        onClick={reset} 
                        disabled={running}
                        className="btn btn-surface backdrop-blur-md flex-1 md:flex-none justify-center"
                    >
                        <span className="material-symbols-outlined text-lg">restart_alt</span>
                        <span className="md:hidden lg:inline">Reset</span>
                    </button>
                    <button 
                        onClick={run}
                        disabled={running}
                        className="btn btn-primary flex-1 md:flex-none justify-center"
                    >
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                        <span>Sort</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Sidebar (Collapsible) - Bottom on Mobile, Right on Desktop */}
        <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-auto md:top-28 md:left-auto md:right-8 md:w-72 z-20 flex flex-col gap-2 md:gap-4">
             <CollapsiblePanel title="Live Statistics" icon="monitoring" initialOpen={true}>
                <div className="grid grid-cols-2 gap-4 w-full mb-2 md:mb-4">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-2 md:p-3 text-center">
                        <div className="text-xl md:text-2xl font-bold font-mono text-white mb-1">{stats.comparisons}</div>
                        <div className="text-[10px] text-[var(--text-faint)] uppercase">Comparisons</div>
                    </div>
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-light)] rounded-xl p-2 md:p-3 text-center">
                        <div className="text-xl md:text-2xl font-bold font-mono text-white mb-1">{stats.swaps}</div>
                        <div className="text-[10px] text-[var(--text-faint)] uppercase">Swaps</div>
                    </div>
                </div>
             </CollapsiblePanel>

             <div className="hidden md:block">
                <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false}>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed space-y-4">
                        <div>
                            <strong className="text-indigo-400 block text-sm mb-1">{ALGORITHMS[algo as keyof typeof ALGORITHMS]}</strong>
                            <p className="mb-2">
                                {algo === 'quick' && "A divide-and-conquer algorithm that selects a 'pivot' element and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot."}
                                {algo === 'merge' && "A specific type of divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves."}
                                {algo === 'heap' && "A comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end."}
                                {algo === 'bubble' && "The simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order."}
                                {algo === 'insertion' && "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."}
                                {algo === 'selection' && "Sorts an array by repeatedly finding the minimum element (considering ascending order) from unsorted part and putting it at the beginning."}
                            </p>
                        </div>
                        
                        <div className="space-y-2 border-t border-white/5 pt-2">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-faint)]">Time Complexity</span>
                                <span className="font-mono text-white">
                                    {algo === 'quick' || algo === 'merge' || algo === 'heap' ? 'O(n log n)' : 'O(n²)'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-faint)]">Space Complexity</span>
                                <span className="font-mono text-white">
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
