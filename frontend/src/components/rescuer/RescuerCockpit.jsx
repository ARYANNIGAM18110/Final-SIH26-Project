import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  BatteryCharging,
  Activity,
  CheckCircle2,
  Bluetooth,
  MapPin,
  Navigation,
  Compass,
  ArrowRight,
  HeartPulse,
  X,
  Smartphone,
  Signal,
  ShieldCheck,
  Camera,
  AlertTriangle,
  Send,
  KeyRound
} from 'lucide-react';
import { broadcastDistressPacket, scanNearbyBleRescuers } from '../../utils/bleMeshEngine';

// --- Sub-component 1: START Triage Modal ---
function RescuerTriageModal({ isOpen, mission, onClose, currentTheme, onSaveTriage }) {
  const [triageCategory, setTriageCategory] = useState('IMMEDIATE');
  const [patientCount, setPatientCount] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !mission) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTriage(mission.id, {
      triageCategory,
      patientCount: parseInt(patientCount, 10),
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative transition-all text-left"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-black" style={{ color: currentTheme.textPrimary }}>
              START Field Triage Log
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" style={{ color: currentTheme.textMuted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-extrabold mb-1.5" style={{ color: currentTheme.textPrimary }}>
              Triage Priority Classification (START Protocol)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'IMMEDIATE', label: '🔴 RED (Immediate / Critical)', border: 'border-red-500' },
                { id: 'DELAYED', label: '🟡 YELLOW (Delayed)', border: 'border-amber-500' },
                { id: 'MINOR', label: '🟢 GREEN (Minor / Walking)', border: 'border-emerald-500' },
                { id: 'EXPECTANT', label: '⚫ BLACK (Deceased / Expectant)', border: 'border-stone-500' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTriageCategory(item.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    triageCategory === item.id ? `${item.border} bg-black/10 dark:bg-white/10 ring-2 ring-amber-500` : 'opacity-70'
                  }`}
                  style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
              Total Casualties / Victims On-Site
            </label>
            <input
              type="number"
              min="1"
              value={patientCount}
              onChange={(e) => setPatientCount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
              Field Medical Notes / Critical Demands
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 1 head trauma, oxygen cylinder needed urgently..."
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold outline-none resize-none"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border text-xs font-bold cursor-pointer"
              style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Record Triage Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Sub-component 2: Rescue Notification & Proof Submission Modal ---
function RescuerResolveModal({ isOpen, mission, onClose, currentTheme, onConfirmResolve }) {
  const [evacueeCount, setEvacueeCount] = useState('1');
  const [resolutionNote, setResolutionNote] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [citizenHandoverConfirmed, setCitizenHandoverConfirmed] = useState(false);
  const [proofPhoto, setProofPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !mission) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setProofPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = verificationCode.trim();

    if (mission.safeCode && cleanInput && cleanInput !== mission.safeCode) {
      setErrorMsg(`❌ Invalid Safe-Code! The code does not match the Citizen's Safe-Code.`);
      return;
    }

    if (!citizenHandoverConfirmed && !cleanInput) {
      setErrorMsg('Please enter the 4-digit Citizen Safe-Code or confirm physical handover.');
      return;
    }

    onConfirmResolve(mission.id, {
      evacueeCount: parseInt(evacueeCount, 10) || 1,
      resolutionNote: resolutionNote || 'All clear. Evacuation complete.',
      proofPhoto,
      verificationCode: cleanInput || 'MANUAL_OFFICER_OVERRIDE',
      notifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notifiedDate: 'Today'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-left transition-all max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: currentTheme.bgCard,
          borderColor: currentTheme.border
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black" style={{ color: currentTheme.textPrimary }}>
                Submit Rescue Completion Proof
              </h3>
              <p className="text-[11px] font-mono" style={{ color: currentTheme.textMuted }}>
                Target: {mission.dispatchId} ({mission.category})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" style={{ color: currentTheme.textMuted }} />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-300 text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black mb-1" style={{ color: currentTheme.textPrimary }}>
              Total Individuals Rescued / Evacuated
            </label>
            <input
              type="number"
              min="1"
              required
              value={evacueeCount}
              onChange={(e) => setEvacueeCount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-black mb-1 flex items-center space-x-1" style={{ color: currentTheme.textPrimary }}>
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Citizen 4-Digit Safe-Code (From Citizen's Screen)</span>
            </label>
            <input
              type="text"
              maxLength="8"
              autoComplete="off"
              placeholder="e.g. 4829"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-black tracking-widest outline-none transition-all focus:ring-2 focus:ring-amber-500"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
            {mission.safeCode && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-1">
                * Citizen's Ticket verification code expected.
              </p>
            )}
          </div>

          <label className="flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer select-none" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.btnAuth }}>
            <input
              type="checkbox"
              checked={citizenHandoverConfirmed}
              onChange={(e) => setCitizenHandoverConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-extrabold" style={{ color: currentTheme.textPrimary }}>
                I verify that field rescue & transit handover is successfully completed
              </span>
              <p className="text-[10px] mt-0.5" style={{ color: currentTheme.textMuted }}>
                Will notify Command Grid for final sign-off and safety audit.
              </p>
            </div>
          </label>

          <div>
            <label className="block text-xs font-black mb-1.5" style={{ color: currentTheme.textPrimary }}>
              Ground Proof Photo (Optional)
            </label>
            <label className="flex items-center justify-center space-x-2 w-full p-2.5 rounded-xl border border-dashed cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: currentTheme.border }}>
              <Camera className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>
                {photoName ? `Attached: ${photoName}` : 'Capture / Upload Proof Photo'}
              </span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-black mb-1" style={{ color: currentTheme.textPrimary }}>
              Rescue Summary / Field Remarks
            </label>
            <textarea
              rows="2"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Victims handed over to Medical Base Camp Team..."
              className="w-full px-4 py-2 rounded-xl border text-xs font-semibold outline-none resize-none"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border text-xs font-bold cursor-pointer"
              style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Notify Command Grid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Sub-component 3: Rescuer Mission Card ---
function RescuerMissionCard({ mission, currentTheme, onOpenMapModal, onOpenTriageModal, onAdvanceStatus }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE_DISPATCH':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">DISPATCHED</span>;
      case 'TEAM_EN_ROUTE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-stone-950 font-black">EN ROUTE</span>;
      case 'ON_SCENE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white font-black">ON SCENE</span>;
      case 'RESCUE_NOTIFIED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-600 text-white font-black animate-pulse">RESCUE NOTIFIED (AUDIT)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white font-black">CLOSED & AUDITED</span>;
    }
  };

  const getNextActionLabel = (status) => {
    switch (status) {
      case 'ACTIVE_DISPATCH':
        return 'Accept & Depart';
      case 'TEAM_EN_ROUTE':
        return 'Arrived On Scene';
      case 'ON_SCENE':
        return 'Verify & Submit Proof';
      case 'RESCUE_NOTIFIED':
        return 'Awaiting HQ Closure';
      default:
        return 'Mission Closed';
    }
  };

  return (
    <div
      className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4 transition-all hover:border-amber-500/50 text-left"
      style={{ borderColor: currentTheme.border }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">{mission.dispatchId}</span>
          <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold">
            {mission.category}
          </span>
          <span className="text-[11px] font-mono" style={{ color: currentTheme.textMuted }}>
            Reported: {mission.time}
          </span>
        </div>
        {getStatusBadge(mission.status)}
      </div>

      <p className="text-xs sm:text-sm font-bold leading-relaxed" style={{ color: currentTheme.textPrimary }}>
        "{mission.text}"
      </p>

      {/* Verification Details if Notified */}
      {mission.proofData && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-black text-cyan-800 dark:text-cyan-300">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Ground Proof Submitted to HQ</span>
            </span>
            <span>Evacuees: {mission.proofData.evacueeCount}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 dark:text-stone-300">
            <span>Safe Code: <strong>{mission.proofData.verificationCode}</strong></span>
            <span>At: {mission.proofData.notifiedAt}</span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-mono truncate">Remarks: {mission.proofData.resolutionNote}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-1 border-t flex-wrap gap-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
        <div className="flex items-center space-x-1.5 truncate">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">{mission.location?.address || 'Field Location Recorded'}</span>
        </div>
        <span className="font-mono text-amber-600 dark:text-amber-400">
          {mission.location?.lat?.toFixed(4)}°, {mission.location?.lng?.toFixed(4)}°
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mission.location.lat},${mission.location.lng}`;
            window.open(mapsUrl, '_blank');
          }}
          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Turn-by-Turn</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenMapModal(mission)}
          className="py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 cursor-pointer hover:brightness-95"
          style={{ backgroundColor: currentTheme.btnAuth, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
        >
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>GIS Heatmap</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenTriageModal(mission)}
          className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>START Triage</span>
        </button>

        <button
          type="button"
          disabled={mission.status === 'RESCUE_NOTIFIED' || mission.status === 'RESOLVED'}
          onClick={() => onAdvanceStatus(mission)}
          className={`py-2.5 px-3 rounded-xl font-black text-xs shadow flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
            mission.status === 'ON_SCENE'
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : mission.status === 'RESCUE_NOTIFIED'
              ? 'bg-stone-500/20 text-stone-500 border border-stone-500/30 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
          }`}
        >
          <span>{getNextActionLabel(mission.status)}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// --- Main Rescuer Cockpit ---
export default function RescuerCockpit({
  currentTheme,
  currentLocation,
  emergencyAlerts,
  updateEmergencyStatus,
  onOpenMapModal
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [unitStatus, setUnitStatus] = useState('ACTIVE_PATROL');
  const [activeTriageMission, setActiveTriageMission] = useState(null);
  const [activeResolveMission, setActiveResolveMission] = useState(null);
  const [isScanningBle, setIsScanningBle] = useState(false);
  const [discoveredNodes, setDiscoveredNodes] = useState([
    { deviceId: 'node-mesh-01', name: 'Field Relay Alpha (Samsung S23)', rssi: -58, status: 'CONNECTED_PEER', relayedTickets: 2 }
  ]);

  const pendingMissions = emergencyAlerts.filter((a) => a.status !== 'RESOLVED');

  const filteredMissions = pendingMissions.filter((mission) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return mission.category === 'Medical Emergency' || mission.category === 'Fire Help';
    return mission.category === activeFilter;
  });

  const handleAdvanceStatus = (mission) => {
    if (mission.status === 'ACTIVE_DISPATCH') {
      updateEmergencyStatus(mission.id, 'TEAM_EN_ROUTE');
    } else if (mission.status === 'TEAM_EN_ROUTE') {
      updateEmergencyStatus(mission.id, 'ON_SCENE');
    } else if (mission.status === 'ON_SCENE') {
      setActiveResolveMission(mission);
    }
  };

  const handleConfirmResolve = (missionId, proofData) => {
    updateEmergencyStatus(missionId, 'RESCUE_NOTIFIED', proofData);
    broadcastDistressPacket({ id: missionId, status: 'RESCUE_NOTIFIED', ...proofData });
  };

  const handleSaveTriage = (missionId, triageData) => {
    if (missionId && triageData) {
      broadcastDistressPacket({ id: missionId, ...triageData });
    }
  };

  const handleBleScanTrigger = async () => {
    setIsScanningBle(true);
    const res = await scanNearbyBleRescuers((node) => {
      setDiscoveredNodes((prev) => {
        if (prev.some((d) => d.deviceId === node.deviceId)) return prev;
        return [...prev, { ...node, status: 'CONNECTED_PEER', relayedTickets: 0 }];
      });
    });

    if (!res.success) {
      setTimeout(() => {
        setIsScanningBle(false);
        setDiscoveredNodes((prev) => [
          ...prev,
          {
            deviceId: 'node-' + Math.floor(100 + Math.random() * 900),
            name: 'Citizen Node (Redmi Note 12)',
            rssi: -62,
            status: 'CONNECTED_PEER',
            relayedTickets: 1
          }
        ]);
      }, 1200);
    } else {
      setTimeout(() => setIsScanningBle(false), 4000);
    }
  };

  return (
    <div
      className="border rounded-3xl p-4 sm:p-8 shadow-xl max-w-5xl w-full transition-all text-left space-y-6 animate-fadeIn"
      style={{
        backgroundColor: currentTheme.bgCard,
        borderColor: currentTheme.border,
        boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
      }}
    >
      {/* Tactical Cockpit Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b gap-4" style={{ borderColor: currentTheme.border }}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30 shrink-0">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] sm:text-[11px] font-black rounded-md uppercase">
                NDRF TACTICAL COCKPIT
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">
                UNIT-BRAVO-09
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.textPrimary }}>
              Field Response Command
            </h2>
            <p className="text-[11px] sm:text-xs font-medium" style={{ color: currentTheme.textMuted }}>
              Rapid Triage, Navigation & Local Mesh Sync
            </p>
          </div>
        </div>

        {/* Rescuer Status Controls */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs font-mono font-bold" style={{ borderColor: currentTheme.border }}>
            <BatteryCharging className="w-4 h-4 text-emerald-500" />
            <span>94%</span>
          </div>

          <button
            onClick={() => setUnitStatus((prev) => (prev === 'ACTIVE_PATROL' ? 'BUSY_RESCUE' : 'ACTIVE_PATROL'))}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center space-x-1.5 cursor-pointer ${
              unitStatus === 'ACTIVE_PATROL'
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/30'
                : 'bg-red-500/20 text-red-800 dark:text-red-200 border-red-500/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{unitStatus === 'ACTIVE_PATROL' ? 'READY (PATROL)' : 'ENGAGED IN RESCUE'}</span>
          </button>
        </div>
      </div>

      {/* GPS Telemetry & Mesh Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 flex items-center justify-between" style={{ borderColor: currentTheme.border }}>
          <span style={{ color: currentTheme.textMuted }}>Live Rescuer GPS:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {currentLocation ? `${currentLocation.lat.toFixed(4)}°N, ${currentLocation.lng.toFixed(4)}°E` : '28.5355°N, 77.3910°E'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 flex items-center justify-between gap-2" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center space-x-1.5 truncate">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
            <span style={{ color: currentTheme.textMuted }}>BLE Mesh:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {discoveredNodes.length > 0 ? `${discoveredNodes.length} Node(s) Active` : 'STANDBY'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBleScanTrigger}
            disabled={isScanningBle}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40 text-[10px] font-black tracking-wider flex items-center space-x-1 cursor-pointer"
          >
            <Bluetooth className={`w-3 h-3 ${isScanningBle ? 'animate-spin' : ''}`} />
            <span>{isScanningBle ? 'SCANNING...' : 'SCAN'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 flex items-center justify-between" style={{ borderColor: currentTheme.border }}>
          <span style={{ color: currentTheme.textMuted }}>Pending Tickets:</span>
          <span className="font-black text-red-600 dark:text-red-400">{pendingMissions.length} Active Targets</span>
        </div>
      </div>

      {/* Live Connected Peer Mesh Nodes Card */}
      {discoveredNodes.length > 0 && (
        <div
          className="p-4 rounded-2xl border bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3"
          style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                P2P Offline Mesh Active ({discoveredNodes.length} Peer Relays Paired)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
              Zero-Internet Data Syncing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {discoveredNodes.map((node) => (
              <div
                key={node.deviceId}
                className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs font-mono"
                style={{ borderColor: currentTheme.border }}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="truncate text-left">
                    <p className="font-bold truncate" style={{ color: currentTheme.textPrimary }}>{node.name}</p>
                    <p className="text-[10px]" style={{ color: currentTheme.textMuted }}>ID: {node.deviceId}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{node.rssi} dBm</span>
                  <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400">+{node.relayedTickets || 0} Relayed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'CRITICAL', 'Medical Emergency', 'Fire Help', 'Accident'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
              activeFilter === filter
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-black'
                : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
            }`}
            style={{
              borderColor: activeFilter === filter ? undefined : currentTheme.border,
              color: activeFilter === filter ? undefined : currentTheme.textPrimary
            }}
          >
            {filter === 'ALL' ? 'All Missions' : filter}
          </button>
        ))}
      </div>

      {/* Mission Queue Cards */}
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center space-y-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-60" />
            <p className="text-sm font-bold">No Active Rescue Missions In This Category</p>
            <p className="text-xs">Your patrol sector is completely cleared.</p>
          </div>
        ) : (
          filteredMissions.map((mission) => (
            <RescuerMissionCard
              key={mission.id}
              mission={mission}
              currentTheme={currentTheme}
              onOpenMapModal={onOpenMapModal}
              onOpenTriageModal={(m) => setActiveTriageMission(m)}
              onAdvanceStatus={handleAdvanceStatus}
            />
          ))
        )}
      </div>

      {/* Rescuer Triage Modal */}
      <RescuerTriageModal
        isOpen={Boolean(activeTriageMission)}
        mission={activeTriageMission}
        onClose={() => setActiveTriageMission(null)}
        currentTheme={currentTheme}
        onSaveTriage={handleSaveTriage}
      />

      {/* Rescue Notification & Proof Modal */}
      <RescuerResolveModal
        isOpen={Boolean(activeResolveMission)}
        mission={activeResolveMission}
        onClose={() => setActiveResolveMission(null)}
        currentTheme={currentTheme}
        onConfirmResolve={handleConfirmResolve}
      />
    </div>
  );
}