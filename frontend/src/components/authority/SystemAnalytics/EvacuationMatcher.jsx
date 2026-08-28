import React from 'react';
import {
  Building,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export default function EvacuationMatcher({
  currentTheme,
  habitations,
  selectedHabId,
  setSelectedHabId,
  selectedHab,
  candidateSites,
  selectedSiteId,
  setSelectedSiteId,
  selectedSite,
  isAllocationFeasible,
  remainingCap,
  requiredBuses,
  handleConfirmEvacuationShift
}) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="p-4 sm:p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4" style={{ borderColor: currentTheme.border }}>
        <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-3" style={{ borderColor: currentTheme.border }}>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Dynamic Hazard Evacuation & Safe Zone Allocator Engine</span>
            </h3>
            <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
              Select vulnerable population sectors in high-hazard Red zones and shift them to designated Green Safe Fields.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30">
            Capacity Optimization Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Source Danger Zone */}
          <div className="p-3.5 rounded-xl border bg-red-500/10 border-red-500/30 space-y-2">
            <label className="flex items-center space-x-1.5 text-xs font-extrabold text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Select Danger / Red Zone Habitation (Source)</span>
            </label>
            <select
              value={selectedHabId}
              onChange={(e) => setSelectedHabId(e.target.value)}
              className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
              style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              {habitations.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.pop} Citizens ({h.tier})
                </option>
              ))}
            </select>

            <div className="pt-2 text-[11px] space-y-1 font-medium" style={{ color: currentTheme.textMuted }}>
              <div>Hazard Type: <b className="text-red-600 dark:text-red-400">{selectedHab.hazard}</b></div>
              <div>Vulnerability Index: <b className="font-mono text-amber-600">{selectedHab.cvs} CVS Score</b></div>
              <div>Elderly / PwD Citizens: <b>{selectedHab.elderly} Seniors • {selectedHab.pwd} PwD</b></div>
            </div>
          </div>

          {/* Destination Safe Zone */}
          <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 space-y-2">
            <label className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Select Safe / Green Zone (Destination)</span>
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
              style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              {candidateSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Rem. Capacity: {s.maxCapacity - s.allocatedPop}
                </option>
              ))}
            </select>

            <div className="pt-2 text-[11px] space-y-1 font-medium" style={{ color: currentTheme.textMuted }}>
              <div>Facility Type: <b className="text-emerald-600 dark:text-emerald-400">{selectedSite.type}</b></div>
              <div>Water & Medical: <b>{selectedSite.waterSupply}</b></div>
              <div>Accessibility Note: <b>{selectedSite.accessibility}</b></div>
            </div>
          </div>
        </div>

        {/* Allocation Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono font-bold">
          <div className={`p-3 rounded-xl border flex justify-between items-center ${
            isAllocationFeasible ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300'
          }`}>
            <span>Evacuation Feasibility</span>
            <span>{isAllocationFeasible ? '✓ FEASIBLE' : '❌ NO CAPACITY'}</span>
          </div>

          <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
            <span style={{ color: currentTheme.textMuted }}>Citizens Shifting</span>
            <span style={{ color: currentTheme.textPrimary }}>{selectedHab.pop} / {remainingCap} Slots</span>
          </div>

          <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
            <span style={{ color: currentTheme.textMuted }}>Transport Convoy</span>
            <span className="text-amber-600 dark:text-amber-300">{requiredBuses} Buses Required</span>
          </div>
        </div>

        <button
          onClick={handleConfirmEvacuationShift}
          disabled={!isAllocationFeasible}
          className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
        >
          <ArrowUpRight className="w-5 h-5" />
          <span>EXECUTE EMERGENCY EVACUATION & SHIFT TO SAFE ZONE</span>
        </button>
      </div>
    </div>
  );
}