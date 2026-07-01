import Link from "next/link";
import AnalyticsConsent from "./AnalyticsConsent";

export const metadata = {
  title: 'The Algorithm Sketchbook - Privacy Policy',
  description: 'Privacy Policy for AlgoViz',
};

export default function PrivacyPage() {
  return (
    <div className="w-full h-full flex flex-col pt-32 md:pt-40 px-6 md:px-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto pb-32">
        <h1 className="text-5xl md:text-7xl font-black text-stone-100 tracking-tight transform -rotate-1 mb-12">
          Privacy Policy
        </h1>

        <div className="sketch-box bg-stone-800 p-8 md:p-12 transform rotate-1 mb-12">
          <h2 className="text-3xl font-bold text-sky-400 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">shield</span>
            The Short Version
          </h2>
          
          <div className="space-y-6 text-xl text-stone-300 leading-relaxed font-inter">
            <p>
              <strong>The Algorithm Sketchbook (AlgoViz) does not collect, store, sell, or share any personal data.</strong>
            </p>
            <p>
              Everything you do on this site—every node you create, every algorithm you race, and every path you draw—happens locally in your own browser. We don&apos;t require accounts, and we don&apos;t have a backend database gobbling up your information. We only use cookies for optional analytics if you explicitly opt in.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="sketch-box bg-stone-800 p-8 transform -rotate-1">
                <h3 className="text-2xl font-bold text-rose-400 mb-4">Analytics</h3>
                <p className="text-stone-300 text-lg mb-6">
                    To understand how people use AlgoViz and to fix UX issues, we use Microsoft Clarity. This helps us see which algorithms are most popular and where users might get stuck. It is strictly opt-in via our cookie consent banner. Clarity does not track personal identities or store personally identifiable information (PII).
                </p>
                <AnalyticsConsent />
            </div>
            
            <div className="sketch-box bg-stone-800 p-8 transform rotate-2">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Open Source</h3>
                <p className="text-stone-300 text-lg mb-6">
                    Don&apos;t take our word for it. The entire codebase is open source and available for public review. You can verify exactly what the code does yourself.
                </p>
                <a 
                    href="https://github.com/Veerpratapsingh08/AlgoViz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-bold text-stone-100 underline decoration-stone-500 hover:text-white"
                >
                    View Source Code
                </a>
            </div>
        </div>

        <div className="mt-16 text-center">
            <Link href="/" className="btn btn-primary px-8 py-3 sketch-box text-xl text-stone-100 bg-stone-800 hover:bg-stone-700">
                Back to Home
            </Link>
        </div>

      </div>
    </div>
  );
}
