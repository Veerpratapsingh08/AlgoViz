'use client';

import { useState, useRef } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import StudyDrawer from './StudyDrawer';
import { Pathfinder, Node, Step } from '@/lib/algorithms/pathfinding';

const ROWS = 20;
const COLS = 40;

const createNode = (row: number, col: number): Node => ({
  row, col,
  isWall: false, distance: Infinity, visited: false, parent: null,
});

const getInitialGrid = (): Node[][] => {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) row.push(createNode(r, c));
    grid.push(row);
  }
  return grid;
};

const ALGO_INFO: Record<string, { desc: string; guarantees: string; performance: string; weighted: string }> = {
  dijkstra: { desc: "Explores all reachable nodes by shortest distance. Guaranteed to find the shortest path in any weighted or unweighted graph.", guarantees: 'Shortest Path', performance: 'Moderate', weighted: 'Yes' },
  astar:    { desc: "Uses a heuristic (Manhattan distance) to guide search toward the target. Usually explores far fewer nodes than Dijkstra while still guaranteeing the shortest path.", guarantees: 'Shortest Path', performance: 'Fast', weighted: 'Yes' },
  bfs:      { desc: "Explores layer by layer, visiting all nodes at distance 1, then 2, etc. Guarantees the shortest path in unweighted grids.", guarantees: 'Shortest Path', performance: 'Moderate', weighted: 'No' },
  dfs:      { desc: "Dives deep along one path before backtracking. Very fast but does NOT guarantee the shortest path — it finds *a* path, not the best one.", guarantees: 'No Guarantee', performance: 'Variable', weighted: 'No' },
};

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState<Node[][]>(getInitialGrid);
  const [start, setStart] = useState({ r: 10, c: 5 });
  const [end, setEnd] = useState({ r: 10, c: 35 });
  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState<'wall' | 'moveStart' | 'moveEnd'>('wall');
  const [algo, setAlgo] = useState('dijkstra');
  const [running, setRunning] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const [pathLength, setPathLength] = useState<number | null>(null);

  const [stats, setStats] = useState({ visited: 0, pathLength: 0 });
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const clearCellClasses = () => {
    const cells = gridRef.current?.getElementsByClassName('grid-cell');
    if (cells) Array.from(cells).forEach(c => c.classList.remove('visited', 'path'));
  };

  const stopAnimation = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
    setRunning(false);
    setNoPath(false);
    setPathLength(null);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (running) return;
    setDrawing(true);
    setNoPath(false);

    if (row === start.r && col === start.c) setMode('moveStart');
    else if (row === end.r && col === end.c) setMode('moveEnd');
    else {
        setMode('wall');
        toggleWall(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!drawing || running) return;

    if (mode === 'moveStart') {
        if (row !== end.r || col !== end.c) setStart({ r: row, c: col });
    } else if (mode === 'moveEnd') {
        if (row !== start.r || col !== start.c) setEnd({ r: row, c: col });
    } else if (mode === 'wall') {
        toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setMode('wall');
  };

  const toggleWall = (r: number, c: number) => {
      if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;

      setGrid(prev => {
          const newGrid = [...prev];
          const row = [...newGrid[r]];
          row[c] = { ...row[c], isWall: !row[c].isWall };
          newGrid[r] = row;
          return newGrid;
      });
  };

  const clearGrid = () => {
      if (running) return;
      clearCellClasses();
      setGrid(getInitialGrid());
      setNoPath(false);
      setPathLength(null);
  };

  const clearPath = () => {
      if (running) return;
      clearCellClasses();
      setNoPath(false);
      setPathLength(null);
  };

  const visualize = () => {
      if (running) return;
      setRunning(true);
      setNoPath(false);
      setPathLength(null);
      clearCellClasses();

      const algoGrid = grid.map(row => row.map(node => ({ ...node, distance: Infinity, visited: false, parent: null, f: undefined, g: undefined, h: undefined })));
      const startNode = algoGrid[start.r][start.c];
      const endNode = algoGrid[end.r][end.c];

      let steps: Step[] = [];

      switch(algo) {
          case 'dijkstra': steps = Pathfinder.dijkstra(algoGrid, startNode, endNode); break;
          case 'astar':    steps = Pathfinder.aStar(algoGrid, startNode, endNode);    break;
          case 'bfs':      steps = Pathfinder.bfs(algoGrid, startNode, endNode);      break;
          case 'dfs':      steps = Pathfinder.dfs(algoGrid, startNode, endNode);      break;
      }

      animate(steps);
  };

  const animate = (steps: Step[]) => {
      const pathSteps = steps.filter(s => s.type === 'path');
      const hasPath = pathSteps.length > 0;

      steps.forEach((step, i) => {
          const t = setTimeout(() => {
             const cell = document.getElementById(`node-${step.row}-${step.col}`);
             if (cell) {
                 const isStart = step.row === start.r && step.col === start.c;
                 const isEnd = step.row === end.r && step.col === end.c;

                 if (step.type === 'visit' && !isStart && !isEnd) {
                     cell.classList.add('visited');
                 } else if (step.type === 'path' && !isStart && !isEnd) {
                     cell.classList.remove('visited');
                     cell.classList.add('path');
                 }
             }
             if (i === steps.length - 1) {
               setRunning(false);
               if (!hasPath) {
                 setNoPath(true);
               } else {
                 setPathLength(pathSteps.length - 2); // exclude start & end
               }
             }
          }, 10 * i);
          timers.current.push(t);
      });

      // If no steps at all, immediately report no path
      if (steps.length === 0) {
        setRunning(false);
        setNoPath(true);
      }
  };

  const generateMaze = () => {
      if (running) return;
      clearCellClasses();
      setNoPath(false);
      setPathLength(null);
      setGrid(prev => prev.map(row => row.map(node => {
           if ((node.row === start.r && node.col === start.c) || (node.row === end.r && node.col === end.c)) return { ...node, isWall: false };
           return { ...node, isWall: Math.random() < 0.3, visited: false, parent: null };
      })));
  };

  const info = ALGO_INFO[algo];

  return (
    <div className="flex flex-col h-full w-full relative">

       {/* Floating Controls Dock */}
       <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-[98%] max-w-7xl z-30">
            <div className="sketch-box bg-stone-800 flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 xl:gap-6 p-4 xl:px-8 xl:py-4 rotate-1">

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full xl:w-72 shrink-0">
                        <select
                           value={algo}
                           onChange={(e) => { setAlgo(e.target.value); clearPath(); }}
                           disabled={running}
                           className="sketch-box bg-stone-700 text-stone-100 font-semibold px-4 pr-10 py-2 outline-none cursor-pointer w-full text-base appearance-none hover:bg-stone-600 transition-colors shrink-0"
                       >
                           <option value="dijkstra" className="bg-stone-800 text-stone-100">Dijkstra&apos;s Algorithm</option>
                           <option value="astar" className="bg-stone-800 text-stone-100">A* Search</option>
                           <option value="bfs" className="bg-stone-800 text-stone-100">Breadth-First Search</option>
                           <option value="dfs" className="bg-stone-800 text-stone-100">Depth-First Search</option>
                       </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-stone-400 text-sm">expand_more</span>
                    </div>
                </div>

                <div className="hidden xl:block w-px h-8 bg-white/10"></div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-end mt-2 xl:mt-0 w-full xl:w-auto">
                    {running ? (
                      <button onClick={stopAnimation} className="btn flex-1 xl:flex-none justify-center px-4 sketch-box bg-rose-900 hover:bg-rose-800 border-rose-700">
                          <span className="material-symbols-outlined text-lg text-rose-300">stop</span>
                          <span className="text-rose-300 tracking-wide">Stop</span>
                      </button>
                    ) : (
                      <>
                        <button onClick={clearGrid} disabled={running} className="btn btn-surface flex-1 sm:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600" title="Clear Grid">
                            <span className="material-symbols-outlined text-lg text-stone-300">delete_sweep</span>
                        </button>
                        <button onClick={generateMaze} disabled={running} className="btn btn-surface flex-1 sm:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600" title="Generate Random Maze">
                            <span className="material-symbols-outlined text-lg text-stone-300">grid_goldenratio</span>
                        </button>
                      </>
                    )}
                    <button onClick={visualize} disabled={running} className="btn btn-primary flex-1 sm:flex-none justify-center px-8 w-full sm:w-auto">
                        <span className="material-symbols-outlined text-lg">explore</span>
                        <span className="tracking-wide text-xl">Find Path</span>
                    </button>
                </div>
            </div>
        </div>

       {/* No Path / Success Banner */}
       {noPath && (
         <div className="absolute top-36 md:top-40 left-1/2 -translate-x-1/2 z-40 sketch-box bg-rose-900 border-rose-600 px-6 py-2 text-rose-300 font-bold text-lg tracking-wide whitespace-nowrap">
           ✗ No path exists — the target is completely blocked!
         </div>
       )}
       {pathLength !== null && !noPath && (
         <div className="absolute top-36 md:top-40 left-1/2 -translate-x-1/2 z-40 sketch-box bg-emerald-900 border-emerald-600 px-6 py-2 text-emerald-300 font-bold text-lg tracking-wide whitespace-nowrap">
           ✓ Path found! Length: {pathLength} cells
         </div>
       )}

       {/* Sidebar Controls */}
       <div className="fixed bottom-4 left-4 right-4 md:absolute md:left-8 md:top-64 md:bottom-auto md:right-auto md:w-72 z-20 flex flex-col gap-2 md:gap-4 max-h-[40vh] md:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0 md:pr-2 pb-0 md:pb-4 -rotate-1">
             <button 
                onClick={() => setShowStudyGuide(true)}
                className="w-full sketch-box bg-stone-800 hover:bg-stone-700 text-stone-100 py-3 px-4 font-bold text-xl flex items-center justify-between transition-colors border-stone-500 shadow-lg group shrink-0"
             >
                <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-400 group-hover:scale-110 transition-transform">menu_book</span>
                    Study Guide
                </span>
                <span className="material-symbols-outlined text-stone-500 text-sm">open_in_new</span>
             </button>

           <CollapsiblePanel title="Legend" icon="help" initialOpen={true} variant="mono">
               <div className="text-lg text-stone-300 space-y-3 pt-2 font-inter">
                   <div className="flex items-center gap-4 p-2 sketch-box bg-stone-700"><span className="w-5 h-5 bg-[var(--node-start)] rounded-full border-2 border-stone-500 shrink-0"></span> Start Node</div>
                   <div className="flex items-center gap-4 p-2 sketch-box bg-stone-700"><span className="w-5 h-5 bg-[var(--node-end)] rounded-full border-2 border-stone-500 shrink-0"></span> Target Node</div>
                   <div className="flex items-center gap-4 p-2 sketch-box bg-stone-700"><span className="w-5 h-5 bg-[var(--node-wall)] border border-stone-500 shrink-0"></span> Wall (click &amp; drag)</div>
                   <div className="flex items-center gap-4 p-2 sketch-box bg-stone-700"><span className="w-5 h-5 bg-[var(--grid-visited)] border border-stone-500 shrink-0"></span> Visited Node</div>
                   <div className="flex items-center gap-4 p-2 sketch-box bg-stone-700"><span className="w-5 h-5 bg-[var(--grid-path)] rounded-full shrink-0"></span> Shortest Path</div>
               </div>
           </CollapsiblePanel>

            <div className="hidden md:block">
              <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false} variant="editorial">
                  <div className="text-lg text-stone-300 leading-relaxed space-y-4 font-inter">
                      <div>
                          <strong className="text-stone-100 block text-4xl font-editorial italic mb-2 font-normal tracking-wide">
                               {algo === 'dijkstra' && "Dijkstra's Algorithm"}
                               {algo === 'astar' && "A* Search"}
                               {algo === 'bfs' && "Breadth-First Search"}
                               {algo === 'dfs' && "Depth-First Search"}
                          </strong>
                          <p className="mb-2 text-stone-400">{info?.desc}</p>
                      </div>

                       <div className="space-y-3 border-t border-stone-600 pt-3">
                            <div className="flex justify-between items-center">
                               <span className="text-stone-400 font-medium">Performance</span>
                               <span className="font-mono text-stone-100 bg-stone-700 px-2 py-0.5 rounded text-base border border-stone-600">
                                   {info?.performance}
                               </span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-stone-400 font-medium">Weighted</span>
                               <span className={`font-mono px-2 py-0.5 rounded text-base border ${info?.weighted === 'Yes' ? 'bg-indigo-900 text-indigo-300 border-indigo-700' : 'bg-stone-700 text-stone-300 border-stone-600'}`}>{info?.weighted}</span>
                           </div>
                       </div>
                   </div>
              </CollapsiblePanel>
           </div>
       </div>

       {/* Grid Canvas */}
       <div className="flex-1 overflow-auto flex items-start md:items-center justify-start md:justify-center p-4 md:pr-8 md:pl-[22rem] pt-40 md:pt-48 custom-scrollbar relative z-10" onMouseUp={handleMouseUp}>
           <div
             ref={gridRef}
             className="grid gap-[2px] mx-auto my-auto p-[2px] rounded-xl sketch-box bg-stone-800"
             style={{
                 gridTemplateColumns: `repeat(${COLS}, 28px)`,
                 gridTemplateRows: `repeat(${ROWS}, 28px)`
             }}
           >
               {grid.map((row, r) => (
                   row.map((node, c) => {
                       let extraClass = '';
                       if (r === start.r && c === start.c) extraClass = 'start';
                       else if (r === end.r && c === end.c) extraClass = 'end';
                       else if (node.isWall) extraClass = 'wall';

                       return (
                           <div
                               key={`${r}-${c}`}
                               id={`node-${r}-${c}`}
                               className={`grid-cell ${extraClass}`}
                               onMouseDown={() => handleMouseDown(r, c)}
                               onMouseEnter={() => handleMouseEnter(r, c)}
                           ></div>
                       );
                   })
               ))}
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
