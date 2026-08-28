import React from 'react';

export default function AuditExport({
  currentTheme,
  auditLogs,
  setIsBlueprintModalOpen
}) {
  return (
    <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4 animate-fadeIn" style={{ borderColor: currentTheme.border }}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Human-in-the-Loop Audit Trail</h4>
          <p className="text-[11px]" style={{ color: currentTheme.textMuted }}>All administrative decisions logged with timestamp and user role.</p>
        </div>
        <button
          onClick={() => setIsBlueprintModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer hover:brightness-95"
          style={{ backgroundColor: currentTheme.btnAuth, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
        >
          Export Official Blueprint
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-2.5 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">[{log.user}]</span>
              <span style={{ color: currentTheme.textPrimary }}>{log.action}</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: currentTheme.textMuted }}>{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}