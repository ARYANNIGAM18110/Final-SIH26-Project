import React from 'react';
import { Lock, Key, AlertTriangle, Radio, ArrowRight, ShieldAlert } from 'lucide-react';

export default function RoleModal({ isOpen, currentTheme, onSelectRole }) {
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
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow-sm"
            style={{
              backgroundColor: currentTheme.btnAuth,
              borderColor: currentTheme.border
            }}
          >
            <Lock className="w-6 h-6" style={{ color: currentTheme.textPrimary }} />
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: currentTheme.textPrimary }}>
            Who You Are ?
          </h2>
          <p className="text-xs font-medium mt-1" style={{ color: currentTheme.textMuted }}>
            Please select your portal role to proceed
          </p>
        </div>

        <div className="space-y-3">
          {/* Option 1: Authorized Person */}
          <button
            onClick={() => onSelectRole('authorized')}
            className="w-full py-3.5 px-4 rounded-2xl border font-bold text-sm shadow-sm transition-all flex items-center justify-between group hover:shadow-md active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentTheme.btnAuth,
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10">
                <Key className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Authorized Person</div>
                <div className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                  Staff, Employee or Security Credentials
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Rescuer Tactical Field Unit */}
          <button
            onClick={() => onSelectRole('rescuer')}
            className="w-full py-3.5 px-4 rounded-2xl border font-bold text-sm shadow-sm transition-all flex items-center justify-between group hover:shadow-md active:scale-95 cursor-pointer bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Rescuer Tactical Cockpit</div>
                <div className="text-[11px] font-medium text-amber-600/80 dark:text-amber-300/80">
                  NDRF, Boat Patrol & First Responder Field Unit
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 3: Citizen Emergency */}
          <button
            onClick={() => onSelectRole('emergency')}
            className="w-full py-3.5 px-4 rounded-2xl bg-red-600 text-white font-extrabold text-sm border border-red-400/50 shadow-lg transition-all flex items-center justify-between group active:scale-95 hover:bg-red-700 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white/20">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-black text-sm tracking-wide">An Emergency</div>
                <div className="text-[11px] text-red-100 font-normal">
                  Voice input, keyboard & photo dispatch
                </div>
              </div>
            </div>
            <Radio className="w-5 h-5 text-red-100 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}