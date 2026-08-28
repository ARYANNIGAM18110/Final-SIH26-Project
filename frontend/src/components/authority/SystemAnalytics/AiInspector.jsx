import React from 'react';
import {
  Brain,
  Building,
  RefreshCw,
  Sparkles,
  Activity,
  CheckSquare,
  CheckCircle2
} from 'lucide-react';

export default function AiInspector({
  currentTheme,
  habitations,
  selectedInspectorHabId,
  setSelectedInspectorHabId,
  setAiInspectResult,
  currentInspectorHab,
  handleRunAiInspection,
  aiInspectLoading,
  aiInspectResult
}) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Habitation Selector Header */}
      <div className="p-4 sm:p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4" style={{ borderColor: currentTheme.border }}>
        <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-3" style={{ borderColor: currentTheme.border }}>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Structural & Disaster Risk Assessment Engine</span>
            </h3>
            <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
              Select any habitation or village to compute Composite Vulnerability Score (CVS) and generate AI diagnostic decisions.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            gemini-3-flash
          </span>
        </div>

        {/* Dropdown Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold" style={{ color: currentTheme.textMuted }}>
            Select Target Habitation / Village for Inspection:
          </label>
          <select
            value={selectedInspectorHabId}
            onChange={(e) => {
              setSelectedInspectorHabId(e.target.value);
              setAiInspectResult(null);
            }}
            className="w-full p-3 rounded-xl border text-xs sm:text-sm font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
            style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
          >
            {habitations.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — District: {h.district} ({h.pop} Citizens • {h.tier})
              </option>
            ))}
          </select>
        </div>

        {/* Baseline Profile Card */}
        <div className="p-4 rounded-xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
          <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: currentTheme.border }}>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Habitation Baseline Profile</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
              Hazard: {currentInspectorHab.hazard}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <div>
              <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Habitation / Village</span>
              <span className="font-extrabold text-sm" style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.name.replace(' (Red Hazard Zone)', '')}</span>
            </div>
            <div>
              <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>District & State</span>
              <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.district}, {currentInspectorHab.state || 'Uttarakhand'}</span>
            </div>
            <div>
              <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Population & Families</span>
              <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.pop} Citizens ({currentInspectorHab.families || Math.round(currentInspectorHab.pop / 5)} Families)</span>
            </div>
            <div>
              <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Housing Structure</span>
              <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.houses || 260} Total ({currentInspectorHab.kuchaHouses || 195} Kucha • {currentInspectorHab.puccaHouses || 65} Pucca)</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono pt-1 text-stone-500 dark:text-stone-400 border-t" style={{ borderColor: currentTheme.border }}>
            <span>GPS Coordinates: {currentInspectorHab.lat}° N, {currentInspectorHab.lng}° E</span>
            <span>Vulnerable Cohort: {currentInspectorHab.elderly} Seniors • {currentInspectorHab.pwd} PwD</span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleRunAiInspection}
          disabled={aiInspectLoading}
          className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 text-white bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:opacity-50"
        >
          {aiInspectLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing Satellite Radar & Multi-Factor Vulnerability Data...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>ANALYZE WITH AI INSPECTOR</span>
            </>
          )}
        </button>
      </div>

      {/* AI Output Panel */}
      {aiInspectResult && (
        <div className="space-y-4 animate-fadeIn">
          <div className={`p-5 rounded-2xl border-2 space-y-3 ${
            aiInspectResult.priority === 'CRITICAL'
              ? 'bg-red-500/10 border-red-500/50'
              : (aiInspectResult.priority === 'HIGH' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/50')
          }`}>
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  AI CLASSIFICATION DECISION
                </span>
                <h3 className={`text-lg sm:text-xl font-black mt-0.5 ${
                  aiInspectResult.priority === 'CRITICAL'
                    ? 'text-red-600 dark:text-red-400'
                    : (aiInspectResult.priority === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')
                }`}>
                  {aiInspectResult.classification}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] block font-bold" style={{ color: currentTheme.textMuted }}>Composite Vulnerability Score</span>
                <span className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
                  CVS: {aiInspectResult.cvs}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border text-xs font-semibold" style={{ borderColor: currentTheme.border }}>
              <b>Recommended Priority Action:</b> {aiInspectResult.recommendedAction}
            </div>

            <div className="text-[10px] font-mono text-purple-700 dark:text-purple-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{aiInspectResult.confidence}</span>
            </div>
          </div>

          {/* Sub-Scores Grid */}
          <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
              <Activity className="w-4 h-4" />
              <span>Multi-Factor Hazard & Vulnerability Sub-Scores (0 – 100)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Flood Exposure', score: aiInspectResult.scores.flood, color: 'bg-blue-500' },
                { label: 'Landslide Exposure', score: aiInspectResult.scores.landslide, color: 'bg-red-500' },
                { label: 'Seismic Exposure', score: aiInspectResult.scores.seismic, color: 'bg-purple-500' },
                { label: 'Terrain / Slope Risk', score: aiInspectResult.scores.terrain, color: 'bg-amber-500' },
                { label: 'Structural Vulnerability', score: aiInspectResult.scores.structural, color: 'bg-orange-500' },
                { label: 'Demographic Risk', score: aiInspectResult.scores.demographic, color: 'bg-indigo-500' },
                { label: 'Infrastructure Vulnerability', score: aiInspectResult.scores.infrastructure, color: 'bg-stone-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: currentTheme.border }}>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: currentTheme.textPrimary }}>{item.label}</span>
                    <span className="font-mono text-red-600 dark:text-red-400">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-800 dark:text-purple-200">
              <b>Formula Applied:</b> CVS = (0.40 × {aiInspectResult.hazardExposure} Hazard) + (0.35 × {aiInspectResult.structuralRisk} Structural) + (0.25 × {aiInspectResult.demographicRisk} Demographic) = <b>{aiInspectResult.cvs} Score</b>
            </div>
          </div>

          {/* Reasoning */}
          <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2" style={{ borderColor: currentTheme.border }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>AI Diagnostic Reasoning</span>
            </h4>
            <p className="text-xs font-semibold leading-relaxed p-3 rounded-xl bg-purple-500/10 border border-purple-500/20" style={{ color: currentTheme.textPrimary }}>
              "{aiInspectResult.reasoning}"
            </p>
          </div>

          {/* Action Checklist */}
          <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Recommended Actionable Evacuation Protocol</span>
            </h4>
            <div className="space-y-2 text-xs font-bold">
              {aiInspectResult.actions.map((act, index) => (
                <div key={index} className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}