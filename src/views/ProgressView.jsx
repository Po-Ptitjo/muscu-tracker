import { useState, useMemo } from 'react'
import { TrendingUp, Award, Zap, Target } from 'lucide-react'
import { MUSCLE_GROUPS } from '../data/muscuData'

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
      <Icon size={20} style={{ color }} />
      <div>
        <p className="font-display text-2xl leading-tight" style={{ color }}>{value}</p>
        <p className="font-body text-[10px] uppercase tracking-wider" style={{ color: color + '88' }}>{label}</p>
      </div>
    </div>
  )
}

export default function ProgressView({ getStats }) {
  const [tab, setTab] = useState('volume')
  const [selectedEx, setSelectedEx] = useState(null)
  const stats = useMemo(() => getStats(), [getStats])

  const TABS = [
    { id: 'volume', label: 'Volume' },
    { id: 'exercise', label: 'Exercices' },
    { id: 'muscle', label: 'Muscles' },
    { id: 'prs', label: 'Records' },
  ]

  const muscleEntries = Object.entries(stats.byMuscle).sort((a, b) => b[1] - a[1])
  const maxMuscleVol = muscleEntries[0]?.[1] || 1

  const exerciseNames = Object.keys(stats.exerciseHistory)
  const curEx = selectedEx || exerciseNames[0]
  const exHistory = stats.exerciseHistory[curEx] || []

  const formatVol = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}t` : `${Math.round(v)}kg`

  if (stats.totalDone === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pb-24 gap-4 px-8 text-center">
        <span className="text-5xl">📊</span>
        <h2 className="font-display text-3xl text-text-primary">Aucune donnée</h2>
        <p className="font-body text-sm" style={{ color: '#3D4F63' }}>
          Complète ta première séance pour voir ta progression ici.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-8">
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: '#3D4F63' }}>Statistiques</p>
        <h1 className="font-display text-4xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>Progression</h1>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard icon={Zap} value={stats.totalDone} label="Séances" color="#A78BFA" />
        <StatCard icon={TrendingUp} value={formatVol(stats.totalVolume)} label="Volume total" color="#00D68F" />
        <StatCard icon={Target} value={stats.totalSets} label="Séries totales" color="#FF6635" />
        <StatCard icon={Award} value={Object.keys(stats.prs).length} label="Records" color="#F59E0B" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-5"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2 rounded-xl font-body text-xs font-semibold transition-all"
            style={{ background: tab === t.id ? 'rgba(167,139,250,0.2)' : 'transparent', color: tab === t.id ? '#A78BFA' : '#3D4F63' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Volume tab */}
      {tab === 'volume' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#3D4F63' }}>Volume par semaine (kg)</p>
          </div>
          {stats.weeklyVolume.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Pas encore de données de volume</p>
            </div>
          ) : (
            <div className="px-4 py-4">
              <div className="flex items-end gap-2 h-32">
                {stats.weeklyVolume.map((w, i) => {
                  const maxVol = Math.max(...stats.weeklyVolume.map(x => x.volume), 1)
                  const pct = (w.volume / maxVol) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="font-body text-[9px]" style={{ color: '#3D4F63' }}>
                        {formatVol(w.volume)}
                      </p>
                      <div className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${pct}%`, background: 'linear-gradient(to top, #6d28d9, #a78bfa)', minHeight: 4 }} />
                      <p className="font-body text-[9px]" style={{ color: '#3D4F63' }}>{w.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exercise progression tab */}
      {tab === 'exercise' && (
        <div className="space-y-3">
          {/* Exercise selector */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {exerciseNames.slice(0, 10).map(name => (
              <button key={name} onClick={() => setSelectedEx(name)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: curEx === name ? '#A78BFA' : 'rgba(255,255,255,0.06)',
                  color: curEx === name ? '#fff' : '#7A8BA3',
                }}>
                {name.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <p className="font-body text-sm font-semibold text-text-primary">{curEx}</p>
              <p className="font-body text-xs" style={{ color: '#3D4F63' }}>Charge maximale par séance</p>
            </div>
            {exHistory.length < 2 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Pas assez de données — complète au moins 2 séances</p>
              </div>
            ) : (
              <div className="px-4 py-4">
                <div className="flex items-end gap-2 h-32">
                  {exHistory.slice(-10).map((h, i) => {
                    const maxW = Math.max(...exHistory.map(x => x.weight), 1)
                    const pct = (h.weight / maxW) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <p className="font-body text-[9px]" style={{ color: '#3D4F63' }}>{h.weight}kg</p>
                        <div className="w-full rounded-t-md"
                          style={{ height: `${pct}%`, background: 'linear-gradient(to top, #059669, #34d399)', minHeight: 4 }} />
                        <p className="font-body text-[9px]" style={{ color: '#3D4F63' }}>
                          {new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    )
                  })}
                </div>
                {exHistory.length >= 2 && (
                  <div className="mt-3 flex items-center gap-2">
                    <TrendingUp size={14} style={{ color: '#34d399' }} />
                    <p className="font-body text-xs" style={{ color: '#34d399' }}>
                      {exHistory[0].weight}kg → {exHistory[exHistory.length - 1].weight}kg
                      ({exHistory[exHistory.length - 1].weight > exHistory[0].weight ? '+' : ''}
                      {exHistory[exHistory.length - 1].weight - exHistory[0].weight}kg)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Muscle tab */}
      {tab === 'muscle' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#3D4F63' }}>Volume par groupe musculaire</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            {muscleEntries.map(([group, vol]) => {
              const color = MUSCLE_GROUPS[group] || '#888'
              const pct = (vol / maxMuscleVol) * 100
              return (
                <div key={group}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <p className="font-body text-sm font-medium text-text-primary">{group}</p>
                    </div>
                    <p className="font-body text-sm font-semibold" style={{ color }}>{formatVol(vol)}</p>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
            {muscleEntries.length === 0 && (
              <p className="font-body text-sm text-center py-6" style={{ color: '#3D4F63' }}>Aucune donnée musculaire</p>
            )}
          </div>
        </div>
      )}

      {/* PRs tab */}
      {tab === 'prs' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <Award size={14} style={{ color: '#F59E0B' }} />
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#F59E0B' }}>Records personnels</p>
          </div>
          {Object.entries(stats.prs).length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Aucun record encore — complète des séances !</p>
            </div>
          ) : (
            <div>
              {Object.entries(stats.prs)
                .sort((a, b) => b[1].weight - a[1].weight)
                .slice(0, 15)
                .map(([name, pr]) => {
                  const color = MUSCLE_GROUPS[pr.group] || '#888'
                  return (
                    <div key={name} className="flex items-center justify-between px-4 py-3 border-b last:border-0"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="font-body text-sm font-semibold text-text-primary">{name}</p>
                        <p className="font-body text-xs mt-0.5" style={{ color }}>{pr.group}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-xl" style={{ color: '#F59E0B' }}>{pr.weight}kg</p>
                        <p className="font-body text-xs" style={{ color: '#3D4F63' }}>× {pr.reps} reps</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
