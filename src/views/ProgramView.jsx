import { useState } from 'react'
import { ChevronDown, ChevronUp, Play, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import CycleWeekNav from '../components/CycleWeekNav'
import { MUSCLE_GROUPS, STATUS_CONFIG, calcNextWeight } from '../data/muscuData'

const STATUS_CYCLE = ['pending', 'done', 'missed', 'moved']

function ProgressionBadge({ decision, msg }) {
  const styles = {
    up: { color: '#00D68F', bg: 'rgba(0,214,143,0.1)', border: 'rgba(0,214,143,0.2)' },
    down: { color: '#FF6635', bg: 'rgba(255,102,53,0.1)', border: 'rgba(255,102,53,0.2)' },
    ok: { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
    neutral: { color: '#3D4F63', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' },
  }
  const s = styles[decision] || styles.neutral
  const Icon = decision === 'up' ? TrendingUp : decision === 'down' ? TrendingDown : Minus
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-body font-medium"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <Icon size={10} />
      {msg}
    </div>
  )
}

function ExerciseRow({ ex, progression }) {
  const prog = progression?.[ex.exerciseId]
  const groupColor = MUSCLE_GROUPS[ex.group] || '#888'
  const hasData = prog && prog.decision !== 'neutral'

  return (
    <div className="px-4 py-3 border-b last:border-0"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: groupColor }} />
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-semibold text-text-primary leading-tight">{ex.name}</p>
            <p className="font-body text-xs mt-0.5" style={{ color: groupColor }}>{ex.group}</p>
            <p className="font-body text-xs mt-1" style={{ color: '#7A8BA3' }}>
              {ex.sets} séries · {ex.rMin}{ex.rMax > ex.rMin ? `–${ex.rMax}` : ''} reps
            </p>
            {hasData && (
              <div className="mt-1.5">
                <ProgressionBadge decision={prog.decision} msg={prog.msg} />
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-display text-lg font-bold"
            style={{ color: prog?.decision === 'up' ? '#00D68F' : prog?.decision === 'down' ? '#FF6635' : '#EDF2F7' }}>
            {(prog?.weight ?? ex.weight) > 0 ? `${prog?.weight ?? ex.weight}kg` : 'PDC'}
          </span>
          {hasData && (
            <p className="font-body text-[10px]" style={{ color: '#3D4F63' }}>S. suivante</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, cycleColor, progression, onStatusChange, onStartSession }) {
  const [expanded, setExpanded] = useState(false)
  const statusInfo = STATUS_CONFIG[session.status] || STATUS_CONFIG.pending
  const isDone = session.status === 'done'
  const isMissed = session.status === 'missed'

  const handleStatusToggle = (e) => {
    e.stopPropagation()
    const idx = STATUS_CYCLE.indexOf(session.status)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    onStatusChange(session.id, next)
  }

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: '#0D1117',
        border: `1px solid ${isDone ? (session.color || cycleColor) + '44' : 'rgba(255,255,255,0.07)'}`,
        opacity: isMissed ? 0.55 : 1,
      }}>
      <button onClick={() => setExpanded(v => !v)}
        className="w-full text-left p-4 flex items-start gap-3 active:bg-white/5 transition-colors">
        <div className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ background: session.color || cycleColor }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-body text-xs font-semibold tracking-widest uppercase"
              style={{ color: session.color || cycleColor }}>
              {session.day}
            </span>
          </div>
          <h3 className="font-display text-xl text-text-primary leading-tight" style={{ letterSpacing: '-0.01em' }}>
            {session.title}
          </h3>
          <p className="font-body text-sm mt-0.5" style={{ color: '#7A8BA3' }}>{session.sub}</p>
          {isDone && (
            <p className="font-body text-xs mt-1" style={{ color: '#A78BFA' }}>
              ✓ {session.completedAt ? new Date(session.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Complété'}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button onClick={handleStatusToggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200 active:scale-90"
            style={{
              background: isDone ? '#A78BFA22' : isMissed ? '#FF444422' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${isDone ? '#A78BFA55' : isMissed ? '#FF444455' : 'rgba(255,255,255,0.1)'}`,
            }}>
            <span style={{ fontSize: '16px' }}>{statusInfo.icon}</span>
          </button>
          <div style={{ color: '#3D4F63' }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {session.exercises.map(ex => (
            <ExerciseRow key={ex.exerciseId} ex={ex} progression={progression} />
          ))}
          <div className="p-3 flex gap-2">
            {!isDone && (
              <button onClick={() => onStartSession(session)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm font-semibold transition-all active:scale-95"
                style={{ background: `${session.color || cycleColor}22`, color: session.color || cycleColor, border: `1px solid ${session.color || cycleColor}44` }}>
                <Play size={14} fill="currentColor" />
                Commencer la séance
              </button>
            )}
            {STATUS_CYCLE.filter(s => s !== session.status).slice(0, 2).map(s => {
              const cfg = STATUS_CONFIG[s]
              return (
                <button key={s} onClick={() => onStatusChange(session.id, s)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-medium transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#7A8BA3', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {cfg.icon} {cfg.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProgramView({
  cycles, activeCycle, activeWeek, settings, program,
  currentCycle, currentWeek, currentSessions,
  onCycleChange, onWeekChange, onStatusChange,
  onGenerateCycle, getProgressionForSession, onStartSession,
}) {
  return (
    <div>
      <CycleWeekNav
        cycles={cycles}
        activeCycle={activeCycle}
        activeWeek={activeWeek}
        currentCycle={currentCycle}
        onCycleChange={onCycleChange}
        onWeekChange={onWeekChange}
        onGenerateCycle={onGenerateCycle}
      />

      <div className="px-4 py-5 space-y-4 pb-8">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-3xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>
              {currentWeek?.label}
            </h2>
            {currentWeek?.type === 'deload' && (
              <span className="font-body text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
                Semaine décharge
              </span>
            )}
          </div>
          <p className="font-body text-xs" style={{ color: '#3D4F63' }}>
            {currentSessions.filter(s => s.status === 'done').length}/{currentSessions.length} séances complétées
          </p>
        </div>

        {currentWeek?.type !== 'deload' && activeWeek > 1 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}>
            <ArrowRight size={14} style={{ color: '#A78BFA' }} />
            <p className="font-body text-xs" style={{ color: '#A78BFA' }}>
              Charges calculées depuis S{activeWeek - 1} — surcharge progressive activée
            </p>
          </div>
        )}

        {currentSessions.map((session, di) => {
          const progression = getProgressionForSession(activeCycle, activeWeek, di)
          return (
            <SessionCard
              key={session.id}
              session={session}
              cycleColor={currentCycle?.color}
              progression={progression}
              onStatusChange={onStatusChange}
              onStartSession={onStartSession}
            />
          )
        })}

        {currentSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="font-display text-2xl text-text-primary mb-2">Aucune séance</p>
            <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Sélectionnez une autre semaine</p>
          </div>
        )}
      </div>
    </div>
  )
}
