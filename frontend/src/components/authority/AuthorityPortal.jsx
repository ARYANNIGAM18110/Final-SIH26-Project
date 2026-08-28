import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import AccessOpsTab from './AccessOpsTab';
import EmergencyReportsTab from './EmergencyReportsTab';
import HistoryArchiveTab from './HistoryArchiveTab';
import SystemAnalyticsTab from './SystemAnalytics/SystemAnalyticsTab';

export default function AuthorityPortal({
  currentTheme,
  loggedInUser,
  sessionTime,
  onSignOutClick,
  activePortalTab,
  setActivePortalTab,
  activeEmergenciesCount,
  resolvedEmergenciesCount,
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
  generatedPass,
  activeEmergencies,
  onSelectEmergencyForMap,
  historySearchQuery,
  setHistorySearchQuery,
  historyCategoryFilter,
  setHistoryCategoryFilter,
  filteredHistory,
  analyticsSubTab,
  setAnalyticsSubTab,
  habitations,
  selectedInspectorHabId,
  setSelectedInspectorHabId,
  setAiInspectResult,
  currentInspectorHab,
  handleRunAiInspection,
  aiInspectLoading,
  aiInspectResult,
  selectedHabId,
  setSelectedHabId,
  selectedHab,
  candidateSites,
  selectedSiteId,
  setSelectedSiteId,
  selectedSite,
  isAllocationFeasible,
  remainingCap,
  requiredBuses,
  handleConfirmEvacuationShift,
  crowdZones,
  selectedSosTargetZone,
  setSelectedSosTargetZone,
  handleTriggerTacticalSos,
  tacticalSosQueue,
  crowdFilter,
  setCrowdFilter,
  gisTileStyle,
  setGisTileStyle,
  analyticsMapRef,
  handleDispatchCrowdControl,
  auditLogs,
  setIsBlueprintModalOpen,
  updateEmergencyStatus
}) {
  return (
    <div
      className="border rounded-3xl p-4 sm:p-8 shadow-xl max-w-5xl w-full transition-all text-left space-y-6 animate-fadeIn"
      style={{
        backgroundColor: currentTheme.bgCard,
        borderColor: currentTheme.border,
        boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b gap-4" style={{ borderColor: currentTheme.border }}>
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30 shrink-0">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] sm:text-[11px] font-black rounded-md uppercase">
                COMMAND PORTAL
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">
                {loggedInUser ? loggedInUser.badgeId : 'AUTH-OFFICER'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.textPrimary }}>
              Authority Command Grid
            </h2>
            <p className="text-[11px] sm:text-xs font-medium" style={{ color: currentTheme.textMuted }}>
              Welcome back, <span className="font-bold" style={{ color: currentTheme.textPrimary }}>{loggedInUser ? loggedInUser.name : 'Officer'}</span> • Session: <span className="font-mono">{sessionTime}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onSignOutClick}
          className="px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center space-x-2 cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Exit Session</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'access_ops', label: 'Access Control' },
          { id: 'emergency_reports', label: `Live Reports (${activeEmergenciesCount})` },
          { id: 'history_archive', label: `Archive (${resolvedEmergenciesCount})` },
          { id: 'system_analytics', label: 'Analytics & DSS' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePortalTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
              activePortalTab === tab.id
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-black'
                : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
            }`}
            style={{
              borderColor: activePortalTab === tab.id ? undefined : currentTheme.border,
              color: activePortalTab === tab.id ? undefined : currentTheme.textPrimary
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activePortalTab === 'access_ops' && (
        <AccessOpsTab
          accessSubTab={accessSubTab}
          setAccessSubTab={setAccessSubTab}
          entryLogs={entryLogs}
          logSearchQuery={logSearchQuery}
          setLogSearchQuery={setLogSearchQuery}
          filteredLogs={filteredLogs}
          handleCheckOutEntrant={handleCheckOutEntrant}
          newEntrantName={newEntrantName}
          setNewEntrantName={setNewEntrantName}
          newEntrantType={newEntrantType}
          setNewEntrantType={setNewEntrantType}
          newEntrantId={newEntrantId}
          setNewEntrantId={setNewEntrantId}
          newEntrantZone={newEntrantZone}
          setNewEntrantZone={setNewEntrantZone}
          handleCreateCheckIn={handleCreateCheckIn}
          gatesStatus={gatesStatus}
          toggleGateStatus={toggleGateStatus}
          passRecipientName={passRecipientName}
          setPassRecipientName={setPassRecipientName}
          passZone={passZone}
          setPassZone={setPassZone}
          handleGeneratePass={handleGeneratePass}
          generatedPass={generatedPass}
          currentTheme={currentTheme}
        />
      )}

      {activePortalTab === 'emergency_reports' && (
        <EmergencyReportsTab
          activeEmergencies={activeEmergencies}
          currentTheme={currentTheme}
          onSelectEmergencyForMap={onSelectEmergencyForMap}
          updateEmergencyStatus={updateEmergencyStatus}
        />
      )}

      {activePortalTab === 'history_archive' && (
        <HistoryArchiveTab
          historySearchQuery={historySearchQuery}
          setHistorySearchQuery={setHistorySearchQuery}
          historyCategoryFilter={historyCategoryFilter}
          setHistoryCategoryFilter={setHistoryCategoryFilter}
          filteredHistory={filteredHistory}
          currentTheme={currentTheme}
        />
      )}

      {activePortalTab === 'system_analytics' && (
        <SystemAnalyticsTab
          analyticsSubTab={analyticsSubTab}
          setAnalyticsSubTab={setAnalyticsSubTab}
          currentTheme={currentTheme}
          habitations={habitations}
          selectedInspectorHabId={selectedInspectorHabId}
          setSelectedInspectorHabId={setSelectedInspectorHabId}
          setAiInspectResult={setAiInspectResult}
          currentInspectorHab={currentInspectorHab}
          handleRunAiInspection={handleRunAiInspection}
          aiInspectLoading={aiInspectLoading}
          aiInspectResult={aiInspectResult}
          selectedHabId={selectedHabId}
          setSelectedHabId={setSelectedHabId}
          selectedHab={selectedHab}
          candidateSites={candidateSites}
          selectedSiteId={selectedSiteId}
          setSelectedSiteId={setSelectedSiteId}
          selectedSite={selectedSite}
          isAllocationFeasible={isAllocationFeasible}
          remainingCap={remainingCap}
          requiredBuses={requiredBuses}
          handleConfirmEvacuationShift={handleConfirmEvacuationShift}
          crowdZones={crowdZones}
          selectedSosTargetZone={selectedSosTargetZone}
          setSelectedSosTargetZone={setSelectedSosTargetZone}
          handleTriggerTacticalSos={handleTriggerTacticalSos}
          tacticalSosQueue={tacticalSosQueue}
          crowdFilter={crowdFilter}
          setCrowdFilter={setCrowdFilter}
          gisTileStyle={gisTileStyle}
          setGisTileStyle={setGisTileStyle}
          analyticsMapRef={analyticsMapRef}
          handleDispatchCrowdControl={handleDispatchCrowdControl}
          auditLogs={auditLogs}
          setIsBlueprintModalOpen={setIsBlueprintModalOpen}
        />
      )}
    </div>
  );
}