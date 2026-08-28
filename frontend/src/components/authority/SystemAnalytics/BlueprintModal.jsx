import React from 'react';
import { X } from 'lucide-react';

export default function BlueprintModal({
  isOpen,
  onClose,
  currentTheme,
  totalBudget,
  habitationsCount
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="border w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative text-left space-y-4" style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}>
        <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: currentTheme.border }}>
          <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Official Government Relocation Blueprint</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 rounded-xl border font-mono text-xs space-y-2" style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border }}>
          <p>Project Total Budget: <strong className="text-amber-600 dark:text-amber-400">₹ {totalBudget} Crores</strong></p>
          <p>Active Vulnerable Habitations: <strong>{habitationsCount} Sectors</strong></p>
          <p>Execution Status: <strong className="text-emerald-600 dark:text-emerald-400">APPROVED BY SDMA & NDRF COMMAND</strong></p>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer" style={{ borderColor: currentTheme.border }}>Close</button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-stone-900 shadow cursor-pointer">Print Official Order</button>
        </div>
      </div>
    </div>
  );
}