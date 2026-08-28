import React from 'react';
import AiInspector from './AiInspector';
import EvacuationMatcher from './EvacuationMatcher';
import TacticalSosConsole from './TacticalSosConsole';
import GisCrowdRadar from './GisCrowdRadar';
import AuditExport from './AuditExport';

export default function SystemAnalyticsTab({
  currentTheme,
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
  setIsBlueprintModalOpen
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex overflow-x-auto gap-1.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border scrollbar-none" style={{ borderColor: currentTheme.border }}>
        {[
          { id: 'ai_inspector', name: 'Habitation Inspector' },
          { id: 'capacity_workbench', name: 'Evacuation Optimizer' },
          { id: 'sos_dispatch', name: 'Tactical SOS Console' },
          { id: 'gis_map', name: 'GIS Crowd Radar' },
          { id: 'audit_export', name: 'Governance & Audit' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAnalyticsSubTab(tab.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              analyticsSubTab === tab.id ? 'shadow-md border' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: analyticsSubTab === tab.id ? currentTheme.btnAuth : 'transparent',
              borderColor: analyticsSubTab === tab.id ? currentTheme.border : 'transparent',
              color: currentTheme.textPrimary
            }}
          >
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {analyticsSubTab === 'ai_inspector' && (
        <AiInspector
          currentTheme={currentTheme}
          habitations={habitations}
          selectedInspectorHabId={selectedInspectorHabId}
          setSelectedInspectorHabId={setSelectedInspectorHabId}
          setAiInspectResult={setAiInspectResult}
          currentInspectorHab={currentInspectorHab}
          handleRunAiInspection={handleRunAiInspection}
          aiInspectLoading={aiInspectLoading}
          aiInspectResult={aiInspectResult}
        />
      )}

      {analyticsSubTab === 'capacity_workbench' && (
        <EvacuationMatcher
          currentTheme={currentTheme}
          habitations={habitations}
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
        />
      )}

      {analyticsSubTab === 'sos_dispatch' && (
        <TacticalSosConsole
          currentTheme={currentTheme}
          crowdZones={crowdZones}
          selectedSosTargetZone={selectedSosTargetZone}
          setSelectedSosTargetZone={setSelectedSosTargetZone}
          handleTriggerTacticalSos={handleTriggerTacticalSos}
          tacticalSosQueue={tacticalSosQueue}
        />
      )}

      {analyticsSubTab === 'gis_map' && (
        <GisCrowdRadar
          currentTheme={currentTheme}
          crowdZones={crowdZones}
          crowdFilter={crowdFilter}
          setCrowdFilter={setCrowdFilter}
          gisTileStyle={gisTileStyle}
          setGisTileStyle={setGisTileStyle}
          analyticsMapRef={analyticsMapRef}
          handleDispatchCrowdControl={handleDispatchCrowdControl}
        />
      )}

      {analyticsSubTab === 'audit_export' && (
        <AuditExport
          currentTheme={currentTheme}
          auditLogs={auditLogs}
          setIsBlueprintModalOpen={setIsBlueprintModalOpen}
        />
      )}
    </div>
  );
}