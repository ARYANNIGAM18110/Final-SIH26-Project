import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle,
  Navigation,
  Lock,
  User,
  ShieldAlert,
  Radio,
  MapPin,
  KeyRound,
  BatteryCharging,
  Clock,
  ShieldCheck,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

export default function GoogleMapsModal({
  selectedEmergencyForMap,
  onClose,
  currentTheme,
  mapContainerRef,
  leafletMapRef,
  updateEmergencyStatus
}) {
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  // Victim & Rescuer Coordinates (Fallback safe values)
  const victimLat = selectedEmergencyForMap?.location?.lat || 28.5355;
  const victimLng = selectedEmergencyForMap?.location?.lng || 77.3910;
  const rescuerLat = victimLat + 0.0055;
  const rescuerLng = victimLng - 0.0048;

  const distanceKm = calculateDistanceKm(rescuerLat, rescuerLng, victimLat, victimLng);
  const calculatedEtaMins = Math.max(2, Math.round(parseFloat(distanceKm) * 3.5));

  // --- HOOKS MUST RUN UNCONDITIONALLY ON EVERY RENDER ---
  useEffect(() => {
    if (!selectedEmergencyForMap || !window.L || !mapContainerRef.current) return;
    const L = window.L;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [(victimLat + rescuerLat) / 2, (victimLng + rescuerLng) / 2],
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });
    leafletMapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Victim Marker (Red SOS)
    const victimPinHtml = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(239,68,68,0.35);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:30px;height:30px;border-radius:50%;background:#ef4444;color:white;display:flex;align-items:center;justify-content:center;border:2px solid white;font-weight:bold;font-size:12px;box-shadow:0 4px 10px rgba(0,0,0,0.4);">
          🆘
        </div>
      </div>
    `;
    const victimIcon = L.divIcon({ html: victimPinHtml, className: 'victim-pin', iconSize: [30, 30], iconAnchor: [15, 15] });
    L.marker([victimLat, victimLng], { icon: victimIcon })
      .addTo(map)
      .bindPopup(`<b>Victim Site:</b><br/>${selectedEmergencyForMap.location?.address || 'Incident Site'}`)
      .openPopup();

    // Rescuer Marker (Amber Shield)
    const rescuerPinHtml = `
      <div style="width:32px;height:32px;border-radius:10px;background:#f59e0b;color:#0c0a09;display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;font-weight:900;font-size:12px;box-shadow:0 4px 10px rgba(0,0,0,0.4);">
        🛡️
      </div>
    `;
    const rescuerIcon = L.divIcon({ html: rescuerPinHtml, className: 'rescuer-pin', iconSize: [32, 32], iconAnchor: [16, 16] });
    L.marker([rescuerLat, rescuerLng], { icon: rescuerIcon })
      .addTo(map)
      .bindPopup(`<b>NDRF UNIT-BRAVO-09</b><br/>Status: En-Route Interception`);

    // Quickest Path Polyline
    const midLat = (victimLat + rescuerLat) / 2 + 0.0008;
    const midLng = (victimLng + rescuerLng) / 2;
    const routePoints = [
      [rescuerLat, rescuerLng],
      [midLat, midLng],
      [victimLat, victimLng]
    ];

    L.polyline(routePoints, {
      color: '#2563eb',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);

    const bounds = L.latLngBounds([[victimLat, victimLng], [rescuerLat, rescuerLng]]);
    map.fitBounds(bounds, { padding: [40, 40] });

    setTimeout(() => map && map.invalidateSize(), 200);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [selectedEmergencyForMap, victimLat, victimLng, rescuerLat, rescuerLng]);

  // Early return safely placed AFTER all hooks
  if (!selectedEmergencyForMap) return null;

  const isResolved = selectedEmergencyForMap.status === 'RESOLVED';
  const isNotified = selectedEmergencyForMap.status === 'RESCUE_NOTIFIED';
  const canClose = isNotified;
  const proof = selectedEmergencyForMap.proofData;

  const handleSealTicket = () => {
    if (typeof updateEmergencyStatus === 'function') {
      updateEmergencyStatus(selectedEmergencyForMap.id, 'RESOLVED');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="border w-full max-w-4xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col space-y-4 max-h-[94vh] overflow-y-auto"
        style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="text-left flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black" style={{ color: currentTheme.textPrimary }}>
                Live Interception Telemetry & Path
              </h3>
              <p className="text-xs font-mono" style={{ color: currentTheme.textMuted }}>
                Target ID: {selectedEmergencyForMap.dispatchId} • Rapid Triage Grid
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" style={{ color: currentTheme.textMuted }} />
          </button>
        </div>

        {/* Live Distance & ETA Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span className="font-bold">Interception Distance:</span>
            <span className="text-base font-black">{distanceKm} km</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-700 dark:text-amber-300">
            <span className="font-bold">Quickest ETA:</span>
            <span className="text-base font-black">~{calculatedEtaMins} Mins</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="font-bold">Path Trajectory:</span>
            <span className="text-xs font-black uppercase">CLEAR (OPTIMAL)</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden border h-60 sm:h-72 w-full relative shadow-inner" style={{ borderColor: currentTheme.border }}>
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* --- PROMINENT RESCUE PROOF DOSSIER CARD (FOR AUTHORITY AUDIT) --- */}
        {isNotified && proof ? (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/40 text-left space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-2 border-cyan-500/20">
              <div className="flex items-center space-x-2 text-cyan-800 dark:text-cyan-300 font-black text-xs">
                <ShieldCheck className="w-5 h-5 text-cyan-500" />
                <span className="uppercase tracking-wider">Ground Rescue Proof Submitted by Rescuer</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 text-[10px] font-mono font-bold">
                Awaiting Authority Sign-off
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border" style={{ borderColor: currentTheme.border }}>
                <span style={{ color: currentTheme.textMuted }}>Evacuated Headcount:</span>
                <p className="text-sm font-black text-cyan-700 dark:text-cyan-300 mt-0.5">{proof.evacueeCount} Persons</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border" style={{ borderColor: currentTheme.border }}>
                <span style={{ color: currentTheme.textMuted }}>Safe-Code Match:</span>
                <p className="text-sm font-black text-amber-600 dark:text-amber-300 mt-0.5">
                  Code: {proof.verificationCode} {proof.verificationCode === selectedEmergencyForMap.safeCode ? '✓ (VERIFIED)' : ''}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border" style={{ borderColor: currentTheme.border }}>
                <span style={{ color: currentTheme.textMuted }}>Time Notified:</span>
                <p className="text-sm font-black text-stone-800 dark:text-stone-200 mt-0.5">{proof.notifiedAt || 'Just now'}</p>
              </div>
            </div>

            {/* Remarks */}
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs" style={{ borderColor: currentTheme.border }}>
              <span className="font-bold text-stone-600 dark:text-stone-400">Rescuer Field Clearance Remarks:</span>
              <p className="text-xs font-semibold mt-0.5" style={{ color: currentTheme.textPrimary }}>
                "{proof.resolutionNote || 'Victim safely evacuated to shelter.'}"
              </p>
            </div>

            {/* Ground Proof Photo Preview */}
            {proof.proofPhoto && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  <Camera className="w-4 h-4" />
                  <span>Ground Scene Proof Attached:</span>
                </div>
                <div
                  onClick={() => setShowFullPhoto(!showFullPhoto)}
                  className="relative rounded-2xl overflow-hidden border border-cyan-500/30 max-h-48 w-full cursor-pointer group bg-black/20"
                >
                  <img
                    src={proof.proofPhoto}
                    alt="Ground rescue proof"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold space-x-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>Click to Toggle Full Image</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-center space-x-2 text-xs text-amber-800 dark:text-amber-300 font-bold">
            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Rescuer is still on the ground. Proof dossier (photos & safe-code) will appear here once submitted.</span>
          </div>
        )}

        {/* Dual Entity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs font-mono">
          {/* Victim Details Card */}
          <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2.5" style={{ borderColor: currentTheme.border }}>
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-black">
              <User className="w-4 h-4" />
              <span className="uppercase">Citizen / Victim Details</span>
            </div>
            <div className="space-y-1.5 text-[11px]" style={{ color: currentTheme.textPrimary }}>
              <p><strong>Category:</strong> {selectedEmergencyForMap.category}</p>
              <p className="leading-snug"><strong>Message:</strong> "{selectedEmergencyForMap.text}"</p>
              <p className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{selectedEmergencyForMap.location?.address || 'Recorded Field Coordinates'}</span>
              </p>
              <p className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Expected Safe-Code: {selectedEmergencyForMap.safeCode || '4829'}</span>
              </p>
            </div>
          </div>

          {/* Rescuer Details Card */}
          <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2.5" style={{ borderColor: currentTheme.border }}>
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-black">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="uppercase">Assigned Rescuer Unit</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px]">UNIT-BRAVO-09</span>
            </div>
            <div className="space-y-1.5 text-[11px]" style={{ color: currentTheme.textPrimary }}>
              <p><strong>Unit:</strong> NDRF Quick Response Squad Alpha</p>
              <p><strong>Officer Lead:</strong> {selectedEmergencyForMap.assignedOfficer || 'Officer Alex Mercer'}</p>
              <p className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Telemetry: {isNotified ? 'RESCUE COMPLETED (PROOF ATTACHED)' : 'EN-ROUTE INTERCEPTING'}</span>
              </p>
              <p className="flex items-center space-x-1" style={{ color: currentTheme.textMuted }}>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                <span>Battery: 94% • Mesh RSSI: -58 dBm</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
          <button
            type="button"
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${rescuerLat},${rescuerLng}&destination=${victimLat},${victimLng}`;
              window.open(mapsUrl, '_blank');
            }}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow flex items-center space-x-1.5 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Interception in Google Maps</span>
          </button>

          {!isResolved && (
            canClose ? (
              <button
                type="button"
                onClick={handleSealTicket}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow flex items-center space-x-1.5 cursor-pointer animate-bounce"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify Proof & Seal Ticket</span>
              </button>
            ) : (
              <div className="py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 border text-xs font-mono flex items-center space-x-1.5 opacity-70" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Awaiting Rescuer Ground Proof & Safe-Code</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}