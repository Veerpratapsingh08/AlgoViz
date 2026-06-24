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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-main)] animate-[fadeOut_0.5s_ease-out_1.8s_forwards] pointer-events-none">
      <div className="relative w-24 h-24 mb-6 animate-[bounce_2s_infinite]">
        <Image 
          src="/assets/logo/algoviz-icon.svg" 
          alt="The Algorithm Sketchbook" 
          width={80}
          height={80}
          className="object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]"
          priority
        />
      </div>
      
      <div className="flex flex-col items-center gap-3">
        <h1 className="mt-8 text-5xl font-black text-stone-100 tracking-tight drop-shadow-lg">
          The Algorithm Sketchbook
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
