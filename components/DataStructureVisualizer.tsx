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
        {/* Sidebar Controls */}
        <div className="absolute left-8 top-28 w-72 z-20 flex flex-col gap-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-2 pb-4">
            <CollapsiblePanel title="Controls" icon="settings" initialOpen={true}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                         <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Structure</div>
                         <div className="grid grid-cols-3 gap-2">
                             <button onClick={() => switchType('bst')} className={`btn text-xs ${type === 'bst' ? 'btn-primary' : 'btn-surface'}`}>BST</button>
                             <button onClick={() => switchType('stack')} className={`btn text-xs ${type === 'stack' ? 'btn-primary' : 'btn-surface'}`}>Stack</button>
                             <button onClick={() => switchType('queue')} className={`btn text-xs ${type === 'queue' ? 'btn-primary' : 'btn-surface'}`}>Queue</button>
                         </div>
                    </div>
                
                    <div className="flex flex-col gap-2">
                        <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Operations</div>
                        <div className="flex gap-2">
                            <input 
                              className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-light)] rounded px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                              placeholder="Value"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && insert()}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={insert} className="btn btn-primary text-xs">Insert</button>
                            <button onClick={remove} className="btn btn-surface text-xs">Remove</button>
                            <button onClick={search} className="btn btn-surface text-xs col-span-2">Search</button>
                            <button onClick={reset} className="btn btn-surface text-xs col-span-2 text-red-400 border-red-400/20 hover:bg-red-400/10">Clear All</button>
                        </div>
                    </div>
                </div>
            </CollapsiblePanel>
            
            <CollapsiblePanel title="Activity Log" icon="history" initialOpen={true}>
                 <div className="bg-[var(--bg-main)] rounded-lg p-3 border border-[var(--border-light)] h-40 overflow-y-auto font-mono text-xs custom-scrollbar">
                    {logs.map((msg, i) => (
                        <div key={i} className="text-white/80 mb-1 border-b border-white/5 pb-1 last:border-0">{">"} {msg}</div>
                    ))}
                    {logs.length === 0 && <div className="text-white/20 italic">Ready...</div>}
                </div>
            </CollapsiblePanel>

            <CollapsiblePanel title="Structure Details" icon="info" initialOpen={false}>
                 <div className="text-xs text-[var(--text-muted)] leading-relaxed space-y-4">
                    <div>
                        <strong className="text-indigo-400 block text-sm mb-1">
                            {type === 'bst' && "Binary Search Tree (BST)"}
                            {type === 'stack' && "Stack (LIFO)"}
                            {type === 'queue' && "Queue (FIFO)"}
                        </strong>
                        <p className="mb-2">
                             {type === 'bst' && "A hierarchical data structure where each node has at most two children. The left child is smaller, and the right child is larger than the parent. Efficient for searching and sorting."}
                             {type === 'stack' && "A linear data structure that follows the Last In, First Out (LIFO) principle. Think of a stack of plates; the last one you put on is the first one you take off."}
                             {type === 'queue' && "A linear data structure that follows the First In, First Out (FIFO) principle. Think of a line at a ticket counter; the first person in line is the first one served."}
                        </p>
                    </div>
                    
                    <div className="space-y-2 border-t border-white/5 pt-2">
                         <div className="flex justify-between">
                            <span className="text-[var(--text-faint)]">Access</span>
                            <span className="font-mono text-white">
                                {type === 'bst' ? 'O(log n)' : 'O(1)'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--text-faint)]">Search</span>
                            <span className="font-mono text-white">
                                {type === 'bst' ? 'O(log n)' : 'O(n)'}
                            </span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-[var(--text-faint)]">Insertion</span>
                            <span className="font-mono text-white">
                                {type === 'bst' ? 'O(log n)' : 'O(1)'}
                            </span>
                        </div>
                    </div>
                </div>
           </CollapsiblePanel>
        </div>

       {/* Canvas */}
       <div className="flex-1 bg-[var(--bg-canvas)] relative overflow-hidden flex items-center justify-center" ref={canvas}>
           
           {/* BST Render */}
           {type === 'bst' && (
               <div className="relative w-full h-full"> 
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
               <div className="flex flex-col-reverse items-center justify-end h-3/4 w-32 border-b-4 border-x-4 border-[var(--border-light)] rounded-b-xl bg-white/5 p-2 gap-2 overflow-hidden transition-all">
                   {items.map((item) => (
                       <div key={item.id} className="w-full h-12 bg-indigo-500 rounded-md flex items-center justify-center font-bold shadow-lg animate-[slideUp_0.3s_ease-out]">
                           {item.val}
                       </div>
                   ))}
                   {items.length === 0 && <div className="text-white/20 text-xs py-4">Stack Empty</div>}
               </div>
           )}
           
           {/* Queue Render */}
           {type === 'queue' && (
                <div className="flex items-center justify-start max-w-3xl h-24 border-y-4 border-[var(--border-light)] bg-white/5 p-2 gap-2 overflow-x-auto rounded-xl">
                   <div className="text-xs text-[var(--text-muted)] absolute -top-6 left-0">Front</div>
                   {items.map((item) => (
                       <div key={item.id} className="min-w-[48px] h-12 bg-purple-500 rounded-md flex items-center justify-center font-bold shadow-lg animate-[fadeIn_0.3s_ease-out]">
                           {item.val}
                       </div>
                   ))}
                   {items.length === 0 && <div className="text-white/20 text-xs px-4">Queue Empty</div>}
                   <div className="text-xs text-[var(--text-muted)] absolute -top-6 right-0">Back</div>
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
                className="absolute w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold shadow-xl border-2 border-white/20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
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
                    stroke="rgba(255,255,255,0.2)" strokeWidth="2" 
                />
            )}
            {node.right && (
                <line 
                    x1={node.x} y1={node.y} 
                    x2={node.right.x} y2={node.right.y} 
                    stroke="rgba(255,255,255,0.2)" strokeWidth="2" 
                />
            )}
            <RecursiveLinks node={node.left} />
            <RecursiveLinks node={node.right} />
        </>
    );
}

function EmptyState({ text, icon }: { text: string; icon: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
            <span className="material-symbols-outlined text-6xl mb-2">{icon}</span>
            <p>{text}</p>
        </div>
    );
}
