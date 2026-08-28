import React from 'react';
import {
  ClipboardList,
  PlusCircle,
  DoorOpen,
  DoorClosed,
  QrCode,
  Search,
  CheckCircle2,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export default function AccessOpsTab({
  currentTheme,
  accessSubTab,
  setAccessSubTab,
  entryLogs,
  logSearchQuery,
  setLogSearchQuery,
  filteredLogs,
  handleCheckOutEntrant,
  newEntrantName,
  setNewEntrantName,
  newEntrantType,
  setNewEntrantType,
  newEntrantId,
  setNewEntrantId,
  newEntrantZone,
  setNewEntrantZone,
  handleCreateCheckIn,
  gatesStatus,
  toggleGateStatus,
  passRecipientName,
  setPassRecipientName,
  passZone,
  setPassZone,
  handleGeneratePass,
  generatedPass
}) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Sub-Tab Switcher */}
      <div className="flex overflow-x-auto gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border scrollbar-none" style={{ borderColor: currentTheme.border }}>
        <button
          onClick={() => setAccessSubTab('entry_log')}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
            accessSubTab === 'entry_log' ? 'shadow border' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: accessSubTab === 'entry_log' ? currentTheme.btnAuth : 'transparent',
            borderColor: accessSubTab === 'entry_log' ? currentTheme.border : 'transparent',
            color: currentTheme.textPrimary
          }}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Live Entry Log ({entryLogs.filter((l) => l.status === 'ACTIVE').length})</span>
        </button>

        <button
          onClick={() => setAccessSubTab('new_checkin')}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
            accessSubTab === 'new_checkin' ? 'shadow border' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: accessSubTab === 'new_checkin' ? currentTheme.btnAuth : 'transparent',
            borderColor: accessSubTab === 'new_checkin' ? currentTheme.border : 'transparent',
            color: currentTheme.textPrimary
          }}
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>New Check-In</span>
        </button>

        <button
          onClick={() => setAccessSubTab('gate_control')}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
            accessSubTab === 'gate_control' ? 'shadow border' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: accessSubTab === 'gate_control' ? currentTheme.btnAuth : 'transparent',
            borderColor: accessSubTab === 'gate_control' ? currentTheme.border : 'transparent',
            color: currentTheme.textPrimary
          }}
        >
          <DoorOpen className="w-3.5 h-3.5" />
          <span>Gates Control</span>
        </button>

        <button
          onClick={() => setAccessSubTab('pass_generator')}
          className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap cursor-pointer ${
            accessSubTab === 'pass_generator' ? 'shadow border' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: accessSubTab === 'pass_generator' ? currentTheme.btnAuth : 'transparent',
            borderColor: accessSubTab === 'pass_generator' ? currentTheme.border : 'transparent',
            color: currentTheme.textPrimary
          }}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Digital Pass</span>
        </button>
      </div>

      {/* Sub-Tab 1: Live Entry Log Table */}
      {accessSubTab === 'entry_log' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
              <input
                type="text"
                placeholder="Search entrants by Name, ID, or Access Zone..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
                style={{
                  backgroundColor: currentTheme.inputBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
              />
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden" style={{ borderColor: currentTheme.border }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-black/5 dark:bg-white/5 font-extrabold uppercase tracking-wider" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                    <th className="p-3.5 whitespace-nowrap">Log ID</th>
                    <th className="p-3.5 whitespace-nowrap">Entrant Name</th>
                    <th className="p-3.5 whitespace-nowrap">Category</th>
                    <th className="p-3.5 whitespace-nowrap">ID / License #</th>
                    <th className="p-3.5 whitespace-nowrap">Assigned Zone</th>
                    <th className="p-3.5 whitespace-nowrap">Time In</th>
                    <th className="p-3.5 whitespace-nowrap">Status</th>
                    <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-mono font-bold whitespace-nowrap">{log.id}</td>
                      <td className="p-3.5 font-extrabold whitespace-nowrap">{log.name}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold text-[10px]">{log.type}</span>
                      </td>
                      <td className="p-3.5 font-mono whitespace-nowrap">{log.idNumber}</td>
                      <td className="p-3.5 font-semibold whitespace-nowrap">{log.zone}</td>
                      <td className="p-3.5 font-mono whitespace-nowrap">{log.timeIn}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          log.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-stone-500/20 text-stone-600 dark:text-stone-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {log.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleCheckOutEntrant(log.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all cursor-pointer"
                            style={{ borderColor: currentTheme.border }}
                          >
                            Check Out
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold" style={{ color: currentTheme.textMuted }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: New Check-In Form */}
      {accessSubTab === 'new_checkin' && (
        <form onSubmit={handleCreateCheckIn} className="space-y-4 max-w-xl mx-auto p-4 rounded-2xl border bg-black/5 dark:bg-white/5" style={{ borderColor: currentTheme.border }}>
          <h3 className="text-sm font-extrabold uppercase tracking-wider mb-2 flex items-center space-x-2" style={{ color: currentTheme.textPrimary }}>
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Log New Authorized Entrant</span>
          </h3>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Robert Langdon"
              value={newEntrantName}
              onChange={(e) => setNewEntrantName(e.target.value)}
              className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
              style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Category</label>
              <select
                value={newEntrantType}
                onChange={(e) => setNewEntrantType(e.target.value)}
                className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
              >
                <option value="Visitor">Visitor / Guest</option>
                <option value="Staff">Employee / Staff</option>
                <option value="Contractor">Contractor / Vendor</option>
                <option value="Delivery">Delivery Driver</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Govt ID / License #</label>
              <input
                type="text"
                required
                placeholder="e.g. DL-99210-X"
                value={newEntrantId}
                onChange={(e) => setNewEntrantId(e.target.value)}
                className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
                style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Destination Zone</label>
            <select
              value={newEntrantZone}
              onChange={(e) => setNewEntrantZone(e.target.value)}
              className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
              style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              <option value="Main Reception">Main Reception</option>
              <option value="Level 2 Office Bay">Level 2 Office Bay</option>
              <option value="Command Hub 01">Command Hub 01</option>
              <option value="Server Room B">Server Room B</option>
              <option value="Loading Bay 03">Loading Bay 03</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
            style={{ backgroundColor: currentTheme.btnAuth, color: currentTheme.textPrimary, borderColor: currentTheme.border }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>CONFIRM & GRANT ENTRY PASS</span>
          </button>
        </form>
      )}

      {/* Sub-Tab 3: Electronic Gate Controls */}
      {accessSubTab === 'gate_control' && (
        <div className="space-y-4">
          <p className="text-xs font-medium mb-3" style={{ color: currentTheme.textMuted }}>
            Authorized Personnel Direct Gate Override & Electronic Turnstile Controls:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'gate01', name: 'Gate 01 - Main Entrance', desc: 'Primary visitor turnstile & RFID scanner.' },
              { id: 'gate02', name: 'Gate 02 - Service Ramp', desc: 'Heavy vehicle & courier entry bay.' },
              { id: 'gate03', name: 'Gate 03 - VIP Elevator', desc: 'High clearance biometric access lift.' }
            ].map((gate) => (
              <div key={gate.id} className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>{gate.name}</span>
                    {gatesStatus[gate.id] === 'UNLOCKED' ? <DoorOpen className="w-5 h-5 text-emerald-500" /> : <DoorClosed className="w-5 h-5 text-red-500" />}
                  </div>
                  <p className="text-[11px] mb-4" style={{ color: currentTheme.textMuted }}>{gate.desc}</p>
                </div>

                <button
                  onClick={() => toggleGateStatus(gate.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gatesStatus[gate.id] === 'UNLOCKED' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/20 text-red-800 dark:text-red-200'
                  }`}
                  style={{ borderColor: currentTheme.border }}
                >
                  Status: {gatesStatus[gate.id]} (Click to Toggle)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Pass Generator */}
      {accessSubTab === 'pass_generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={handleGeneratePass} className="space-y-4 p-4 rounded-2xl border bg-black/5 dark:bg-white/5" style={{ borderColor: currentTheme.border }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
              Issue Digital Visitor QR Pass
            </h3>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Recipient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Amanda Cole"
                value={passRecipientName}
                onChange={(e) => setPassRecipientName(e.target.value)}
                className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
                style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Zone Permission</label>
              <select
                value={passZone}
                onChange={(e) => setPassZone(e.target.value)}
                className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
              >
                <option value="Level 2 Office Bay">Level 2 Office Bay</option>
                <option value="Command Hub 01">Command Hub 01</option>
                <option value="Server Room B">Server Room B</option>
                <option value="Full Facility Clearance">Full Facility Clearance</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold border transition-all hover:brightness-95 cursor-pointer"
              style={{ backgroundColor: currentTheme.btnAuth, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
              Generate Pass QR Code
            </button>
          </form>

          {generatedPass ? (
            <div className="p-6 rounded-2xl border-2 border-emerald-500/50 bg-black/10 dark:bg-black/30 text-center space-y-3 relative overflow-hidden animate-fadeIn" style={{ borderColor: currentTheme.border }}>
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-black rounded-full uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL DIGITAL PASS</span>
              </div>

              <div className="w-24 h-24 bg-white p-2 mx-auto rounded-xl shadow-inner flex items-center justify-center">
                <QrCode className="w-20 h-20 text-stone-900" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">{generatedPass.passCode}</p>
                <h4 className="text-lg font-black" style={{ color: currentTheme.textPrimary }}>{generatedPass.name}</h4>
                <p className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Permitted Zone: {generatedPass.zone}</p>
              </div>

              <div className="pt-3 border-t text-[11px] flex justify-between" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                <span>Valid: {generatedPass.validUntil}</span>
                <span>Issuer: {generatedPass.issuer}</span>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center space-y-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
              <QrCode className="w-10 h-10 opacity-40" />
              <p className="text-xs font-bold">No Digital Pass Generated Yet</p>
              <p className="text-[11px]">Fill the form on the left to issue a pass QR code.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}