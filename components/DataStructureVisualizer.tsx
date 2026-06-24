'use client';

import { useState, useRef } from 'react';
import CollapsiblePanel from './CollapsiblePanel';
import StudyDrawer from './StudyDrawer';
import { BSTNode, TreeUtils } from '@/lib/algorithms/datastructures';

type LogEntry = { msg: string; type: 'success' | 'info' | 'error' | 'warn' };
type Item = { id: number, val: string };

export default function DataStructureVisualizer() {
  const [type, setType] = useState<'bst' | 'stack' | 'queue' | 'linkedlist'>('bst');
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [root, setRoot] = useState<BSTNode | null>(null);
  const [highlightedVal, setHighlightedVal] = useState<number | string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  const canvas = useRef<HTMLDivElement>(null);

  const log = (msg: string, t: LogEntry['type'] = 'info') =>
    setLogs(prev => [{ msg, type: t }, ...prev].slice(0, 15));

  const insert = () => {
      if (!input.trim()) return;
      const num = parseInt(input);
      const val = input.trim();

      if (type === 'bst') {
          if (isNaN(num)) { log('BST only accepts numbers', 'error'); return; }
          const result = TreeUtils.insert(root, num);
          if (result.isDuplicate) {
            log(`${num} already exists in the tree`, 'warn');
          } else {
            const canvasWidth = canvas.current?.clientWidth ?? 800;
            TreeUtils.layout(result.root, canvasWidth);
            setRoot(result.root);
            log(`Inserted ${num}`, 'success');
          }
      } else if (type === 'stack') {
          setItems(prev => [...prev, { id: Date.now(), val }]);
          log(`Pushed "${val}" onto the stack`, 'success');
      } else if (type === 'queue') {
          setItems(prev => [...prev, { id: Date.now(), val }]);
          log(`Enqueued "${val}"`, 'success');
      } else if (type === 'linkedlist') {
          setItems(prev => [...prev, { id: Date.now(), val }]);
          log(`Appended "${val}" to Linked List`, 'success');
      }
      setInput('');
  };

  const remove = () => {
      if (type === 'stack') {
          if (!items.length) { log('Stack underflow — nothing to pop!', 'error'); return; }
          const item = items[items.length - 1];
          setItems(prev => prev.slice(0, -1));
          log(`Popped "${item.val}" from the stack`, 'info');
      } else if (type === 'queue') {
          if (!items.length) { log('Queue underflow — nothing to dequeue!', 'error'); return; }
          const item = items[0];
          setItems(prev => prev.slice(1));
          log(`Dequeued "${item.val}" from front`, 'info');
      } else if (type === 'linkedlist') {
          if (!items.length) { log('Linked List is empty', 'error'); return; }
          if (!input.trim()) {
              const item = items[items.length - 1];
              setItems(prev => prev.slice(0, -1));
              log(`Removed tail "${item.val}"`, 'info');
          } else {
              const target = input.trim();
              const idx = items.findIndex(i => i.val === target);
              if (idx !== -1) {
                  setItems(prev => prev.filter((_, i) => i !== idx));
                  log(`Deleted "${target}" from Linked List`, 'info');
              } else {
                  log(`"${target}" not found`, 'error');
              }
              setInput('');
          }
      } else if (type === 'bst') {
          if (!input.trim()) { log('Enter a value to delete', 'warn'); return; }
          const num = parseInt(input);
          if (isNaN(num)) { log('BST only accepts numbers', 'error'); return; }
          const result = TreeUtils.delete(root, num);
          if (!result.deleted) {
            log(`${num} not found in the tree`, 'error');
          } else {
            if (result.root) {
              const canvasWidth = canvas.current?.clientWidth ?? 800;
              TreeUtils.layout(result.root, canvasWidth);
            }
            setRoot(result.root);
            setHighlightedVal(null);
            log(`Deleted ${num} from the tree`, 'info');
          }
          setInput('');
      }
  };

  const search = () => {
      if (!input.trim()) return;
      if (type === 'bst') {
          const num = parseInt(input);
          if (isNaN(num)) { log('BST only accepts numbers', 'error'); return; }
          const found = TreeUtils.search(root, num);
          if (found) {
            setHighlightedVal(num);
            log(`Found ${num} in the tree ✓`, 'success');
            // Clear highlight after 2.5s
            setTimeout(() => setHighlightedVal(null), 2500);
          } else {
            setHighlightedVal(null);
            log(`${num} is not in the tree`, 'error');
          }
      } else {
          const found = items.find(i => i.val === input);
          if (found) {
            setHighlightedVal(input);
            log(`Found "${input}" at index ${items.indexOf(found)}`, 'success');
            setTimeout(() => setHighlightedVal(null), 2500);
          } else {
            setHighlightedVal(null);
            log(`"${input}" not found`, 'error');
          }
      }
      setInput('');
  };

  const reset = () => {
      setRoot(null);
      setItems([]);
      setLogs([]);
      setHighlightedVal(null);
      setInput('');
  };

  const switchType = (t: 'bst' | 'stack' | 'queue' | 'linkedlist') => {
      setType(t);
      reset();
  };

  const treeSize = TreeUtils.size(root);
  const treeHeight = TreeUtils.height(root);

  const logColor: Record<LogEntry['type'], string> = {
    success: 'text-emerald-400',
    info:    'text-stone-300',
    error:   'text-rose-400',
    warn:    'text-amber-400',
  };

  const logPrefix: Record<LogEntry['type'], string> = {
    success: '✓',
    info:    '›',
    error:   '✗',
    warn:    '!',
  };

  return (
    <div className="flex flex-col h-full w-full relative">

        {/* Floating Controls Dock */}
        <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-[98%] max-w-7xl z-30">
            <div className="sketch-box bg-stone-800 flex flex-row flex-wrap items-center justify-center gap-4 p-4 xl:px-8 xl:py-4 -rotate-1">

                <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 w-full xl:w-auto">
                    {(['bst', 'stack', 'queue', 'linkedlist'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => switchType(t)}
                        className={`btn text-xl font-bold uppercase ${type === t ? 'sketch-box bg-stone-600 text-stone-100' : 'bg-transparent text-stone-400 hover:text-stone-100 border-transparent'}`}
                      >
                        {t === 'bst' ? 'BST' : t === 'linkedlist' ? 'Linked List' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                </div>

                <div className="hidden xl:block w-px h-8 bg-white/10 mx-2"></div>

                <div className="flex items-center gap-3 w-full xl:w-auto flex-1">
                    <input
                      className="flex-1 sketch-box bg-stone-700 px-4 py-2 text-base text-stone-100 outline-none w-full xl:w-48 placeholder:text-stone-400"
                      placeholder={type === 'bst' ? 'Enter number...' : 'Enter value...'}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && insert()}
                    />
                </div>

                <div className="hidden xl:block w-px h-8 bg-white/10 mx-2"></div>

                <div className="flex items-center gap-2 justify-center mt-2 xl:mt-0 flex-wrap sm:flex-nowrap">
                    <button onClick={insert} className="btn btn-primary flex-1 sm:flex-none justify-center px-6">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="tracking-wide text-xl">Insert</span>
                    </button>
                    <button onClick={remove} className="btn btn-surface flex-1 sm:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-rose-900">
                        <span className="material-symbols-outlined text-lg">remove</span>
                        <span className="tracking-wide text-xl">{type === 'bst' || type === 'linkedlist' ? 'Delete' : 'Remove'}</span>
                    </button>
                    <button onClick={search} className="btn btn-surface flex-1 sm:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600">
                        <span className="material-symbols-outlined text-lg">search</span>
                        <span className="tracking-wide text-xl">Search</span>
                    </button>
                    <button onClick={reset} className="btn btn-surface flex-1 sm:flex-none justify-center px-4 sketch-box bg-stone-700 hover:bg-stone-600" title="Clear All">
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar Controls */}
        <div className="fixed bottom-4 left-4 right-4 md:absolute md:left-8 md:top-64 md:bottom-auto md:right-auto md:w-72 z-20 flex flex-col gap-2 md:gap-4 max-h-[40vh] md:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0 md:pr-2 pb-0 md:pb-4 rotate-1">
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

            <CollapsiblePanel title="Activity Log" icon="history" initialOpen={true}>
                 <div className="sketch-box bg-stone-900 p-3 h-32 md:h-48 overflow-y-auto font-mono text-base custom-scrollbar">
                    {logs.map((entry, i) => (
                        <div key={i} className={`mb-1.5 pb-1.5 border-b border-stone-700 last:border-0 ${logColor[entry.type]}`}>
                          <span className="font-bold mr-2">{logPrefix[entry.type]}</span>{entry.msg}
                        </div>
                    ))}
                    {logs.length === 0 && <div className="text-stone-500 italic">No operations yet...</div>}
                </div>
            </CollapsiblePanel>

            {type === 'bst' && root && (
              <CollapsiblePanel title="Tree Stats" icon="account_tree" initialOpen={true}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="sketch-box bg-stone-700 p-3 text-center">
                    <div className="text-3xl font-black text-stone-100">{treeSize}</div>
                    <div className="text-sm text-stone-400 uppercase tracking-widest">Nodes</div>
                  </div>
                  <div className="sketch-box bg-stone-700 p-3 text-center">
                    <div className="text-3xl font-black text-stone-100">{treeHeight}</div>
                    <div className="text-sm text-stone-400 uppercase tracking-widest">Height</div>
                  </div>
                </div>
              </CollapsiblePanel>
            )}

        </div>

        {/* Right Sidebar Controls */}
        <div className="hidden md:flex fixed bottom-4 left-4 right-4 md:absolute md:right-8 md:top-64 md:bottom-auto md:left-auto md:w-72 z-20 flex-col gap-2 md:gap-4 max-h-[40vh] md:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0 md:pr-2 pb-0 md:pb-4 -rotate-1">
            <CollapsiblePanel title="How it Works" icon="info" initialOpen={true}>
                <div className="text-lg text-stone-300 leading-relaxed space-y-3 font-inter">
                {type === 'bst' && (
                  <>
                    <p><strong className="text-stone-100">Binary Search Tree</strong> — each node has at most 2 children. Left child is always smaller, right is always larger.</p>
                    <p className="text-stone-400">Drag to insert, type a number and hit <strong className="text-stone-300">Delete</strong> to remove. <strong className="text-stone-300">Search</strong> highlights the found node in gold.</p>
                    <div className="space-y-2 border-t border-stone-600 pt-3">
                      <div className="flex justify-between"><span className="text-stone-400">Insert</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(log n) avg</span></div>
                      <div className="flex justify-between"><span className="text-stone-400">Search</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(log n) avg</span></div>
                      <div className="flex justify-between"><span className="text-stone-400">Delete</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(log n) avg</span></div>
                    </div>
                  </>
                )}
                {type === 'stack' && (
                  <>
                    <p><strong className="text-stone-100">Stack (LIFO)</strong> — Last In, First Out. Like a stack of plates; you always take from the top.</p>
                    <div className="space-y-2 border-t border-stone-600 pt-3">
                      <div className="flex justify-between"><span className="text-stone-400">Push / Pop</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(1)</span></div>
                      <div className="flex justify-between"><span className="text-stone-400">Search</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(n)</span></div>
                    </div>
                  </>
                )}
                {type === 'queue' && (
                  <>
                    <p><strong className="text-stone-100">Queue (FIFO)</strong> — First In, First Out. Like a line at the checkout — first person in is first served.</p>
                    <div className="space-y-2 border-t border-stone-600 pt-3">
                      <div className="flex justify-between"><span className="text-stone-400">Enqueue / Dequeue</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(1)</span></div>
                      <div className="flex justify-between"><span className="text-stone-400">Search</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(n)</span></div>
                    </div>
                  </>
                )}
                {type === 'linkedlist' && (
                  <>
                    <p><strong className="text-stone-100">Linked List</strong> — a sequence of nodes where each node points to the next. Dynamic size but sequential access.</p>
                    <p className="text-stone-400 text-sm">Type a value and hit <strong className="text-stone-300">Insert</strong> to append. Hit <strong className="text-stone-300">Delete</strong> to remove the tail, or type a value to delete a specific node. <strong className="text-stone-300">Search</strong> highlights the node.</p>
                    <div className="space-y-2 border-t border-stone-600 pt-3">
                      <div className="flex justify-between"><span className="text-stone-400">Append (Tail)</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(1)</span></div>
                      <div className="flex justify-between"><span className="text-stone-400">Search / Delete</span><span className="font-mono bg-stone-700 px-2 rounded text-base border border-stone-600">O(n)</span></div>
                    </div>
                  </>
                )}
                </div>
            </CollapsiblePanel>
        </div>

       {/* Canvas */}
       <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8 pt-32 md:pt-40" ref={canvas}>

           {/* BST Render */}
           {type === 'bst' && (
               <div className="relative w-full h-full overflow-auto custom-scrollbar">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <RecursiveLinks node={root} />
                  </svg>
                  <div className="absolute inset-0 w-full h-full z-10">
                      <RecursiveNodes node={root} highlightedVal={highlightedVal} />
                  </div>
                  {!root && <EmptyState text="Empty Tree — Insert a number" icon="account_tree" />}
               </div>
           )}

           {/* Stack Render */}
           {type === 'stack' && (
               <div className="flex flex-col-reverse items-center justify-end h-3/4 w-40 sketch-box bg-stone-800 p-4 gap-3 overflow-hidden rounded-b-3xl">
                   {items.map((item, i) => (
                       <div key={item.id} className={`w-full h-14 sketch-box flex items-center justify-center font-bold text-2xl text-stone-100 transition-all ${i === items.length - 1 ? 'bg-emerald-800 border-emerald-600' : 'bg-stone-700'}`}>
                           {item.val}
                       </div>
                   ))}
                   {items.length === 0 && <div className="text-stone-400 text-sm font-semibold tracking-wide uppercase py-4">Stack Empty</div>}
               </div>
           )}

           {/* Queue Render */}
           {type === 'queue' && (
                <div className="flex items-center justify-start w-full max-w-5xl h-36 sketch-box bg-stone-800 p-4 gap-3 overflow-x-auto relative custom-scrollbar">
                   <div className="text-xs text-stone-400 font-bold uppercase tracking-widest absolute top-2 left-6">Front (Dequeue)</div>
                   <div className="text-xs text-stone-400 font-bold uppercase tracking-widest absolute top-2 right-6">Back (Enqueue)</div>

                   <div className="flex items-center gap-3 pt-6 px-4">
                       {items.map((item, i) => (
                           <div key={item.id} className={`min-w-[64px] h-14 px-4 sketch-box flex items-center justify-center font-bold text-2xl text-stone-100 transition-all ${item.val === highlightedVal ? 'bg-amber-600 border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.8)]' : i === 0 ? 'bg-emerald-800 border-emerald-600' : 'bg-stone-700'}`}>
                               {item.val}
                           </div>
                       ))}
                       {items.length === 0 && <div className="text-stone-400 text-sm font-semibold tracking-wide uppercase px-8 pt-2 w-full text-center">Queue Empty</div>}
                   </div>
               </div>
           )}

           {/* Linked List Render */}
           {type === 'linkedlist' && (
                <div className="flex items-center justify-start w-full max-w-5xl h-40 sketch-box bg-stone-800 p-4 gap-0 overflow-x-auto relative custom-scrollbar">
                   <div className="text-xs text-stone-400 font-bold uppercase tracking-widest absolute top-2 left-6">Head</div>
                   <div className="text-xs text-stone-400 font-bold uppercase tracking-widest absolute top-2 right-6">Tail</div>

                   <div className="flex items-center pt-6 px-4">
                       {items.map((item, i) => (
                           <div key={item.id} className="flex items-center">
                               <div className={`min-w-[64px] h-14 px-4 sketch-box flex items-center justify-center font-bold text-2xl text-stone-100 transition-all ${item.val === highlightedVal ? 'bg-amber-600 border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.8)]' : 'bg-stone-700'}`}>
                                   {item.val}
                               </div>
                               <div className="flex items-center text-stone-500 mx-1 md:mx-3">
                                   <span className="material-symbols-outlined text-3xl font-light">arrow_right_alt</span>
                               </div>
                           </div>
                       ))}
                       {items.length > 0 && (
                           <div className="font-mono text-stone-400 font-bold text-lg sketch-box px-3 py-2 border-stone-600 border-dashed bg-stone-800">
                               null
                           </div>
                       )}
                       {items.length === 0 && <div className="text-stone-400 text-sm font-semibold tracking-wide uppercase px-8 pt-2 w-full text-center">List Empty</div>}
                   </div>
               </div>
           )}

       </div>

       <StudyDrawer 
         isOpen={showStudyGuide} 
         onClose={() => setShowStudyGuide(false)} 
         contentKey={type} 
       />
    </div>
  );
}

function RecursiveNodes({ node, highlightedVal }: { node: BSTNode | null; highlightedVal: number | string | null }) {
    if (!node) return null;
    const isHighlighted = node.value === highlightedVal;
    return (
        <>
            <div
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10 select-none ${
                  isHighlighted
                    ? 'bg-amber-500 border-2 border-amber-300 text-stone-900 scale-125 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                    : 'sketch-box bg-stone-700 border-2 border-stone-500 text-stone-100'
                }`}
                style={{ left: node.x, top: node.y }}
            >
                {node.value}
            </div>
            <RecursiveNodes node={node.left} highlightedVal={highlightedVal} />
            <RecursiveNodes node={node.right} highlightedVal={highlightedVal} />
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
                    stroke="#78716c" strokeWidth="2"
                    strokeLinecap="round"
                />
            )}
            {node.right && (
                <line
                    x1={node.x} y1={node.y}
                    x2={node.right.x} y2={node.right.y}
                    stroke="#78716c" strokeWidth="2"
                    strokeLinecap="round"
                />
            )}
            <RecursiveLinks node={node.left} />
            <RecursiveLinks node={node.right} />
        </>
    );
}

function EmptyState({ text, icon }: { text: string; icon: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-500 opacity-60">
            <span className="material-symbols-outlined text-7xl mb-4 text-stone-600">{icon}</span>
            <p className="font-semibold tracking-wide text-lg">{text}</p>
        </div>
    );
}
