import React from 'react';
import { Eye, EyeOff, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function AuthLoginModal({
  isOpen,
  currentTheme,
  badgeIdInput,
  setBadgeIdInput,
  pinInput,
  setPinInput,
  showPin,
  setShowPin,
  authError,
  setAuthError,
  isVerifying,
  onLoginSubmit,
  onBackToRole
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToRole}
            className="text-xs font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            style={{ color: currentTheme.textMuted }}
          >
            <span>← Back to Role Selection</span>
          </button>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
            AUTH PORTAL
          </span>
        </div>

        <div className="text-left mb-4">
          <h2 className="text-xl font-black" style={{ color: currentTheme.textPrimary }}>
            Authorized Verification
          </h2>
          <p className="text-xs font-medium mt-1" style={{ color: currentTheme.textMuted }}>
            Enter Security Badge ID & Access PIN
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-200 text-xs font-bold flex items-start space-x-2">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={onLoginSubmit} className="space-y-3.5 text-left">
          <div>
            <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
              Badge ID / Username
            </label>
            <input
              type="text"
              value={badgeIdInput}
              onChange={(e) => setBadgeIdInput(e.target.value)}
              placeholder="e.g. AUTH-8821"
              className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-amber-500/40"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
              Security Access PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-amber-500/40 pr-10"
                style={{
                  backgroundColor: currentTheme.inputBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
              Authorized Demo Credentials (Click to Auto-fill):
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {[
                { u: 'admin', p: 'admin123' },
                { u: 'rescue01', p: 'rescue123' },
                { u: 'operator01', p: 'operator123' },
                { u: 'control01', p: 'control123' },
                { u: 'AUTH-8821', p: '7749' }
              ].map((cred, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setBadgeIdInput(cred.u);
                    setPinInput(cred.p);
                    setAuthError('');
                  }}
                  className="px-2 py-1 rounded bg-black/10 dark:bg-white/10 border hover:border-amber-500 font-bold cursor-pointer"
                  style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                >
                  {cred.u} / {cred.p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 px-5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
            style={{
              backgroundColor: currentTheme.btnAuth,
              color: currentTheme.textPrimary,
              borderColor: currentTheme.border
            }}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Enter Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}