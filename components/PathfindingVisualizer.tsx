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

      // Create algorithm-ready grid copy (resetting stateful props)
      // Preserving 'isWall' but resetting 'distance', 'visited', 'parent'
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
       {/* Sidebar Controls */}
       <div className="absolute left-8 top-28 w-72 z-20 flex flex-col gap-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-2 pb-4">
           <CollapsiblePanel title="Configuration" icon="settings" initialOpen={true}>
               <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                       <label className="text-xs text-[var(--text-muted)] font-bold uppercase">Algorithm</label>
                       <select 
                           value={algo}
                           onChange={(e) => setAlgo(e.target.value)}
                           disabled={running}
                           className="bg-[var(--bg-surface)] text-white p-2 rounded-lg border border-[var(--border-light)] outline-none"
                       >
                           <option value="dijkstra">Dijkstra&apos;s Algorithm</option>
                           <option value="astar">A* Search</option>
                           <option value="bfs">Breadth-First Search</option>
                           <option value="dfs">Depth-First Search</option>
                       </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                       <button onClick={visualize} disabled={running} className="btn btn-primary col-span-2">
                           Visualize
                       </button>
                       <button onClick={generateMaze} disabled={running} className="btn btn-surface text-xs">Gen Maze</button>
                       <button onClick={clearGrid} disabled={running} className="btn btn-surface text-xs">Clear</button>
                   </div>
               </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="Legend" icon="help" initialOpen={true}>
               <div className="text-xs text-[var(--text-muted)] space-y-2">
                   <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[var(--node-start)] rounded-md"></span> Start Node</div>
                   <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[var(--node-end)] rounded-md"></span> Target Node</div>
                   <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[var(--node-wall)] rounded-md"></span> Wall</div>
                   <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[var(--node-visited)] rounded-md opacity-50"></span> Visited</div>
                   <div className="flex items-center gap-3"><span className="w-4 h-4 bg-[var(--node-shortest)] rounded-md"></span> Shortest Path</div>
               </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="Algorithm Details" icon="info" initialOpen={false}>
                 <div className="text-xs text-[var(--text-muted)] leading-relaxed space-y-4">
                    <div>
                        <strong className="text-indigo-400 block text-sm mb-1">
                            {algo === 'dijkstra' && "Dijkstra's Algorithm"}
                            {algo === 'astar' && "A* Search"}
                            {algo === 'bfs' && "Breadth-First Search"}
                            {algo === 'dfs' && "Depth-First Search"}
                        </strong>
                        <p className="mb-2">
                             {algo === 'dijkstra' && "The father of pathfinding algorithms; guarantees the shortest path. It explores all neighbors equally, expanding outward like a shockwave."}
                             {algo === 'astar' && "Changes the 'shockwave' into a directed beam by using a heuristic (estimate) to prioritize nodes closer to the target. Usually faster than Dijkstra."}
                             {algo === 'bfs' && "Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Guarantees shortest path in unweighted graphs."}
                             {algo === 'dfs' && "Explores as far as possible along each branch before backtracking. Does NOT guarantee shortest path and can get lost in infinite grids."}
                        </p>
                    </div>
                    
                    <div className="space-y-2 border-t border-white/5 pt-2">
                         <div className="flex justify-between">
                            <span className="text-[var(--text-faint)]">Performance</span>
                            <span className="font-mono text-white">
                                {algo === 'astar' ? 'Fastest' : algo === 'dfs' ? 'Variable' : 'Moderate'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-faint)]">Shortest Path?</span>
                            <span className="font-mono text-white">
                                {algo === 'dfs' ? 'No' : 'Yes'}
                            </span>
                        </div>
                    </div>
                </div>
           </CollapsiblePanel>
       </div>

       {/* Grid Canvas */}
       <div className="flex-1 bg-[var(--bg-canvas)] flex items-center justify-center p-8 pt-20" onMouseUp={handleMouseUp}>
           <div 
             ref={gridRef}
             className="grid gap-[1px] bg-[var(--border-light)] border border-[var(--border-light)] shadow-2xl"
             style={{ 
                 gridTemplateColumns: `repeat(${COLS}, 30px)`,
                 gridTemplateRows: `repeat(${ROWS}, 30px)`
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
                               className={`grid-cell w-[30px] h-[30px] ${extraClass}`}
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
