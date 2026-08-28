import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

export default function PwaInstallBanner({ currentTheme }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    triggerHapticFeedback('success');
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-fadeIn flex items-center justify-between gap-3"
      style={{
        backgroundColor: currentTheme?.bgCard || '#ffffff',
        borderColor: currentTheme?.border || '#e5e7eb'
      }}
    >
      <div className="flex items-center space-x-3 overflow-hidden text-left">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="truncate">
          <p className="text-xs font-black" style={{ color: currentTheme?.textPrimary || '#111827' }}>
            Install Standalone App
          </p>
          <p className="text-[11px] text-stone-500 truncate">
            Enable 100% offline emergency mesh mode
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center space-x-1 shadow cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4 text-stone-500" />
        </button>
      </div>
    </div>
  );
}