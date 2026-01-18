'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-main)] animate-[fadeOut_0.5s_ease-out_1.8s_forwards]">
      <div className="relative w-24 h-24 mb-6 animate-[bounce_2s_infinite]">
        <Image 
          src="/assets/logo/algoviz-icon.svg" 
          alt="AlgoViz" 
          fill
          className="object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]"
          priority
        />
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight">
          AlgoViz
        </h1>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
