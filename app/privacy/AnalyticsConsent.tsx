"use client";

import { useEffect, useState } from "react";

export default function AnalyticsConsent() {
  const [consentStatus, setConsentStatus] = useState<string | null>(null);

  useEffect(() => {
    setConsentStatus(localStorage.getItem('algoviz-cookie-consent') || 'unknown');
  }, []);

  const handleRevoke = () => {
    localStorage.setItem('algoviz-cookie-consent', 'declined');
    setConsentStatus('declined');
    window.location.reload();
  };

  const handleGrant = () => {
    localStorage.setItem('algoviz-cookie-consent', 'true');
    setConsentStatus('true');
    window.dispatchEvent(new Event('cookie-consent-granted'));
    window.location.reload();
  };

  if (!consentStatus) return null; // Avoid hydration mismatch

  return (
    <div className="mt-6 pt-6 border-t border-stone-600 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="text-stone-100 font-bold mb-1">Manage Analytics Consent</h4>
        <p className="text-sm text-stone-300">
          Current Status: <strong className="text-rose-400 font-bold uppercase tracking-wider">{consentStatus === 'true' ? 'Opted In' : consentStatus === 'declined' ? 'Opted Out' : 'Unknown'}</strong>
        </p>
      </div>
      <div className="shrink-0 flex gap-3">
        {(consentStatus === 'true' || consentStatus === 'unknown') && (
          <button 
            onClick={handleRevoke} 
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-md font-bold text-sm transition-colors"
          >
            Opt Out
          </button>
        )}
        {(consentStatus === 'declined' || consentStatus === 'unknown') && (
          <button 
            onClick={handleGrant} 
            className="bg-stone-100 text-stone-900 px-4 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Opt In to Analytics
          </button>
        )}
      </div>
    </div>
  );
}
