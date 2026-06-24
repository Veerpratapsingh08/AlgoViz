'use client';

import { useEffect, useState } from 'react';
import { STUDY_DATA } from '@/lib/studyContent';

interface StudyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contentKey: string;
}

export default function StudyDrawer({ isOpen, onClose, contentKey }: StudyDrawerProps) {
  const content = STUDY_DATA[contentKey];
  const [lang, setLang] = useState<'typescript' | 'python' | 'java' | 'cpp'>('typescript');

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !content) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity animate-[fadeIn_0.3s_ease-out]" 
        onClick={onClose}
      ></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-stone-900 border-l-2 border-stone-700 shadow-2xl z-[110] overflow-y-auto custom-scrollbar animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)]">
         
         {/* Header */}
         <div className="sticky top-0 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 p-6 flex justify-between items-center z-10">
            <h2 className="text-3xl font-black text-stone-100 font-inter tracking-wide">{content.title}</h2>
            <button 
              onClick={onClose} 
              className="text-stone-400 hover:text-rose-400 hover:bg-stone-800 p-2 rounded-full transition-colors outline-none focus:ring-2 focus:ring-stone-600 flex items-center justify-center"
              title="Close Guide"
            >
                <span className="material-symbols-outlined text-3xl">close</span>
            </button>
         </div>

         <div className="p-6 md:p-8 pb-20">
            {/* Description */}
            <div className="space-y-4 mb-10 text-lg text-stone-300 leading-relaxed font-inter">
                {content.description.map((para, idx) => (
                    <p key={idx}>{para}</p>
                ))}
            </div>

            {/* Complexity Grid */}
            <h3 className="text-stone-100 font-bold text-xl mb-4 font-inter tracking-wide">Performance Characteristics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="sketch-box bg-stone-800 p-4 border-emerald-900 border">
                   <div className="text-emerald-500 uppercase tracking-widest text-xs font-black mb-1">Time (Best Case)</div>
                   <div className="font-mono text-2xl text-emerald-300 font-bold">{content.best}</div>
                </div>
                <div className="sketch-box bg-stone-800 p-4">
                   <div className="text-stone-400 uppercase tracking-widest text-xs font-black mb-1">Time (Average Case)</div>
                   <div className="font-mono text-2xl text-stone-100 font-bold">{content.avg}</div>
                </div>
                <div className="sketch-box bg-stone-800 p-4 border-rose-900 border">
                   <div className="text-rose-500 uppercase tracking-widest text-xs font-black mb-1">Time (Worst Case)</div>
                   <div className="font-mono text-2xl text-rose-300 font-bold">{content.worst}</div>
                </div>
                <div className="sketch-box bg-stone-800 p-4">
                   <div className="text-stone-400 uppercase tracking-widest text-xs font-black mb-1">Space Complexity</div>
                   <div className="font-mono text-2xl text-stone-100 font-bold">{content.space}</div>
                </div>
            </div>

            {/* Key Characteristics */}
            <div className="mb-10 sketch-box bg-stone-800 p-6 md:p-8">
                <h3 className="text-stone-100 font-bold text-xl mb-6 font-inter tracking-wide">Key Takeaways</h3>
                <ul className="space-y-4">
                    {content.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start text-stone-300 font-inter text-lg">
                            <span className="material-symbols-outlined text-amber-500 mr-3 text-2xl -mt-0.5">check_circle</span>
                            <span>{char}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Code Snippet */}
            <div>
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                 <h3 className="text-stone-100 font-bold text-2xl font-inter tracking-wide flex items-center gap-2">
                   <span className="material-symbols-outlined text-stone-400">code</span>
                   Implementation
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => setLang('typescript')} className={`px-3 py-1.5 text-sm font-bold sketch-box ${lang === 'typescript' ? 'bg-stone-600 text-stone-100 border-stone-500' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>TypeScript</button>
                    <button onClick={() => setLang('python')} className={`px-3 py-1.5 text-sm font-bold sketch-box ${lang === 'python' ? 'bg-stone-600 text-stone-100 border-stone-500' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>Python</button>
                    <button onClick={() => setLang('java')} className={`px-3 py-1.5 text-sm font-bold sketch-box ${lang === 'java' ? 'bg-stone-600 text-stone-100 border-stone-500' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>Java</button>
                    <button onClick={() => setLang('cpp')} className={`px-3 py-1.5 text-sm font-bold sketch-box ${lang === 'cpp' ? 'bg-stone-600 text-stone-100 border-stone-500' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>C++</button>
                 </div>
               </div>
               <div className="sketch-box bg-[#1a1a1a] border-stone-700 p-0 overflow-hidden shadow-inner">
                   <pre className="p-6 overflow-x-auto custom-scrollbar font-mono text-sm md:text-base text-stone-300 leading-relaxed">
                       <code dangerouslySetInnerHTML={{ __html: (content.code[lang as keyof typeof content.code] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }}></code>
                   </pre>
               </div>
               <p className="text-stone-500 text-sm mt-4 italic">* Note: This is a conceptual implementation meant for educational study, not production use.</p>
            </div>
         </div>
      </div>
    </>
  );
}
