import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle,
  Lock,
  ShieldCheck,
  Compass,
  Navigation,
  Flame,
  HeartPulse,
  AlertTriangle,
  HelpCircle,
  Camera
} from 'lucide-react';

export function getCategoryBadgeIcon(category) {
  switch (category) {
    case 'Medical Emergency':
      return <HeartPulse className="w-3.5 h-3.5 text-red-500" />;
    case 'Fire Help':
      return <Flame className="w-3.5 h-3.5 text-amber-500" />;
    case 'Accident':
      return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />;
    default:
      return <HelpCircle className="w-3.5 h-3.5 text-blue-500" />;
  }
}

export default function EmergencyReportsTab({
  activeEmergencies,
  currentTheme,
  onSelectEmergencyForMap,
  updateEmergencyStatus
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE_DISPATCH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">DISPATCHED</span>;
      case 'TEAM_EN_ROUTE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-stone-950 font-black">EN ROUTE</span>;
      case 'ON_SCENE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white font-black">ON SCENE</span>;
      case 'RESCUE_NOTIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-600 text-white font-black animate-pulse">PROOF SUBMITTED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white font-black">CLOSED & AUDITED</span>;
    }
  };

  return (
    <div className="space-y-4">
      {activeEmergencies.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center space-y-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
          <CheckCircle className="w-12 h-12 text-emerald-500 opacity-60" />
          <p className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>All Sectors Cleared & Safe</p>
          <p className="text-xs">No pending emergency alerts in the active command queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeEmergencies.map((emg) => {
            const isNotified = emg.status === 'RESCUE_NOTIFIED';
            const canAuthorityClose = isNotified;

            return (
              <div
                key={emg.id}
                className="p-5 rounded-3xl border bg-black/5 dark:bg-white/5 space-y-4 transition-all text-left flex flex-col justify-between"
                style={{ borderColor: currentTheme.border }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">{emg.dispatchId}</span>
                      <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold flex items-center space-x-1">
                        {getCategoryBadgeIcon(emg.category)}
                        <span>{emg.category}</span>
                      </span>
                    </div>
                    {getStatusBadge(emg.status)}
                  </div>

                  <p className="text-xs sm:text-sm font-bold leading-relaxed" style={{ color: currentTheme.textPrimary }}>
                    "{emg.text}"
                  </p>

                  {/* Citizen Attached Photo */}
                  {emg.photo && (
                    <div className="rounded-xl overflow-hidden border max-h-40 w-full" style={{ borderColor: currentTheme.border }}>
                      <img src={emg.photo} alt="Citizen upload" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Ground Rescue Proof Validation Card */}
                  {isNotified && emg.proofData && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/40 text-xs space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between font-black text-cyan-800 dark:text-cyan-300">
                        <span className="flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4 text-cyan-500" />
                          <span>GROUND RESCUE PROOF ATTACHED</span>
                        </span>
                        <span className="font-mono">Headcount: {emg.proofData.evacueeCount}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-700 dark:text-stone-300">
                        <div>Safe-Code: <strong>{emg.proofData.verificationCode}</strong></div>
                        <div>Notified: <strong>{emg.proofData.notifiedAt}</strong></div>
                      </div>

                      {emg.proofData.resolutionNote && (
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                          Remarks: "{emg.proofData.resolutionNote}"
                        </p>
                      )}

                      {/* Rescuer Proof Photo Display */}
                      {emg.proofData.proofPhoto && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Rescuer Ground Proof Photo:</span>
                          </div>
                          <div className="rounded-xl overflow-hidden border max-h-44 w-full bg-black/20" style={{ borderColor: currentTheme.border }}>
                            <img src={emg.proofData.proofPhoto} alt="Rescuer ground completion proof" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 text-xs pt-1 border-t" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{emg.location?.address}</span>
                      </span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">
                        {emg.location?.lat?.toFixed(4)}°, {emg.location?.lng?.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span>Reported: {emg.time}</span>
                      <span>Assigned: {emg.assignedOfficer || 'Patrol Unit 09'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2" style={{ borderColor: currentTheme.border }}>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => onSelectEmergencyForMap(emg)}
                      className="w-1/2 py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                      <span>Live Telemetry & Route</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${emg.location.lat},${emg.location.lng}`;
                        window.open(mapsUrl, '_blank');
                      }}
                      className="w-1/2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Route</span>
                    </button>
                  </div>

                  {canAuthorityClose ? (
                    <button
                      type="button"
                      onClick={() => updateEmergencyStatus(emg.id, 'RESOLVED')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer animate-pulse"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify Proof & Seal Ticket</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 border text-[11px] font-mono text-center flex items-center justify-center space-x-1.5 opacity-70 cursor-not-allowed" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Awaiting Rescuer Ground Proof & Safe-Code</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}