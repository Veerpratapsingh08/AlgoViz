'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { GraphNode, GraphEdge, GraphAlgorithms, GraphStep } from '@/lib/algorithms/graphs';
import StudyDrawer from '@/components/StudyDrawer';

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  
  const [draggingEdge, setDraggingEdge] = useState<{fromId: string, x: number, y: number} | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);
  
  const [algo, setAlgo] = useState<'kruskal' | 'dijkstra'>('kruskal');
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [studyOpen, setStudyOpen] = useState(false);
  
  // Visual state
  const [edgeColors, setEdgeColors] = useState<{[key: string]: string}>({});
  const [nodeColors, setNodeColors] = useState<{[key: string]: string}>({});
  const timers = useRef<NodeJS.Timeout[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const loadGraph = (type: 'constellation' | 'k4' | 'star') => {
    clearAll();
    const w = window.innerWidth;
    const cx = w > 768 ? 400 : w / 2;
    const cy = 250;
    
    if (type === 'constellation') {
      const n = [
        { id: '1', x: cx - 100, y: cy - 100 },
        { id: '2', x: cx + 50, y: cy - 120 },
        { id: '3', x: cx + 150, y: cy },
        { id: '4', x: cx + 50, y: cy + 120 },
        { id: '5', x: cx - 100, y: cy + 100 },
        { id: '6', x: cx - 200, y: cy }
      ];
      setNodes(n);
      setEdges([
        { id: 'e_1_2', from: '1', to: '2', weight: 4 },
        { id: 'e_2_3', from: '2', to: '3', weight: 3 },
        { id: 'e_3_4', from: '3', to: '4', weight: 5 },
        { id: 'e_4_5', from: '4', to: '5', weight: 2 },
        { id: 'e_5_6', from: '5', to: '6', weight: 4 },
        { id: 'e_6_1', from: '6', to: '1', weight: 6 },
        { id: 'e_1_4', from: '1', to: '4', weight: 7 },
        { id: 'e_2_5', from: '2', to: '5', weight: 8 },
      ]);
      setNodeIdCounter(7);
    } else if (type === 'k4') {
      const n = [
        { id: '1', x: cx, y: cy - 100 },
        { id: '2', x: cx + 100, y: cy + 50 },
        { id: '3', x: cx - 100, y: cy + 50 },
        { id: '4', x: cx, y: cy + 10 }
      ];
      setNodes(n);
      setEdges([
        { id: 'e_1_2', from: '1', to: '2', weight: 5 },
        { id: 'e_2_3', from: '2', to: '3', weight: 5 },
        { id: 'e_3_1', from: '3', to: '1', weight: 5 },
        { id: 'e_1_4', from: '1', to: '4', weight: 3 },
        { id: 'e_2_4', from: '2', to: '4', weight: 3 },
        { id: 'e_3_4', from: '3', to: '4', weight: 3 },
      ]);
      setNodeIdCounter(5);
    } else if (type === 'star') {
      const n = [
        { id: 'C', x: cx, y: cy },
        { id: '1', x: cx, y: cy - 120 },
        { id: '2', x: cx + 120, y: cy },
        { id: '3', x: cx, y: cy + 120 },
        { id: '4', x: cx - 120, y: cy },
      ];
      setNodes(n);
      setEdges([
        { id: 'e_C_1', from: 'C', to: '1', weight: 2 },
        { id: 'e_C_2', from: 'C', to: '2', weight: 4 },
        { id: 'e_C_3', from: 'C', to: '3', weight: 1 },
        { id: 'e_C_4', from: 'C', to: '4', weight: 7 },
      ]);
      setNodeIdCounter(5);
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    // Load default constellation on mount
    loadGraph('constellation');
  }, []);

  const resetVisuals = () => {
    clearTimers();
    setRunning(false);
    setEdgeColors({});
    setNodeColors({});
  };

  const handleCanvasDoubleClick = (e: MouseEvent) => {
    if (running) return;
    if (!containerRef.current) return;
    
    // Check if clicked directly on canvas, not on a node
    if ((e.target as HTMLElement).tagName !== 'DIV' || !(e.target as HTMLElement).classList.contains('graph-canvas')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: GraphNode = {
      id: `${nodeIdCounter}`,
      x,
      y
    };
    
    setNodes(prev => [...prev, newNode]);
    setNodeIdCounter(prev => prev + 1);
    resetVisuals();
    setShowTooltip(false);
  };

  const handleNodeMouseDown = (e: MouseEvent, id: string) => {
    if (running) return;
    e.stopPropagation();
    
    // Start dragging edge
    const node = nodes.find(n => n.id === id);
    if (node) {
      setDraggingEdge({ fromId: id, x: node.x, y: node.y });
    }
  };

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!draggingEdge || running) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDraggingEdge({ ...draggingEdge, x, y });
  };

  const handleNodeMouseUp = (e: MouseEvent, toId: string) => {
    if (running || !draggingEdge) return;
    e.stopPropagation();
    
    if (draggingEdge.fromId !== toId) {
      // Check if edge already exists
      const exists = edges.some(edge => 
        (edge.from === draggingEdge.fromId && edge.to === toId) ||
        (edge.to === draggingEdge.fromId && edge.from === toId)
      );
      
      if (!exists) {
        const n1 = nodes.find(n => n.id === draggingEdge.fromId)!;
        const n2 = nodes.find(n => n.id === toId)!;
        
        // Calculate Euclidean distance for weight
        const dist = Math.round(Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2)) / 10);
        
        const newEdge: GraphEdge = {
          id: `e_${draggingEdge.fromId}_${toId}`,
          from: draggingEdge.fromId,
          to: toId,
          weight: Math.max(1, dist) // ensure at least 1
        };
        
        setEdges(prev => [...prev, newEdge]);
        resetVisuals();
      }
    }
    
    setDraggingEdge(null);
  };

  const handleCanvasMouseUp = () => {
    if (draggingEdge) {
      setDraggingEdge(null);
    }
  };

  const clearAll = () => {
    if (running) return;
    setNodes([]);
    setEdges([]);
    setNodeIdCounter(0);
    resetVisuals();
  };
  
  const clearEdges = () => {
    if (running) return;
    setEdges([]);
    resetVisuals();
  };

  const runAlgorithm = () => {
    if (running || nodes.length === 0) return;
    resetVisuals();
    setRunning(true);

    let steps: GraphStep[] = [];
    
    if (algo === 'kruskal') {
      steps = GraphAlgorithms.kruskal(nodes, edges);
    } else if (algo === 'dijkstra') {
      if (nodes.length >= 2) {
        // Just pick first added and last added for now
        steps = GraphAlgorithms.dijkstra(nodes, edges, nodes[0].id, nodes[nodes.length - 1].id);
      } else {
        setRunning(false);
        return;
      }
    }

    const delay = Math.max(10, 201 - speed * 2);

    steps.forEach((step, index) => {
      const t = setTimeout(() => {
        if (step.type === 'checking_edge' && step.edgeId) {
          setEdgeColors(prev => ({ ...prev, [step.edgeId!]: 'stroke-amber-400' }));
        } else if (step.type === 'selected_edge' && step.edgeId) {
          setEdgeColors(prev => ({ ...prev, [step.edgeId!]: 'stroke-emerald-400' }));
        } else if (step.type === 'rejected_edge' && step.edgeId) {
          setEdgeColors(prev => ({ ...prev, [step.edgeId!]: 'stroke-stone-700 opacity-30' }));
        } else if (step.type === 'visited_node' && step.nodeId) {
          setNodeColors(prev => ({ ...prev, [step.nodeId!]: 'bg-[var(--accent-gold)] border-amber-600 text-stone-900' }));
        } else if (step.type === 'path_found' && step.pathEdges) {
           // Color the final path in green
           const finalEdges: {[key: string]: string} = {};
           step.pathEdges.forEach(id => finalEdges[id] = 'stroke-[var(--accent-gold)] stroke-[4px]');
           setEdgeColors(prev => ({ ...prev, ...finalEdges }));
        }

        if (index === steps.length - 1) {
          setRunning(false);
        }
      }, index * delay);
      timers.current.push(t);
    });
    
    if (steps.length === 0) {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-[var(--bg-main)]">
      {/* Top Dock Controls */}
      <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-[98%] max-w-5xl z-30 pointer-events-none">
          <div className="sketch-box bg-stone-800 flex flex-row flex-wrap items-center justify-center lg:justify-between gap-4 p-4 pointer-events-auto -rotate-1">
              
              <div className="flex items-center gap-4">
                  <div className="relative w-48 shrink-0">
                      <select
                          value={algo}
                          onChange={(e) => { setAlgo(e.target.value as any); resetVisuals(); }}
                          disabled={running}
                          className="sketch-box bg-stone-700 text-stone-100 font-bold px-4 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-stone-600 transition-colors border-sky-600"
                      >
                          <option value="kruskal" className="bg-stone-800">Kruskal's MST</option>
                          <option value="dijkstra" className="bg-stone-800">Dijkstra's Shortest Path</option>
                      </select>
                  </div>

                  <div className="relative w-40 shrink-0">
                      <select
                          onChange={(e) => { 
                            if (e.target.value) {
                              loadGraph(e.target.value as any);
                              e.target.value = '';
                            }
                          }}
                          disabled={running}
                          className="sketch-box bg-stone-700 text-stone-100 font-bold px-4 py-2 outline-none cursor-pointer w-full text-sm appearance-none hover:bg-stone-600 transition-colors border-emerald-600"
                      >
                          <option value="" className="bg-stone-800">Load Graph...</option>
                          <option value="constellation" className="bg-stone-800">Constellation</option>
                          <option value="k4" className="bg-stone-800">K4 Complete</option>
                          <option value="star" className="bg-stone-800">Star Graph</option>
                      </select>
                  </div>
              </div>

              <div className="flex items-center gap-3">
                  <label className="text-xs text-stone-400 font-bold uppercase tracking-widest whitespace-nowrap">Speed</label>
                  <input
                      type="range"
                      min="1" max="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-24 accent-stone-300 h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
                  />
              </div>

              <div className="flex items-center gap-2">
                  <button onClick={clearEdges} disabled={running} className="btn btn-surface px-4 py-1 text-sm sketch-box bg-stone-700 hover:bg-stone-600">Clear Edges</button>
                  <button onClick={clearAll} disabled={running} className="btn btn-surface px-4 py-1 text-sm sketch-box bg-rose-900 hover:bg-rose-800 border-rose-700 text-rose-300">Clear All</button>
                  
                  {running ? (
                    <button onClick={resetVisuals} className="btn btn-primary px-6 bg-rose-600 hover:bg-rose-500 text-stone-900 border-rose-700 ml-2">Stop</button>
                  ) : (
                    <button onClick={runAlgorithm} className="btn btn-primary px-6 bg-amber-600 hover:bg-amber-500 text-stone-900 ml-2">Run</button>
                  )}
              </div>
          </div>
      </div>

      {/* Instructions Overlay */}
      {showTooltip && (
          <div className="absolute top-44 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
              <div className="sketch-box bg-amber-400 text-stone-900 font-editorial italic tracking-wide text-2xl p-4 transform -rotate-2 animate-bounce shadow-xl">
                  Double-click to drop a node. Drag between nodes to connect!
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-amber-400"></div>
              </div>
          </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 w-full h-full pt-40 px-4 pb-8 overflow-hidden">
        <div 
          ref={containerRef}
          className="graph-canvas w-full h-full sketch-box bg-[#1a1a1a] relative overflow-hidden cursor-crosshair border-stone-700"
          onDoubleClick={handleCanvasDoubleClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
        >
          {/* SVG Layer for Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(e => {
              const n1 = nodes.find(n => n.id === e.from);
              const n2 = nodes.find(n => n.id === e.to);
              if (!n1 || !n2) return null;
              
              const colorClass = edgeColors[e.id] || 'stroke-stone-600';
              const isThick = edgeColors[e.id]?.includes('stroke-[4px]');
              
              return (
                <g key={e.id}>
                  <line 
                    x1={n1.x} y1={n1.y} 
                    x2={n2.x} y2={n2.y} 
                    className={`${colorClass} transition-colors duration-300 ${!isThick ? 'stroke-2' : ''}`} 
                  />
                  {/* Weight Label Background */}
                  <rect 
                    x={(n1.x + n2.x) / 2 - 12} 
                    y={(n1.y + n2.y) / 2 - 10} 
                    width="24" height="20" 
                    rx="4"
                    className="fill-stone-900"
                  />
                  {/* Weight Label */}
                  <text 
                    x={(n1.x + n2.x) / 2} 
                    y={(n1.y + n2.y) / 2 + 4} 
                    textAnchor="middle" 
                    className={`text-xs font-mono font-bold ${edgeColors[e.id]?.includes('emerald') ? 'fill-emerald-400' : 'fill-stone-400'}`}
                  >
                    {e.weight}
                  </text>
                </g>
              );
            })}
            
            {draggingEdge && (() => {
              const fromNode = nodes.find(n => n.id === draggingEdge.fromId);
              if (!fromNode) return null;
              return (
                <line 
                  x1={fromNode.x} y1={fromNode.y} 
                  x2={draggingEdge.x} y2={draggingEdge.y} 
                  className="stroke-stone-400 stroke-2" 
                  strokeDasharray="5,5" 
                />
              );
            })()}
          </svg>

          {/* HTML Layer for Nodes */}
          {nodes.map(n => {
            let color = nodeColors[n.id] || 'bg-stone-800 border-stone-500 text-stone-300';
            
            // Highlight start/end nodes for Dijkstra
            if (algo === 'dijkstra' && !running && Object.keys(nodeColors).length === 0) {
                if (n.id === nodes[0]?.id) color = 'bg-sky-900 border-sky-400 text-sky-100';
                if (nodes.length > 1 && n.id === nodes[nodes.length - 1]?.id) color = 'bg-emerald-900 border-emerald-400 text-emerald-100';
            }

            return (
              <div
                key={n.id}
                className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer font-bold font-mono transition-colors shadow-lg z-10 select-none ${color} hover:scale-110 hover:border-stone-200 hover:z-20`}
                style={{ left: n.x, top: n.y }}
                onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                onMouseUp={(e) => handleNodeMouseUp(e, n.id)}
              >
                {n.id}
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Guide Button */}
      <div className="hidden lg:flex fixed bottom-4 right-4 lg:absolute lg:right-8 lg:top-64 lg:bottom-auto lg:left-auto lg:w-72 z-20 flex-col gap-2 lg:gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar pointer-events-none">
          <button onClick={() => setStudyOpen(true)} className="btn btn-surface py-3 text-lg sketch-box bg-stone-800 border-stone-600 hover:bg-stone-700 flex items-center justify-center gap-2 mt-4 text-stone-300 pointer-events-auto">
              <span className="material-symbols-outlined">menu_book</span> Study Guide
          </button>
      </div>

      <StudyDrawer 
        isOpen={studyOpen} 
        onClose={() => setStudyOpen(false)} 
        contentKey={algo} 
      />
    </div>
  );
}
