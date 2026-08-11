import { useState, useEffect, useCallback } from 'react'
import {
  buildInitialCycles, generateNextCycle, getDefaultWeights,
  BASE_PROGRAM, calcNextWeight, getProgressionForWeek, findExInProgram,
} from '../data/muscuData'
import { loadState, saveState, cloneDeep } from '../utils/storage'

const DEFAULT_SETTINGS = {
  restDefault: 90,
  baseWeights: getDefaultWeights(),
}

// Migrate old exercise IDs to new ones (keep performances). Mapping keys are oldId -> targetId.
function migrateOldExerciseIds(state) {
  if (!state || !state.cycles) return state
  const mapping = {
    // curl concentration (j4e7) -> curl pupitre (j2e4)
    'j4e7': 'j2e4',
  }
  const program = state.program || BASE_PROGRAM
  let changed = false

  state.cycles.forEach(cycle => {
    cycle.weeks.forEach(week => {
      week.sessions.forEach(session => {
        // iterate backwards to allow splicing
        for (let i = session.exercises.length - 1; i >= 0; i--) {
          const ex = session.exercises[i]
          const targetId = mapping[ex.exerciseId]
          if (!targetId) continue

          const targetDef = findExInProgram(targetId, program) || {}
          const existingIndex = session.exercises.findIndex(e => e.exerciseId === targetId)

          if (existingIndex !== -1) {
            // merge completedSets into existing target exercise
            const targetEx = session.exercises[existingIndex]
            targetEx.completedSets = (targetEx.completedSets || []).concat(ex.completedSets || [])
            // remove old exercise entry
            session.exercises.splice(i, 1)
            changed = true
          } else {
            // update exercise id and metadata but keep completedSets
            ex.exerciseId = targetId
            ex.name = targetDef.name || ex.name
            ex.group = targetDef.group || ex.group
            ex.rMin = targetDef.rMin || ex.rMin
            ex.rMax = targetDef.rMax || ex.rMax
            ex.equipType = targetDef.equipType || ex.equipType
            changed = true
          }
        }
      })
    })
  })

  // migrate baseWeights keys
  if (state.settings && state.settings.baseWeights) {
    Object.keys(mapping).forEach(oldId => {
      const targetId = mapping[oldId]
      if (state.settings.baseWeights[oldId]) {
        if (!state.settings.baseWeights[targetId]) state.settings.baseWeights[targetId] = state.settings.baseWeights[oldId]
        delete state.settings.baseWeights[oldId]
        changed = true
      }
    })
  }

  return state
}

function buildInitialState() {
  const baseWeights = getDefaultWeights()
  return {
    cycles: buildInitialCycles(baseWeights),
    activeCycle: 1,
    activeWeek: 1,
    settings: { ...DEFAULT_SETTINGS, baseWeights },
    program: cloneDeep(BASE_PROGRAM),
  }
}

export function useMuscuTraining() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    if (saved?.cycles?.length) {
      // migrate legacy exercise ids if present
      migrateOldExerciseIds(saved)
      return saved
    }
    return buildInitialState()
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  const { cycles, activeCycle, activeWeek, settings, program } = state

  // ─── Navigation ──────────────────────────────────────────────────────────
  const setActiveCycle = useCallback((cycleId) => {
    setState(s => ({ ...s, activeCycle: cycleId, activeWeek: 1 }))
  }, [])

  const setActiveWeek = useCallback((weekNum) => {
    setState(s => ({ ...s, activeWeek: weekNum }))
  }, [])

  // ─── Derived data ─────────────────────────────────────────────────────────
  const currentCycle = cycles.find(c => c.id === activeCycle) || cycles[0]
  const currentWeek = currentCycle?.weeks.find(w => w.number === activeWeek) || currentCycle?.weeks[0]
  const currentSessions = currentWeek?.sessions || []

  // ─── Get progression from previous same-position week ────────────────────
  const getProgressionForSession = useCallback((cycleId, weekNum, dayIndex) => {
    // Find same session from previous week in same cycle, or last week of prev cycle
    const cycle = cycles.find(c => c.id === cycleId)
    if (!cycle) return {}

    let prevSession = null

    if (weekNum > 1) {
      // Previous week in same cycle
      const prevWeek = cycle.weeks.find(w => w.number === weekNum - 1)
      prevSession = prevWeek?.sessions[dayIndex]
    } else {
      // Last week of previous cycle
      const prevCycle = cycles.find(c => c.id === cycleId - 1)
      if (prevCycle) {
        const lastWeek = prevCycle.weeks[prevCycle.weeks.length - 1]
        prevSession = lastWeek?.sessions[dayIndex]
      }
    }

    if (!prevSession || prevSession.status !== 'done') return {}

    // Calculate progression for each exercise
    const result = {}
    prevSession.exercises.forEach(ex => {
      if (ex.completedSets?.length > 0) {
        result[ex.exerciseId] = calcNextWeight(ex, ex.completedSets)
      }
    })
    return result
  }, [cycles])

  // ─── Update session status ────────────────────────────────────────────────
  const updateSession = useCallback((cycleId, weekNum, sessionId, updates) => {
    setState(s => {
      const next = cloneDeep(s)
      const cycle = next.cycles.find(c => c.id === cycleId)
      if (!cycle) return s
      const week = cycle.weeks.find(w => w.number === weekNum)
      if (!week) return s
      const session = week.sessions.find(sess => sess.id === sessionId)
      if (!session) return s
      Object.assign(session, updates)
      if (updates.status === 'done') session.completedAt = new Date().toISOString()
      return next
    })
  }, [])

  const setSessionStatus = useCallback((sessionId, status) => {
    updateSession(activeCycle, activeWeek, sessionId, { status })
  }, [activeCycle, activeWeek, updateSession])

  // ─── Complete session with sets data ────────────────────────────────────
  const completeSession = useCallback((cycleId, weekNum, sessionId, exerciseSets) => {
    setState(s => {
      const next = cloneDeep(s)
      const cycle = next.cycles.find(c => c.id === cycleId)
      if (!cycle) return s
      const week = cycle.weeks.find(w => w.number === weekNum)
      if (!week) return s
      const session = week.sessions.find(sess => sess.id === sessionId)
      if (!session) return s

      // Store completed sets for each exercise
      session.exercises = session.exercises.map(ex => {
        const sets = exerciseSets[ex.exerciseId] || []
        return { ...ex, completedSets: sets }
      })
      session.status = 'done'
      session.completedAt = new Date().toISOString()

      // Update baseWeights in settings based on performance
      session.exercises.forEach(ex => {
        if (ex.completedSets?.length > 0) {
          const prog = calcNextWeight(ex, ex.completedSets)
          // Update base weight for next week's suggestion
          if (!next.settings.baseWeights) next.settings.baseWeights = {}
          next.settings.baseWeights[ex.exerciseId] = prog.weight
        }
      })

      return next
    })
  }, [])

  // ─── Generate next cycle ──────────────────────────────────────────────────
  const generateCycle = useCallback(() => {
    setState(s => {
      const newCycle = generateNextCycle(s.cycles)
      if (!newCycle) return s
      return {
        ...s,
        cycles: [...s.cycles, newCycle],
        activeCycle: newCycle.id,
        activeWeek: 1,
      }
    })
  }, [])

  // ─── Settings ────────────────────────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }))
  }, [])

  const updateBaseWeight = useCallback((exerciseId, weight) => {
    setState(s => {
      const newState = cloneDeep(s)
      if (!newState.settings.baseWeights) newState.settings.baseWeights = {}
      newState.settings.baseWeights[exerciseId] = weight
      return newState
    })
  }, [])

  // ─── Program updates ─────────────────────────────────────────────────────
  const updateProgram = useCallback((newProgram) => {
    setState(s => ({ ...s, program: newProgram }))
  }, [])

  // ─── Stats ────────────────────────────────────────────────────────────────
  const getStats = useCallback(() => {
    const allSessions = cycles.flatMap(c => c.weeks.flatMap(w => w.sessions))
    const doneSessions = allSessions.filter(s => s.status === 'done')

    const totalVolume = doneSessions.reduce((total, session) => {
      return total + session.exercises.reduce((t, ex) => {
        return t + (ex.completedSets || []).reduce((st, set) => st + (set.weight * set.reps), 0)
      }, 0)
    }, 0)

    const totalSets = doneSessions.reduce((total, session) => {
      return total + session.exercises.reduce((t, ex) => t + (ex.completedSets?.length || 0), 0)
    }, 0)

    // Volume by muscle group
    const byMuscle = {}
    doneSessions.forEach(session => {
      session.exercises.forEach(ex => {
        if (!byMuscle[ex.group]) byMuscle[ex.group] = 0
        ;(ex.completedSets || []).forEach(set => {
          byMuscle[ex.group] += set.weight * set.reps
        })
      })
    })

    // PR (personal records) per exercise
    const prs = {}
    doneSessions.forEach(session => {
      session.exercises.forEach(ex => {
        ;(ex.completedSets || []).forEach(set => {
          if (set.weight > 0 && (!prs[ex.name] || set.weight > prs[ex.name].weight)) {
            prs[ex.name] = { weight: set.weight, reps: set.reps, group: ex.group }
          }
        })
      })
    })

    // Volume per week (last 8 weeks)
    const weeklyVolume = cycles.flatMap(c =>
      c.weeks.map(w => {
        const vol = w.sessions.filter(s => s.status === 'done').reduce((t, s) =>
          t + s.exercises.reduce((et, ex) =>
            et + (ex.completedSets || []).reduce((st, set) => st + set.weight * set.reps, 0), 0), 0)
        return { label: `C${c.id}S${w.number}`, volume: vol, cycleId: c.id, weekNum: w.number }
      })
    ).filter(w => w.volume > 0).slice(-8)

    // Exercise progression over time
    const exerciseHistory = {}
    doneSessions.forEach(session => {
      session.exercises.forEach(ex => {
        if (!exerciseHistory[ex.name]) exerciseHistory[ex.name] = []
        const maxWeight = Math.max(0, ...(ex.completedSets || []).map(s => s.weight))
        if (maxWeight > 0) {
          exerciseHistory[ex.name].push({
            date: session.completedAt,
            weight: maxWeight,
          })
        }
      })
    })

    return {
      totalDone: doneSessions.length,
      totalVolume,
      totalSets,
      byMuscle,
      prs,
      weeklyVolume,
      exerciseHistory,
    }
  }, [cycles])

  // ─── Reset ────────────────────────────────────────────────────────────────
  const resetData = useCallback(() => {
    setState(buildInitialState())
  }, [])

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `muscu-tracker-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state])

  const importData = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        if (imported.cycles) setState(imported)
      } catch {}
    }
    reader.readAsText(file)
  }, [])

  return {
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
  }
}
