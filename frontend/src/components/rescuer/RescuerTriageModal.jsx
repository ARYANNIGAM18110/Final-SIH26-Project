import React, { useState } from 'react';
import { X, HeartPulse, Check } from 'lucide-react';

export default function RescuerTriageModal({
  isOpen,
  mission,
  onClose,
  currentTheme,
  onSaveTriage
}) {
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
        className="border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative transition-all"
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
              <Check className="w-4 h-4" />
              <span>Record Triage Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}