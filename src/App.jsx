import { useState } from 'react'
import { useMuscuTraining } from './hooks/useMuscuTraining'
import BottomNav from './components/BottomNav'
import ProgramView from './views/ProgramView'
import TodayView from './views/TodayView'
import ProgressView from './views/ProgressView'
import SettingsView from './views/SettingsView'
import HistoryView from './views/HistoryView'
import RanksView from './views/RanksView'

export default function App() {
  const [activeTab, setActiveTab] = useState('today')

  const {
    cycles, activeCycle, activeWeek, settings, program,
    currentCycle, currentWeek, currentSessions,
    setActiveCycle, setActiveWeek,
    updateSession, setSessionStatus, completeSession,
    generateCycle,
    updateSettings, updateBaseWeight,
    updateProgram,
    getProgressionForSession,
    getStats,
    resetData, exportData, importData,
  } = useMuscuTraining()

  const [sessionActive, setSessionActive] = useState(false)

  const commonProps = {
    cycles, activeCycle, activeWeek, settings, program,
    currentCycle, currentWeek, currentSessions,
    onCycleChange: setActiveCycle,
    onWeekChange: setActiveWeek,
    onStatusChange: setSessionStatus,
    onGenerateCycle: generateCycle,
    getProgressionForSession,
  }

  const handleStartSession = (session) => {
    setSessionActive(session)
  }

  return (
    <div className="flex flex-col h-full bg-grid" style={{ background: '#07090F' }}>
      <header className="flex-shrink-0 flex items-center justify-between px-4"
        style={{
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: '8px',
          background: 'rgba(7,9,15,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #a78bfa)' }}>
            <span style={{ fontSize: '14px' }}>💪</span>
          </div>
          <span className="font-display text-xl tracking-wide text-text-primary">MusclePace</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
            <span className="font-body text-xs font-medium" style={{ color: '#A78BFA' }}>
              {currentCycle?.name}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(167,139,250,0.5)' }} />
            <span className="font-body text-xs" style={{ color: '#A78BFA88' }}>S{activeWeek}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide" style={{ paddingBottom: '80px' }}>
        {activeTab === 'program' && (
          <ProgramView
            {...commonProps}
            onStartSession={handleStartSession}
          />
        )}
        {activeTab === 'today' && (
          <TodayView
            {...commonProps}
            completeSession={completeSession}
            initialSession={sessionActive}
          />
        )}
        {activeTab === 'history' && (
          <HistoryView cycles={cycles} />
        )}
        {activeTab === 'ranks' && (
          <RanksView cycles={cycles} settings={settings} />
        )}
        {activeTab === 'progress' && (
          <ProgressView getStats={getStats} />
        )}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            cycles={cycles}
            onUpdate={updateSettings}
            onUpdateBaseWeight={updateBaseWeight}
            onReset={resetData}
            onExport={exportData}
            onImport={importData}
          />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
