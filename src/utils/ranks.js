// Rank system utilities
// Provides mappings from performance % (vs baseline) to rank and ELO.

export const RANKS = [
  { id: 'coal-i', name: 'Coal I', percent: 100, eloMin: 400, eloMax: 599 },
  { id: 'coal-ii', name: 'Coal II', percent: 106, eloMin: 600, eloMax: 799 },
  { id: 'coal-iii', name: 'Coal III', percent: 116, eloMin: 800, eloMax: 999 },
  { id: 'copper-i', name: 'Copper I', percent: 130, eloMin: 1000, eloMax: 1199 },
  { id: 'copper-ii', name: 'Copper II', percent: 146, eloMin: 1200, eloMax: 1399 },
  { id: 'copper-iii', name: 'Copper III', percent: 164, eloMin: 1400, eloMax: 1599 },
  { id: 'iron-i', name: 'Iron I', percent: 184, eloMin: 1600, eloMax: 1799 },
  { id: 'iron-ii', name: 'Iron II', percent: 206, eloMin: 1800, eloMax: 1999 },
  { id: 'iron-iii', name: 'Iron III', percent: 229, eloMin: 2000, eloMax: 2199 },
  { id: 'gold-i', name: 'Gold I', percent: 254, eloMin: 2200, eloMax: 2399 },
  { id: 'gold-ii', name: 'Gold II', percent: 280, eloMin: 2400, eloMax: 2599 },
  { id: 'gold-iii', name: 'Gold III', percent: 308, eloMin: 2600, eloMax: 2799 },
  { id: 'emerald-i', name: 'Emerald I', percent: 337, eloMin: 2800, eloMax: 2999 },
  { id: 'emerald-ii', name: 'Emerald II', percent: 367, eloMin: 3000, eloMax: 3199 },
  { id: 'emerald-iii', name: 'Emerald III', percent: 399, eloMin: 3200, eloMax: 3399 },
  { id: 'diamond-i', name: 'Diamond I', percent: 432, eloMin: 3400, eloMax: 3599 },
  { id: 'diamond-ii', name: 'Diamond II', percent: 465, eloMin: 3600, eloMax: 3799 },
  { id: 'diamond-iii', name: 'Diamond III', percent: 500, eloMin: 3800, eloMax: 3999 },
  { id: 'netherite', name: 'Netherite', percent: 501, eloMin: 4000, eloMax: 9999 },
]

function center(rank) {
  return Math.round((rank.eloMin + rank.eloMax) / 2)
}

// Compute performance metric for an exercise entry
// baseline: baseWeight * baselineReps
// performance: if there is at least one valid set (reps >= rMin),
// use the maximum weight among valid sets multiplied by rMax
export function computeExercisePerformanceMetric(exercise, baseWeights) {
  let baseW = (baseWeights && baseWeights[exercise.exerciseId]) || exercise.weight || 0
  let baseReps = exercise.rMax || exercise.rMin || 1

  // Force baseline for curl pupitre and curl concentration to 6kg × 12 reps = 72
  const exId = exercise.exerciseId || exercise.originalExerciseId || ''
  if (exId === 'j2e4' || exId === 'j4e7') {
    baseW = 6
    baseReps = 12
  }

  const baseline = baseW * baseReps

  const sets = exercise.completedSets || []
  if (sets.length === 0) return { provisional: true, baseline, performance: 0 }

  const rMin = typeof exercise.rMin === 'number' ? exercise.rMin : 1
  const rMax = typeof exercise.rMax === 'number' ? exercise.rMax : (exercise.rMin || 1)

  // Keep only sets that meet rMin
  const validSets = sets.filter(s => (s.reps || 0) >= rMin)
  if (validSets.length === 0) return { provisional: true, baseline, performance: 0 }

  // Choose the heaviest valid set and compute performance as weight * rMax
  const maxWeight = validSets.reduce((m, s) => Math.max(m, s.weight || 0), 0)
  const performance = maxWeight * rMax

  return { provisional: false, baseline, performance }
}

// Map percent to rank entry (choose highest rank whose percent <= value)
export function rankFromPercent(percent) {
  if (!percent || isNaN(percent)) return RANKS[0]
  let selected = RANKS[0]
  for (const r of RANKS) {
    if (percent >= r.percent) selected = r
    else break
  }
  return selected
}

// Compute elo/points for a single exercise
export function computeExerciseElo(exercise, baseWeights) {
  const { provisional, baseline, performance } = computeExercisePerformanceMetric(exercise, baseWeights)
  if (provisional) return { provisional: true, elo: null, percent: null, rank: RANKS[0], points: 0 }
  const percent = baseline > 0 ? (performance / baseline) * 100 : 100
  const rank = rankFromPercent(percent)
  const elo = center(rank)
  // Use the center ELO of the rank as the exercise points (can be adjusted later)
  const points = elo
  return { provisional: false, elo, percent: Math.round(percent), rank, points }
}

// Map an ELO to a rank by elo ranges
export function rankFromElo(elo) {
  if (typeof elo !== 'number' || isNaN(elo)) return RANKS[0]
  for (const r of RANKS) {
    if (elo >= r.eloMin && elo <= r.eloMax) return r
  }
  return RANKS[RANKS.length - 1]
}

// Compute elos for all exercises across cycles and derive a global ELO as average of per-exercise ELOs
export function computeAllElos(cycles, baseWeights) {
  // flatten last done session per exercise to get most recent performance per exercise
  const exerciseLatest = {}
  cycles.flatMap(c => c.weeks.flatMap(w => w.sessions)).forEach(sess => {
    if (sess.status !== 'done') return
    sess.exercises.forEach(ex => {
      const prev = exerciseLatest[ex.exerciseId]
      if (!prev || new Date(sess.completedAt) > new Date(prev.completedAt || 0)) {
        exerciseLatest[ex.exerciseId] = { ...ex, completedAt: sess.completedAt }
      }
    })
  })

  const results = {}
  const elos = []
  const percents = []
  for (const id in exerciseLatest) {
    const res = computeExerciseElo(exerciseLatest[id], baseWeights)
    results[id] = { ...res, name: exerciseLatest[id].name, group: exerciseLatest[id].group }
    if (!res.provisional && typeof res.elo === 'number') {
      elos.push(res.elo)
      if (typeof res.percent === 'number') percents.push(res.percent)
    }
  }

  // If no real performances exist, mark global as provisional
  if (elos.length === 0) {
    return { perExercise: results, globalElo: null, globalPercent: null, globalRank: RANKS[0], provisional: true }
  }

  const avgElo = Math.round(elos.reduce((a,b)=>a+b,0) / elos.length)
  const avgPercent = percents.length ? Math.round(percents.reduce((a,b)=>a+b,0) / percents.length) : null
  const globalRank = rankFromElo(avgElo)

  return {
    perExercise: results,
    globalElo: avgElo,
    globalPercent: avgPercent,
    globalRank,
    provisional: false,
  }
}
