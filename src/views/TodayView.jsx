import { useState, useCallback } from 'react'
import { Dumbbell, Flame, X, Check, Plus, Minus, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { MUSCLE_GROUPS, calcNextWeight } from '../data/muscuData'

// ─── Rest selector ────────────────────────────────────────────────────────
const REST_OPTIONS = [
  { label: '45s', value: 45 },
  { label: '1min', value: 60 },
  { label: '90s', value: 90 },
  { label: '2min', value: 120 },
  { label: '3min', value: 180 },
]

function RestSelector({ value, onChange }) {
  return (
    <div className="flex gap-1.5 items-center">
      <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: '#3D4F63' }}>Repos</span>
      <div className="flex gap-1">
        {REST_OPTIONS.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className="px-2 py-1 rounded-lg font-body text-xs font-semibold transition-all active:scale-95"
            style={{
              background: value === o.value ? '#A78BFA' : 'rgba(255,255,255,0.05)',
              color: value === o.value ? '#fff' : '#3D4F63',
            }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Set row ──────────────────────────────────────────────────────────────
function SetRow({ setNum, set, onUpdate, onToggle, rMin, rMax }) {
  const roundWeight = (w, step = 0.5) => Math.max(0, Math.round(w / step) * step)

  return (
    <div className="grid items-center gap-2 mb-2"
      style={{ gridTemplateColumns: '24px 1fr 72px 40px', opacity: set.done ? 0.55 : 1 }}>
      <span className="font-body text-xs text-center font-semibold" style={{ color: '#3D4F63' }}>
        {setNum}
      </span>

      {/* Weight */}
      <div className="flex items-center gap-1">
        <button onClick={() => onUpdate('weight', roundWeight(set.weight - 2.5))}
          className="w-8 h-9 rounded-lg flex items-center justify-center font-bold text-lg active:scale-85 transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#EDF2F7' }}>
          −
        </button>
        <input
          type="number"
          value={set.weight}
          step="2.5"
          min="0"
          onChange={e => onUpdate('weight', parseFloat(e.target.value) || 0)}
          className="flex-1 text-center font-body font-bold rounded-lg py-2 outline-none"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#EDF2F7', fontSize: '16px' }}
        />
        <button onClick={() => onUpdate('weight', roundWeight(set.weight + 2.5))}
          className="w-8 h-9 rounded-lg flex items-center justify-center font-bold text-lg active:scale-85 transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#EDF2F7' }}>
          +
        </button>
      </div>

      {/* Reps */}
      <input
        type="number"
        value={set.reps}
        min="0"
        onChange={e => onUpdate('reps', parseInt(e.target.value) || 0)}
        className="text-center font-body font-bold rounded-lg py-2 outline-none"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#EDF2F7', fontSize: '16px' }}
      />

      {/* Done check */}
      <button onClick={onToggle}
        className="w-10 h-9 rounded-lg flex items-center justify-center transition-all active:scale-90"
        style={{
          background: set.done ? '#059669' : 'rgba(255,255,255,0.05)',
          border: `2px solid ${set.done ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
          boxShadow: set.done ? '0 0 12px rgba(16,185,129,0.3)' : 'none',
        }}>
        {set.done && <Check size={16} strokeWidth={3} style={{ color: '#fff' }} />}
      </button>
    </div>
  )
}

// ─── Exercise panel ────────────────────────────────────────────────────────
function ExercisePanel({ ex, progression, restDefault, onSetsChange }) {
  const [sets, setSets] = useState(() => {
    const suggestedWeight = progression?.[ex.exerciseId]?.weight ?? ex.weight
    return Array.from({ length: ex.sets }, (_, i) => ({
      id: i,
      weight: suggestedWeight,
      reps: ex.rMax,
      done: false,
    }))
  })
  const [restTime, setRestTime] = useState(restDefault || 90)

  const prog = progression?.[ex.exerciseId]
  const groupColor = MUSCLE_GROUPS[ex.group] || '#888'

  const updateSet = (idx, field, value) => {
    setSets(prev => {
      const next = prev.map((s, i) => i === idx ? { ...s, [field]: value } : s)
      onSetsChange(ex.exerciseId, next.filter(s => s.done))
      return next
    })
  }

  const toggleSet = (idx) => {
    setSets(prev => {
      const next = prev.map((s, i) => i === idx ? { ...s, done: !s.done } : s)
      onSetsChange(ex.exerciseId, next.filter(s => s.done))
      return next
    })
  }

  const addSet = () => {
    const lastSet = sets[sets.length - 1]
    setSets(prev => [...prev, { id: prev.length, weight: lastSet?.weight ?? ex.weight, reps: ex.rMin, done: false }])
  }

  const doneSets = sets.filter(s => s.done).length

  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Ex header */}
      <div className="px-4 py-3 flex items-start gap-2"
        style={{ background: `${groupColor}11`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: groupColor }} />
        <div className="flex-1">
          <p className="font-body text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: groupColor }}>
            {ex.group}
          </p>
          <h3 className="font-display text-xl text-text-primary" style={{ letterSpacing: '-0.01em' }}>{ex.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>
              {ex.rMin}{ex.rMax > ex.rMin ? `–${ex.rMax}` : ''} reps · {ex.sets} séries
            </p>
            {prog && prog.decision !== 'neutral' && (
              <span className="font-body text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  color: prog.decision === 'up' ? '#00D68F' : prog.decision === 'down' ? '#FF6635' : '#A78BFA',
                  background: prog.decision === 'up' ? 'rgba(0,214,143,0.1)' : prog.decision === 'down' ? 'rgba(255,102,53,0.1)' : 'rgba(167,139,250,0.1)',
                }}>
                {prog.decision === 'up' ? '↑' : prog.decision === 'down' ? '↓' : '='} {prog.msg.split('→')[1]?.trim() || prog.msg}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display text-2xl text-text-primary">{doneSets}/{sets.length}</p>
          <p className="font-body text-[10px]" style={{ color: '#3D4F63' }}>séries</p>
        </div>
      </div>

      {/* Sets */}
      <div className="px-4 pt-3 pb-2">
        {/* Column headers */}
        <div className="grid mb-1.5"
          style={{ gridTemplateColumns: '24px 1fr 72px 40px', gap: '8px' }}>
          {['#', 'Poids (kg)', 'Reps', '✓'].map(h => (
            <p key={h} className="font-body text-center text-[10px] uppercase tracking-wider" style={{ color: '#3D4F63' }}>{h}</p>
          ))}
        </div>

        {sets.map((set, idx) => (
          <SetRow
            key={set.id}
            setNum={idx + 1}
            set={set}
            rMin={ex.rMin}
            rMax={ex.rMax}
            onUpdate={(field, value) => updateSet(idx, field, value)}
            onToggle={() => toggleSet(idx)}
          />
        ))}

        <button onClick={addSet}
          className="w-full py-2 mt-1 rounded-xl flex items-center justify-center gap-2 font-body text-xs font-medium transition-all active:scale-95"
          style={{ border: '1.5px dashed rgba(255,255,255,0.1)', color: '#3D4F63' }}>
          <Plus size={12} /> Ajouter une série
        </button>
      </div>

      {/* Rest selector */}
      <div className="px-4 pb-3">
        <RestSelector value={restTime} onChange={setRestTime} />
      </div>

      {ex.notes && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-body text-xs italic" style={{ color: '#7A8BA3' }}>{ex.notes}</p>
        </div>
      )}
    </div>
  )
}

// ─── Main TodayView ────────────────────────────────────────────────────────
export default function TodayView({
  cycles, activeCycle, activeWeek, currentCycle, currentWeek,
  currentSessions, getProgressionForSession,
  completeSession, settings,
}) {
  const [activeSession, setActiveSession] = useState(null)
  const [completedSets, setCompletedSets] = useState({}) // { exerciseId: [sets] }
  const [currentExIdx, setCurrentExIdx] = useState(0)

  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  const DOW_MAP = { 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 0: 'Dimanche' }
  const todayName = DOW_MAP[new Date().getDay()]

  const todaySession = currentSessions.find(s => s.day === todayName)
  const nextPending = currentSessions.find(s => s.status === 'pending' || s.status === 'moved')
  const totalDone = cycles.flatMap(c => c.weeks.flatMap(w => w.sessions)).filter(s => s.status === 'done').length

  const startSession = (session) => {
    const di = currentSessions.findIndex(s => s.id === session.id)
    setActiveSession({ ...session, dayIndex: di })
    setCompletedSets({})
    setCurrentExIdx(0)
  }

  const handleSetsChange = useCallback((exerciseId, sets) => {
    setCompletedSets(prev => ({ ...prev, [exerciseId]: sets }))
  }, [])

  const finishSession = () => {
    if (!activeSession) return
    completeSession(activeCycle, activeWeek, activeSession.id, completedSets)
    setActiveSession(null)
    setCompletedSets({})
  }

  // ─── Active session view ──────────────────────────────────────────────
  if (activeSession) {
    const di = activeSession.dayIndex
    const progression = getProgressionForSession(activeCycle, activeWeek, di)
    const exercises = activeSession.exercises
    const totalDoneEx = Object.keys(completedSets).length
    const doneSetsCount = Object.values(completedSets).reduce((t, sets) => t + sets.length, 0)

    return (
      <div className="flex flex-col h-full">
        {/* Session header */}
        <div className="flex-shrink-0 px-4 py-4"
          style={{ background: `${activeSession.color}22`, borderBottom: `1px solid ${activeSession.color}33` }}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setActiveSession(null)}
              className="flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-xl transition-all active:scale-95"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#EDF2F7', border: '1px solid rgba(255,255,255,0.15)' }}>
              <X size={14} /> Annuler
            </button>
            <div className="text-center">
              <p className="font-body text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>EN COURS</p>
              <p className="font-display text-base font-bold text-white" style={{ letterSpacing: '-0.01em' }}>{activeSession.title}</p>
            </div>
            <div className="text-right" style={{ minWidth: 60 }}>
              <p className="font-display text-lg text-white">{totalDoneEx}/{exercises.length}</p>
              <p className="font-body text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>exercices</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${exercises.length ? (totalDoneEx / exercises.length) * 100 : 0}%`, background: activeSession.color }} />
          </div>
          {/* Exercise tabs */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {exercises.map((ex, i) => {
              const done = (completedSets[ex.exerciseId]?.length ?? 0) > 0
              const isActive = i === currentExIdx
              return (
                <button key={ex.exerciseId} onClick={() => setCurrentExIdx(i)}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg font-body text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: isActive ? activeSession.color : done ? `${activeSession.color}22` : 'rgba(0,0,0,0.3)',
                    color: isActive ? '#fff' : done ? activeSession.color : 'rgba(255,255,255,0.4)',
                  }}>
                  {done && !isActive ? '✓ ' : ''}{ex.name.split(' ').slice(0, 2).join(' ')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scrollable exercise content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4" style={{ paddingBottom: '100px' }}>
          {exercises[currentExIdx] && (
            <ExercisePanel
              key={exercises[currentExIdx].exerciseId}
              ex={exercises[currentExIdx]}
              progression={progression}
              restDefault={settings?.restDefault || 90}
              onSetsChange={handleSetsChange}
            />
          )}
        </div>

        {/* Navigation footer */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3"
          style={{ background: 'rgba(7,9,15,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex gap-2 max-w-[430px] mx-auto">
            {currentExIdx > 0 && (
              <button onClick={() => setCurrentExIdx(i => i - 1)}
                className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#EDF2F7' }}>
                <ChevronLeft size={16} /> Préc.
              </button>
            )}
            {currentExIdx < exercises.length - 1 ? (
              <button onClick={() => setCurrentExIdx(i => i + 1)}
                className="flex-2 flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: `${activeSession.color}33`, color: activeSession.color, border: `1px solid ${activeSession.color}55` }}>
                Suivant <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={finishSession}
                className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
                <Check size={16} strokeWidth={3} /> Terminer !
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── Default view (no active session) ─────────────────────────────────
  return (
    <div className="px-4 py-6 space-y-5 pb-8">
      <div>
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: '#3D4F63' }}>{dateStr}</p>
        <h1 className="font-display text-4xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>Aujourd'hui</h1>
      </div>

      {/* Quick stats */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <Flame size={20} style={{ color: '#A78BFA' }} />
          <div>
            <p className="font-display text-2xl leading-tight" style={{ color: '#A78BFA' }}>{totalDone}</p>
            <p className="font-body text-[10px] uppercase tracking-wider" style={{ color: '#A78BFA88' }}>Séances totales</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(0,214,143,0.10)', border: '1px solid rgba(0,214,143,0.22)' }}>
          <Dumbbell size={20} style={{ color: '#00D68F' }} />
          <div>
            <p className="font-display text-2xl leading-tight" style={{ color: '#00D68F' }}>{currentCycle?.name || 'C1'}</p>
            <p className="font-body text-[10px] uppercase tracking-wider" style={{ color: '#00D68F88' }}>{currentWeek?.label || 'S1'}</p>
          </div>
        </div>
      </div>

      {/* Today's session */}
      <div>
        <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: '#3D4F63' }}>Séance du jour</p>
        {todaySession ? (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: `${todaySession.color}18`, border: `1px solid ${todaySession.color}44` }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-xs font-semibold uppercase tracking-widest" style={{ color: todaySession.color }}>
                  {todaySession.day}
                </span>
                {todaySession.status === 'done' && (
                  <span className="font-body text-xs" style={{ color: '#A78BFA' }}>✓ Fait</span>
                )}
              </div>
              <h2 className="font-display text-2xl text-text-primary mb-1" style={{ letterSpacing: '-0.01em' }}>
                {todaySession.title}
              </h2>
              <p className="font-body text-sm mb-4" style={{ color: '#7A8BA3' }}>
                {todaySession.sub} · {todaySession.exercises.length} exercices
              </p>
              {todaySession.status !== 'done' && (
                <button onClick={() => startSession(todaySession)}
                  className="w-full py-3.5 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{ background: todaySession.color, color: '#fff', boxShadow: `0 4px 20px ${todaySession.color}44` }}>
                  <Dumbbell size={16} />
                  Commencer la séance
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-4xl">🛌</span>
            <h2 className="font-display text-2xl text-text-primary">Repos mérité</h2>
            <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Récupération musculaire active.</p>
          </div>
        )}
      </div>

      {/* Next pending session */}
      {nextPending && nextPending.id !== todaySession?.id && (
        <div>
          <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: '#3D4F63' }}>Prochaine séance</p>
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${nextPending.color}22` }}>
              <Dumbbell size={18} style={{ color: nextPending.color }} />
            </div>
            <div className="flex-1">
              <p className="font-body text-xs mb-0.5" style={{ color: nextPending.color }}>{nextPending.day}</p>
              <p className="font-body text-sm font-semibold text-text-primary">{nextPending.title}</p>
              <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>{nextPending.sub}</p>
            </div>
            <button onClick={() => startSession(nextPending)}
              className="px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all active:scale-95"
              style={{ background: `${nextPending.color}22`, color: nextPending.color }}>
              Démarrer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
