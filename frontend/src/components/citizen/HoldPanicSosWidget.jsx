import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Undo2, Lock } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';
import { speakEmergencyVoice, stopEmergencyVoice } from '../../utils/voiceAlerts';

export default function HoldPanicSosWidget({
  onTriggerQuickSos,
  onCancelQuickSos,
  currentTheme,
  isFormOpen,
  hasActiveTicket
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [cancelCountdown, setCancelCountdown] = useState(null);
  const [pendingTicketId, setPendingTicketId] = useState(null);

  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const cancelTimerRef = useRef(null);

  const HOLD_DURATION = 3000; // 3 Seconds
  const INTERVAL_STEP = 50;

  const startHolding = (e) => {
    if (hasActiveTicket || cancelCountdown !== null) return;
    e.preventDefault();
    setIsHolding(true);
    setHoldProgress(0);

    triggerHapticFeedback('medium');

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(progress);

      if (progress > 30 && progress < 35) triggerHapticFeedback('light');
      if (progress > 65 && progress < 70) triggerHapticFeedback('medium');

      if (elapsed >= HOLD_DURATION) {
        clearInterval(progressIntervalRef.current);
        executeImmediateSos();
      }
    }, INTERVAL_STEP);
  };

  const cancelHolding = () => {
    if (cancelCountdown !== null) return;
    setIsHolding(false);
    setHoldProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  const executeImmediateSos = () => {
    setIsHolding(false);
    setHoldProgress(0);

    triggerHapticFeedback('sos');
    speakEmergencyVoice('Critical distress beacon broadcasted. Help is en route.');

    const generatedId = onTriggerQuickSos('Critical Panic SOS');
    setPendingTicketId(generatedId);
    setCancelCountdown(5);
  };

  useEffect(() => {
    if (cancelCountdown === null) return;

    if (cancelCountdown > 0) {
      cancelTimerRef.current = setTimeout(() => {
        setCancelCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCancelCountdown(null);
      setPendingTicketId(null);
    }

    return () => clearTimeout(cancelTimerRef.current);
  }, [cancelCountdown]);

  const handleCancelDispatchedSos = () => {
    if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
    stopEmergencyVoice();
    triggerHapticFeedback('warning');

    if (pendingTicketId && onCancelQuickSos) {
      onCancelQuickSos(pendingTicketId);
    }

    setCancelCountdown(null);
    setPendingTicketId(null);
    speakEmergencyVoice('SOS broadcast cancelled.');
  };

  if (isFormOpen) return null;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="fixed bottom-24 right-6 sm:right-8 z-[999] flex flex-col items-end select-none">
      {cancelCountdown !== null ? (
        <div className="p-4 rounded-3xl bg-red-600 text-white shadow-2xl border-2 border-red-300 flex items-center space-x-3 animate-bounce max-w-xs text-left">
          <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-black text-sm shrink-0">
            {cancelCountdown}s
          </div>
          <div className="text-xs">
            <p className="font-black uppercase tracking-wider">SOS DISPATCHED!</p>
            <p className="text-[11px] opacity-90">Tapped by accident?</p>
          </div>
          <button
            onClick={handleCancelDispatchedSos}
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-black text-xs shadow hover:bg-stone-100 flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-end space-y-2">
          {isHolding && (
            <div className="p-2.5 rounded-2xl bg-black/90 text-white text-[10px] font-mono border border-red-500/40 max-w-xs text-left shadow-2xl animate-fadeIn">
              <span className="text-amber-400 font-bold flex items-center space-x-1 mb-0.5">
                <AlertTriangle className="w-3 h-3" />
                <span>LEGAL NOTICE (DM ACT SEC 54)</span>
              </span>
              <span>High-precision GPS broadcast initiated. False alarms are legally punishable.</span>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90 pointer-events-none absolute z-10">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-black/10 dark:text-white/10"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-red-500 transition-all duration-75"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <button
              onMouseDown={startHolding}
              onMouseUp={cancelHolding}
              onMouseLeave={cancelHolding}
              onTouchStart={startHolding}
              onTouchEnd={cancelHolding}
              disabled={hasActiveTicket}
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-transform active:scale-95 cursor-pointer relative z-20 ${
                hasActiveTicket
                  ? 'bg-stone-600 opacity-80 cursor-not-allowed border-2 border-stone-400'
                  : isHolding
                  ? 'bg-red-700 scale-105'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
              style={{
                boxShadow: isHolding
                  ? '0 0 35px rgba(239, 68, 68, 0.9)'
                  : hasActiveTicket
                  ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                  : '0 8px 25px rgba(220, 38, 38, 0.5)'
              }}
              aria-label="Hold 3 seconds for Panic SOS"
            >
              {hasActiveTicket ? (
                <Lock className="w-6 h-6 text-stone-300" />
              ) : (
                <ShieldAlert className={`w-6 h-6 ${isHolding ? 'animate-bounce text-amber-300' : ''}`} />
              )}
              <span className="text-[9px] font-black tracking-tighter mt-0.5">
                {hasActiveTicket ? 'LOCKED' : isHolding ? `${Math.ceil((100 - holdProgress) / 33)}s` : 'HOLD SOS'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}