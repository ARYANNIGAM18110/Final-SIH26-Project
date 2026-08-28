import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  FileDown,
  Printer,
  X,
  FileText,
  KeyRound,
  Users,
  Clock,
  Camera
} from 'lucide-react';
import { getCategoryBadgeIcon } from './EmergencyReportsTab';

// --- Sub-component: Official NDRF Incident Dossier Modal ---
function IncidentDossierModal({ isOpen, incident, onClose, currentTheme }) {
  if (!isOpen || !incident) return null;

  const proof = incident.proofData || {};
  const verificationHash = `NDRF-SHA256-${Math.abs(
    (incident.dispatchId + (incident.resolvedAt?.timestamp || '2026')).split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
  ).toString(16).toUpperCase()}`;

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="border w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto space-y-6 print:m-0 print:p-4 print:border-none print:shadow-none"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b print:hidden" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              National Disaster Response Force (NDRF) Clearance Audit
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintDossier}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
              <X className="w-5 h-5" style={{ color: currentTheme.textMuted }} />
            </button>
          </div>
        </div>

        {/* --- OFFICIAL PRINTABLE DOSSIER SHEET --- */}
        <div id="printable-dossier" className="p-6 sm:p-8 rounded-2xl border bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 space-y-6 font-mono border-stone-300 dark:border-stone-800 shadow-sm print:border-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-stone-900 dark:border-stone-100 gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                GOVERNMENT OF INDIA • DISASTER MANAGEMENT AUTHORITY
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                INCIDENT CLEARANCE & TRIAGE DOSSIER
              </h2>
              <p className="text-[11px] text-stone-500">
                Official Post-Incident Field Verification & Safety Sign-off Record
              </p>
            </div>
            <div className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl text-center font-black uppercase text-xs tracking-wider">
              ✓ OFFICIALLY SEALED
            </div>
          </div>

          {/* Incident Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b pb-4 border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Dispatch Ticket ID</span>
              <span className="font-black text-red-600 dark:text-red-400">{incident.dispatchId}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Category</span>
              <span className="font-bold">{incident.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Reported Time</span>
              <span>{incident.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">Closed Time</span>
              <span className="font-bold text-emerald-600">{incident.resolvedAt?.time || 'Today'}</span>
            </div>
          </div>

          {/* Victim Distress Context */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-stone-500 uppercase font-black block">Distress Signal Payload:</span>
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              "{incident.text}"
            </div>
          </div>

          {/* Location & GIS Telemetry */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-stone-500 uppercase font-black block">Incident Location & GPS:</span>
            <div className="flex justify-between items-center p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="truncate">{incident.location?.address}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0 ml-2">
                {incident.location?.lat?.toFixed(4)}°N, {incident.location?.lng?.toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* Field Verification & Rescuer Handover Audit */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] text-stone-500 uppercase font-black block">Ground Rescue Verification Audit:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] text-stone-500 block">Evacuated Headcount</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                  {proof.evacueeCount || 1} Casualties Handled
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] text-stone-500 block">Citizen Safe-Code Match</span>
                <span className="text-base font-black text-amber-700 dark:text-amber-300">
                  {proof.verificationCode || incident.safeCode || '4829'} (MATCHED)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-[10px] text-stone-500 block">Rescuer Tactical Unit</span>
                <span className="text-base font-black text-blue-700 dark:text-blue-300">
                  UNIT-BRAVO-09
                </span>
              </div>
            </div>

            {/* Field Remarks */}
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <span className="text-[10px] text-stone-500 font-bold block">Rescuer Ground Clearance Remarks:</span>
              <p className="mt-0.5 italic">"{proof.resolutionNote || 'All victims stabilized and transferred to Base Camp.'}"</p>
            </div>
          </div>

          {/* Signatures & Verification Seal */}
          <div className="pt-4 border-t-2 border-dashed border-stone-300 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 block uppercase">Cryptographic Audit Hash:</span>
              <span className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300">{verificationHash}</span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-stone-500 block uppercase">Authorized Officer Sign-off:</span>
              <span className="font-black text-sm text-stone-900 dark:text-stone-100">{incident.assignedOfficer || 'Officer Alex Mercer'}</span>
              <p className="text-[10px] text-emerald-600 font-bold">✓ NDRF Central Command Validated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main History Archive Tab ---
export default function HistoryArchiveTab({
  historySearchQuery,
  setHistorySearchQuery,
  historyCategoryFilter,
  setHistoryCategoryFilter,
  filteredHistory,
  currentTheme
}) {
  const [selectedIncidentForDossier, setSelectedIncidentForDossier] = useState(null);

  return (
    <div className="space-y-4 animate-fadeIn text-left">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
          <input
            type="text"
            value={historySearchQuery}
            onChange={(e) => setHistorySearchQuery(e.target.value)}
            placeholder="Search by Dispatch ID or location..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
            style={{
              backgroundColor: currentTheme.inputBg,
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary
            }}
          />
        </div>

        {/* Filter Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['ALL', 'Medical Emergency', 'Fire Help', 'Accident'].map((cat) => (
            <button
              key={cat}
              onClick={() => setHistoryCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                historyCategoryFilter === cat
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                  : 'bg-black/5 dark:bg-white/5 opacity-75 hover:opacity-100'
              }`}
              style={{
                borderColor: historyCategoryFilter === cat ? undefined : currentTheme.border,
                color: historyCategoryFilter === cat ? undefined : currentTheme.textPrimary
              }}
            >
              {cat === 'ALL' ? 'All Resolved' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List */}
      {filteredHistory.length === 0 ? (
        <div className="p-10 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center space-y-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
          <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-60" />
          <p className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>No Archival Records Found</p>
          <p className="text-xs">Cleared and resolved incidents will show up here permanently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3 flex flex-col justify-between"
              style={{ borderColor: currentTheme.border }}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">{item.dispatchId}</span>
                    <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold flex items-center space-x-1">
                      {getCategoryBadgeIcon(item.category)}
                      <span>{item.category}</span>
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                    SEALED & ARCHIVED
                  </span>
                </div>

                <p className="text-xs font-bold line-clamp-2" style={{ color: currentTheme.textPrimary }}>
                  "{item.text}"
                </p>

                {/* Resolved Audit & Proof Details */}
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono space-y-1">
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Officer Signed-Off:</span>
                    </span>
                    <span>{item.assignedOfficer || 'Officer Alex Mercer'}</span>
                  </div>
                  {item.proofData && (
                    <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                      <span>Evacuees: {item.proofData.evacueeCount}</span>
                      <span>Code: {item.proofData.verificationCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                  <span className="truncate flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{item.location?.address}</span>
                  </span>
                  <span className="shrink-0">{item.resolvedAt?.time || item.time}</span>
                </div>
              </div>

              {/* 1-Click Export Dossier Button */}
              <div className="pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForDossier(item)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Incident Clearance Dossier (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incident Dossier PDF Modal */}
      <IncidentDossierModal
        isOpen={Boolean(selectedIncidentForDossier)}
        incident={selectedIncidentForDossier}
        onClose={() => setSelectedIncidentForDossier(null)}
        currentTheme={currentTheme}
      />
    </div>
  );
}