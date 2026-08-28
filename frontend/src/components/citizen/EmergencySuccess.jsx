import React from 'react';
import {
  CheckCircle2,
  MapPin,
  PhoneCall,
  Users,
  Home,
  KeyRound
} from 'lucide-react';

export default function EmergencySuccess({
  currentTheme,
  dispatchId,
  safeCode,
  currentLocation,
  successMapRef,
  onOpenCommunityFeed,
  onRequestGoHome
}) {
  return (
    <div
      className="border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-8 shadow-2xl max-w-2xl sm:max-w-3xl w-full text-center relative backdrop-blur-xl space-y-5 animate-fadeIn"
      style={{
        backgroundColor: currentTheme.bgCard,
        borderColor: currentTheme.border,
        boxShadow: `0 20px 50px ${currentTheme.cardShadow}`
      }}
    >
      <div>
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl animate-bounce">
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        <span className="inline-block px-3.5 py-1 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-black rounded-full mb-2 tracking-widest uppercase">
          Dispatch ID: {dispatchId}
        </span>

        <h2 className="text-xl sm:text-2xl font-black mb-1 leading-snug text-emerald-700 dark:text-emerald-300">
          Emergency Alert Successfully Sent. Help is on the Way.
        </h2>

        <p className="text-xs font-medium leading-relaxed" style={{ color: currentTheme.textMuted }}>
          Your emergency signal and live GPS coordinates have been transmitted. Rescue units have been alerted!
        </p>
      </div>

      {/* --- PROMINENT CITIZEN SAFE-CODE VERIFICATION CARD --- */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-2">
        <div className="flex items-center justify-center space-x-1.5 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider">
          <KeyRound className="w-4 h-4" />
          <span>Your Citizen Verification Safe-Code</span>
        </div>
        <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-stone-900 dark:text-amber-300 py-1 select-all">
          {safeCode || '4829'}
        </div>
        <p className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 leading-snug">
          ⚠️ Share this 4-digit code with your rescuer when they arrive to officially verify your safe evacuation.
        </p>
      </div>

      {/* Interactive Live Map showing User Location & Nearby Stations */}
      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>
          <span className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
            <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Your Live GPS Location & Nearby Responders</span>
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">📍 GPS Signal Active</span>
        </div>

        <div className="relative h-60 sm:h-72 rounded-2xl border overflow-hidden bg-stone-900 border-emerald-500/40 shadow-xl">
          <div ref={successMapRef} className="absolute inset-0 z-0"></div>
        </div>
      </div>

      {/* Nearby Emergency Responder Hubs Cards */}
      <div className="text-left space-y-2">
        <p className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
          Nearby Emergency Responder Hubs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Hospital Card */}
          <div className="p-3 rounded-2xl border bg-blue-500/10 border-blue-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex justify-between items-start font-black text-blue-700 dark:text-blue-300">
                <span>🏥 District Hospital ER</span>
                <span className="text-[10px] font-mono bg-blue-500/20 px-1.5 py-0.5 rounded">420m</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Multi-Specialty Trauma Care & Ambulance Hub</p>
            </div>
            <button
              onClick={() => window.open('tel:102')}
              className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call Helpline (102)</span>
            </button>
          </div>

          {/* Police Station Card */}
          <div className="p-3 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex justify-between items-start font-black text-indigo-700 dark:text-indigo-300">
                <span>🚔 Central Police Hub</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded">310m</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Patrol Squad & Rapid Response Command</p>
            </div>
            <button
              onClick={() => window.open('tel:112')}
              className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call Police (112)</span>
            </button>
          </div>

          {/* Fire Station Card */}
          <div className="p-3 rounded-2xl border bg-amber-500/10 border-amber-500/30 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex justify-between items-start font-black text-amber-700 dark:text-amber-300">
                <span>🚒 Fire Station 04</span>
                <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">580m</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Hazmat & Disaster Emergency Response Unit</p>
            </div>
            <button
              onClick={() => window.open('tel:101')}
              className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call Fire (101)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Arrival & GPS Details */}
      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border text-left space-y-1.5" style={{ borderColor: currentTheme.border }}>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium" style={{ color: currentTheme.textMuted }}>Estimated Response Arrival:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">3 - 5 Minutes</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium" style={{ color: currentTheme.textMuted }}>Acquired GPS Coordinates:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {currentLocation ? `${currentLocation.lat.toFixed(4)}°, ${currentLocation.lng.toFixed(4)}°` : 'Acquired'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          onClick={() => window.open('tel:911')}
          className="w-full py-3.5 px-4 rounded-2xl bg-red-600 text-white font-black text-xs sm:text-sm shadow-xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call Hotline (911)</span>
        </button>

        <button
          onClick={onOpenCommunityFeed}
          className="w-full py-3.5 px-4 rounded-2xl border text-xs font-bold hover:brightness-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          style={{
            backgroundColor: currentTheme.btnAuth,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
        >
          <Users className="w-4 h-4 text-blue-500" />
          <span>Community Feed</span>
        </button>

        <button
          onClick={onRequestGoHome}
          className="w-full py-3.5 px-4 rounded-2xl border text-xs font-bold hover:brightness-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          style={{
            backgroundColor: currentTheme.btnAuth,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
}