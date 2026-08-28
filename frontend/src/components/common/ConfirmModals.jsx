import React from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';

export function ConfirmHomeModal({ isOpen, currentTheme, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center transition-all"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black mb-2" style={{ color: currentTheme.textPrimary }}>
          Return to Home Page?
        </h3>

        <p className="text-xs font-medium mb-6 leading-relaxed" style={{ color: currentTheme.textMuted }}>
          Are you sure you want to leave this page? Any unsubmitted inputs or active sessions will be reset.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all hover:brightness-95 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentTheme.inputBg,
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Yes, Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmSignOutModal({ isOpen, currentTheme, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center transition-all"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <LogOut className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black mb-2" style={{ color: currentTheme.textPrimary }}>
          Confirm Sign Out?
        </h3>

        <p className="text-xs font-medium mb-6 leading-relaxed" style={{ color: currentTheme.textMuted }}>
          Are you sure you want to sign out from the Authorized Entry Portal? You will need to verify your Badge ID and Access PIN to enter again.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all hover:brightness-95 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentTheme.inputBg,
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Yes, Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
