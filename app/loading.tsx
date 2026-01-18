
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-main)]">
      <div className="relative w-20 h-20 mb-8 animate-[float_3s_ease-in-out_infinite]">
        <Image 
          src="/assets/logo/algoviz-icon.svg" 
          alt="AlgoViz" 
          fill
          className="object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          priority
        />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          AlgoViz
        </h2>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
        </div>
      </div>
    </div>
  );
}
