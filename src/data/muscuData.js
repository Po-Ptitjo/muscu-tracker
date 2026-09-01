// Types d'exercice
export const EXERCISE_TYPES = {
  compound: { label: 'Poly-articulaire', color: '#FF6635', bg: 'rgba(255,102,53,0.12)', border: 'rgba(255,102,53,0.25)' },
  isolation: { label: 'Isolation', color: '#4D9FFF', bg: 'rgba(77,159,255,0.12)', border: 'rgba(77,159,255,0.25)' },
  machine: { label: 'Machine', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
  free: { label: 'Poids libres', color: '#00D68F', bg: 'rgba(0,214,143,0.12)', border: 'rgba(0,214,143,0.25)' },
  bodyweight: { label: 'Corps', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
}

export const MUSCLE_GROUPS = {
  Pectoraux: '#a855f7',
  Épaules: '#3b82f6',
  Triceps: '#f59e0b',
  Biceps: '#22c55e',
  Dos: '#ef4444',
  Jambes: '#eab308',
  Mollets: '#06b6d4',
  Abdos: '#ec4899',
  Trapèzes: '#8b5cf6',
}

export const STATUS_CONFIG = {
  pending: { label: 'À faire', icon: '○', color: '#3D4F63' },
  done: { label: 'Fait', icon: '✓', color: '#00D68F' },
  missed: { label: 'Raté', icon: '✗', color: '#FF4444' },
  moved: { label: 'Déplacé', icon: '→', color: '#F59E0B' },
}

// ────────────────────────────────────────────────────────────
// Programme de base — 4 jours, 4 semaines/cycle
// Chaque exercice : { id, name, group, sets, rMin, rMax, weight, inc, type }
// inc = incrément par semaine (machine: 5kg, poids libres: 1-2kg)
// ────────────────────────────────────────────────────────────

export const BASE_PROGRAM = [
  {
    id: 'j1',
    name: 'JOUR A — Push',
    sub: 'Pectoraux · Épaules · Triceps',
    color: '#a855f7',
    exercises: [
      { id: 'j1e1', name: 'Développé couché machine', group: 'Pectoraux', sets: 4, rMin: 8, rMax: 12, weight: 30, inc: 5, equipType: 'machine', notes: 'Contrôle en descente, pause en haut' },
      { id: 'j1e2', name: 'Développé incliné haltères', group: 'Pectoraux', sets: 4, rMin: 8, rMax: 12, weight: 20, inc: 2, equipType: 'free', notes: 'Coudes à 45°' },
      { id: 'j1e3', name: 'Écarté poulie basse', group: 'Pectoraux', sets: 3, rMin: 12, rMax: 15, weight: 20, inc: 5, equipType: 'machine', notes: 'Contraction maximale, étirement en bas' },
      { id: 'j1e4', name: 'Développé épaules haltères', group: 'Épaules', sets: 4, rMin: 8, rMax: 12, weight: 14, inc: 2, equipType: 'free', notes: '' },
      { id: 'j1e5', name: 'Élévations latérales machine', group: 'Épaules', sets: 3, rMin: 12, rMax: 15, weight: 10, inc: 1, equipType: 'machine', notes: 'Pincer en haut 1 seconde' },
      { id: 'j1e6', name: 'Extension triceps poulie corde', group: 'Triceps', sets: 3, rMin: 12, rMax: 15, weight: 10, inc: 1, equipType: 'machine', notes: '' },
      { id: 'j1e7', name: 'Barre au front EZ', group: 'Triceps', sets: 3, rMin: 10, rMax: 12, weight: 10, inc: 2, equipType: 'free', notes: '' },
    ],
  },
  {
    id: 'j2',
    name: 'JOUR B — Pull',
    sub: 'Dos · Biceps · Trapèzes',
    color: '#3b82f6',
    exercises: [
      { id: 'j2e1', name: 'Tirage vertical prise large', group: 'Dos', sets: 4, rMin: 8, rMax: 12, weight: 30, inc: 5, equipType: 'machine', notes: 'Coudes vers les hanches' },
      { id: 'j2e2', name: 'Tirage horizontal câble', group: 'Dos', sets: 4, rMin: 10, rMax: 12, weight: 30, inc: 5, equipType: 'machine', notes: 'Serrer les omoplates' },
      { id: 'j2e3', name: 'Pull-over machine', group: 'Dos', sets: 3, rMin: 12, rMax: 15, weight: 30, inc: 5, equipType: 'machine', notes: '' },
      { id: 'j2e4', name: 'Curl pupitre', group: 'Biceps', sets: 4, rMin: 10, rMax: 12, weight: 6, inc: 2, equipType: 'free', notes: '' },
      { id: 'j2e5', name: 'Curl marteau haltères', group: 'Biceps', sets: 3, rMin: 10, rMax: 12, weight: 5, inc: 1, equipType: 'free', notes: '' },
      { id: 'j2e6', name: 'Shrugs haltères', group: 'Trapèzes', sets: 4, rMin: 12, rMax: 15, weight: 24, inc: 2, equipType: 'free', notes: 'Tenir 1 seconde en haut' },
    ],
  },
  {
    id: 'j3',
    name: 'JOUR C — Legs',
    sub: 'Jambes · Mollets · Abdos',
    color: '#22c55e',
    exercises: [
      { id: 'j3e1', name: 'Squat guidé (Smith)', group: 'Jambes', sets: 4, rMin: 8, rMax: 10, weight: 20, inc: 5, equipType: 'machine', notes: 'Descente contrôlée 3s' },
      { id: 'j3e2', name: 'Leg press', group: 'Jambes', sets: 4, rMin: 10, rMax: 12, weight: 30, inc: 10, equipType: 'machine', notes: 'Pieds écartés largeur épaules' },
      { id: 'j3e3', name: 'Leg curl assis', group: 'Jambes', sets: 3, rMin: 12, rMax: 15, weight: 25, inc: 5, equipType: 'machine', notes: '' },
      { id: 'j3e4', name: 'Fentes marchées haltères', group: 'Jambes', sets: 3, rMin: 10, rMax: 12, weight: 16, inc: 2, equipType: 'free', notes: 'Par jambe' },
      { id: 'j3e5', name: 'Mollets debout machine', group: 'Mollets', sets: 4, rMin: 15, rMax: 20, weight: 35, inc: 5, equipType: 'machine', notes: 'Pause étirement en bas' },
      { id: 'j3e6', name: 'Crunch machine', group: 'Abdos', sets: 4, rMin: 15, rMax: 20, weight: 30, inc: 5, equipType: 'machine', notes: '' },
    ],
  },
  {
    id: 'j4',
    name: 'JOUR D — Pecs/Dos/Biceps',
    sub: 'Pectoraux · Dos · Biceps',
    color: '#f59e0b',
    exercises: [
      { id: 'j4e1', name: 'Écarté poulie basse', group: 'Pectoraux', sets: 3, rMin: 12, rMax: 15, weight: 10, inc: 5, equipType: 'machine', notes: 'Contraction maximale, étirement en bas' },
      { id: 'j4e2', name: 'Développé couché haltères prise neutre', group: 'Pectoraux', sets: 3, rMin: 10, rMax: 12, weight: 20, inc: 2, equipType: 'free', notes: 'Prise neutre, moins de stress épaules' },
      { id: 'j4e3', name: 'Écarté machine (pec deck)', group: 'Pectoraux', sets: 3, rMin: 12, rMax: 15, weight: 15, inc: 5, equipType: 'machine', notes: 'Contraction maximale, contrôle total' },
      { id: 'j4e4', name: 'Tirage vertical prise serrée neutre', group: 'Dos', sets: 3, rMin: 10, rMax: 12, weight: 30, inc: 5, equipType: 'machine', notes: 'Prise différente du mercredi, coudes vers les hanches' },
      { id: 'j4e5', name: 'Pull-over machine', group: 'Dos', sets: 3, rMin: 12, rMax: 15, weight: 30, inc: 5, equipType: 'machine', notes: 'Grand dorsal en étirement complet' },
      { id: 'j4e6', name: 'Curl incliné haltères', group: 'Biceps', sets: 3, rMin: 12, rMax: 12, weight: 6, inc: 1, equipType: 'free', notes: 'Étirement maximal, charges légères intentionnellement' },
      { id: 'j4e7', name: 'Curl concentration haltères', group: 'Biceps', sets: 3, rMin: 12, rMax: 12, weight: 6, inc: 1, equipType: 'free', notes: 'Un bras à la fois, contraction maximale' },
    ],
  },
]

// ────────────────────────────────────────────────────────────
// Génère les cycles (semaines) à partir du programme
// Chaque cycle = 4 semaines (S1, S2, S3, S4 allégée)
// ────────────────────────────────────────────────────────────

export function buildInitialCycles(baseWeights = null, decisions = {}) {
  // Use S-1 weights if not provided
  const defaultBaseWeights = {
    j1e1: 30, j1e2: 20, j1e3: 20, j1e4: 14, j1e5: 10, j1e6: 10, j1e7: 10,
    j2e1: 30, j2e2: 30, j2e3: 30, j2e4: 6, j2e5: 5, j2e6: 24,
    j3e1: 20, j3e2: 30, j3e3: 25, j3e4: 16, j3e5: 35, j3e6: 30,
    j4e1: 10, j4e2: 20, j4e3: 15, j4e4: 30, j4e5: 30, j4e6: 6, j4e7: 6,
  }
  return [buildCycle(1, baseWeights || defaultBaseWeights, decisions)]
}

export function getDefaultWeights() {
  const weights = {}
  BASE_PROGRAM.forEach(day =>
    day.exercises.forEach(ex => {
      weights[ex.id] = ex.weight
    })
  )
  return weights
}

export function buildCycle(cycleId, baseWeights, decisions = {}) {
  const COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
  const PHASES = ['Construction', 'Développement', 'Intensité', 'Décharge', 'Performance']

  return {
    id: cycleId,
    name: `Cycle ${cycleId}`,
    phase: PHASES[(cycleId - 1) % PHASES.length],
    color: COLORS[(cycleId - 1) % COLORS.length],
    weeks: buildWeeks(cycleId, baseWeights, decisions),
  }
}

function buildWeeks(cycleId, baseWeights, decisions = {}) {
  const weeks = []
  // 3 semaines par cycle: 3 normales (pas de deload pour débutant)
  for (let w = 1; w <= 3; w++) {
    weeks.push({
      number: w,
      label: `Semaine ${w}`,
      type: 'normal',
      sessions: buildSessions(cycleId, w, baseWeights, false, decisions),
    })
  }
  return weeks
}

function buildSessions(cycleId, weekNum, baseWeights, isDeload, decisions = {}) {
  // Répartition sur la semaine: L, M, J, S
  const DAYS = ['Lundi', 'Mardi', 'Jeudi', 'Samedi']

  return BASE_PROGRAM.map((day, di) => {
    const sessionExercises = day.exercises.map(ex => {
      // Progression: chaque semaine normale — pas de deload pour débutant
      // Calcul du poids cible à partir des poids de base.
      // Pour les exercices en haltères (free), diviser le poids total par 2 pour obtenir
      // le poids d'une haltère (sauf si l'exercice est explicitement 'concentration').
      const baseW = baseWeights[ex.id] ?? ex.weight
      let targetWeight = baseW

      if (ex.equipType === 'free' && !/concentration|curl/i.test(ex.name)) {
        const perDumbbell = baseW / 2
        targetWeight = roundToNearestDumbbell(perDumbbell)
      }

      // Gestion de la surcharge progressive temporaire : si la décision précédente
      // demandait d'ajouter 1 série (add_set), on augmente le nombre de séries pour
      // cette séance uniquement via tempExtraSet. Le nombre de séries configuré
      // (sets) reste inchangé.
      const decision = decisions?.[ex.id]
      let tempExtraSet = null
      if (decision === 'add_set') {
        if (ex.equipType === 'free') {
          // poids de l'extra set = plus grand haltère <= targetWeight (salle A)
          const extra = getNearestDumbbellBelowOrEqual(targetWeight)
          tempExtraSet = { weight: extra, note: 'Série supplémentaire temporaire (salle)' }
        } else {
          // pour machines: garder même poids
          tempExtraSet = { weight: targetWeight, note: 'Série supplémentaire temporaire (machine)' }
        }
      }

      return {
        exerciseId: ex.id,
        name: ex.name,
        group: ex.group,
        sets: ex.sets,
        rMin: ex.rMin,
        rMax: ex.rMax,
        weight: targetWeight,
        inc: ex.inc,
        equipType: ex.equipType,
        notes: ex.notes,
        // Suivi des séries réalisées (rempli pendant la séance)
        completedSets: [],
        // Info non persistante: série supplémentaire temporaire selon salle
        tempExtraSet,
      }
    })

    return {
      id: `c${cycleId}w${weekNum}-j${di + 1}`,
      day: DAYS[di],
      dayId: day.id,
      title: day.name,
      sub: day.sub,
      color: day.color,
      status: 'pending',
      completedAt: null,
      notes: '',
      exercises: sessionExercises,
    }
  })
}

// ────────────────────────────────────────────────────────────
// ALGO DE SURCHARGE PROGRESSIVE
//
// Principe : pour chaque exercice, on regarde les séries de la
// MÊME séance de la semaine PRÉCÉDENTE et on calcule le poids
// pour la semaine suivante.
//
// Règle :
//   - Si toutes les séries ont atteint rMax → augmenter le poids
//     (machine: +5kg, poids libres: +1 ou 2kg selon l'incrément)
//   - Si le minimum de reps dépasse rMin mais pas toutes à rMax → maintenir
//   - Si au moins 1 série < rMin → baisser (retour au poids précédent)
// ────────────────────────────────────────────────────────────

export function calcNextWeight(ex, completedSets) {
  if (!completedSets || completedSets.length === 0) {
    return { weight: ex.weight, decision: 'neutral', msg: `Démarrer à ${ex.weight}kg` }
  }

  const validSets = completedSets.filter(s => s.reps > 0)
  if (validSets.length === 0) {
    return { weight: ex.weight, decision: 'neutral', msg: 'Pas de données' }
  }

  const minReps = Math.min(...validSets.map(s => s.reps))
  const maxReps = Math.max(...validSets.map(s => s.reps))
  const currentW = validSets[0]?.weight ?? ex.weight
  const inc = ex.inc || (ex.equipType === 'machine' ? 5 : 2)

  // Toutes les séries à rMax ou + → augmenter le poids
  const allAtMax = validSets.every(s => s.reps >= ex.rMax)
  // Minimum atteint partout → maintenir
  const allAtMin = validSets.every(s => s.reps >= ex.rMin)
  // Certaines séries sous le min → baisser
  const someBelowMin = validSets.some(s => s.reps < ex.rMin)

  if (allAtMax) {
    // Si toutes les séries configurées ont atteint rMax → ajouter 1 série au même poids
    const configuredSets = ex.sets || validSets.length
    if (validSets.length === configuredSets) {
      return {
        weight: currentW,
        decision: 'add_set',
        msg: `⚡ Toutes les séries à rMax → ajouter 1 série au même poids (${currentW}kg)`,
      }
    }
    // Si une série supplémentaire existait déjà et est maxée → augmenter le poids et revenir au nombre de séries configuré
    if (validSets.length > configuredSets) {
      const newW = roundWeight(currentW + inc, ex.equipType)
      return {
        weight: newW,
        decision: 'up',
        msg: `🔥 Série supplémentaire maxée → +${inc}kg (${newW}kg)`,
      }
    }
    // Cas par défaut: augmenter
    const newW = roundWeight(currentW + inc, ex.equipType)
    return {
      weight: newW,
      decision: 'up',
      msg: `🔥 Max atteint → +${inc}kg (${newW}kg)`,
    }
  }

  if (someBelowMin) {
    const newW = roundWeight(Math.max(0, currentW - inc), ex.equipType)
    return {
      weight: newW,
      decision: 'down',
      msg: `⚠️ Sous le min → −${inc}kg (${newW}kg)`,
    }
  }

  // Dans la cible [rMin, rMax) → maintenir
  return {
    weight: currentW,
    decision: 'ok',
    msg: `✅ Dans la cible — ${currentW}kg`,
  }
}

// Pour l'affichage de la progression semaine-à-semaine
export function getProgressionForWeek(prevWeekSession, program) {
  if (!prevWeekSession) return {}
  const result = {}
  prevWeekSession.exercises.forEach(ex => {
    const programEx = findExInProgram(ex.exerciseId, program)
    if (!programEx) return
    const next = calcNextWeight(
      { ...programEx, weight: ex.weight, inc: ex.inc },
      ex.completedSets
    )
    result[ex.exerciseId] = next
  })
  return result
}

export function findExInProgram(exerciseId, program) {
  for (const day of program) {
    const found = day.exercises.find(e => e.id === exerciseId)
    if (found) return found
  }
  return null
}

function roundWeight(w, equipType) {
  if (equipType === 'machine') return Math.round(w / 2.5) * 2.5
  // Poids libres: arrondi au 0.5kg
  return Math.round(w * 2) / 2
}

const DUMBBELL_SET_A = [4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30]

function roundToNearestDumbbell(w) {
  const candidates = DUMBBELL_SET_A

  let best = candidates[0]
  let bestDiff = Math.abs(candidates[0] - w)
  for (const c of candidates) {
    const d = Math.abs(c - w)
    if (d < bestDiff) {
      best = c
      bestDiff = d
    }
  }
  return best
}

export function getNearestDumbbellBelowOrEqual(w) {
  const set = DUMBBELL_SET_A
  // find max c <= w, else return smallest
  for (let i = set.length - 1; i >= 0; i--) {
    if (set[i] <= w) return set[i]
  }
  return set[0]
}

// Calcule les poids pour le prochain cycle en fonction des sessions du cycle précédent
export function computeBaseWeightsForNextCycle(previousCycleSessions) {
  const weights = {}
  const decisions = {}

  // Pour chaque exercice, trouver la dernière série complétée du cycle
  previousCycleSessions.forEach(session => {
    if (session.status !== 'done') return
    session.exercises.forEach(ex => {
      if (!ex.completedSets || ex.completedSets.length === 0) return
      const prog = calcNextWeight(ex, ex.completedSets)
      // On garde le poids calculé le plus récent
      weights[ex.exerciseId] = prog.weight
      decisions[ex.exerciseId] = prog.decision
    })
  })

  return { weights, decisions }
}

// Génère le cycle suivant avec progression automatique
export function generateNextCycle(allCycles, customWeights = null) {
  const lastCycle = allCycles[allCycles.length - 1]
  if (!lastCycle) return null

  let baseWeights
  let decisions = {}
  if (customWeights) {
    baseWeights = customWeights
  } else {
    // Calculer les poids depuis le dernier cycle
    const allSessions = lastCycle.weeks.flatMap(w => w.sessions)
    const computed = computeBaseWeightsForNextCycle(allSessions)
    baseWeights = computed.weights
    decisions = computed.decisions

    // Fallback: utiliser les poids du dernier cycle pour les exercices sans données
    lastCycle.weeks[lastCycle.weeks.length - 1]?.sessions.forEach(session => {
      session.exercises.forEach(ex => {
        if (baseWeights[ex.exerciseId] === undefined) {
          baseWeights[ex.exerciseId] = ex.weight
        }
      })
    })
  }

  return buildCycle(lastCycle.id + 1, baseWeights, decisions)
}
