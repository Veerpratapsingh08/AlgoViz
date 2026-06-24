'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sort, Step } from '@/lib/algorithms/sorting';

const ALGORITHMS = {
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
};

export default function RaceVisualizer() {
  const [baseArray, setBaseArray] = useState<number[]>([]);
  
  const [array1, setArray1] = useState<number[]>([]);
  const [algo1, setAlgo1] = useState<string>('quick');
  const [stats1, setStats1] = useState({ comparisons: 0, writes: 0 });
  const [colors1, setColors1] = useState<{[key: number]: string}>({});
  const [done1, setDone1] = useState<boolean>(false);
  
  const [array2, setArray2] = useState<number[]>([]);
  const [algo2, setAlgo2] = useState<string>('bubble');
  const [stats2, setStats2] = useState({ comparisons: 0, writes: 0 });
  const [colors2, setColors2] = useState<{[key: number]: string}>({});
  const [done2, setDone2] = useState<boolean>(false);

  const [size, setSize] = useState<number>(40);
  const [speed, setSpeed] = useState<number>(50);
  const [running, setRunning] = useState<boolean>(false);
  const [winner, setWinner] = useState<1 | 2 | 'tie' | null>(null);

  const timers1 = useRef<NodeJS.Timeout[]>([]);
  const timers2 = useRef<NodeJS.Timeout[]>([]);
  const runningRef = useRef(running);

  useEffect(() => { runningRef.current = running; }, [running]);

  const clearTimers = () => {
    timers1.current.forEach(t => clearTimeout(t));
    timers1.current = [];
    timers2.current.forEach(t => clearTimeout(t));
    timers2.current = [];
  };

  const reset = useCallback(() => {
    if (runningRef.current) return;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setBaseArray(arr);
    setArray1([...arr]);
    setArray2([...arr]);
    setColors1({});
    setColors2({});
    setStats1({ comparisons: 0, writes: 0 });
    setStats2({ comparisons: 0, writes: 0 });
    setDone1(false);
    setDone2(false);
    setWinner(null);
  }, [size]);

  const stop = () => {
    clearTimers();
    setRunning(false);
    setColors1({});
    setColors2({});
  };

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => { return () => clearTimers(); }, []);

  const handleSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (running) return;
    const val = parseInt(e.target.value);
    setSize(val);
    const arr = Array.from({ length: val }, () => Math.floor(Math.random() * 95) + 5);
    setBaseArray(arr);
    setArray1([...arr]);
    setArray2([...arr]);
    setColors1({});
    setColors2({});
    setDone1(false);
    setDone2(false);
    setWinner(null);
  };

  const getSteps = (algo: string, arr: number[]) => {
    switch (algo) {
      case 'bubble':    return Sort.bubble(arr);
      case 'selection': return Sort.selection(arr);
      case 'insertion': return Sort.insertion(arr);
      case 'merge':     return Sort.merge(arr);
      case 'quick':     return Sort.quick(arr);
      case 'heap':      return Sort.heap(arr);
      default:          return [];
    }
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    setDone1(false);
    setDone2(false);
    setWinner(null);
    setStats1({ comparisons: 0, writes: 0 });
    setStats2({ comparisons: 0, writes: 0 });
    clearTimers();

    setArray1([...baseArray]);
    setArray2([...baseArray]);

    const steps1 = getSteps(algo1, [...baseArray]);
    const steps2 = getSteps(algo2, [...baseArray]);

    if (steps1.length < steps2.length) setWinner(1);
    else if (steps2.length < steps1.length) setWinner(2);
    else setWinner('tie');

    animate(steps1, 1);
    animate(steps2, 2);
  };

  const animate = (steps: Step[], player: 1 | 2) => {
    const isP1 = player === 1;
    const setArray = isP1 ? setArray1 : setArray2;
    const setStats = isP1 ? setStats1 : setStats2;
    const setColors = isP1 ? setColors1 : setColors2;
    const setDone = isP1 ? setDone1 : setDone2;
    const timers = isP1 ? timers1 : timers2;
    
    if (steps.length === 0) { 
        setDone(true); 
        if (isP1) {
            if (done2) setRunning(false);
        } else {
            if (done1) setRunning(false);
        }
        return; 
    }

    const delay = Math.max(1, 101 - speed);
    const arrCopy = [...baseArray];
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
          setDone(true);
          setColors(() => {
            const final: {[key: number]: string} = {};
            arrCopy.forEach((_, k) => final[k] = 'sorted');
            return final;
          });
          
          if (isP1) {
             setDone2((d2) => { if (d2) setRunning(false); return d2; });
          } else {
             setDone1((d1) => { if (d1) setRunning(false); return d1; });
          }
        }
      }, i * delay);

      timers.current.push(t);
    });
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-[var(--bg-main)]">
      
      {/* Floating Controls Dock */}
      <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-[98%] max-w-6xl z-30">
          <div className="sketch-box bg-stone-800 flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 xl:gap-6 p-4 xl:px-8 xl:py-4 -rotate-1">
              
              {/* Algos Selection */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  <div className="relative w-full sm:w-48 shrink-0">
                      <select
                          value={algo1}
                          onChange={(e) => { setAlgo1(e.target.value); }}
                          disabled={running}
                          className="sketch-box bg-stone-700 text-stone-100 font-bold px-4 pr-10 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-stone-600 transition-colors border-rose-600"
                      >
                          {Object.entries(ALGORITHMS).map(([key, name]) => (
                              <option key={key} value={key} className="bg-stone-800 text-stone-100">{name}</option>
                          ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400 text-sm">expand_more</span>
                  </div>
                  
                  <span className="text-stone-400 font-bold italic hidden sm:block text-xl">VS</span>
                  
                  <div className="relative w-full sm:w-48 shrink-0">
                      <select
                          value={algo2}
                          onChange={(e) => { setAlgo2(e.target.value); }}
                          disabled={running}
                          className="sketch-box bg-stone-700 text-stone-100 font-bold px-4 pr-10 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-stone-600 transition-colors border-sky-600"
                      >
                          {Object.entries(ALGORITHMS).map(([key, name]) => (
                              <option key={key} value={key} className="bg-stone-800 text-stone-100">{name}</option>
                          ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400 text-sm">expand_more</span>
                  </div>
              </div>

              <div className="hidden lg:block w-px h-8 bg-white/10"></div>

              {/* Sliders */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 xl:gap-8 w-full lg:w-auto">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-xs text-stone-400 font-bold uppercase tracking-widest whitespace-nowrap min-w-[60px]">Size: {size}</label>
                      <input
                          type="range"
                          min="10" max="100"
                          value={size}
                          onChange={handleSize}
                          disabled={running}
                          className="w-full sm:w-24 xl:w-32 accent-stone-300 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-xs text-stone-400 font-bold uppercase tracking-widest whitespace-nowrap min-w-[60px]">Speed: {speed}</label>
                      <input
                          type="range"
                          min="1" max="100"
                          value={speed}
                          onChange={(e) => setSpeed(parseInt(e.target.value))}
                          className="w-full sm:w-24 xl:w-32 accent-stone-300 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>
              </div>

              <div className="hidden lg:block w-px h-8 bg-white/10"></div>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-center mt-2 lg:mt-0 w-full lg:w-auto">
                  {running ? (
                    <button onClick={stop} className="btn btn-surface flex-1 lg:flex-none justify-center px-4 sketch-box bg-rose-900 hover:bg-rose-800 border-rose-700" title="Stop">
                        <span className="material-symbols-outlined text-lg text-rose-300">stop</span>
                    </button>
                  ) : (
                    <button onClick={reset} className="btn btn-surface flex-1 lg:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600" title="Reset Array">
                        <span className="material-symbols-outlined text-lg text-stone-300">restart_alt</span>
                    </button>
                  )}
                  <button onClick={run} disabled={running} className="btn btn-primary flex-1 lg:flex-none justify-center px-8 bg-amber-600 hover:bg-amber-500 text-stone-900">
                      <span className="material-symbols-outlined text-lg">flag</span>
                      <span className="tracking-wide text-xl font-black uppercase">Race</span>
                  </button>
              </div>
          </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex flex-col pt-40 md:pt-44 px-4 md:px-8 pb-8 gap-4 overflow-hidden">
          
          {/* Top Canvas (Algo 1) */}
          <div className="flex-1 sketch-box bg-[#1a1a1a] p-4 flex flex-col relative overflow-hidden group">
              <div className="absolute top-4 left-6 z-20 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                  <h2 className="text-2xl font-black text-rose-400 uppercase tracking-widest">{ALGORITHMS[algo1 as keyof typeof ALGORITHMS]}</h2>
                  <div className="flex gap-3 text-stone-400 text-xs sm:text-sm font-mono bg-stone-900/80 px-3 py-1 rounded">
                      <span>Cmp: <strong className="text-stone-200">{stats1.comparisons}</strong></span>
                      <span>Swp: <strong className="text-stone-200">{stats1.writes}</strong></span>
                  </div>
              </div>
              
              {done1 && winner === 1 && (
                  <div className="absolute top-4 right-6 z-20 text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined">emoji_events</span> Winner
                  </div>
              )}
              {done1 && winner === 2 && (
                  <div className="absolute top-4 right-6 z-20 text-stone-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      Finished
                  </div>
              )}

              <div className="flex-1 w-full h-full flex items-end justify-center gap-[1px] sm:gap-[2px] max-w-7xl mx-auto z-10 pt-16">
                  {array1.map((val, idx) => (
                      <div
                          key={idx}
                          className={`bar ${colors1[idx] || ''} ${done1 && winner === 1 ? 'bg-emerald-500 border-emerald-400' : ''}`}
                          style={{ height: `${val}%` }}
                      ></div>
                  ))}
              </div>
          </div>

          {/* Bottom Canvas (Algo 2) */}
          <div className="flex-1 sketch-box bg-[#1a1a1a] p-4 flex flex-col relative overflow-hidden group">
              <div className="absolute top-4 left-6 z-20 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                  <h2 className="text-2xl font-black text-sky-400 uppercase tracking-widest">{ALGORITHMS[algo2 as keyof typeof ALGORITHMS]}</h2>
                  <div className="flex gap-3 text-stone-400 text-xs sm:text-sm font-mono bg-stone-900/80 px-3 py-1 rounded">
                      <span>Cmp: <strong className="text-stone-200">{stats2.comparisons}</strong></span>
                      <span>Swp: <strong className="text-stone-200">{stats2.writes}</strong></span>
                  </div>
              </div>

              {done2 && winner === 2 && (
                  <div className="absolute top-4 right-6 z-20 text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined">emoji_events</span> Winner
                  </div>
              )}
              {done2 && winner === 1 && (
                  <div className="absolute top-4 right-6 z-20 text-stone-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      Finished
                  </div>
              )}

              <div className="flex-1 w-full h-full flex items-end justify-center gap-[1px] sm:gap-[2px] max-w-7xl mx-auto z-10 pt-16">
                  {array2.map((val, idx) => (
                      <div
                          key={idx}
                          className={`bar ${colors2[idx] || ''} ${done2 && winner === 2 ? 'bg-emerald-500 border-emerald-400' : ''}`}
                          style={{ height: `${val}%` }}
                      ></div>
                  ))}
              </div>
          </div>
          
      </div>
      
      {/* Race Winner Overlay Banner */}
      {done1 && done2 && !running && winner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 sketch-box bg-stone-900 border-amber-500 border-4 p-8 flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)] -rotate-2">
              <span className="material-symbols-outlined text-6xl text-amber-500 mb-2">emoji_events</span>
              <h1 className="text-4xl font-black text-stone-100 uppercase tracking-widest text-center">
                 {winner === 'tie' ? "It's a Tie!" : `${ALGORITHMS[(winner === 1 ? algo1 : algo2) as keyof typeof ALGORITHMS]} Wins!`}
              </h1>
              {winner !== 'tie' && (
                  <p className="text-stone-400 mt-2 text-lg">
                      Faster by <strong className="text-stone-200">
                          {Math.abs(getSteps(algo1, [...baseArray]).length - getSteps(algo2, [...baseArray]).length)}
                      </strong> operations
                  </p>
              )}
              <button onClick={reset} className="mt-6 btn btn-primary px-8 py-2 text-lg">Race Again</button>
          </div>
      )}
      
    </div>
  );
}
