"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the consent
    const consent = localStorage.getItem('algoviz-cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('algoviz-cookie-consent', 'true');
    window.dispatchEvent(new Event('cookie-consent-granted'));
    setShow(false);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('algoviz-cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto sketch-box bg-stone-800 p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto transform -rotate-1 shadow-2xl">
        <div className="flex-1 text-sm text-stone-300 font-inter">
          <p className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-rose-400 text-xl">cookie</span>
            <strong className="text-stone-100 text-base font-bold">We respect your privacy</strong>
          </p>
          <p className="leading-relaxed">
            AlgoViz uses Microsoft Clarity analytics to understand how you interact with our visualizations and improve the experience. We do not sell your data. By clicking Accept, you consent to our use of analytics cookies. Read our <Link href="/privacy" className="text-sky-400 hover:underline decoration-sky-400 font-bold">Privacy Policy</Link> for more details.
          </p>
        </div>
        <div className="flex shrink-0 gap-4">
          <button 
            onClick={handleDecline}
            className="btn btn-surface px-6 text-sm"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="btn btn-primary px-6 text-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
