'use client';

import { useState, useRef } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import { BSTNode, TreeUtils } from '@/lib/algorithms/datastructures';

type Item = { id: number, val: string };

export default function DataStructureVisualizer() {
  const [type, setType] = useState<'bst' | 'stack' | 'queue'>('bst');
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  
  const canvas = useRef<HTMLDivElement>(null);

  const log = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10));

  const insert = () => {
      if (!input) return;
      const num = parseInt(input);
      const val = input;

      if (type === 'bst') {
          if (isNaN(num)) return;
          const newRoot = TreeUtils.insert(root, num);
          TreeUtils.layout(newRoot, 400, 50, 1, 800);
          setRoot(newRoot); 
          log(`Inserted ${num}`);
      } else if (type === 'stack') {
          setItems(prev => [...prev, { id: Date.now(), val }]);
          log(`Pushed ${val}`);
      } else if (type === 'queue') {
          setItems(prev => [...prev, { id: Date.now(), val }]);
          log(`Enqueued ${val}`);
      }
      setInput('');
  };

  const remove = () => {
      if (type === 'stack') {
          if (!items.length) return log("Underflow");
          const item = items[items.length - 1];
          setItems(prev => prev.slice(0, -1));
          log(`Popped ${item.val}`);
      } else if (type === 'queue') {
          if (!items.length) return log("Underflow");
          const item = items[0];
          setItems(prev => prev.slice(1));
          log(`Dequeued ${item.val}`);
      } else if (type === 'bst') {
          log("Deletion pending...");
      }
  };

  const search = () => {
      if (!input) return;
      if (type === 'bst') {
          const num = parseInt(input);
          if (isNaN(num)) return;
          const found = TreeUtils.search(root, num);
          log(found ? `Found ${num}` : `${num} not found`);
      } else {
          const found = items.find(i => i.val === input);
          log(found ? `Found at index ${items.indexOf(found!)}` : `Not found`);
      }
  };

  const reset = () => {
      setRoot(null);
      setItems([]);
      setLogs([]);
      log("Reset");
  };

  const switchType = (t: 'bst' | 'stack' | 'queue') => {
      setType(t);
      reset();
  };

  return (
    <div className="flex flex-col h-full w-full relative">
        
        {/* Floating Controls Dock */}
        <div className="absolute top-24 md:top-28 left-1/2 transform -translate-x-1/2 w-[95%] md:w-auto max-w-5xl z-30 animate-[slideUp_0.5s_ease-out]">
            <div className="glass-panel flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 md:px-8 md:py-4 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] bg-slate-900/60 backdrop-blur-2xl">
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button onClick={() => switchType('bst')} className={`btn ${type === 'bst' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white border-transparent'}`}>BST</button>
                    <button onClick={() => switchType('stack')} className={`btn ${type === 'stack' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white border-transparent'}`}>Stack</button>
                    <button onClick={() => switchType('queue')} className={`btn ${type === 'queue' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]' : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white border-transparent'}`}>Queue</button>
                </div>

                <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-colors w-full md:w-48 placeholder:text-slate-500"
                      placeholder="Enter value..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && insert()}
                    />
                </div>

                <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>

                <div className="flex items-center gap-2 justify-end mt-2 md:mt-0 flex-wrap md:flex-nowrap">
                    <button onClick={insert} className="btn btn-primary flex-1 md:flex-none justify-center px-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-gradient-to-r from-emerald-500 to-teal-500">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="tracking-wide">Insert</span>
                    </button>
                    <button onClick={remove} className="btn btn-surface flex-1 md:flex-none justify-center px-4 hover:border-rose-500/30 hover:text-rose-400">
                        <span className="material-symbols-outlined text-lg">remove</span>
                        <span className="tracking-wide">Remove</span>
                    </button>
                    <button onClick={search} className="btn btn-surface flex-1 md:flex-none justify-center px-4">
                        <span className="material-symbols-outlined text-lg">search</span>
                    </button>
                    <button onClick={reset} className="btn btn-surface flex-1 md:flex-none justify-center px-4" title="Clear All">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar Controls - Bottom on mobile, Left on desktop */}
        <div className="fixed bottom-4 left-4 right-4 md:absolute md:left-8 md:top-48 md:bottom-auto md:right-auto md:w-72 z-20 flex flex-col gap-2 md:gap-4 max-h-[40vh] md:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0 md:pr-2 pb-0 md:pb-4 animate-[fadeIn_0.8s_ease-out]">
            
            <CollapsiblePanel title="Activity Log" icon="history" initialOpen={true}>
                 <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5 h-24 md:h-40 overflow-y-auto font-mono text-xs custom-scrollbar shadow-inner">
                    {logs.map((msg, i) => (
                        <div key={i} className="text-slate-300 mb-1 border-b border-white/5 pb-1 last:border-0"><span className="text-indigo-400 font-bold">{">"}</span> {msg}</div>
                    ))}
                    {logs.length === 0 && <div className="text-slate-600 italic">Waiting for operations...</div>}
                </div>
            </CollapsiblePanel>

            <div className="hidden md:block">
                <CollapsiblePanel title="Structure Details" icon="info" initialOpen={false}>
                        <div className="text-xs text-slate-300 leading-relaxed space-y-4">
                        <div>
                            <strong className="text-emerald-400 block text-sm mb-2 font-bold tracking-wide">
                                {type === 'bst' && "Binary Search Tree (BST)"}
                                {type === 'stack' && "Stack (LIFO)"}
                                {type === 'queue' && "Queue (FIFO)"}
                            </strong>
                            <p className="mb-2 font-light">
                                    {type === 'bst' && "A hierarchical data structure where each node has at most two children. The left child is smaller, and the right child is larger than the parent. Efficient for searching and sorting."}
                                    {type === 'stack' && "A linear data structure that follows the Last In, First Out (LIFO) principle. Think of a stack of plates; the last one you put on is the first one you take off."}
                                    {type === 'queue' && "A linear data structure that follows the First In, First Out (FIFO) principle. Think of a line at a ticket counter; the first person in line is the first one served."}
                            </p>
                        </div>
                        
                        <div className="space-y-3 border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Access</span>
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                    {type === 'bst' ? 'O(log n)' : 'O(1)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Search</span>
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                    {type === 'bst' ? 'O(log n)' : 'O(n)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Insertion</span>
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">
                                    {type === 'bst' ? 'O(log n)' : 'O(1)'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CollapsiblePanel>
            </div>
        </div>

       {/* Canvas */}
       <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8" ref={canvas}>
           
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[150px]"></div>
            </div>

           {/* BST Render */}
           {type === 'bst' && (
               <div className="relative w-full h-full pt-32"> 
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <RecursiveLinks node={root} />
                  </svg>
                  <div className="absolute inset-0 w-full h-full z-10">
                      <RecursiveNodes node={root} />
                  </div>
                  {!root && <EmptyState text="Empty Tree" icon="account_tree" />}
               </div>
           )}

           {/* Stack Render */}
           {type === 'stack' && (
               <div className="flex flex-col-reverse items-center justify-end h-3/4 w-40 border-b-4 border-x-4 border-white/20 rounded-b-3xl bg-slate-900/30 backdrop-blur-sm p-4 gap-3 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                   {items.map((item) => (
                       <div key={item.id} className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.3)] animate-[slideUp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                           {item.val}
                       </div>
                   ))}
                   {items.length === 0 && <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase py-4">Stack Empty</div>}
               </div>
           )}
           
           {/* Queue Render */}
           {type === 'queue' && (
                <div className="flex items-center justify-start max-w-4xl h-32 border-y-4 border-white/20 bg-slate-900/30 backdrop-blur-sm p-4 gap-3 overflow-x-auto rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative custom-scrollbar">
                   <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest absolute top-2 left-6">Front</div>
                   <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest absolute top-2 right-6">Back</div>
                   
                   <div className="flex items-center gap-3 pt-6 px-4">
                       {items.map((item) => (
                           <div key={item.id} className="min-w-[64px] h-14 px-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center font-bold text-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.3)] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                               {item.val}
                           </div>
                       ))}
                       {items.length === 0 && <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase px-8 pt-2 w-full text-center">Queue Empty</div>}
                   </div>
               </div>
           )}

       </div>
    </div>
  );
}

// Helper Components for BST
function RecursiveNodes({ node }: { node: BSTNode | null }) {
    if (!node) return null;
    return (
        <>
            <div 
                className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-[inset_0_2px_6px_rgba(255,255,255,0.4),0_10px_20px_rgba(139,92,246,0.4)] border border-white/20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10 animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]"
                style={{ left: node.x, top: node.y }}
            >
                {node.value}
            </div>
            <RecursiveNodes node={node.left} />
            <RecursiveNodes node={node.right} />
        </>
    );
}

function RecursiveLinks({ node }: { node: BSTNode | null }) {
    if (!node) return null;
    return (
        <>
            {node.left && (
                <line 
                    x1={node.x} y1={node.y} 
                    x2={node.left.x} y2={node.left.y} 
                    stroke="rgba(139,92,246,0.3)" strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-[fadeIn_0.6s_ease-out]"
                />
            )}
            {node.right && (
                <line 
                    x1={node.x} y1={node.y} 
                    x2={node.right.x} y2={node.right.y} 
                    stroke="rgba(139,92,246,0.3)" strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-[fadeIn_0.6s_ease-out]"
                />
            )}
            <RecursiveLinks node={node.left} />
            <RecursiveLinks node={node.right} />
        </>
    );
}

function EmptyState({ text, icon }: { text: string; icon: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-60">
            <span className="material-symbols-outlined text-7xl mb-4 drop-shadow-md text-slate-600">{icon}</span>
            <p className="font-semibold tracking-wide uppercase">{text}</p>
        </div>
    );
}
