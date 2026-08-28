import React from 'react';
import {
  Siren,
  Zap,
  Activity
} from 'lucide-react';

export default function TacticalSosConsole({
  currentTheme,
  crowdZones,
  selectedSosTargetZone,
  setSelectedSosTargetZone,
  handleTriggerTacticalSos,
  tacticalSosQueue
}) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1-Tap SOS Button Card */}
        <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 text-center space-y-4 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center justify-center space-x-1.5">
              <Siren className="w-4 h-4" />
              <span>1-Tap Red Zone SOS & Audio Alarm</span>
            </h4>
            <p className="text-[11px] mt-1" style={{ color: currentTheme.textMuted }}>
              Tapping broadcasts a swept Web Audio emergency siren and high-volume voice dispatch alert.
            </p>
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-bold mb-1" style={{ color: currentTheme.textMuted }}>
              Target Red Hazard Hotspot
            </label>
            <select
              value={selectedSosTargetZone}
              onChange={(e) => setSelectedSosTargetZone(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
              style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              {crowdZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.level === 'RED' ? '🔴' : '🟡'} {z.name} ({z.count} Humans)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleTriggerTacticalSos('Critical Emergency Medical Evacuation')}
            className="w-32 h-32 mx-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-2xl border-4 border-red-300 flex flex-col items-center justify-center transition-transform active:scale-90 animate-pulse my-2 cursor-pointer"
          >
            <Zap className="w-7 h-7 mb-1" />
            <span>1-TAP SOS</span>
            <span className="text-[9px] font-mono opacity-90">LOUD VOICE</span>
          </button>

          <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
            Triggers sound sweep & speech synthesis
          </div>
        </div>

        {/* Live Dispatch Queue */}
        <div className="lg:col-span-2 p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
          <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: currentTheme.border }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center space-x-1.5">
              <Activity className="w-4 h-4" />
              <span>Live First-Responder & NDRF Dispatch Queue</span>
            </h4>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 text-[10px] font-black">
              {tacticalSosQueue.length} Active Dispatches
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tacticalSosQueue.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 text-xs flex justify-between items-center gap-2" style={{ borderColor: currentTheme.border }}>
                <div>
                  <span className="font-extrabold block" style={{ color: currentTheme.textPrimary }}>{evt.type}</span>
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-300 block">Target: {evt.target}</span>
                  <span className="text-[10px] font-mono" style={{ color: currentTheme.textMuted }}>{evt.time}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 text-[10px] font-black shrink-0">
                  {evt.status} (ETA: {evt.eta})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}