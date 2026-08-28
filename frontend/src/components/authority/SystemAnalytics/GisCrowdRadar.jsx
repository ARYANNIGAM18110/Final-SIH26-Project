import React from 'react';
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Compass
} from 'lucide-react';

export default function GisCrowdRadar({
  currentTheme,
  crowdZones,
  crowdFilter,
  setCrowdFilter,
  gisTileStyle,
  setGisTileStyle,
  analyticsMapRef,
  handleDispatchCrowdControl
}) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-1" style={{ borderColor: currentTheme.border }}>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>Total Tracked Humans</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300 flex items-center justify-between">
            <span>{crowdZones.reduce((acc, z) => acc + z.count, 0)}</span>
            <Users className="w-5 h-5 opacity-40" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border bg-red-500/10 border-red-500/30 space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">🔴 Red Alert Hotspots</span>
          <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{crowdZones.filter((z) => z.level === 'RED').length} Zones</span>
            <ShieldAlert className="w-5 h-5 opacity-40 animate-pulse" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border bg-amber-500/10 border-amber-500/30 space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">🟡 Moderate Warnings</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300 flex items-center justify-between">
            <span>{crowdZones.filter((z) => z.level === 'YELLOW').length} Zones</span>
            <AlertTriangle className="w-5 h-5 opacity-40" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">🟢 Safe Clear Sectors</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>{crowdZones.filter((z) => z.level === 'GREEN').length} Zones</span>
            <CheckCircle2 className="w-5 h-5 opacity-40" />
          </div>
        </div>
      </div>

      {/* Radar Controls Header */}
      <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-wrap justify-between items-center gap-3" style={{ borderColor: currentTheme.border }}>
        <div>
          <h3 className="text-xs sm:text-sm font-black flex items-center space-x-2" style={{ color: currentTheme.textPrimary }}>
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Interactive GIS Human Crowd Satellite Radar</span>
          </h3>
          <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
            Real-time footprint tracking (Red = Severe Surge, Yellow = Moderate, Green = Safe).
          </p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
            {['satellite', 'dark', 'topo'].map((style) => (
              <button
                key={style}
                onClick={() => setGisTileStyle(style)}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold capitalize transition-all cursor-pointer ${
                  gisTileStyle === style ? 'bg-amber-500 text-stone-900 shadow' : 'hover:opacity-100 opacity-70'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'RED', label: '🔴 Red' },
              { id: 'YELLOW', label: '🟡 Yellow' },
              { id: 'GREEN', label: '🟢 Green' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCrowdFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                  crowdFilter === f.id ? 'bg-red-600 text-white shadow' : 'hover:opacity-100 opacity-70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GIS Leaflet Map Container */}
      <div className="relative h-72 sm:h-96 rounded-2xl border overflow-hidden bg-stone-900 shadow-xl" style={{ borderColor: currentTheme.border }}>
        <div ref={analyticsMapRef} className="absolute inset-0 z-0"></div>
      </div>

      {/* Active Crowd Zones Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Active Crowd Hotspots & Response Controls
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {crowdZones
            .filter((z) => crowdFilter === 'ALL' || z.level === crowdFilter)
            .map((zone) => {
              let badgeBg = 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/30';
              if (zone.level === 'RED') badgeBg = 'bg-red-600 text-white animate-pulse';
              if (zone.level === 'YELLOW') badgeBg = 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30';

              return (
                <div
                  key={zone.id}
                  className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
                    zone.level === 'RED' ? 'bg-red-500/10 border-red-500/40' : 'bg-black/5 dark:bg-white/5'
                  }`}
                  style={{ borderColor: zone.level === 'RED' ? undefined : currentTheme.border }}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-xs sm:text-sm" style={{ color: currentTheme.textPrimary }}>
                        {zone.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 border ${badgeBg}`}>
                        {zone.level === 'RED' ? '🔴 HIGH SURGE' : zone.level === 'YELLOW' ? '🟡 MODERATE' : '🟢 SAFE'}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                      Category: <b>{zone.category}</b> • Footfall Trend: <b>{zone.trend}</b>
                    </p>

                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden my-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          zone.level === 'RED' ? 'bg-red-600' : zone.level === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${zone.density}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono font-bold" style={{ color: currentTheme.textMuted }}>
                      <span>Humans Gathered: {zone.count} / {zone.maxCap}</span>
                      <span>Density: {zone.density}% Capacity</span>
                    </div>
                  </div>

                  {zone.level === 'RED' && (
                    <button
                      onClick={() => handleDispatchCrowdControl(zone)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Dispatch Crowd Dispersion & Voice Warning</span>
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}