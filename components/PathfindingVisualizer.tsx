'use client';

import { useState, useRef } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
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

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState<Node[][]>(getInitialGrid);
  const [start, setStart] = useState({ r: 10, c: 10 });
  const [end, setEnd] = useState({ r: 10, c: 30 });
  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState<'wall' | 'moveStart' | 'moveEnd'>('wall');
  const [algo, setAlgo] = useState('dijkstra');
  const [running, setRunning] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (row: number, col: number) => {
    if (running) return;
    setDrawing(true);
    
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
      const cells = gridRef.current?.getElementsByClassName('grid-cell');
      if (cells) Array.from(cells).forEach(c => c.classList.remove('visited', 'path'));
      setGrid(getInitialGrid());
  };

  const visualize = () => {
      if (running) return;
      setRunning(true);
      
      const cells = gridRef.current?.getElementsByClassName('grid-cell');
      if (cells) Array.from(cells).forEach(c => c.classList.remove('visited', 'path'));

      const algoGrid = grid.map(row => row.map(node => ({ ...node, distance: Infinity, visited: false, parent: null })));
      const startNode = algoGrid[start.r][start.c];
      const endNode = algoGrid[end.r][end.c];

      let steps: Step[] = [];
      
      switch(algo) {
          case 'dijkstra': steps = Pathfinder.dijkstra(algoGrid, startNode, endNode); break;
          case 'astar': steps = Pathfinder.aStar(algoGrid, startNode, endNode); break;
          case 'bfs': steps = Pathfinder.bfs(algoGrid, startNode, endNode); break;
          case 'dfs': steps = Pathfinder.dfs(algoGrid, startNode, endNode); break;
      }

      animate(steps);
  };

  const animate = (steps: Step[]) => {
      steps.forEach((step, i) => {
          setTimeout(() => {
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
             if (i === steps.length - 1) setRunning(false);
          }, 10 * i);
      });
  };

  const generateMaze = () => {
      if (running) return;
      clearGrid();
      setGrid(prev => prev.map(row => row.map(node => {
           if ((node.row === start.r && node.col === start.c) || (node.row === end.r && node.col === end.c)) return node;
           return { ...node, isWall: Math.random() < 0.3 };
      })));
  };

  return (
    <div className="flex flex-col h-full w-full relative">
       
       {/* Floating Controls Dock */}
       <div className="absolute top-24 md:top-28 left-1/2 transform -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-30 animate-[slideUp_0.5s_ease-out]">
            <div className="glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 md:px-8 md:py-4 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] bg-slate-900/60 backdrop-blur-2xl">
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select 
                           value={algo}
                           onChange={(e) => setAlgo(e.target.value)}
                           disabled={running}
                           className="bg-white/5 border border-white/10 text-white font-semibold rounded-xl px-4 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-white/10 transition-colors"
                       >
                           <option value="dijkstra" className="bg-slate-900 text-white">Dijkstra&apos;s Algorithm</option>
                           <option value="astar" className="bg-slate-900 text-white">A* Search</option>
                           <option value="bfs" className="bg-slate-900 text-white">Breadth-First Search</option>
                           <option value="dfs" className="bg-slate-900 text-white">Depth-First Search</option>
                       </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 text-sm">expand_more</span>
                    </div>
                </div>

                <div className="hidden md:block w-px h-8 bg-white/10"></div>

                <div className="flex items-center gap-3 justify-end mt-2 md:mt-0">
                    <button onClick={clearGrid} disabled={running} className="btn btn-surface flex-1 md:flex-none justify-center px-4" title="Clear Grid">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                    <button onClick={generateMaze} disabled={running} className="btn btn-surface flex-1 md:flex-none justify-center px-4" title="Generate Random Maze">
                        <span className="material-symbols-outlined text-lg">grid_goldenratio</span>
                    </button>
                    <button onClick={visualize} disabled={running} className="btn btn-primary flex-1 md:flex-none justify-center px-8 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-gradient-to-r from-cyan-500 to-blue-600">
                        <span className="material-symbols-outlined text-lg">explore</span>
                        <span className="tracking-wide">Find Path</span>
                    </button>
                </div>
            </div>
        </div>

       {/* Sidebar Controls - Bottom on mobile, Left on desktop */}
       <div className="fixed bottom-4 left-4 right-4 md:absolute md:left-8 md:top-48 md:bottom-auto md:right-auto md:w-72 z-20 flex flex-col gap-2 md:gap-4 max-h-[40vh] md:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0 md:pr-2 pb-0 md:pb-4 animate-[fadeIn_0.8s_ease-out]">
           
           <CollapsiblePanel title="Legend" icon="help" initialOpen={true}>
               <div className="text-xs text-slate-300 space-y-3 pt-2">
                   <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/5"><span className="w-5 h-5 bg-[var(--node-start)] rounded-full shadow-[0_0_10px_var(--node-start)] animate-pulseGlow"></span> Start Node</div>
                   <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/5"><span className="w-5 h-5 bg-[var(--node-end)] rounded-full shadow-[0_0_10px_var(--node-end)] animate-pulseGlow"></span> Target Node</div>
                   <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/5"><span className="w-5 h-5 bg-[var(--node-wall)] rounded-md border border-slate-600"></span> Wall</div>
                   <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/5"><span className="w-5 h-5 bg-[var(--grid-visited)] border border-cyan-500/30 rounded-md"></span> Visited Node</div>
                   <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg border border-white/5"><span className="w-5 h-5 bg-[var(--grid-path)] rounded-md shadow-[0_0_10px_var(--grid-path)]"></span> Shortest Path</div>
               </div>
           </CollapsiblePanel>

           <div className="hidden md:block">
              <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false}>
                    <div className="text-xs text-slate-300 leading-relaxed space-y-4">
                       <div>
                           <strong className="text-cyan-400 block text-sm mb-2 font-bold tracking-wide">
                               {algo === 'dijkstra' && "Dijkstra's Algorithm"}
                               {algo === 'astar' && "A* Search"}
                               {algo === 'bfs' && "Breadth-First Search"}
                               {algo === 'dfs' && "Depth-First Search"}
                           </strong>
                           <p className="mb-2 font-light">
                                {algo === 'dijkstra' && "The father of pathfinding algorithms; guarantees the shortest path. It explores all neighbors equally, expanding outward like a shockwave."}
                                {algo === 'astar' && "Changes the 'shockwave' into a directed beam by using a heuristic (estimate) to prioritize nodes closer to the target. Usually faster than Dijkstra."}
                                {algo === 'bfs' && "Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Guarantees shortest path in unweighted graphs."}
                                {algo === 'dfs' && "Explores as far as possible along each branch before backtracking. Does NOT guarantee shortest path and can get lost in infinite grids."}
                           </p>
                       </div>
                       
                       <div className="space-y-3 border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                               <span className="text-slate-400 font-medium">Performance</span>
                               <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                   {algo === 'astar' ? 'Fastest' : algo === 'dfs' ? 'Variable' : 'Moderate'}
                               </span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-slate-400 font-medium">Shortest Path?</span>
                               <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                   {algo === 'dfs' ? 'No' : 'Yes'}
                               </span>
                           </div>
                       </div>
                   </div>
              </CollapsiblePanel>
           </div>
       </div>

       {/* Grid Canvas */}
       <div className="flex-1 overflow-auto flex items-start md:items-center justify-start md:justify-center p-4 md:p-8 pt-40 md:pt-48 custom-scrollbar relative z-10" onMouseUp={handleMouseUp}>
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px]"></div>
            </div>

           <div 
             ref={gridRef}
             className="grid gap-[2px] bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto my-auto p-[2px] rounded-xl backdrop-blur-sm"
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
    </div>
  );
}
