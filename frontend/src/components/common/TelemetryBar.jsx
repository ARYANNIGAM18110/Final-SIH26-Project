import React from 'react';
import { Wifi, WifiOff, BatteryCharging, BatteryWarning, Inbox } from 'lucide-react';

export default function TelemetryBar({
  isOnline,
  outboxCount,
  powerState,
  currentTheme
}) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center space-x-2 animate-fadeIn select-none">
      {/* Pending Outbox Sync Indicator */}
      {outboxCount > 0 && (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-amber-500 text-stone-950 font-black text-xs shadow-xl border border-amber-400 animate-pulse">
          <Inbox className="w-3.5 h-3.5" />
          <span>{outboxCount} Outbox Queued</span>
        </div>
      )}

      {/* Network / Mesh Status */}
      <div
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shadow-xl border transition-all ${
          isOnline
            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/40'
            : 'bg-red-500/20 text-red-800 dark:text-red-200 border-red-500/40'
        }`}
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">ONLINE</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-red-600 dark:text-red-400 animate-bounce" />
            <span>OFFLINE (MESH ACTIVE)</span>
          </>
        )}
      </div>

      {/* Battery State */}
      {powerState && (
        <div
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold shadow-xl border transition-all ${
            powerState.isLowPower
              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40 animate-pulse'
              : 'bg-black/10 dark:bg-white/10 border-black/10 dark:border-white/10'
          }`}
          style={{
            backdropFilter: 'blur(8px)',
            color: currentTheme.textPrimary
          }}
        >
          {powerState.isCharging ? (
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
          ) : powerState.isLowPower ? (
            <BatteryWarning className="w-3.5 h-3.5 text-amber-500" />
          ) : null}
          <span>{powerState.levelPercent}%</span>
        </div>
      )}
    </div>
  );
}